#!/usr/bin/env python3
"""Optimize member photos stored in a Notion data source.

The original photo is never changed. When needed, a WebP derivative is uploaded
to a separate files property. A SHA-256 hash records which original was last
processed, making repeated executions safe and inexpensive.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import os
import random
import re
import sys
import time
import unicodedata
from pathlib import Path
from typing import Any

import requests
from PIL import Image, ImageOps, UnidentifiedImageError, features


NOTION_API_URL = "https://api.notion.com/v1"
NOTION_VERSION = "2026-03-11"
DEFAULT_DATA_SOURCE_ID = "2abb02a6-eb6d-817a-a8db-000bb0190ffb"
DEFAULT_SOURCE_PROPERTY = "Fotinha"
DEFAULT_OUTPUT_PROPERTY = "Fotinha otimizada"
DEFAULT_HASH_PROPERTY = "Fotinha hash"
DEFAULT_MAX_BYTES = 500 * 1024
DEFAULT_MAX_DIMENSION = 1600
MAX_DOWNLOAD_BYTES = 25 * 1024 * 1024
MAX_IMAGE_PIXELS = 50_000_000
RETRYABLE_STATUS = {429, 529}
RETRYABLE_READ_STATUS = {500, 502, 503, 504}


class NotionError(RuntimeError):
    """A Notion request failed."""


def load_env_file(path: Path) -> None:
    """Load simple KEY=VALUE entries without overriding the process environment."""
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
            value = value[1:-1]
        os.environ.setdefault(key, value)


def normalized_name(value: str) -> str:
    value = unicodedata.normalize("NFKC", value)
    return " ".join(value.casefold().split())


def format_bytes(value: int) -> str:
    if value < 1024:
        return f"{value} B"
    if value < 1024 * 1024:
        return f"{value / 1024:.1f} KB"
    return f"{value / (1024 * 1024):.2f} MB"


class NotionClient:
    def __init__(self, token: str) -> None:
        self.session = requests.Session()
        self.session.headers.update(
            {
                "Authorization": f"Bearer {token}",
                "Notion-Version": NOTION_VERSION,
                "Accept": "application/json",
            }
        )

    def request(
        self,
        method: str,
        path: str,
        *,
        idempotent: bool = False,
        max_attempts: int = 6,
        **kwargs: Any,
    ) -> requests.Response:
        url = path if path.startswith("http") else f"{NOTION_API_URL}/{path.lstrip('/')}"

        for attempt in range(max_attempts):
            response = self.session.request(method, url, timeout=(15, 90), **kwargs)
            retryable = response.status_code in RETRYABLE_STATUS or (
                idempotent and response.status_code in RETRYABLE_READ_STATUS
            )
            if not retryable or attempt == max_attempts - 1:
                if not response.ok:
                    detail = response.text[:1000]
                    raise NotionError(f"{method} {path} retornou {response.status_code}: {detail}")
                return response

            retry_after = response.headers.get("Retry-After")
            delay = float(retry_after) if retry_after else min(2**attempt, 30)
            time.sleep(delay + random.uniform(0, 0.25))

        raise AssertionError("unreachable")

    def get_data_source(self, data_source_id: str) -> dict[str, Any]:
        return self.request(
            "GET", f"data_sources/{data_source_id}", idempotent=True
        ).json()

    def iter_pages(self, data_source_id: str):
        cursor: str | None = None
        while True:
            body: dict[str, Any] = {"page_size": 100}
            if cursor:
                body["start_cursor"] = cursor
            data = self.request(
                "POST",
                f"data_sources/{data_source_id}/query",
                idempotent=True,
                json=body,
            ).json()
            yield from data.get("results", [])
            if not data.get("has_more"):
                return
            cursor = data.get("next_cursor")
            if not cursor:
                raise NotionError("A resposta indicou mais páginas, mas não trouxe next_cursor.")

    def create_file_upload(self, filename: str) -> str:
        data = self.request(
            "POST",
            "file_uploads",
            json={
                "mode": "single_part",
                "filename": filename,
                "content_type": "image/webp",
            },
        ).json()
        return data["id"]

    def send_file_upload(self, upload_id: str, filename: str, content: bytes) -> None:
        self.request(
            "POST",
            f"file_uploads/{upload_id}/send",
            files={"file": (filename, content, "image/webp")},
        )

    def update_page_properties(self, page_id: str, properties: dict[str, Any]) -> None:
        self.request("PATCH", f"pages/{page_id}", json={"properties": properties})


def resolve_property(
    schema: dict[str, Any], requested_name: str, expected_type: str
) -> tuple[str, str]:
    properties = schema.get("properties", {})
    wanted = normalized_name(requested_name)
    matches = [
        (name, value)
        for name, value in properties.items()
        if normalized_name(name) == wanted
    ]
    if not matches:
        available = ", ".join(sorted(properties))
        raise ValueError(
            f'Campo "{requested_name}" não encontrado no Notion. Campos disponíveis: {available}'
        )

    actual_name, definition = matches[0]
    actual_type = definition.get("type")
    if actual_type != expected_type:
        raise ValueError(
            f'O campo "{actual_name}" precisa ser do tipo {expected_type!r}, '
            f"mas é do tipo {actual_type!r}."
        )
    return actual_name, definition["id"]


def page_title(page: dict[str, Any]) -> str:
    for prop in page.get("properties", {}).values():
        if prop.get("type") == "title":
            text = "".join(part.get("plain_text", "") for part in prop.get("title", []))
            if text.strip():
                return text.strip()
    return page.get("id", "membro sem nome")


def property_value(page: dict[str, Any], property_id: str, property_name: str) -> dict[str, Any]:
    properties = page.get("properties", {})
    if property_name in properties:
        return properties[property_name]
    for value in properties.values():
        if value.get("id") == property_id:
            return value
    return {}


def first_file_url(prop: dict[str, Any]) -> str | None:
    files = prop.get("files") or []
    if not files:
        return None
    item = files[0]
    file_type = item.get("type")
    if file_type in {"file", "external"}:
        return item.get(file_type, {}).get("url")
    return None


def rich_text_value(prop: dict[str, Any]) -> str:
    return "".join(part.get("plain_text", "") for part in prop.get("rich_text", [])).strip()


def download_image(url: str) -> bytes:
    # Deliberately do not use the authenticated Notion session here. Notion file
    # URLs may point to third-party storage and must never receive the API token.
    with requests.get(url, stream=True, timeout=(15, 90)) as response:
        response.raise_for_status()
        content_length = response.headers.get("Content-Length")
        if content_length and int(content_length) > MAX_DOWNLOAD_BYTES:
            raise ValueError(
                f"arquivo excede o limite de download de {format_bytes(MAX_DOWNLOAD_BYTES)}"
            )

        chunks: list[bytes] = []
        total = 0
        for chunk in response.iter_content(chunk_size=64 * 1024):
            if not chunk:
                continue
            total += len(chunk)
            if total > MAX_DOWNLOAD_BYTES:
                raise ValueError(
                    f"arquivo excede o limite de download de {format_bytes(MAX_DOWNLOAD_BYTES)}"
                )
            chunks.append(chunk)
        return b"".join(chunks)


def has_transparency(image: Image.Image) -> bool:
    return image.mode in {"RGBA", "LA"} or (
        image.mode == "P" and "transparency" in image.info
    )


def encode_webp(image: Image.Image, quality: int) -> bytes:
    output = io.BytesIO()
    image.save(output, format="WEBP", quality=quality, method=6, exact=True)
    return output.getvalue()


def optimize_image(
    original: bytes, max_dimension: int, max_bytes: int
) -> tuple[bytes | None, tuple[int, int], tuple[int, int]]:
    Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS
    with Image.open(io.BytesIO(original)) as opened:
        if getattr(opened, "is_animated", False):
            raise ValueError(
                f"imagem animada {opened.format or ''} com "
                f"{getattr(opened, 'n_frames', '?')} quadros não é suportada; "
                "nenhuma alteração foi feita"
            )

        source_size = opened.size
        image = ImageOps.exif_transpose(opened)
        image.load()
        image = image.convert("RGBA" if has_transparency(image) else "RGB")

    if len(original) <= max_bytes and max(source_size) <= max_dimension:
        return None, source_size, source_size

    if max(image.size) > max_dimension:
        ratio = max_dimension / max(image.size)
        resized = tuple(max(1, round(value * ratio)) for value in image.size)
        image = image.resize(resized, Image.Resampling.LANCZOS)

    best: bytes | None = None
    best_size = image.size
    while min(image.size) >= 240:
        for quality in (85, 82, 79, 76, 73, 70):
            candidate = encode_webp(image, quality)
            if best is None or len(candidate) < len(best):
                best, best_size = candidate, image.size
            if len(candidate) <= max_bytes:
                return candidate, source_size, image.size

        ratio = min(0.9, (max_bytes / len(best)) ** 0.5 * 0.97)
        next_size = tuple(max(1, round(value * ratio)) for value in image.size)
        if next_size == image.size:
            break
        image = image.resize(next_size, Image.Resampling.LANCZOS)

    if best is None:
        raise ValueError("não foi possível gerar a versão WebP")
    return best, source_size, best_size


def safe_filename(name: str, page_id: str) -> str:
    normalized = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", normalized).strip("-").lower()
    return f"{slug or 'membro'}-{page_id[:8]}.webp"


def hash_property_payload(digest: str) -> dict[str, Any]:
    return {"rich_text": [{"type": "text", "text": {"content": digest}}]}


def process_page(
    client: NotionClient,
    page: dict[str, Any],
    *,
    source_name: str,
    source_id: str,
    output_name: str,
    output_id: str,
    hash_name: str,
    hash_id: str,
    max_dimension: int,
    max_bytes: int,
    dry_run: bool,
    force: bool,
) -> str:
    name = page_title(page)
    source = property_value(page, source_id, source_name)
    source_url = first_file_url(source)
    if not source_url:
        print(f"[SEM FOTO] {name}")
        return "no_photo"

    original = download_image(source_url)
    digest = hashlib.sha256(original).hexdigest()
    stored_digest = rich_text_value(property_value(page, hash_id, hash_name))
    has_optimized_photo = bool(
        property_value(page, output_id, output_name).get("files")
    )
    if not force and stored_digest == digest and has_optimized_photo:
        print(f"[IGUAL] {name}")
        return "unchanged"

    optimized, source_size, result_size = optimize_image(
        original, max_dimension=max_dimension, max_bytes=max_bytes
    )

    if optimized is None:
        if not force and stored_digest == digest:
            print(
                f"[IGUAL] {name}: original adequada, "
                f"{source_size[0]}x{source_size[1]}, {format_bytes(len(original))}"
            )
            return "unchanged"
        print(
            f"[ADEQUADA] {name}: {source_size[0]}x{source_size[1]}, "
            f"{format_bytes(len(original))}"
        )
        if not dry_run:
            client.update_page_properties(
                page["id"],
                {
                    output_id: {"files": []},
                    hash_id: hash_property_payload(digest),
                },
            )
        return "adequate"

    print(
        f"[OTIMIZAR] {name}: {source_size[0]}x{source_size[1]} "
        f"({format_bytes(len(original))}) -> {result_size[0]}x{result_size[1]} "
        f"({format_bytes(len(optimized))})"
    )
    if dry_run:
        return "optimized"

    filename = safe_filename(name, page["id"])
    upload_id = client.create_file_upload(filename)
    client.send_file_upload(upload_id, filename, optimized)
    client.update_page_properties(
        page["id"],
        {
            output_id: {
                "files": [
                    {
                        "type": "file_upload",
                        "file_upload": {"id": upload_id},
                        "name": filename,
                    }
                ]
            },
            hash_id: hash_property_payload(digest),
        },
    )
    return "optimized"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Otimiza fotos de membros no Notion sem alterar os originais."
    )
    parser.add_argument("--apply", action="store_true", help="Grava as alterações no Notion.")
    parser.add_argument(
        "--force", action="store_true", help="Reanalisa as fotos mesmo quando o hash coincide."
    )
    parser.add_argument(
        "--data-source-id",
        default=os.getenv("NOTION_MEMBERS_DATA_SOURCE_ID", DEFAULT_DATA_SOURCE_ID),
    )
    parser.add_argument("--source-property", default=DEFAULT_SOURCE_PROPERTY)
    parser.add_argument("--output-property", default=DEFAULT_OUTPUT_PROPERTY)
    parser.add_argument("--hash-property", default=DEFAULT_HASH_PROPERTY)
    parser.add_argument("--max-dimension", type=int, default=DEFAULT_MAX_DIMENSION)
    parser.add_argument("--max-kb", type=int, default=500)
    return parser.parse_args()


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(line_buffering=True)
    project_root = Path(__file__).resolve().parents[1]
    load_env_file(project_root / ".env.local")
    args = parse_args()

    if args.max_dimension <= 0 or args.max_kb <= 0:
        print("--max-dimension e --max-kb precisam ser positivos.", file=sys.stderr)
        return 2
    if not features.check("webp"):
        print("Esta instalação do Pillow não possui suporte a WebP.", file=sys.stderr)
        return 2

    token = os.getenv("NOTION_TOKEN")
    if not token:
        print("Defina NOTION_TOKEN no ambiente ou em .env.local.", file=sys.stderr)
        return 2

    dry_run = not args.apply
    client = NotionClient(token)
    try:
        schema = client.get_data_source(args.data_source_id)
        source_name, source_id = resolve_property(
            schema, args.source_property, "files"
        )
        output_name, output_id = resolve_property(
            schema, args.output_property, "files"
        )
        hash_name, hash_id = resolve_property(schema, args.hash_property, "rich_text")
    except (requests.RequestException, NotionError, ValueError, KeyError) as error:
        print(f"Erro de configuração: {error}", file=sys.stderr)
        return 2

    mode = "APLICAÇÃO" if args.apply else "SIMULAÇÃO (nenhuma alteração será feita)"
    print(f"Modo: {mode}")
    print(f"Origem: {source_name} | Destino: {output_name} | Hash: {hash_name}")
    print(f"Limites: {args.max_dimension}px e {args.max_kb} KB\n")

    counts = {"unchanged": 0, "no_photo": 0, "adequate": 0, "optimized": 0, "error": 0}
    try:
        pages = client.iter_pages(args.data_source_id)
        for page in pages:
            try:
                result = process_page(
                    client,
                    page,
                    source_name=source_name,
                    source_id=source_id,
                    output_name=output_name,
                    output_id=output_id,
                    hash_name=hash_name,
                    hash_id=hash_id,
                    max_dimension=args.max_dimension,
                    max_bytes=args.max_kb * 1024,
                    dry_run=dry_run,
                    force=args.force,
                )
                counts[result] += 1
            except (requests.RequestException, NotionError, UnidentifiedImageError, OSError, ValueError) as error:
                counts["error"] += 1
                print(f"[ERRO] {page_title(page)}: {error}", file=sys.stderr)
    except (requests.RequestException, NotionError) as error:
        print(f"Falha ao consultar os membros: {error}", file=sys.stderr)
        return 1

    print("\nResumo:")
    print(f"  Inalteradas pelo hash: {counts['unchanged']}")
    print(f"  Sem foto: {counts['no_photo']}")
    print(f"  Originais adequadas: {counts['adequate']}")
    print(f"  Otimizadas: {counts['optimized']}")
    print(f"  Erros: {counts['error']}")
    return 1 if counts["error"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
