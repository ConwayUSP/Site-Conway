import './FilterOption.css'

// Department textures
import DPS from '@assets/setores/textures/DPS.png'
import DLC from '@assets/setores/textures/DLC.png'
import GG from '@assets/setores/textures/GG.png'
import OP from '@assets/setores/textures/OP.png'

const textures = {DPS, DLC, GG, OP}
const colors = {"DPS":"gray", "DLC":"red", "GG":"yellow", "OP":"blue", "Todos":"violet"}

export default function ({tag, isSelected, clickAction}) {
    if (isSelected) return (
        <button 
            className={`filterOption selectedOption ${tag == "Todos"? "todos" : ""}`}
            aria-label={`Filtro ${tag}`}
        >
            <h1 style={{"color": `var(--brand-${colors[tag]})`}}>{tag}</h1>
            <img src={textures[tag]}/>
        </button>
    )
    else return (
        <button 
            className="filterOption unselectedOption" onClick={clickAction}
            aria-label={`Filtro ${tag}`}
        >
            <h2>{tag}</h2>
        </button>
    )
}