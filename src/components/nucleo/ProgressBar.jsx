import { useNucleo } from '@hooks/useNucleo';

import './ProgressBar.css'

export function ProgressBar({ id }) {
    const { getPercentage } = useNucleo()
    const percentage = getPercentage(id);
    
    return (
        <div className="progress-display">
            <progress value={percentage} max="100"/>
            <span>{percentage}%</span>
        </div>
    )
}