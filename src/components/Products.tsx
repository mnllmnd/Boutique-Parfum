import './Products.css'

const PRODUCTS = [
  {
    id: 1,
    name: 'Essence Nocturne',
    price: '25,000 FCFA',
    description: 'Mystérieux et profond',
    notes: 'Oud, Musc, Ambre',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764370046/glfa56la7ffzfwwtrmox.jpg'
  },
  {
    id: 2,
    name: 'Aura Cristalline',
    price: '23,000 FCFA',
    description: 'Frais et élégant',
    notes: 'Bergamote, Citron, Muscat',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764370176/bolvyr9baf9emcu8j8kz.jpg'
  },
  {
    id: 3,
    name: 'Velours Nocturne',
    price: '27,000 FCFA',
    description: 'Sensuel et riche',
    notes: 'Rose, Jasmin, Vanille',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764370176/wo9tqfsflbyuh2js7jnw.jpg'
  },
  {
    id: 4,
    name: 'Signature Luxe',
    price: '29,000 FCFA',
    description: 'Intemporel et noble',
    notes: 'Sandalwood, Vetiver, Cèdre',
    image: 'https://res.cloudinary.com/dcs9vkwe0/image/upload/v1764369468/kpkrcezmc07pzj5drkpf.jpg'
  }
]

export default function Products() {
  return (
    <section id="products" className="products">
      <div className="container">
        <h2 className="section-title">Notre Collection</h2>
        <div className="products-grid">
          {PRODUCTS.map(product => (
            <article
              key={product.id}
              className="product-card"
            >
              <div className="product-image">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-img"
                  />
                ) : (
                  <div className="bottle-placeholder"></div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-notes">{product.notes}</p>
                <div className="product-footer">
                  <a 
                    href="https://wa.me/772509543" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="whatsapp-btn"
                    title="Contacter sur WhatsApp"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.023 0-2.031.394-2.773 1.122-.744.738-1.155 1.72-1.155 2.756 0 1.09.38 2.128 1.075 2.933l-.067.67.685-.179c.79.458 1.734.721 2.77.721 1.024 0 2.031-.394 2.773-1.122s1.155-1.72 1.155-2.756c0-1.089-.38-2.128-1.075-2.933-.743-.728-1.882-1.212-2.963-1.212m5.471-1.122C17.002 2.391 14.193 0 10.823 0 4.998 0 .25 4.748.25 10.573c0 1.897.407 3.745 1.215 5.407L.031 24l8.563-2.712c1.604.839 3.397 1.285 5.229 1.285 5.824 0 10.573-4.748 10.573-10.573 0-2.828-1.144-5.493-3.221-7.489z"/>
                    </svg>
                    Contacter
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
