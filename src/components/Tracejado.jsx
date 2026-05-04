import { motion } from 'framer-motion'
import './Tracejado.css'
import getPathEnd from '@utils/getPathEnd'

/*
- Para utilizar, basta passar a propriedade "d" com o caminho do tracejado. Este "d" pode ser obtido diretamente do elemento SVG. É recomendado fazer o caminho simples (sem tracejados nem marcadores) no Figma, 'copiar como SVG' e extrair o "d" do elemento <path>.
- Caso deseje marcadores no início ou no final, utilize as propriedades "comeco" e "final" com os seguintes valores:
  - comeco: "circulo", ...
  - final: "seta", ...
*/

function Tracejado({d, comeco, final, id}) {
    const { start, end } = getPathEnd(d);

    const padding = 15;

    const minX = Math.min(start.x, end.x) - padding;
    const minY = Math.min(start.y, end.y) - padding;
    const maxX = Math.max(start.x, end.x) + padding;
    const maxY = Math.max(start.y, end.y) + padding;

    const width = maxX - minX;
    const height = maxY - minY;

    return (
        <svg className="tracejado" viewBox={`${minX} ${minY} ${width} ${height}`} id={id}>
            {final === "seta" &&
                <marker
                id="arrowUp"
                markerWidth="6"
                markerHeight="7"
                viewBox="-3 -3 14 14"
                refX="5"
                refY="5"
                orient="0"
                markerUnits="strokeWidth"
                >
                    <path d="M0,10 L5,0 L10,10 Z" fill="white" />
                </marker>
            }

            <motion.path
                d={d}
                fill="transparent"
                stroke="white"
                strokeWidth="1.5"
                strokeDasharray="4.5 4.5"
                initial={{ strokeDashoffset: 200 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                duration: 3,
                ease: "easeOut",
                }}
                markerEnd={final === "seta" ? "url(#arrowUp)" : undefined}
                markerStart={comeco === "circulo" ? "url(#circleStart)" : undefined}
            />

            {comeco === "circulo" &&
                <circle cx={start.x} cy={start.y} r="3" fill="white" />
            }
        </svg>
    )
}

export default Tracejado