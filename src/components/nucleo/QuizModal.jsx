import { motion } from "framer-motion";
import { Button } from "./Button";
import "./QuizModal.css";
import { useState, useMemo } from "react";
import { compability } from "../../utils/compability";
import { trilhas } from "../../assets/quiz/perguntas";
import { QuizResults } from "./QuizResults";
import Confetti from 'react-confetti'

export function QuizModal({ closeModal, perguntas }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [points, setPoints] = useState([]);

  const resultados = useMemo(() => compability(trilhas, points), [points]);

  let isFinal = currentQuestion === perguntas.length;

  return (
    <div className="quiz-modal" onClick={closeModal}>
      <div
        className="quiz-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {isFinal && <Confetti />}
        <div className="quiz-modal-head">
          <p className="quiz-modal-head-texto">
            {!isFinal
              ? perguntas[currentQuestion].pergunta
              : "Achamos que essas trilhas são as que mais combinam com seu perfil!"}
          </p>
          <div className="close-quiz-modal">
            <p onClick={closeModal}>X</p>
          </div>
        </div>
        <motion.div className="quiz-modal-content">
          {!isFinal ? (
            <>
              <div
                className="quiz-modal-meme"
                style={{
                  "--meme-image": `url(${perguntas[currentQuestion].imagem})`,
                }}
              >
                <img src={perguntas[currentQuestion].imagem} />
              </div>
              <div className="quiz-modal-respostas">
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
            </>
          ) : (
            <QuizResults closeModal={closeModal} resultados={resultados} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
