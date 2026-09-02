import { useEffect, useRef } from 'react'

import './GridLines.css'

// tune: raise to spread the grid nodes farther apart
const SPACING = 50
// tune: raise to widen the pointer influence
const RADIUS_FRAC = 0.8
// tune: raise to strengthen the lens displacement
const LENS_FRAC = 0.02
// tune: raise to brighten highlighted dots
const PEAK_A = 0.95
// tune: raise to brighten resting lines
const LINE_A_LIGHT = 0.15
// tune: raise to quicken pointer tracking
const MOUSE_LERP = 0.14

export default function GridLines() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const mouseRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let dots = []
    let hSegs = []
    let vSegs = []
    let animId = 0
    let alive = true
    let cw = 0, ch = 0

    let smoothMx = -99999
    let smoothMy = -99999

    function build() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.parentElement.getBoundingClientRect()
      const OVERSCAN = 1.1
      cw = rect.width * OVERSCAN
      ch = rect.height * OVERSCAN
      if (!cw || !ch) return

      canvas.style.position = 'absolute'
      canvas.style.width = `${cw}px`
      canvas.style.height = `${ch}px`
      canvas.style.left = `${-(cw - rect.width) / 2}px`
      canvas.style.top = `${-(ch - rect.height) / 2}px`

      canvas.width = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = Math.floor(cw / SPACING) + 2
      const rows = Math.floor(ch / SPACING) + 2
      const ox = (cw % SPACING) / 2
      const oy = (ch % SPACING) / 2

      const prev = new Map()
      for (const d of dots) {
        prev.set(`${d.x.toFixed(0)},${d.y.toFixed(0)}`, d)
      }

      const grid = []
      dots = []
      for (let r = 0; r < rows; r++) {
        grid[r] = []
        for (let c = 0; c < cols; c++) {
          const x = ox + c * SPACING
          const y = oy + r * SPACING
          const key = `${x.toFixed(0)},${y.toFixed(0)}`
          const d = prev.get(key) ?? { x, y, b: 0, l: 0, px: x, py: y }

          dots.push(d)
          grid[r][c] = d
        }
      }

      hSegs = []
      vSegs = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (c + 1 < cols) hSegs.push({ a: grid[r][c], b: grid[r][c + 1] })
          if (r + 1 < rows) vSegs.push({ a: grid[r][c], b: grid[r + 1][c] })
        }
      }
    }

    function frame() {
      if (!alive) return
      ctx.clearRect(0, 0, cw, ch)

      const raw = mouseRef.current
      if (raw) {
        if (smoothMx === -99999) { smoothMx = raw.x; smoothMy = raw.y }
        smoothMx += (raw.x - smoothMx) * MOUSE_LERP
        smoothMy += (raw.y - smoothMy) * MOUSE_LERP
      } else {
        smoothMx = -99999
        smoothMy = -99999
      }

      const mx = smoothMx
      const my = smoothMy
      const R = RADIUS_FRAC * Math.max(cw, ch)
      const r2 = R * R
      const lensPush = LENS_FRAC * R
      const dotRGB = '50,40,90'
      const baseA = 0.10
      const lineRestA = LINE_A_LIGHT

      for (const d of dots) {
        const dx = d.x - mx
        const dy = d.y - my
        const dist2 = dx * dx + dy * dy
        const dist = Math.sqrt(dist2)
        const safeDist = Math.max(dist, 0.0001) // evita divisão por ~0 perto do cursor

        const tgtB = dist2 < r2 ? Math.exp(-dist2 / (r2 * 0.45)) : 0
        d.b += (tgtB > d.b ? 0.16 : 0.07) * (tgtB - d.b)
        if (d.b < 0.004) d.b = 0

        const tgtL = dist < R ? Math.pow(1 - dist / R, 2) : 0
        d.l += (tgtL > d.l ? 0.18 : 0.08) * (tgtL - d.l)
        if (d.l < 0.004) d.l = 0

        if (d.l > 0.004) {
          const pull = Math.min(lensPush * d.l, safeDist * 0.65)
          const ux = dx / safeDist
          const uy = dy / safeDist
          d.px = d.x - ux * pull
          d.py = d.y - uy * pull
        } else {
          d.px = d.x
          d.py = d.y
        }
      }

      const allSegs = [...hSegs, ...vSegs]
      for (const seg of allSegs) {
        const segB = (seg.a.b + seg.b.b) / 2
        const lineA = lineRestA + (PEAK_A - lineRestA) * segB
        ctx.strokeStyle = `rgba(${dotRGB},${lineA.toFixed(3)})`
        ctx.lineWidth = 0.5 + segB * 0.6
        ctx.beginPath()
        ctx.moveTo(seg.a.px, seg.a.py)
        ctx.lineTo(seg.b.px, seg.b.py)
        ctx.stroke()
      }

      for (const d of dots) {
        const alpha = baseA + (PEAK_A - baseA) * d.b
        const sz = 1 + d.b * 2.2
        ctx.fillStyle = `rgba(${dotRGB},${alpha.toFixed(2)})`
        ctx.fillRect(d.px - sz / 2, d.py - sz / 2, sz, sz)
      }

      animId = requestAnimationFrame(frame)
    }

    build()
    frame()

    const ro = new ResizeObserver(build)
    ro.observe(canvas.parentElement)

    return () => {
      alive = false
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      updateMouse(e.clientX, e.clientY)
    }

    const handleTouchMove = (e) => {
      const t = e.touches[0]
      if (t) updateMouse(t.clientX, t.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  })

  function updateMouse(clientX, clientY) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
  }

  return (
    <section
      ref={containerRef}
      className="grid-lines"
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100dvh' }}
      />
    </section>
  )
}