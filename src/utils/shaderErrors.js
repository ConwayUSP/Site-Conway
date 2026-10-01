export function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}

export function isShaderRendererError(message) {
  return message.includes("WebGPURenderer")
    || message.includes("WebGLProgram: Shader Error")
    || message.includes("THREE.NodeMaterial");
}

function findMissingVariableSemicolon(message, sourceLines) {
  if (!/expected ['"]?;['"]? for variable declaration/i.test(message.message)) {
    return null;
  }

  const reportedLine = message.lineNum > 0 ? message.lineNum : sourceLines.length;
  const searchStart = Math.min(reportedLine - 1, sourceLines.length - 1);

  for (let index = searchStart; index >= 0; index -= 1) {
    const codeBeforeComment = sourceLines[index].split("//", 1)[0].trimEnd();

    if (
      /^\s*(?:let|var(?:<[^>]+>)?|const|override)\b/.test(codeBeforeComment)
      && !codeBeforeComment.endsWith(";")
    ) {
      return {
        line: index + 1,
        column: codeBeforeComment.length + 1,
      };
    }
  }

  return null;
}

function getEditorLocation(message, sourceLines) {
  const correctedLocation = findMissingVariableSemicolon(message, sourceLines);
  if (correctedLocation) return correctedLocation;

  if (message.lineNum <= 0 || message.lineNum > sourceLines.length) return null;

  return {
    line: message.lineNum,
    column: message.linePos > 0 ? message.linePos : null,
  };
}

export function formatCompilationErrors(messages, code) {
  const sourceLines = code.split("\n");

  return messages.map((message) => {
    const editorLocation = getEditorLocation(message, sourceLines);
    const location = editorLocation
      ? ` na linha ${editorLocation.line}${editorLocation.column ? `:${editorLocation.column}` : ""}`
      : "";
    let excerpt = "";

    if (editorLocation) {
      excerpt = `\n  ${sourceLines[editorLocation.line - 1]}`;
      if (editorLocation.column) {
        excerpt += `\n  ${" ".repeat(editorLocation.column - 1)}^`;
      }
    }

    return `WGSL${location}: ${message.message}${excerpt}`;
  }).join("\n\n");
}
