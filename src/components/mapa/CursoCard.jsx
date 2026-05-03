import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import './CursoCard.css'
import isSmallScreen from '@utils/isSmallScreen'
import { remToPx } from '@utils/convertValues'
import CursoModal from './CursoModal'

/*
- Para utilizar, forneça no campo "file" o nome do arquivo de dados presente em /public/data/trilhas/ como "EXEMPLO" para EXEMPLO.json
- "type" é um campo opcional. Caso deseje utilizar um card horizontal (texto à direita do ícone), basta fornecer o valor "horizontal"
*/

function CursoCard({ file, type, id }) {
    const [data, setData] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalPos, setModalPos] = useState({ x: 0, y: 0 })

    function handleOpen(e) {
        const rect = e.currentTarget.getBoundingClientRect()

        if (!isSmallScreen()) {
            setModalPos({
                x: Math.min(rect.left + 52, window.innerWidth - remToPx(24.5) - 24),
                y: Math.min(rect.top + 64, window.innerHeight - remToPx(21) - 24)
            })
        } else {
            setModalPos({ 
                x: window.visualViewport.offsetLeft + (window.visualViewport.width - remToPx(24.5)) / 2,
                y: window.visualViewport.offsetTop + (window.visualViewport.height - remToPx(23)) / 2
            })
        }

        setIsModalOpen(true)
    }

    useEffect(() => {
        if (!isModalOpen) return;
        if (!isSmallScreen()) return;
        const preventScroll = (e) => e.preventDefault();
        document.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            document.removeEventListener('touchmove', preventScroll);
        };
    }, [isModalOpen]);

    useEffect(() => {
        if (file) {
            try {
                fetch(`/data/trilhas/${file}.json`)
                    .then(response => response.json())
                    .then(setData)
                    .catch(() => console.error("O campo 'file' do CursoCard deve ser uma string representando o nome do arquivo de dados (sem extensão) presente em /public/data/trilhas/", file))
            } catch (error) {
                console.error("Erro ao buscar dados do curso")
            }
        }
    }, [file])

    const filteredLabel = data ? data.label.split(' ').filter(word => word !== '&') : [];

    if (!data) return null

    return (
        <div className="curso-card-wrapper" id={id}>
            <motion.div 
            className={`curso-card ${type === 'horizontal' ? 'horizontal' : ''}`} 
            onClick={isSmallScreen() ? (e) => handleOpen(e) : () => window.open(data.link, '_blank')}
            onMouseEnter={isSmallScreen() ? null : (e) => handleOpen(e)}
            onMouseLeave={isSmallScreen() ? null : () => setIsModalOpen(false)}
            whileHover={{
                scale: 1.15,
                transition: { duration: 0.2, ease: 'easeOut' },
                cursor: 'pointer'
            }}
            >
                <img className="icon" src={`/icons/trilhas/${data.icon}.png`} alt={data.titulo} />
                <div className="curso-label">
                    {data.label.split(' ').map((palavra, index) => {
                        if (palavra === '&') {
                            return (
                                <span key={index} style={{ color: 'var(--white)' }}>
                                    {palavra + " "}
                                </span>
                            );
                        }

                        const cor = Array.isArray(data.cores)? "var(--" + data.cores[filteredLabel.indexOf(palavra)] + ")" : "var(--" + data.cores + ")";
                        
                        return (
                            <span key={index} style={{ color: cor }}>
                                {palavra + " "}
                            </span>
                        );
                    })}
                </div>
            </motion.div>
            {isModalOpen && createPortal(
            isSmallScreen() ? 
                <motion.div className="bg-overlay" onClick={() => setIsModalOpen(false) }>
                    <motion.div className="curso-modal-container" style={{ top: modalPos.y, left: modalPos.x }}
                    initial={{ scale: 1.3 / window.visualViewport?.scale }} animate={{ scale: 1.25 / window.visualViewport?.scale }} transition={{ duration: 0.03, ease: 'easeOut' }}>
                        <CursoModal data={data} />
                    </motion.div>
                </motion.div>
            :
                <motion.div className="curso-modal-container" style={{ top: modalPos.y, left: modalPos.x }} 
                initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 0.03, ease: 'easeIn' }}>
                    <CursoModal data={data} />
                </motion.div>
            , document.body)}
        </div>
    )
}

export default CursoCard