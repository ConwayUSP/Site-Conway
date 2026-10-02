import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import './CursoCard.css'
import isSmallScreen from '@utils/isSmallScreen'
import { remToPx } from '@utils/convertValues'
import trilhasConfig from '@data/trilhasConfig.json'
import CursoModal from './CursoModal'

/*
- Para utilizar, forneça em "trailId" a chave correspondente em trilhasConfig.json.
- "type" é um campo opcional. Caso deseje utilizar um card horizontal (texto à direita do ícone), basta fornecer o valor "horizontal"
*/

function CursoCard({ trailId, type, id }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalPos, setModalPos] = useState({ x: 0, y: 0 })
    const navigate = useNavigate()
    const trail = trilhasConfig[trailId]
    const data = trail?.map

    function handleAccess() {
        navigate(`/nucleo/trilha/${trailId}`)
    }

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

    const filteredLabel = data ? data.label.split(' ').filter(word => word !== '&') : [];

    return (
        <div className="curso-card-wrapper" id={id}>
            <motion.div 
            className={`curso-card ${type === 'horizontal' ? 'horizontal' : ''}`} 
            onClick={data ? (isSmallScreen() ? (e) => handleOpen(e) : handleAccess) : undefined}
            onMouseEnter={data && !isSmallScreen() ? (e) => handleOpen(e) : undefined}
            onMouseLeave={data && !isSmallScreen() ? () => setIsModalOpen(false) : undefined}
            whileHover={data ? {
                scale: 1.15,
                transition: { duration: 0.2, ease: 'easeOut' },
                cursor: 'pointer'
            } : undefined}
            >
                {data ? (
                    <img className="icon" src={`/icons/trilhas/${data.icon}.png`} alt={data.title} />
                ) : (
                    <span className="icon" aria-hidden="true" />
                )}
                <div className="curso-label">
                    {data?.label.split(' ').map((palavra, index) => {
                        if (palavra === '&') {
                            return (
                                <span key={index} style={{ color: 'var(--white)' }}>
                                    {palavra + " "}
                                </span>
                            );
                        }

                        const cor = Array.isArray(data.colors)? "var(--" + data.colors[filteredLabel.indexOf(palavra)] + ")" : "var(--" + data.colors + ")";
                        
                        return (
                            <span key={index} style={{ color: cor }}>
                                {palavra + " "}
                            </span>
                        );
                    })}
                </div>
            </motion.div>
            {data && isModalOpen && createPortal(
            isSmallScreen() ? 
                <motion.div className="bg-overlay" onClick={() => setIsModalOpen(false) }>
                    <motion.div className="curso-modal-container" style={{ top: modalPos.y, left: modalPos.x }}
                    initial={{ scale: 1.3 / window.visualViewport?.scale }} animate={{ scale: 1.25 / window.visualViewport?.scale }} transition={{ duration: 0.03, ease: 'easeOut' }}>
                        <CursoModal data={data} onAccess={handleAccess} />
                    </motion.div>
                </motion.div>
            :
                <motion.div className="curso-modal-container" style={{ top: modalPos.y, left: modalPos.x }} 
                initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 0.03, ease: 'easeIn' }}>
                    <CursoModal data={data} onAccess={handleAccess} />
                </motion.div>
            , document.body)}
        </div>
    )
}

export default CursoCard
