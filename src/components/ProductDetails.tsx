import { useState } from 'react'
import './ProductDetails.css'

const PRODUCTS = [
  {
    id: 1,
    name: 'Sauvage Dior',
    description: 'Mystérieux et profond',
    notes: 'Oud, Musc, Ambre',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764370046/glfa56la7ffzfwwtrmox.jpg',
    audioUrl: 'https://res.cloudinary.com/dcs9vkwe0/video/upload/v1764411795/flywthxunahtxut6gicx.mp4',
    fullDescription: 'Sauvage Dior est un parfum mystérieux et profond qui capture l\'essence de la nuit. Ses notes envoûtantes d\'oud, de musc et d\'ambre créent une symphonie olfactive intemporelle, parfaite pour les moments de luxe et de contemplation.',
    topNotes: 'Épices, Bergamote',
    heartNotes: 'Oud, Patchouli',
    baseNotes: 'Musc, Ambre, Vanille'
  },
  // ... autres produits
]

interface ProductDetailsProps {
  readonly productId: number
  readonly onClose: () => void
}

export default function ProductDetails({ productId, onClose }: ProductDetailsProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    character: false,
    composition: false,
    about: false
  })

  const product = PRODUCTS.find(p => p.id === productId)

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  if (!product) return null

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleWhatsAppClick = (productName: string) => {
    const message = `Bonjour, je suis intéressé(e) par le parfum ${productName}. Pourriez-vous me donner plus d'informations ?`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/772509543?text=${encodedMessage}`, '_blank')
  }

  return (
    <div 
      className={`product-details-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={handleClose}
      onKeyDown={(e) => e.key === 'Escape' && handleClose()}
    >
      <div 
        className="product-details-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="details-close-btn" onClick={handleClose} aria-label="Fermer">
          ✕
        </button>
        
        <div className="details-container">
          <div className="details-image-section">
            <img 
              src={product.image} 
              alt={product.name}
              className="details-image"
            />
          </div>

          <div className="details-content-section">
            <div className="details-header">
              <h1 className="details-title">{product.name}</h1>
              <div className="details-divider"></div>
            </div>

            <div className="details-body">
              {/* Desktop: affichage normal */}
              <div className="details-desktop-view">
                {/* AUDIO EN PREMIER */}
                <div className="details-group audio-group">
                  <h3 className="details-label">Écouter la présentation</h3>
                  <audio 
                    controls 
                    className="details-audio"
                    controlsList="nodownload"
                  >
                    <source src={product.audioUrl} type="audio/mp4" />
                    Votre navigateur ne supporte pas l'élément audio.
                  </audio>
                </div>

                <div className="details-group">
                  <h3 className="details-label">Caractère</h3>
                  <p className="details-text">{product.description}</p>
                </div>

                <div className="details-group">
                  <h3 className="details-label">Composition Olfactive</h3>
                  <div className="details-pyramid">
                    <div className="pyramid-tier">
                      <span className="pyramid-label">Notes de Tête</span>
                      <p className="pyramid-value">{product.topNotes}</p>
                    </div>
                    <div className="pyramid-tier">
                      <span className="pyramid-label">Notes de Cœur</span>
                      <p className="pyramid-value">{product.heartNotes}</p>
                    </div>
                    <div className="pyramid-tier">
                      <span className="pyramid-label">Notes de Base</span>
                      <p className="pyramid-value">{product.baseNotes}</p>
                    </div>
                  </div>
                </div>

                <div className="details-group">
                  <h3 className="details-label">À Propos</h3>
                  <p className="details-description">{product.fullDescription}</p>
                </div>
              </div>

              {/* Mobile: Accordion view */}
              <div className="details-mobile-accordion">
                {/* AUDIO TOUJOURS VISIBLE EN MOBILE */}
                <div className="accordion-audio-section">
                  <h3 className="details-label">Écouter la présentation</h3>
                  <audio 
                    controls 
                    className="accordion-audio"
                    controlsList="nodownload"
                  >
                    <source src={product.audioUrl} type="audio/mp4" />
                    Votre navigateur ne supporte pas l'élément audio.
                  </audio>
                </div>

                {/* Section 1: Caractère */}
                <div className="accordion-item">
                  <button 
                    className={`accordion-header ${expandedSections.character ? 'active' : ''}`}
                    onClick={() => toggleSection('character')}
                    aria-expanded={expandedSections.character}
                  >
                    <span className="accordion-title">Caractère</span>
                    <svg className="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {expandedSections.character && (
                    <div className="accordion-content">
                      <p className="accordion-text">{product.description}</p>
                    </div>
                  )}
                </div>

                {/* Section 2: Composition */}
                <div className="accordion-item">
                  <button 
                    className={`accordion-header ${expandedSections.composition ? 'active' : ''}`}
                    onClick={() => toggleSection('composition')}
                    aria-expanded={expandedSections.composition}
                  >
                    <span className="accordion-title">Composition</span>
                    <svg className="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {expandedSections.composition && (
                    <div className="accordion-content">
                      <div className="accordion-pyramid">
                        <div className="accordion-pyramid-tier">
                          <span className="accordion-pyramid-label">Notes de Tête</span>
                          <p className="accordion-pyramid-value">{product.topNotes}</p>
                        </div>
                        <div className="accordion-pyramid-tier">
                          <span className="accordion-pyramid-label">Notes de Cœur</span>
                          <p className="accordion-pyramid-value">{product.heartNotes}</p>
                        </div>
                        <div className="accordion-pyramid-tier">
                          <span className="accordion-pyramid-label">Notes de Base</span>
                          <p className="accordion-pyramid-value">{product.baseNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 3: À propos */}
                <div className="accordion-item">
                  <button 
                    className={`accordion-header ${expandedSections.about ? 'active' : ''}`}
                    onClick={() => toggleSection('about')}
                    aria-expanded={expandedSections.about}
                  >
                    <span className="accordion-title">À Propos</span>
                    <svg className="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {expandedSections.about && (
                    <div className="accordion-content">
                      <p className="accordion-text">{product.fullDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleWhatsAppClick(product.name)}
              className="details-whatsapp-btn"
              aria-label={`Contacter au sujet de ${product.name}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.023 0-2.031.394-2.773 1.122-.744.738-1.155 1.72-1.155 2.756 0 1.09.38 2.128 1.075 2.933l-.067.67.685-.179c.79.458 1.734.721 2.77.721 1.024 0 2.031-.394 2.773-1.122s1.155-1.72 1.155-2.756c0-1.089-.38-2.128-1.075-2.933-.743-.728-1.882-1.212-2.963-1.212m5.471-1.122C17.002 2.391 14.193 0 10.823 0 4.998 0 .25 4.748.25 10.573c0 1.897.407 3.745 1.215 5.407L.031 24l8.563-2.712c1.604.839 3.397 1.285 5.229 1.285 5.824 0 10.573-4.748 10.573-10.573 0-2.828-1.144-5.493-3.221-7.489z"/>
              </svg>
              <span>Commander</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}