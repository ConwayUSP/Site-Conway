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
    name: "Buffer A",
    code: `fn buffA(time: f32, uv: vec2<f32>, mouse_pos: vec2<f32>) -> vec4<f32> {
  return vec4<f32>(0.0, 0.0, 0.0, 1.0);
}`
  },
  {
    id: "main",
    name: "Main",
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

  const [lightPos, setLightPos] = useState({ x: 5, y: 5, z: -3 });
  const [showLightMenu, setShowLightMenu] = useState(false);
  const [activeShaderId, setActiveShaderId] = useState("main");
  const [modelType, setModelType] = useState("plane");
  const [customModelUrl, setCustomModelUrl] = useState(null);
  const [customModel, setCustomModel] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
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
                  
                <div className="light-menu-container">
                  <button
                    onClick={() => setShowLightMenu(!showLightMenu)}
                    className="light-menu-btn"
                    style={{ borderColor: currentTheme.border, color: currentTheme.text }}
                  >
                    Luz
                  </button>

                  {showLightMenu && (
                    <div className="light-menu-dropdown">
                      <div className="light-menu-title">Posição da Luz</div>
                      
                      {/* Slider X (Vermelho) */}
                      <div className="light-slider-group">
                        <div className="light-slider-header">
                          <span className="light-axis-x">Eixo X</span>
                          <span>{lightPos.x}</span>
                        </div>
                        <input 
                          type="range" min="-20" max="20" step="0.1" 
                          value={lightPos.x} 
                          className="slider-x"
                          onChange={(e) => setLightPos({ ...lightPos, x: parseFloat(e.target.value) })}
                        />
                      </div>

                      {/* Slider Y (Verde) */}
                      <div className="light-slider-group">
                        <div className="light-slider-header">
                          <span className="light-axis-y">Eixo Y</span>
                          <span>{lightPos.y}</span>
                        </div>
                        <input 
                          type="range" min="-20" max="20" step="0.1" 
                          value={lightPos.y} 
                          className="slider-y"
                          onChange={(e) => setLightPos({ ...lightPos, y: parseFloat(e.target.value) })}
                        />
                      </div>

                      {/* Slider Z (Azul) */}
                      <div className="light-slider-group">
                        <div className="light-slider-header">
                          <span className="light-axis-z">Eixo Z</span>
                          <span>{lightPos.z}</span>
                        </div>
                        <input 
                          type="range" min="-20" max="20" step="0.1" 
                          value={lightPos.z} 
                          className="slider-z"
                          onChange={(e) => setLightPos({ ...lightPos, z: parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={handleShare} className="share-btn">{copied ? "Link Copiado!" : "Compartilhar"}</button>
              </div>
            )}
          </div>

          {/* Botão de Ajuda / Documentação */}
          <div className="help-button-container">
            <button 
              onClick={() => setShowHelpModal(true)}
              className="help-icon-btn"
              title="Ajuda e Documentação"
              style={{
                backgroundColor: currentTheme.bg,
                color: currentTheme.text,
                border: "0px solid",
                borderColor: currentTheme.borderColor,
                opacity: "1.0"
              }}
            >
              ?
            </button>
          </div>
              
          {/* Modal de Ajuda / Documentação */}
          {showHelpModal && (
            <div className="help-modal-overlay" onClick={() => setShowHelpModal(false)}>
              <div 
                className="help-modal-content" 
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: currentTheme.bg,
                  color: currentTheme.text,
                  borderColor: currentTheme.border
                }}
              >
                <button 
                  className="help-modal-close" 
                  onClick={() => setShowHelpModal(false)}
                  style={{ color: "var(--brand-red)" }}
                >
                  &times;
                </button>

                <h2 style={{ color: currentTheme.text }}>Guia do Laboratório</h2>
                <p className="help-subtitle" style={{ opacity: 0.7, color: currentTheme.text }}>Visão geral, parâmetros e funcionalidades avançadas do pipeline e do editor</p>

                <div className="help-section">
                  <h3 style={{ color: currentTheme.text }}>Visão Geral do Laboratório</h3>
                  <p style={{ opacity: 0.9, color: currentTheme.text }}>
                    Este editor permite a criação e teste em tempo real de shaders de fragmento utilizando a API 
                    <strong> WebGPU</strong> e o ecossistema <strong>Three.js / TSL (Three Shading Language)</strong>. 
                    O sistema suporta múltiplos passes encadeados (Buffer A, Buffer B, ..., até Main), permitindo 
                    efetuar processamentos offscreen intermediários antes de renderizar a imagem final na tela.
                  </p>
                </div>

                <div className="help-section">
                  <h3 style={{ color: currentTheme.text }}>A Linguagem WGSL</h3>
                  <p style={{ opacity: 0.9, color: currentTheme.text }}>
                    Os shaders aqui precisam ser escritos na linguagem WGSL, e <strong>não</strong> em GLSL ou HLSL. Para consultar a sintaxe completa, tipos de dados e funções built-in suportadas pela especificação da WebGPU, acesse a documentação oficial:
                  </p>
                  <a 
                    href="https://www.w3.org/TR/WGSL/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="help-link"
                  >
                    W3C WGSL Specification
                  </a>
                </div>

                <div className="help-section">
                  <h3 style={{ color: currentTheme.text }}>Uniforms e Parâmetros Disponíveis</h3>
                  <p style={{ opacity: 0.9, color: currentTheme.text }}>Os seguintes parâmetros são injetados automaticamente e podem ser utilizados nas assinaturas das funções dos buffers e do main:</p>
                  <ul className="help-list" style={{ opacity: 0.9, color: currentTheme.text }}>
                    <li><code>time: f32</code> - Tempo decorrido em segundos, útil para animações contínuas.</li>
                    <li><code>uv: vec2&lt;f32&gt;</code> - Coordenadas de mapeamento UV da geometria (0.0 a 1.0).</li>
                    <li><code>mouse_pos: vec2&lt;f32&gt;</code> - Posição normalizada do cursor do mouse sobre o canvas.</li>
                    <li><code>light_pos: vec3&lt;f32&gt;</code> - Posição tridimensional da fonte de luz configurada nos sliders XYZ.</li>
                    <li><code>normal: vec3&lt;f32&gt;</code> - Vetor normal da superfície 3D (espaço local).</li>
                    <li><code>pos: vec3&lt;f32&gt;</code> - Posição mundial tridimensional (World Position) do fragmento/vértice.</li>
                    <li><code>cam_pos: vec3&lt;f32&gt;</code> - Posição atual da câmera principal no espaço 3D.</li>
                    <li><code>cam_dir: vec3&lt;f32&gt;</code> - Vetor de direção de visão da câmera.</li>
                    <li><code>pass0, pass1, ... : vec4&lt;f32&gt;</code> - Texturas geradas pelos passes intermediários (Buffers anteriores) para leitura encadeada.</li>
                    <li><code>tex0, tex1, ... : vec4&lt;f32&gt;</code> - Texturas manuais carregadas nos slots ou a textura nativa extraída do modelo 3D.</li>
                  </ul>
                </div>

                <div className="help-section">
                  <h3 style={{ color: currentTheme.text }}>Funcionalidades Adicionais</h3>
                  <div className="help-features-grid">
                    <div className="help-feature-card" style={{ borderColor: currentTheme.border, background: 'rgba(255,255,255,0.02)' }}>
                      <h4 style={{ color: currentTheme.text }}>Modelos 3D Próprios</h4>
                      <p style={{ color: currentTheme.text, opacity: 0.9 }}>Permite importar arquivos <code>.gltf</code> ou <code>.glb</code> customizados. O sistema detecta texturas nativas e auto-gera UVs caso o modelo não possua. Modelos <code>.gltf</code> devem ser importados junto de suas texturas e <code>.bin</code></p>
                    </div>
                    <div className="help-feature-card" style={{ borderColor: currentTheme.border, background: 'rgba(255,255,255,0.02)' }}>
                      <h4 style={{ color: currentTheme.text }}>Slots de Texturas</h4>
                      <p style={{ color: currentTheme.text, opacity: 0.9 }}>Carregue imagens estáticas nos canais de textura para alimentar diretamente seus shaders com mapas visuais personalizados. Não esqueça de adicionar o parâmetro <code>tex0, tex1, ...</code> no cabeçalho da função</p>
                    </div>
                    <div className="help-feature-card" style={{ borderColor: currentTheme.border, background: 'rgba(255,255,255,0.02)' }}>
                      <h4 style={{ color: currentTheme.text }}>Posição da Light-Cam</h4>
                      <p style={{ color: currentTheme.text, opacity: 0.9 }}>Controle interativo através de sliders coloridos (RGB para eixos XYZ) que definem a posição exata da câmera de luz para cálculos de sombra e profundidade. Os buffers são "renderizados" do ponto de vista desta câmera</p>
                    </div>
                    <div className="help-feature-card" style={{ borderColor: currentTheme.border, background: 'rgba(255,255,255,0.02)' }}>
                      <h4 style={{ color: currentTheme.text }}>Compartilhamento</h4>
                      <p style={{ color: currentTheme.text, opacity: 0.9 }}>Empacota e exporta o seu estado de desenvolvimento para que você possa compartilhar facilmente suas criações com outras pessoas. Os URLs gerados são enormes, então esteja avisado!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="canvas-wrapper">
            <ShaderCanvas 
              shaders={shaders}
              modelType={modelType} 
              customModel={customModel}
              bgColor={currentTheme.bg}
              textures={textures}
              shaderError={shaderError}
              onShaderError={handleShaderError}
              lightPosition={lightPos}
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
