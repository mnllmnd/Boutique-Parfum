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
      
      <Footer onAdminClick={() => setShowAdminPanel(true)} />
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      <WhatsAppButton />
    </div>
  )
}

export default App
