import Hero from '@components/home/Hero'
import About from '@components/home/About'
import Sectors from '@components/home/Sectors'
import './Home.css'

export default function Home() {
  return (
    <main className="home">
      <Hero />
      <About />
      <Sectors />
    </main>
  )
}
