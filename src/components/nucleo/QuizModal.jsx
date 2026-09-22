import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from 'react-confetti'

// Components
import { Button } from "./Button";
import { QuizResults } from "./QuizResults";

// Utils
import { compability } from "@utils/compability";

// Data
import { trilhas } from "@data/perguntas";

// Hooks
import { useWindowSize } from "@hooks/useWindowSize";

import "./QuizModal.css";
import "./ProgressBar.css";

export function QuizModal({ closeModal, perguntas }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [points, setPoints] = useState([]);
  const { width, height } = useWindowSize();

  const resultados = useMemo(() => compability(trilhas, points), [points]);
  const isFinal = currentQuestion === perguntas.length;

  return (
    <div className="quiz-modal" onClick={closeModal}>
      <div
        className="quiz-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {isFinal && <Confetti width={width} height={height} />}
        <div className="quiz-modal-head">
          <p className="quiz-modal-head-texto">
            {!isFinal
              ? perguntas[currentQuestion].pergunta
              : "Trilhas  que mais combinam com seu perfil:"}
          </p>
          <div className="close-quiz-modal">
            <p onClick={closeModal}>X</p>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {!isFinal ? (
            <motion.div className="quiz-modal-content"
              key={currentQuestion}
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -35 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div
                className="quiz-modal-meme"
                style={{
                  "--meme-image": `url(${perguntas[currentQuestion].imagem})`,
                }}
              >
                <img src={perguntas[currentQuestion].imagem} />
              </div>
              <div 
                className="quiz-modal-respostas"
              >
                <Button
                  onClick={() => {
                    setPoints((prev) => [...prev, 0]);
                    setCurrentQuestion((prev) => prev + 1);
                  }}
                >
                  Discordo fortemente
                </Button>
                <Button
                  onClick={() => {
                    setPoints((prev) => [...prev, 1]);
                    setCurrentQuestion((prev) => prev + 1);
                  }}
                >
                  Discordo
                </Button>
                <Button
                  onClick={() => {
                    setPoints((prev) => [...prev, 2]);
                    setCurrentQuestion((prev) => prev + 1);
                  }}
                >
                  Concordo
                </Button>
                <Button
                  onClick={() => {
                    setPoints((prev) => [...prev, 3]);
                    setCurrentQuestion((prev) => prev + 1);
                  }}
                >
                  Concordo fortemente
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <QuizResults closeModal={closeModal} resultados={resultados} />
            </motion.div>
          )}
        </AnimatePresence>
        {!isFinal && (
          <QuizProgress question={currentQuestion} perguntas={perguntas} />
        )}
      </div>
    </div>
  );
}

function QuizProgress({question, perguntas}) {
  const percentage = Math.round((question / perguntas.length) * 100);
  return (
    <div className="progress-display">
        <progress value={percentage} max="100"/>
        <span>{percentage}%</span>
    </div>
  )
}
