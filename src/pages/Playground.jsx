// src/pages/Playground.jsx
import { useState, useEffect } from "react";
import LZString from "lz-string";
import Split from "react-split";
import ShaderCanvas from "../components/playground/ShaderCanvas";
import ShaderEditor from "../components/playground/ShaderEditor";
import { THEMES } from "../components/playground/themes";
import "./Playground.css";

const DEFAULT_SHADER = `fn niam(u_time: f32, vUv: vec2<f32>) -> vec4<f32> {
  let r = 0.5 + 0.5 * cos(u_time + vUv.x + 0.0);
  let g = 0.5 + 0.5 * cos(u_time + vUv.y + 2.0);
  let b = 0.5 + 0.5 * cos(u_time + vUv.x + 4.0);
  
  return vec4<f32>(r, g, b, 1.0);
}`;

export default function Playground() {
  const [code, setCode] = useState(DEFAULT_SHADER);
  const [modelType, setModelType] = useState("plane");
  const [customModelUrl, setCustomModelUrl] = useState(null);
  const [themeKey, setThemeKey] = useState("dark");
  const [vimEnabled, setVimEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentTheme = THEMES[themeKey] || THEMES.dark;

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
    if (urlModel && urlModel !== "custom") {
      setModelType(urlModel);
    }
  }, []);

  // Gerar e copiar URL compartilhável
  const handleShare = () => {
    const compressed = LZString.compressToEncodedURIComponent(code);
    const shareModel = modelType === "custom" ? "plane" : modelType; // fallback caso use modelo local
    const newUrl = `${window.location.origin}${window.location.pathname}?model=${shareModel}&code=${compressed}`;
    
    navigator.clipboard.writeText(newUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomModelUrl(url);
      setModelType("custom");
    }
  };

  return (
    <div className="playground-page" style={{ backgroundColor: currentTheme.bg }}>
      <Split 
        className="split-container" 
        sizes={[50, 50]} 
        minSize={300} 
        gutterSize={8} 
        gutterAlign="center" 
        direction="horizontal" 
        cursor="col-resize"
      >
        <div className="playground-left" style={{ borderRight: `1px solid ${currentTheme.border}` }}>
          <div className="playground-controls" style={{ backgroundColor: currentTheme.panelBg, borderBottom: `1px solid ${currentTheme.border}`, color: currentTheme.text }}>
            <div className="control-group">
              <label>Modelo 3D:</label>
              <select value={modelType} onChange={(e) => setModelType(e.target.value)} style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderColor: currentTheme.border }}>
                <option value="plane">Plano 2D</option>
                <option value="cube">Cubo</option>
                <option value="sphere">Esfera</option>
                <option value="icosahedron">Icosaedro</option>
                <option value="torus">Torus</option>
                {customModelUrl && <option value="custom">Ficheiro Personalizado</option>}
              </select>
            </div>

            <label className="upload-btn" style={{ borderColor: currentTheme.border, color: currentTheme.text }}>
              Subir .gltf/.glb
              <input type="file" accept=".gltf,.glb" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>

            <div className="control-group">
              <label>Tema:</label>
              <select value={themeKey} onChange={(e) => setThemeKey(e.target.value)} style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderColor: currentTheme.border }}>
                {Object.keys(THEMES).map((key) => (
                  <option key={key} value={key}>{THEMES[key].name}</option>
                ))}
              </select>
            </div>

            <button onClick={handleShare} className="share-btn">
              {copied ? "Link Copiado!" : "Compartilhar"}
            </button>
          </div>

          <div className="canvas-wrapper">
            <ShaderCanvas 
              code={code} 
              modelType={modelType} 
              customModelUrl={customModelUrl}
              bgColor={currentTheme.bg}
            />
          </div>
        </div>

        <div className="playground-right">
          <ShaderEditor
            code={code}
            onChange={setCode}
            vimEnabled={vimEnabled}
            onToggleVim={setVimEnabled}
            currentTheme={currentTheme}
          />
        </div>
      </Split>
    </div>
  );
}
