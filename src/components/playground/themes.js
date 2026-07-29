import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

function createTheme({ dark, bg, panelBg, border, text, cursor, selection, guttersBg, guttersText, tokenStyles }) {
  const baseTheme = EditorView.theme({
    "&": {
      backgroundColor: bg,
      color: text,
      height: "100%"
    },
    ".cm-content": {
      caretColor: cursor,
      fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, Monaco, monospace"
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: cursor
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: selection
    },
    ".cm-gutters": {
      backgroundColor: guttersBg,
      color: guttersText,
      borderRight: `1px solid ${border}`
    },
    ".cm-activeLine": {
      backgroundColor: dark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)"
    },
    ".cm-activeLineGutter": {
      backgroundColor: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
      color: text
    }
  }, { dark });

  const highlightStyle = HighlightStyle.define(tokenStyles);

  return [baseTheme, syntaxHighlighting(highlightStyle)];
}

export const THEMES = {
  dark: {
    name: "One Dark",
    bg: "#1e1e1e",
    panelBg: "#181818",
    border: "#2d2d2d",
    text: "#abb2bf",
    editorTheme: createTheme({
      dark: true,
      bg: "#1e1e1e",
      panelBg: "#181818",
      border: "#2d2d2d",
      text: "#abb2bf",
      cursor: "#528bff",
      selection: "#3e4451",
      guttersBg: "#1e1e1e",
      guttersText: "#4b5263",
      tokenStyles: [
        { tag: t.keyword, color: "#c678dd", fontWeight: "bold" },
        { tag: [t.typeName, t.className], color: "#e5c07b" },
        { tag: [t.number, t.bool, t.null], color: "#d19a66" },
        { tag: [t.string, t.character], color: "#98c379" },
        { tag: t.propertyName, color: "#61afef" },
        { tag: t.variableName, color: "#e06c75" },
        { tag: t.operator, color: "#56b6c2" },
        { tag: t.comment, color: "#5c6370", fontStyle: "italic" },
        { tag: t.punctuation, color: "#abb2bf" },
        { tag: t.name, color: "#abb2bf" }
      ]
    })
  },
  dracula: {
    name: "Dracula",
    bg: "#282a36",
    panelBg: "#21222c",
    border: "#44475a",
    text: "#f8f8f2",
    editorTheme: createTheme({
      dark: true,
      bg: "#282a36",
      panelBg: "#21222c",
      border: "#44475a",
      text: "#f8f8f2",
      cursor: "#f8f8f2",
      selection: "#44475a",
      guttersBg: "#21222c",
      guttersText: "#6272a4",
      tokenStyles: [
        { tag: t.keyword, color: "#ff79c6", fontWeight: "bold" },
        { tag: [t.typeName, t.className], color: "#8be9fd", fontStyle: "italic" },
        { tag: [t.number, t.bool, t.null], color: "#bd93f9" },
        { tag: [t.string, t.character], color: "#f1fa8c" },
        { tag: t.propertyName, color: "#50fa7b" },
        { tag: t.variableName, color: "#f8f8f2" },
        { tag: t.operator, color: "#ff79c6" },
        { tag: t.comment, color: "#6272a4", fontStyle: "italic" },
        { tag: t.punctuation, color: "#f8f8f2" },
        { tag: t.name, color: "#f8f8f2" }
      ]
    })
  },
  monokai: {
    name: "Monokai",
    bg: "#272822",
    panelBg: "#1e1f1c",
    border: "#3e3d32",
    text: "#f8f8f2",
    editorTheme: createTheme({
      dark: true,
      bg: "#272822",
      panelBg: "#1e1f1c",
      border: "#3e3d32",
      text: "#f8f8f2",
      cursor: "#f8f8f0",
      selection: "#49483e",
      guttersBg: "#1e1f1c",
      guttersText: "#90908a",
      tokenStyles: [
        { tag: t.keyword, color: "#f92672", fontWeight: "bold" },
        { tag: [t.typeName, t.className], color: "#66d9ef" },
        { tag: [t.number, t.bool, t.null], color: "#ae81ff" },
        { tag: [t.string, t.character], color: "#e6db74" },
        { tag: t.propertyName, color: "#a6e22e" },
        { tag: t.variableName, color: "#fd971f" },
        { tag: t.operator, color: "#f92672" },
        { tag: t.comment, color: "#75715e", fontStyle: "italic" },
        { tag: t.punctuation, color: "#f8f8f2" },
        { tag: t.name, color: "#f8f8f2" }
      ]
    })
  },
  catjump: {
    name: "Pulo do Gato",
    bg: "#15152b",
    panelBg: "#1a1a2f",
    border: "#2c2c4f",
    text: "#d6efff",
    editorTheme: createTheme({
      dark: true,
      bg: "#15152b",
      panelBg: "#1a1a2f",
      border: "#2c2c4f",
      text: "#d6efff",
      cursor: "#fb719f",
      selection: "#15152b",
      guttersBg: "#15152b",
      guttersText: "#2c2c4f",
      tokenStyles: [
        { tag: t.keyword, color: "#fb719f", fontWeight: "bold" },
        { tag: [t.typeName, t.className], color: "#89d4ec" },
        { tag: [t.number, t.bool, t.null], color: "#fff5bf" },
        { tag: [t.string, t.character], color: "#fff5bf" },
        { tag: t.propertyName, color: "#bbffb7" },
        { tag: t.variableName, color: "#fffade" },
        { tag: t.operator, color: "#1c7eac" },
        { tag: t.comment, color: "#00576a" },
        { tag: t.punctuation, color: "#d6efff" },
        { tag: t.name, color: "#9294ff" }
      ]
    })
  },
  light: {
    name: "GitHub Light",
    bg: "#ffffff",
    panelBg: "#f6f8fa",
    border: "#d0d7de",
    text: "#24292f",
    editorTheme: createTheme({
      dark: false,
      bg: "#ffffff",
      panelBg: "#f6f8fa",
      border: "#d0d7de",
      text: "#24292f",
      cursor: "#0969da",
      selection: "#b3d7ff",
      guttersBg: "#f6f8fa",
      guttersText: "#57606a",
      tokenStyles: [
        { tag: t.keyword, color: "#cf222e", fontWeight: "bold" },
        { tag: [t.typeName, t.className], color: "#953800" },
        { tag: [t.number, t.bool, t.null], color: "#0550ae" },
        { tag: [t.string, t.character], color: "#0a3069" },
        { tag: t.propertyName, color: "#8250df" },
        { tag: t.variableName, color: "#24292f" },
        { tag: t.operator, color: "#cf222e" },
        { tag: t.comment, color: "#6e7781", fontStyle: "italic" },
        { tag: t.punctuation, color: "#24292f" },
        { tag: t.name, color: "#24292f" }
      ]
    })
  }
};
