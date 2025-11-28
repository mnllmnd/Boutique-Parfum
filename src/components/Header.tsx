import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">LUXE</div>
        <nav className="nav">
          <a href="#products">Produits</a>
          <a href="/about">À propos</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}
