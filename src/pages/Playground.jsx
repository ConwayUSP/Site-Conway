// src/pages/Playground.jsx
import { useState, useEffect } from "react";
import LZString from "lz-string";
import ShaderCanvas from "../components/playground/ShaderCanvas";
import ShaderEditor from "../components/playground/ShaderEditor";
import "./Playground.css";

const DEFAULT_SHADER = `fn niam(u_time: f32, vUv: vec2<f32>) -> vec4<f32> {
  // A sintaxe do WGSL é estritamente tipada e usa declarações matemáticas similares a Rust
  let r = 0.5 + 0.5 * cos(u_time + vUv.x + 0.0);
  let g = 0.5 + 0.5 * cos(u_time + vUv.y + 2.0);
  let b = 0.5 + 0.5 * cos(u_time + vUv.x + 4.0);
  
  return vec4<f32>(r, g, b, 1.0);
}`;

export default function Playground() {
  const [code, setCode] = useState(DEFAULT_SHADER);
  const [modelType, setModelType] = useState("plane");
  const [vimEnabled, setVimEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  // Carregar estado inicial da URL se existir
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const compressedCode = params.get("code");
    const urlModel = params.get("model");

    if (compressedCode) {
      const decompressed = LZString.decompressFromEncodedURIComponent(compressedCode);
      if (decompressed) {
        setCode(decompressed);
      }
    }
    if (urlModel) {
      setModelType(urlModel);
    }
  }, []);

  // Gerar e copiar URL compartilhável
  const handleShare = () => {
    const compressed = LZString.compressToEncodedURIComponent(code);
    const newUrl = `${window.location.origin}${window.location.pathname}?model=${modelType}&code=${compressed}`;
    
    navigator.clipboard.writeText(newUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="playground-page">
      <div className="playground-left">
        <div className="playground-controls">
          <label>Modelo 3D:</label>
          <select value={modelType} onChange={(e) => setModelType(e.target.value)}>
            <option value="plane">Sem Modelo (Plano 2D)</option>
            <option value="cube">Cubo</option>
            <option value="sphere">Esfera</option>
            <option value="icosahedron">Icosaedro</option>
            <option value="torus">Torus</option>
          </select>

          <button onClick={handleShare} className="share-btn">
            {copied ? "Link Copiado!" : "Compartilhar Shader"}
          </button>
        </div>
        <div className="canvas-wrapper">
          <ShaderCanvas code={code} modelType={modelType} />
        </div>
      </div>

      <div className="playground-right">
        <ShaderEditor
          code={code}
          onChange={setCode}
          vimEnabled={vimEnabled}
          onToggleVim={setVimEnabled}
        />
      </div>
    </div>
  );
}
