import { useNavigate } from 'react-router-dom'
import './progressBar.css'
import { getPercentage } from '@utils/trailProgressFunctions.jsx'

export function ProgressBar({ id }) {
    var percentage = getPercentage(id);
    return (
        <div className="progress-display">
            <progress value={percentage} max="100"></progress>
            <p>{percentage}%</p>
        </div>
    )
}