import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>LUXE</h4>
            <p>Essence de luxe et de raffinement</p>
          </div>
          <div className="footer-section">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#products">Produits</a></li>
              <li><a href="#about">À propos</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Nous Suivre</h4>
            <ul>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Direct</h4>
            <p>
              <a href="https://wa.me/772509543" target="_blank" rel="noopener noreferrer">
                WhatsApp: +212 772 509 543
              </a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} LUXE Parfums. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
