import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { vim } from "@replit/codemirror-vim";

export default function ShaderEditor({ code, onChange, vimEnabled, onToggleVim }) {
  const [internalCode, setInternalCode] = useState(code);

  // Atualiza o código interno se a prop externa mudar (ex: ao carregar da URL)
  useEffect(() => {
    setInternalCode(code);
  }, [code]);

  // Debounce para notificar a alteração do shader
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(internalCode);
    }, 400);

    return () => clearTimeout(handler);
  }, [internalCode, onChange]);

  const extensions = [cpp()];
  if (vimEnabled) {
    extensions.push(vim());
  }

  return (
    <div className="shader-editor-container" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="editor-toolbar" style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#1a1a1a", borderBottom: "1px solid #333", color: "#fff" }}>
        <span>Editor de Shader</span>
        <label style={{ cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="checkbox"
            checked={vimEnabled}
            onChange={(e) => onToggleVim(e.target.checked)}
          />
          Vim Motions
        </label>
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        <CodeMirror
          value={internalCode}
          height="100%"
          theme="dark"
          extensions={extensions}
          onChange={(val) => setInternalCode(val)}
        />
      </div>
    </div>
  );
}
