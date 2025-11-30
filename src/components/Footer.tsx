import './Footer.css'

interface FooterProps {
  readonly onAdminClick?: () => void
}

export default function Footer({ onAdminClick }: FooterProps) {
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
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Direct</h4>
            <p>
              <a href="https://wa.me/221772509543" target="_blank" rel="noopener noreferrer">
                WhatsApp: +221 77 250 95 43
              </a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} LUXE Parfums. Tous droits réservés.</p>
          <button className="admin-icon" onClick={onAdminClick} title="Admin Panel" aria-label="Admin Panel">
            ⚙️
          </button>
        </div>
      </div>
    </footer>
  )
}
