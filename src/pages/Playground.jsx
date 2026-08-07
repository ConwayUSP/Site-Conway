// src/pages/Playground.jsx
import { useState, useEffect } from "react";
import LZString from "lz-string";
import Split from "react-split";

// Components
import ShaderCanvas from "@components/playground/ShaderCanvas";
import ShaderEditor from "@components/playground/ShaderEditor";
import { THEMES } from "@components/playground/themes";

// Hooks
import { useMediaQuery } from "@hooks/useMediaQuery";

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
    return localStorage.getItem("playground_theme") || "catjump";
  });

  const [fontSize, setFontSize] = useState(() => {
    const savedSize = localStorage.getItem("playground_font_size");
    return savedSize ? parseInt(savedSize, 10) : 14;
  });

  const [vimEnabled, setVimEnabled] = useState(() => {
    return localStorage.getItem("playground_vim_mode") === "true";
  });

  const [isControlsCollapsed, setIsControlsCollapsed] = useState(() => {
    return localStorage.getItem("playground_controls_collapsed") === "true";
  });

  const [copied, setCopied] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

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

  useEffect(() => {
    localStorage.setItem("playground_controls_collapsed", isControlsCollapsed.toString());
  }, [isControlsCollapsed]);

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
    <div className="playground-page" >
      <Split 
        className="split-container" 
        minSize={300} 
        gutterSize={8} 
        gutterAlign="center" 
        key={isMobile ? "vertical" : "horizontal"}
        direction={isMobile ? "vertical" : "horizontal"} 
        cursor={isMobile ? "row-resize" : "col-resize"}
        sizes={isMobile ? [50, 50] : [60, 40]} 
      >
        {/* Painel do Canvas 3D */}
        <div className="playground-left" >
          <div className={`playground-controls ${isControlsCollapsed ? "collapsed" : ""}`} style={{
              backgroundColor: currentTheme.panelBg,
              color: currentTheme.text
            }}>
            <button 
              className="toggle-controls-btn"
              onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
              title={isControlsCollapsed ? "Expandir Controles" : "Minimizar Controles"}
              style={{ color: currentTheme.text }}
            >
              {isControlsCollapsed ? "›" : "‹"}
            </button>

            {!isControlsCollapsed && (
            <div className="controls-content">
              <div className="control-group">
                <label>Modelo 3D:</label>
                <select value={modelType} onChange={(e) => setModelType(e.target.value)} style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderColor: currentTheme.border }}>
                    <option value="plane">Plano 2D</option>
                    <option value="cube">Cubo</option>
                    <option value="sphere">Esfera</option>
                    <option value="torus">Torus</option>
                    {customModelUrl && <option value="custom">Personalizado</option>}
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
          )}
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
