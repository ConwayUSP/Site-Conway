import isSmallScreen from '@utils/isSmallScreen'
import { motion } from 'framer-motion'
import './CursoModal.css'
import { remToPx } from '@utils/convertValues'
import arrow from '@assets/icons/arrow-forward.svg'
import estrelinhas1 from '@assets/enfeites/twinkles1.svg'
import estrelinhas2 from '@assets/enfeites/twinkles2.svg'

function CursoModal({data, id, onAccess}) {
    if (!data) return null
    
    return (
        <div className="curso-modal" id={id}>
            <div className="curso-modal-title">
                <h2 style={{ marginRight: "2rem" }}>{data.title}</h2>
                <img className="estrelinhas-top" src={estrelinhas1} alt="Estrelinhas" style={{ height: '1.2rem', width: 'auto' }} />
            </div>
            <div className="curso-modal-content">
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="0.5rem" height="0.5rem" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.1rem" y="0.1rem" width="0.3rem" height="0.3rem" transform={"rotate(-45 " + remToPx(0.3) + " " + remToPx(0.3) + ")"} fill="var(--yellow)" />
                    </svg>
                    <h3 style={{ color: 'var(--yellow)' }}>{data.subtitle}</h3>
                </div>

                {data.description.split('\n').map((line, index) => (
                    <p key={index} style={{ fontSize: '0.8rem', lineHeight: '1rem', marginBottom: "0.1rem"}}>{line}</p>
                ))}
                
                { isSmallScreen() ?
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'end', gap: '0.4rem' }}>
                        <motion.button onClick={onAccess}>
                            Acesse o curso
                            <img src={arrow} alt="->" style={{ width: '0.8rem', height: '0.8rem' }} />
                        </motion.button>
                        <img className="estrelinhas-bottom" src={estrelinhas2} alt="Estrelinhas" style={{ height: '1.2rem', width: 'auto' }} />
                    </div>
                : null }
            </div>
        </div>
    )
}

export default CursoModal
