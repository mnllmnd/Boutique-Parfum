import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Products from './components/Products'
import AllProducts from './components/AllProducts'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import AdminPanel from './components/AdminPanel'

type Page = 'home' | 'products' | 'contact'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  return (
    <div className="app">
      <Header onNavigate={setCurrentPage} />
      
      <main className="app-main">
        {currentPage === 'home' && (
          <>
            <Hero onNavigate={setCurrentPage} />
            <Products />
          </>
        )}
        
        {currentPage === 'products' && (
          <AllProducts />
        )}
        
        {currentPage === 'contact' && (
          <Contact />
        )}
      </main>
      
      <Footer onAdminClick={() => setShowAdminPanel(true)} />
      
      {/* Navigation mobile fixe en bas */}
      <nav className="mobile-nav">
        <button 
          className={`mobile-nav-item ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
          aria-label="Accueil"
        >
          <span className="mobile-nav-icon">🏠</span>
          <span className="mobile-nav-label">Accueil</span>
        </button>
        <button 
          className={`mobile-nav-item ${currentPage === 'products' ? 'active' : ''}`}
          onClick={() => setCurrentPage('products')}
          aria-label="Collection"
        >
          <span className="mobile-nav-icon">✨</span>
          <span className="mobile-nav-label">Collection</span>
        </button>
        <button 
          className={`mobile-nav-item ${currentPage === 'contact' ? 'active' : ''}`}
          onClick={() => setCurrentPage('contact')}
          aria-label="Contact"
        >
          <span className="mobile-nav-icon">💬</span>
          <span className="mobile-nav-label">Contact</span>
        </button>
      </nav>

      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      <WhatsAppButton />
    </div>
  )
}

export default App
