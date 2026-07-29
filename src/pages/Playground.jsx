// src/pages/Playground.jsx
import { useState, useEffect } from "react";
import LZString from "lz-string";
import Split from "react-split";
import ShaderCanvas from "../components/playground/ShaderCanvas";
import ShaderEditor from "../components/playground/ShaderEditor";
import { THEMES } from "../components/playground/themes";
import "./Playground.css";

const DEFAULT_SHADER = `
  fn niam(time: f32, uv: vec2<f32>, mouse_pos: vec2<f32>) -> vec4<f32> {
  let dist = distance(uv, mouse_pos);
  let circle = smoothstep(0.15, 0.05, dist);

  let r = 0.5 + 0.5 * cos(time + uv.x + 0.0);
  let g = 0.5 + 0.5 * cos(time + uv.y + 2.0);
  let b = 0.5 + 0.5 * cos(time + uv.x + 4.0);

  let baseColor = vec3<f32>(r, g, b);
  let finalColor = mix(baseColor, vec3<f32>(1.0-r, 1.0-g, 1.0-b), circle);

  return vec4<f32>(finalColor, 1.0);
}`;

export default function Playground() {
  // Pegamos o código ou da URL ou do localStorage, se não usamos o default
  const [code, setCode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const compressedCode = params.get("code");
    if (compressedCode) {
      const decompressed = LZString.decompressFromEncodedURIComponent(compressedCode);
      if (decompressed) return decompressed;
    }
    const savedCode = localStorage.getItem("playground_shader_code");
    if (savedCode) return savedCode;

    return DEFAULT_SHADER;
  });

  const [modelType, setModelType] = useState("plane");
  const [customModelUrl, setCustomModelUrl] = useState(null);
  
  const [themeKey, setThemeKey] = useState(() => {
    return localStorage.getItem("playground_theme") || "dark";
  });

  const [fontSize, setFontSize] = useState(() => {
    const savedSize = localStorage.getItem("playground_font_size");
    return savedSize ? parseInt(savedSize, 10) : 14;
  });

  const [vimEnabled, setVimEnabled] = useState(() => {
    return localStorage.getItem("playground_vim_mode") === "true";
  });

  const [copied, setCopied] = useState(false);

  const currentTheme = THEMES[themeKey] || THEMES.dark;

  useEffect(() => {
    localStorage.setItem("playground_shader_code", code);
  }, [code]);

  useEffect(() => {
    localStorage.setItem("playground_theme", themeKey);
  }, [themeKey]);

  useEffect(() => {
    localStorage.setItem("playground_font_size", fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("playground_vim_mode", vimEnabled)
  }, [vimEnabled])

  const handleShare = () => {
    const compressed = LZString.compressToEncodedURIComponent(code);
    const shareModel = modelType === "custom" ? "plane" : modelType;
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
        {/* Painel do Canvas 3D */}
        <div className="playground-left" style={{ borderRight: `1px solid ${currentTheme.border}` }}>
          <div className="playground-controls" style={{ backgroundColor: currentTheme.panelBg, borderBottom: `1px solid ${currentTheme.border}`, color: currentTheme.text }}>
            <div className="control-group">
              <label>Modelo 3D:</label>
              <select value={modelType} onChange={(e) => setModelType(e.target.value)} style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderColor: currentTheme.border }}>
                <option value="plane">Plano 2D</option>
                <option value="cube">Cubo</option>
                <option value="sphere">Esfera</option>
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

        {/* Painel do editor de código */}
        <div className="playground-right">
          <ShaderEditor
            code={code}
            onChange={setCode}
            vimEnabled={vimEnabled}
            onToggleVim={setVimEnabled}
            currentTheme={currentTheme}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
          />
        </div>
      </Split>
    </div>
  );
}
