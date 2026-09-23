import { useEffect, useRef, useState } from 'react'
import shaderCode from './hero.wgsl?raw'
import './HeroShader.css'

export default function HeroShader() {
  const containerRef = useRef(null)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let renderer
    let material
    let resizeObserver
    let intersectionObserver
    let mouse
    let draw
    let visible = true

    const onPointerMove = event => {
      if (!mouse || motion.matches) return
      const rect = container.getBoundingClientRect()
      mouse.set(
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      )
    }

    const syncAnimation = () => {
      if (!renderer || !draw || disposed) return
      renderer.setAnimationLoop(visible && !document.hidden && !motion.matches ? draw : null)
      if (visible && !document.hidden) draw()
    }

    const initialize = async () => {
      try {
        // WGSL requires WebGPU; retain a static logo when it is unavailable.
        if (!navigator.gpu) throw new Error('WebGPU indisponível')
        const [THREE, tsl] = await Promise.all([import('three/webgpu'), import('three/tsl')])
        if (disposed) return
        renderer = new THREE.WebGPURenderer({ antialias: false, alpha: true })
        await renderer.init()
        if (disposed) { renderer.dispose(); return }
        renderer.setClearColor(0x000000, 0)

        mouse = new THREE.Vector2(0.35, 0.5)
        const aspect = tsl.uniform(new THREE.Vector2(1, 1))
        const elapsed = tsl.uniform(0)
        material = new THREE.NodeMaterial()
        material.transparent = true
        const screenUv = tsl.uv()
        material.fragmentNode = tsl.wgslFn(shaderCode)({
          time: elapsed,
          // QuadMesh UVs run downwards; the ray camera expects Y upwards.
          uv: tsl.vec2(screenUv.x, screenUv.y.oneMinus()).sub(0.5).mul(aspect).add(0.5),
          mouse_pos: tsl.uniform(mouse),
        })
        const quad = new THREE.QuadMesh(material)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        container.appendChild(renderer.domElement)

        const resize = () => {
          const { width, height } = container.getBoundingClientRect()
          if (!width || !height) return
          renderer.setSize(width, height)
          // Preserve the geometry on both portrait and landscape screens.
          aspect.value.set(Math.max(1, width / height), Math.max(1, height / width))
          if (draw) draw()
        }
        resize()
        await renderer.compileAsync(quad, quad.camera)
        if (disposed) return

        let previous = performance.now()
        draw = () => {
          const now = performance.now()
          if (!motion.matches) elapsed.value += Math.min((now - previous) / 1000, 0.05)
          previous = now
          quad.render(renderer)
        }
        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(container)
        intersectionObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting
          syncAnimation()
        })
        intersectionObserver.observe(container)
        syncAnimation()
      } catch (error) {
        if (disposed) return
        renderer?.setAnimationLoop(null)
        renderer?.domElement.remove()
        console.warn('Não foi possível iniciar o shader da home:', error)
        setUnavailable(true)
      }
    }

    container.addEventListener('pointermove', onPointerMove)
    document.addEventListener('visibilitychange', syncAnimation)
    motion.addEventListener('change', syncAnimation)
    initialize()

    return () => {
      disposed = true
      draw = null
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      container.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', syncAnimation)
      motion.removeEventListener('change', syncAnimation)
      renderer?.setAnimationLoop(null)
      renderer?.domElement.remove()
      renderer?.dispose()
      material?.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="hero-shader" aria-hidden="true">
      {unavailable && <img className="hero-shader__fallback" src="/icons/logos/white.svg" alt="" />}
    </div>
  )
}
