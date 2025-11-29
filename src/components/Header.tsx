import './Header.css'

interface HeaderProps {
  readonly onNavigate: (page: 'home' | 'products' | 'contact') => void
}

export default function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="header">
      <div className="container">
        <button 
          className="logo" 
          onClick={() => onNavigate('home')} 
          aria-label="Accueil Luxe Perfum"
        >
          <span className="logo-text">LUXE</span>
          <span className="logo-subtitle">Dakar</span>
        </button>
        <nav className="nav">
          <button 
            onClick={() => onNavigate('products')} 
            className="nav-link"
            aria-label="Voir nos produits"
          >
            <span className="nav-text">Collection</span>
          </button>
          <a href="#about" className="nav-link">
            <span className="nav-text">Histoire</span>
          </a>
          <button 
            onClick={() => onNavigate('contact')} 
            className="nav-link"
            aria-label="Nous contacter"
          >
            <span className="nav-text">Contact</span>
          </button>
        </nav>

        <div className="header-actions">
          <div className="language-selector">
            <span className="language-text">FR</span>
          </div>
        </div>
      </div>
      
      {/* Ligne de séparation élégante */}
      <div className="header-divider"></div>
    </header>
  )
}