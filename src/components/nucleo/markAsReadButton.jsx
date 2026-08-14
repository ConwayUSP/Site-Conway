import { useNucleo } from '@hooks/useNucleo';
import './markAsReadButton.css'

export function MarkAsReadButton({ id }) {
    const { markAllAsRead } = useNucleo()

    return (
        <div className="markButton-display">
            <button className="markButton" onClick={() => { markAllAsRead(id); }}>
                Marcar trilha como lida
            </button>
        </div>
    )
}