import { motion, useSpring, useMotionValue } from 'framer-motion'

import GridLines from '@components/home/GridLines';

import './Hero.css'

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  const y = useSpring(mouseY, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <>
      <GridLines />
      <motion.section 
        className="hero" 
        onMouseMove={handleMouseMove}
        style={{ "--x": x, "--y": y }}
      >
        <h1 className='neon' data-text='Conway'>Conway</h1>
      </motion.section>
    </>
  )
}