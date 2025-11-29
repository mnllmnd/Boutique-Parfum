import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Products from './components/Products'
import AllProducts from './components/AllProducts'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

type Page = 'home' | 'products' | 'contact'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  return (
    <div className="app">
      <Header onNavigate={setCurrentPage} />
      
      {currentPage === 'home' && (
        <>
          <Hero />
          <Products />
        </>
      )}
      
      {currentPage === 'products' && (
        <AllProducts />
      )}
      
      {currentPage === 'contact' && (
        <Contact />
      )}
      
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
