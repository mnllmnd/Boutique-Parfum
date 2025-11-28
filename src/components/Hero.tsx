import { useState, useEffect } from 'react'
import './Hero.css'

const HERO_IMAGES = [
  { id: 'hero-1', url: 'https://i.pinimg.com/1200x/94/a9/93/94a993434c3339447bf29dc172736257.jpg' },
  { id: 'hero-2', url: 'https://i.pinimg.com/736x/67/5d/df/675ddf4c5d7f1ceacff15d0f9f826197.jpg' },
  { id: 'hero-3', url: 'https://i.pinimg.com/736x/9b/92/08/9b92084657e8d2ecebb6b95f3e82362e.jpg' }
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="hero">
      <div className="hero-carousel">
        {HERO_IMAGES.map((image, index) => (
          <img
            key={image.id}
            src={image.url}
            alt={`Essence de Luxe ${index + 1}`}
            className={`hero-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      <div className="hero-content">
        <h1 className="hero-title">Essence de Luxe</h1>
        <p className="hero-subtitle">Découvrez les parfums les plus raffinés</p>
        <a href="#products" className="hero-cta">Explorer la collection</a>
      </div>
      <div className="hero-indicators">
        {HERO_IMAGES.map((image, index) => (
          <button
            key={image.id}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
      <div className="hero-background"></div>
    </section>
  )
}
