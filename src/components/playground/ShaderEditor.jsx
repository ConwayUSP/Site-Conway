import { useEffect, useState, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { vim } from "@replit/codemirror-vim";
import { EditorView, keymap } from "@codemirror/view";

export default function ShaderEditor({ code, onChange, vimEnabled, onToggleVim, currentTheme, fontSize,
  onFontSizeChange }) {
  const [internalCode, setInternalCode] = useState(code);

  useEffect(() => {
    setInternalCode(code);
  }, [code]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(internalCode);
    }, 400);

    return () => clearTimeout(handler);
  }, [internalCode, onChange]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          onFontSizeChange((prev) => Math.min(prev + 1, 64));
        } else if (e.key === "-") {
          e.preventDefault();
          onFontSizeChange((prev) => Math.max(prev - 1, 10));
        } else if (e.key === "0") {
          e.preventDefault();
          onFontSizeChange(14);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onFontSizeChange]);

  const fontSizeTheme = useMemo(() => {
    return EditorView.theme({
      "&": { fontSize: `${fontSize}px` },
      ".cm-gutters": { fontSize: `${fontSize}px` }
    });
  }, [fontSize]);

  const extensions = [cpp(), currentTheme.editorTheme, fontSizeTheme];
  if (vimEnabled) {
    extensions.push(vim());
  }

  return (
    <div 
      className="shader-editor-container" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%", 
        backgroundColor: currentTheme.panelBg,
        color: currentTheme.text 
      }}
    >
      <div 
        className="editor-toolbar" 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          padding: "8px 12px", 
          backgroundColor: currentTheme.panelBg, 
          borderBottom: `1px solid ${currentTheme.border}`, 
          color: currentTheme.text 
        }}
      >
        <span>Editor de Shader (WGSL)</span>
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
          theme={currentTheme.editorTheme}
          extensions={extensions}
          onChange={(val) => setInternalCode(val)}
        />
      </div>
    </div>
  );
}
