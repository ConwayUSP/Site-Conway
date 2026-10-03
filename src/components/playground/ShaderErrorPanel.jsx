import { useState } from "react";

export default function ShaderErrorPanel({ error }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!error) return null;

  return (
    <section className={`shader-error-panel ${isExpanded ? "expanded" : "collapsed"}`} aria-live="polite">
      <button
        type="button"
        className="shader-error-panel__toggle"
        onClick={() => setIsExpanded((expanded) => !expanded)}
        aria-expanded={isExpanded}
      >
        <img className="shader-error-panel__status" src="/icons/alert-circle.svg" alt="" aria-hidden="true"/>
        <span>Erro no shader</span>
        <img lassName="shader-error-panel__chevron" src="/icons/chevron-down.svg" alt="" aria-hidden="true"/>
      </button>

      {isExpanded && <pre className="shader-error-panel__log">{error}</pre>}
    </section>
  );
}
