import { useNavigate } from 'react-router-dom'
import './markAsReadButton.css'
import { markAllAsRead } from '@utils/trailProgressFunctions.jsx'

export function MarkAsReadButton({ id }) {
    const navigate = useNavigate();
    return (
        <div className="markButton-display">
            <button className="markButton" onClick={() => { markAllAsRead(id); navigate(0); }}>
                Marcar trilha como lida
            </button>
        </div>
    )
}