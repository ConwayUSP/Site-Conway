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
        <div className={`selectedOption ${tag == "Todos"? "todos" : ""}`}>
            <h1 style={{"color": `var(--brand-${colors[tag]})`}}>{tag}</h1>
                <img src={textures[tag]}/>
        </div>
    )
    else return (
        <div className="unselectedOption" onClick={clickAction}>
            <h2>{tag}</h2>
        </div>
    )
}