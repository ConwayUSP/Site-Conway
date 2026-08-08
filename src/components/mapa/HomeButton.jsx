import { useNavigate } from 'react-router-dom'
import './HomeButton.css'

function HomeButton({ id }) {
    const navigate = useNavigate()

    return (
        <div className="home-button" id={id} onClick={() => navigate('/')}>
            <img src="/icons/logos/white.svg" alt="Home" style={{width: '2.67rem', height: '2.67rem' }} />
        </div>
    )
}

export default HomeButton
