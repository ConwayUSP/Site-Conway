import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { vim } from "@replit/codemirror-vim";
import { EditorView, keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";

export default function ShaderEditor({ 
  shaders, activeShaderId, onSelectShader, onAddBuffer, onRemoveShader,
  code, onChange, vimEnabled, onToggleVim, currentTheme, fontSize,
  onFontSizeChange, textures, onTextureUpload, onTextureClear 
}) {
  const [internalCode, setInternalCode] = useState(code);
  const [isTexturesOpen, setIsTexturesOpen] = useState(false);

  useEffect(() => { setInternalCode(code); }, [code]);

  useEffect(() => {
    const handler = setTimeout(() => { onChange(internalCode); }, 400);
    return () => clearTimeout(handler);
  }, [internalCode, onChange]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "=" || e.key === "+") { e.preventDefault(); onFontSizeChange(p => Math.min(p + 1, 64)); }
        else if (e.key === "-") { e.preventDefault(); onFontSizeChange(p => Math.max(p - 1, 10)); }
        else if (e.key === "0") { e.preventDefault(); onFontSizeChange(14); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onFontSizeChange]);

  const fontSizeTheme = useMemo(() => EditorView.theme({
    "&": { fontSize: `${fontSize}px` },
    ".cm-gutters": { fontSize: `${fontSize}px` }
  }), [fontSize]);

  const vimEscape = useMemo(() => Prec.highest(keymap.of([{
    key: "Escape",
    run: (view) => { view.contentDOM.focus(); return false; }
  }])), []);

  const extensions = [cpp(), currentTheme.editorTheme, fontSizeTheme, vimEscape];
  if (vimEnabled) extensions.push(vim());

  return (
    <div className="shader-editor-container" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, backgroundColor: currentTheme.panelBg, color: currentTheme.text, borderRadius: "0.5rem" }}>
      <div className="editor-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: currentTheme.panelBg, color: currentTheme.text, borderRadius: "0.5rem", flexWrap: "wrap", gap: "8px" }}>
        
        {/* Seletor de Passes / Shaders (Abas Dinâmicas) */}
        <div className="editor-tabs" style={{ display: "flex", minWidth: 0, gap: "4px", alignItems: "center", overflowX: "auto" }}>
          {shaders.map(shader => {
            const isActive = shader.id === activeShaderId;
            return (
              <div key={shader.id} style={{ display: "flex", alignItems: "center", background: isActive ? "rgba(255,255,255,0.12)" : "transparent", borderRadius: "4px", padding: "2px 6px" }}>
                <button 
                  onClick={() => onSelectShader(shader.id)}
                  style={{ background: "none", border: "none", color: currentTheme.text, cursor: "pointer", fontSize: "0.85rem", fontWeight: isActive ? "bold" : "normal" }}
                >
                  {shader.name}
                </button>
                {shader.id !== "main" && (
                  <button onClick={() => onRemoveShader(shader.id)} title="Remover buffer" style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.75rem", marginLeft: "4px" }}>
                    ✕
                  </button>
                )}
              </div>
            );
          })}
          <button onClick={onAddBuffer} title="Adicionar novo Buffer" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid #3b82f6", color: "#3b82f6", borderRadius: "4px", padding: "6px 8px 2px 8px", display: "flex", alignItems: "flex-end", cursor: "pointer", fontSize: "0.8rem", marginLeft: "4px"}}>
            + Buffer
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Menu Dropdown de Texturas */}
          <div className="textures-menu-container">
            <button className="textures-btn" style={{ color: currentTheme.text }} onClick={() => setIsTexturesOpen(!isTexturesOpen)}>
              Texturas ▾
            </button>
            {isTexturesOpen && (
              <div className="textures-dropdown" style={{ backgroundColor: currentTheme.panelBg, borderColor: currentTheme.border }}>
                {textures.map((tex, i) => (
                  <div key={i} className={`texture-slot ${tex ? 'has-texture' : ''}`} style={{ backgroundColor: currentTheme.bg }}>
                    <span style={{ color: currentTheme.text }}>Slot {i}</span>
                    <div className="texture-slot-actions">
                      <label className="texture-slot-label">
                        {tex ? "Trocar" : "Carregar"}
                        <input type="file" accept="image/*" onChange={(e) => onTextureUpload(i, e.target.files[0])} />
                      </label>
                      {tex && <button className="texture-clear-btn" onClick={() => onTextureClear(i)} title="Remover textura">✕</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="vim-switch-label" style={{ color: currentTheme.text }}>
            <div className="vim-switch">
              <input type="checkbox" checked={vimEnabled} onChange={(e) => onToggleVim(e.target.checked)} />
              <span className="vim-slider"></span>
            </div>
            <span>Vim</span>
          </label>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        <CodeMirror value={internalCode} height="100%" theme={currentTheme.editorTheme} extensions={extensions} onChange={setInternalCode} />
      </div>
    </div>
  );
}

