import './Header.css'

interface HeaderProps {
  readonly onNavigate: (page: 'home' | 'products') => void
}

export default function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="header">
      <div className="container">
        <button className="logo" onClick={() => onNavigate('home')} aria-label="Accueil">
          LUXE
        </button>
        <nav className="nav">
          <button onClick={() => onNavigate('products')} className="nav-link">
            Produits
          </button>
          <a href="#about" className="nav-link">À propos</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
      </div>
    </header>
  )
}
