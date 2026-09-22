import "./QuizResults.css";
import { Chip } from "./Chip";

export function QuizResults({ resultados }) {
  return (
    <>
      <div className="quiz-results-container">
        <div className="quiz-results-podium">
          <div className="quiz-results-second">
            <img src={resultados[1].imagem} alt={resultados[1].nome} />
            <Chip style={{ backgroundColor: "#a399ff" }}>
              2° - {resultados[1].nome}
            </Chip>
          </div>
          <div className="quiz-results-first">
            <img src={resultados[0].imagem} alt={resultados[0].nome} />
            <Chip style={{ backgroundColor: "#a399ff" }}>
              1° - {resultados[0].nome}
            </Chip>
          </div>
          <div className="quiz-results-third">
            <img src={resultados[2].imagem} alt={resultados[2].nome} />
            <Chip style={{ backgroundColor: "#a399ff" }}>
              3° - {resultados[2].nome}
            </Chip>
          </div>
        </div>
        <p>
          * Recomendamos que aqueles que não tenham conhecimento de versionamento façam a trilha de Git & GitHub paralelamente
        </p>
      </div>
    </>
  );
}
