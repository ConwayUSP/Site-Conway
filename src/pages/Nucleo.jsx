import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from 'react-router-dom';

// Components
import { QuizModal } from "@components/nucleo/QuizModal";
import { ProgressBar } from '@components/nucleo/progressBar.jsx';

// Data
import trilhasConfig from '@data/trilhasConfig.json';
import { perguntas } from "@data/perguntas";

import "./Nucleo.css";

function Nucleo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="nucleo">
      <header style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
            color: "var(--cor-texto)",
          }}
        >
          Portal de Trilhas
        </h1>
        <p style={{ color: "var(--cor-texto-mutado)" }}>
          Selecione uma trilha para começar a estudar
        </p>
        <button
          className="open-quiz-modal"
          onClick={() => setIsModalOpen(true)}
        >
          Não sabe por onde começar?
        </button>
      </header>

      <div className="trails-grid">
        {Object.entries(trilhasConfig).map(([id, trail]) => (
          <Link
            key={id}
            to={`./trilha/${id}`}
            // Injetamos a classe do card E a classe do tema da trilha!
            className={`card-trilha ${trail.themeClass}`}
          >
            <img src={trail.thumbnail} alt={trail.name} />
            <div className="card-trilha-content">
              <h3>{trail.name}</h3>
              <p>{trail.description}</p>
              <ProgressBar id={id} />
            </div>
          </Link>
        ))}
      </div>

      {isModalOpen &&
        createPortal(
          <QuizModal
            closeModal={() => setIsModalOpen(false)}
            perguntas={perguntas}
          />,
          document.body,
        )}
    </main>
  );
}

export default Nucleo;
