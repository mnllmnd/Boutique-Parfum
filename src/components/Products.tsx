import { useState } from 'react'
import './Products.css'
import ProductDetails from './ProductDetails'

const PRODUCTS = [
  {
    id: 1,
    name: 'Essence Nocturne',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764370046/glfa56la7ffzfwwtrmox.jpg'
  },
  {
    id: 2,
    name: 'Aura Cristalline',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764370176/bolvyr9baf9emcu8j8kz.jpg'
  },
  {
    id: 3,
    name: 'Velours Nocturne',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764370176/wo9tqfsflbyuh2js7jnw.jpg'
  },
  {
    id: 4,
    name: 'Signature Luxe',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764374734/lo2o7tbxdcqqdgsaz4ls.png'
  }
]

export default function Products() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)

  return (
    <>
      <section id="products" className="products">
        <div className="container">
          <h2 className="section-title">Collection Signature</h2>
          <div className="products-grid">
            {PRODUCTS.map(product => (
              <button
                key={product.id}
                className="product-card"
                onClick={() => setSelectedProductId(product.id)}
                aria-label={`Voir les détails de ${product.name}`}
              >
                <div className="product-image">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="bottle-placeholder">
                      <span className="placeholder-icon">✦</span>
                    </div>
                  )}
                </div>
                
                <div className="product-content">
                  <h3 className="product-title">{product.name}</h3>
                </div>
              </button>
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