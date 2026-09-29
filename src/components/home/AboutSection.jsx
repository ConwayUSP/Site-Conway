import './AboutSection.css'
import { motion, useReducedMotion } from 'motion/react'

export default function AboutSection({ id, title, reverse = false, children }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className={`home-story${reverse ? ' home-story--reverse' : ''}`}
      aria-labelledby={id}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: 'easeOut' }}
    >
      <h2 id={id} className="home-story__title"><span>{title}</span></h2>
      <div className="home-story__content">{children}</div>
    </motion.section>
  )
}
