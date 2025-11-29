import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Products from './components/Products'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

function App() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <Products />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
