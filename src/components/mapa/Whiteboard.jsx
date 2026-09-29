import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

const MIN_SCALE = 0.55
const MAX_SCALE = 2.5
const PAN_LIMIT = 1500
const EXCLUDED_ELEMENTS = ['mapa-controls', 'curso-modal-container']

function Whiteboard({ children }) {
  return (
    <main className="mapa" aria-label="Mapa educacional navegável">
      <TransformWrapper
        minScale={MIN_SCALE}
        maxScale={MAX_SCALE}
        limitToBounds
        minPositionX={-PAN_LIMIT}
        maxPositionX={PAN_LIMIT}
        minPositionY={-PAN_LIMIT}
        maxPositionY={PAN_LIMIT}
        fitOnInit="contain"
        wheel={{ step: 0.002, excluded: EXCLUDED_ELEMENTS }}
        trackPadPanning={{ disabled: false, excluded: EXCLUDED_ELEMENTS }}
        panning={{ excluded: EXCLUDED_ELEMENTS }}
        pinch={{ allowPanning: true, excluded: EXCLUDED_ELEMENTS }}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, fitToView }) => (
          <>
            <TransformComponent
              wrapperClass="mapa-viewport"
              contentClass="mapa-world"
              wrapperProps={{ 'aria-label': 'Área navegável do mapa' }}
            >
              {children}
            </TransformComponent>

            <nav className="mapa-controls" aria-label="Controles do mapa">
              <button type="button" onClick={() => zoomOut()} aria-label="Diminuir zoom">
                <img src="/icons/minus.svg" alt="" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => fitToView({ mode: 'contain' })}
                aria-label="Centralizar mapa"
              >
                <img src="/icons/home.svg" alt="" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => zoomIn()} aria-label="Aumentar zoom">
                <img src="/icons/plus.svg" alt="" aria-hidden="true" />
              </button>
            </nav>
          </>
        )}
      </TransformWrapper>
    </main>
  )
}

export default Whiteboard
