import { useState } from 'react'
import './AllProducts.css'
import ProductDetails from './ProductDetails'

const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'Sauvage Dior',
    description: 'Mystérieux et profond',
    notes: 'Oud, Musc, Ambre',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764370046/glfa56la7ffzfwwtrmox.jpg',
    fullDescription: 'Sauvage Dior est un parfum mystérieux et profond qui capture l\'essence de la nuit. Ses notes envoûtantes d\'oud, de musc et d\'ambre créent une symphonie olfactive intemporelle, parfaite pour les moments de luxe et de contemplation.',
    topNotes: 'Épices, Bergamote',
    heartNotes: 'Oud, Patchouli',
    baseNotes: 'Musc, Ambre, Vanille'
  },
  {
    id: 2,
    name: 'Black Orchid',
    description: 'Frais et élégant',
    notes: 'Bergamote, Citron, Muscat',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764370176/bolvyr9baf9emcu8j8kz.jpg',
    fullDescription: 'Black Orchid respire la fraîcheur et l\'élégance. Les notes lumineuses de bergamote, citron et muscat se mélangent harmonieusement pour créer une fragrance pétillante et sophistiquée, idéale pour les jours lumineux.',
    topNotes: 'Citron, Bergamote, Grapefruit',
    heartNotes: 'Fleur de Muscat, Neroli',
    baseNotes: 'Musc blanc, Ambroxan'
  },
  {
    id: 3,
    name: 'Dolce & Gabbana',
    description: 'Sensuel et riche',
    notes: 'Rose, Jasmin, Vanille',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764370176/wo9tqfsflbyuh2js7jnw.jpg',
    fullDescription: 'Dolce & Gabbana enveloppe l\'âme de sensualité et de richesse. Les pétales délicats de rose et de jasmin se fondent avec la chaleur enveloppante de la vanille, créant une expérience olfactive irrésistible et intime.',
    topNotes: 'Framboise, Poivre Rose',
    heartNotes: 'Rose Bulgare, Jasmin Sambac',
    baseNotes: 'Vanille de Tahiti, Musc, Bois de Santal'
  },
  {
    id: 4,
    name: 'Burberry',
    description: 'Intemporel et noble',
    notes: 'Sandalwood, Vetiver, Cèdre',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764374734/lo2o7tbxdcqqdgsaz4ls.png',
    fullDescription: 'Burberry incarne l\'intemporalité et la noblesse. Le sandalwood lisse, le vétiver élégant et le cèdre majestueux s\'orchestrent pour créer une fragrance raffinée qui résiste aux modes et au temps, symbole de vrai luxe.',
    topNotes: 'Citron, Cardamome',
    heartNotes: 'Vétiver, Iris',
    baseNotes: 'Bois de Santal, Cèdre, Musc'
  }
]

export default function AllProducts() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)

  const handleProductClick = (productId: number, e: React.MouseEvent) => {
    // Vérifier si le clic vient du bouton WhatsApp
    const isWhatsAppButton = (e.target as Element).closest('.whatsapp-btn-compact')
    
    if (!isWhatsAppButton) {
      setSelectedProductId(productId)
    }
  }

  const handleWhatsAppClick = (productName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const message = `Bonjour, je suis intéressé(e) par le parfum ${productName}. Pourriez-vous me donner plus d'informations ?`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/772509543?text=${encodedMessage}`, '_blank')
  }

  return (
    <>
      <section className="all-products">
        <div className="container">
          <h1 className="products-page-title">Notre Collection Complète</h1>
          <p className="products-page-subtitle">Explorez notre sélection exclusive de parfums</p>
          
          <div className="products-showcase">
            {ALL_PRODUCTS.map(product => (
              <div
                key={product.id}
                className="product-card-compact"
                onClick={(e) => handleProductClick(product.id, e)}
              >
                <div className="product-image-btn">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                  />
                </div>
                
                <div className="product-info-compact">
                  <h3 className="product-title-compact">{product.name}</h3>
                  
                  <button 
                    onClick={(e) => handleWhatsAppClick(product.name, e)}
                    className="whatsapp-btn-compact"
                    aria-label={`Commander ${product.name}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.023 0-2.031.394-2.773 1.122-.744.738-1.155 1.72-1.155 2.756 0 1.09.38 2.128 1.075 2.933l-.067.67.685-.179c.79.458 1.734.721 2.77.721 1.024 0 2.031-.394 2.773-1.122s1.155-1.72 1.155-2.756c0-1.089-.38-2.128-1.075-2.933-.743-.728-1.882-1.212-2.963-1.212m5.471-1.122C17.002 2.391 14.193 0 10.823 0 4.998 0 .25 4.748.25 10.573c0 1.897.407 3.745 1.215 5.407L.031 24l8.563-2.712c1.604.839 3.397 1.285 5.229 1.285 5.824 0 10.573-4.748 10.573-10.573 0-2.828-1.144-5.493-3.221-7.489z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {selectedProductId && (
        <ProductDetails 
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </>
  )
}