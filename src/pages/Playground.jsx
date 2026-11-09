import { useState, useEffect, useCallback, useRef } from "react";
import LZString from "lz-string";
import Split from "react-split";
import * as THREE from "three";

import ShaderCanvas from "@components/playground/ShaderCanvas";
import ShaderEditor from "@components/playground/ShaderEditor";
import { THEMES } from "@components/playground/themes";
import { useMediaQuery } from "@hooks/useMediaQuery";

import "./Playground.css";

const DEFAULT_SHADERS = [
  {
    id: "bufferA",
    name: "Buffer A (Dynamic Energy Pulse)",
    code: `fn buffA(time: f32, uv: vec2<f32>, mouse_pos: vec2<f32>) -> vec4<f32> {
  return vec4<f32>(0.0, 0.0, 0.0, 1.0);
}`
  },
  {
    id: "main",
    name: "Image (Texture + Normals + Buffer A)",
    code: `fn niam(time: f32, uv: vec2<f32>, mouse_pos: vec2<f32>, normal: vec3<f32>, pass0: vec4<f32>, tex0: vec4<f32>, cam_pos: vec3<f32>, cam_dir: vec3<f32>) -> vec4<f32> {
  // cor da primeira textura caso haja alguma
  let tex_color = tex0;
  // velocidade do arco-íris
  let rs = 0.4;
  // cor final = textura + arco-íris
  var final_color = tex_color.rgb + vec3<f32>(0.2 * sin(time * rs), 0.2 * cos(time * rs), 0.2 * sin(1.0 + time * rs));
  return vec4<f32>(final_color, 1.0);
}`
  }
];

export default function Playground() {
  // Estado com a lista de shaders (Buffers + Main)
  const [shaders, setShaders] = useState(() => {
    const saved = localStorage.getItem("playground_multi_shaders");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_SHADERS;
  });

  const [activeShaderId, setActiveShaderId] = useState("main");
  const [modelType, setModelType] = useState("plane");
  const [customModelUrl, setCustomModelUrl] = useState(null);
  const [customModel, setCustomModel] = useState(null);
  
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem("playground_theme") || "catjump");
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem("playground_font_size") || "14", 10));
  const [vimEnabled, setVimEnabled] = useState(() => localStorage.getItem("playground_vim_mode") === "true");
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(() => localStorage.getItem("playground_controls_collapsed") === "true");

  const [copied, setCopied] = useState(false);
  const [shaderError, setShaderError] = useState(null);
  const currentCodeRef = useRef("");

  const isMobile = useMediaQuery('(max-width: 768px)');
  const currentTheme = THEMES[themeKey] || THEMES.dark;
  const [textures, setTextures] = useState(Array(8).fill(null));

  // Sincroniza salvamento no localStorage
  useEffect(() => {
    localStorage.setItem("playground_multi_shaders", JSON.stringify(shaders));
  }, [shaders]);

  useEffect(() => {
    localStorage.setItem("playground_theme", themeKey);
    localStorage.setItem("playground_font_size", fontSize.toString());
    localStorage.setItem("playground_vim_mode", vimEnabled);
    localStorage.setItem("playground_controls_collapsed", isControlsCollapsed.toString());
  }, [themeKey, fontSize, vimEnabled, isControlsCollapsed]);

  const activeShader = shaders.find(s => s.id === activeShaderId) || shaders[0];
  currentCodeRef.current = activeShader?.code || "";

  const handleShaderError = useCallback((error) => {
    setShaderError(error);
  }, []);

  const handleCodeChange = useCallback((nextCode) => {
    setShaderError(null);
    setShaders(prev => prev.map(s => s.id === activeShaderId ? { ...s, code: nextCode } : s));
  }, [activeShaderId]);

  // Adicionar novo Buffer
  const handleAddBuffer = () => {
    const bufferCount = shaders.filter(s => s.id.startsWith("buffer")).length + 1;
    const newId = `buffer${bufferCount}`;
    const newName = `Buffer ${String.fromCharCode(64 + bufferCount)}`; // Buffer B, Buffer C...
    
    const newBuffer = {
      id: newId,
      name: newName,
      code: `fn ${newId}Main(time: f32, uv: vec2<f32>) -> vec4<f32> {\n  return vec4<f32>(uv, 0.0, 1.0);\n}`
    };

    // Insere antes do último (main)
    setShaders(prev => {
      const mainShader = prev.find(s => s.id === "main");
      const buffers = prev.filter(s => s.id !== "main");
      return [...buffers, newBuffer, mainShader];
    });
    setActiveShaderId(newId);
  };

  const handleRemoveShader = (id) => {
    if (id === "main") return; // Não pode remover o principal
    setShaders(prev => prev.filter(s => s.id !== id));
    setActiveShaderId("main");
  };

  const handleShare = () => {
    const mainShader = shaders.find(s => s.id === "main") || shaders[0];
    const compressed = LZString.compressToEncodedURIComponent(mainShader.code);
    const newUrl = `${window.location.origin}${window.location.pathname}?code=${compressed}`;
    navigator.clipboard.writeText(newUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Cria um dicionário mapeando "nome_do_arquivo.bin" -> "blob:http..."
    const fileMap = {};
    files.forEach(file => {
      fileMap[file.name] = URL.createObjectURL(file);
    });

    // Acha o arquivo principal (.gltf ou .glb)
    const mainFile = files.find(f => f.name.endsWith('.gltf') || f.name.endsWith('.glb'));
    if (!mainFile) {
      alert("Por favor, selecione ao menos um arquivo .gltf ou .glb principal junto com seus arquivos auxiliares.");
      return;
    }

    setCustomModel({
      url: fileMap[mainFile.name],
      fileMap: fileMap
    });
    setModelType("custom");
  };

  const handleTextureUpload = (index, file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setTextures(prev => {
        const next = [...prev];
        if (next[index]) URL.revokeObjectURL(next[index]);
        next[index] = url;
        return next;
      });
    }
  };

  const handleTextureClear = (index) => {
    setTextures(prev => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]);
      next[index] = null;
      return next;
    });
  };

  return (
    <div className="playground-page">
      <Split 
        className="split-container" 
        minSize={300} 
        gutterSize={8} 
        direction={isMobile ? "vertical" : "horizontal"} 
        sizes={isMobile ? [50, 50] : [60, 40]} 
      >
        <div className="playground-left">
          <div className={`playground-controls ${isControlsCollapsed ? "collapsed" : ""}`} style={{ backgroundColor: currentTheme.panelBg, color: currentTheme.text }}>
            <button className="toggle-controls-btn" onClick={() => setIsControlsCollapsed(!isControlsCollapsed)} style={{ color: currentTheme.text }}>
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
                    {customModel && <option value="custom">Personalizado</option>}
                  </select>
                </div>
                <label className="upload-btn" style={{ borderColor: currentTheme.border, color: currentTheme.text }}>
                  Subir .gltf/.glb
                  <input 
                    type="file" 
                    accept=".gltf,.glb,.bin,.png,.jpg,.jpeg" 
                    multiple 
                    onChange={handleFileUpload} 
                    style={{ display: "none" }} 
                  />
                </label>
                <div className="control-group">
                  <label>Tema:</label>
                  <select value={themeKey} onChange={(e) => setThemeKey(e.target.value)} style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderColor: currentTheme.border }}>
                    {Object.keys(THEMES).map((key) => <option key={key} value={key}>{THEMES[key].name}</option>)}
                  </select>
                </div>
                <button onClick={handleShare} className="share-btn">{copied ? "Link Copiado!" : "Compartilhar"}</button>
              </div>
            )}
          </div>
          <div className="canvas-wrapper">
            <ShaderCanvas 
              shaders={shaders}
              modelType={modelType} 
              customModel={customModel}
              bgColor={currentTheme.bg}
              textures={textures}
              shaderError={shaderError}
              onShaderError={handleShaderError}
            />
          </div>
        </div>

        <div className="playground-right">
          <ShaderEditor
            shaders={shaders}
            activeShaderId={activeShaderId}
            onSelectShader={setActiveShaderId}
            onAddBuffer={handleAddBuffer}
            onRemoveShader={handleRemoveShader}
            code={activeShader?.code || ""}
            onChange={handleCodeChange}
            vimEnabled={vimEnabled}
            onToggleVim={setVimEnabled}
            currentTheme={currentTheme}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            textures={textures}
            onTextureUpload={handleTextureUpload}
            onTextureClear={handleTextureClear}
          />
        </div>
      </Split>
    </div>
  );
}
