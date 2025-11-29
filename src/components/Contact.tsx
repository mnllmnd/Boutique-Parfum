import './Contact.css'

export default function Contact() {
  const handleWhatsAppClick = () => {
    const message = `Bonjour, je suis intéressé(e) par vos parfums. Pourriez-vous m'aider ?`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/772509543?text=${encodedMessage}`, '_blank')
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-bg-decoration">
        <div className="decoration-circle decoration-circle-1"></div>
        <div className="decoration-circle decoration-circle-2"></div>
      </div>

      <div className="container">
        <div className="contact-header">
          <h2 className="contact-title">Nous Contacter</h2>
          <p className="contact-subtitle">Nous sommes à votre écoute pour toutes vos questions</p>
        </div>

        <div className="contact-info-section">
          <h3 className="info-title">Informations de Contact</h3>

          <div className="info-cards">

            {/* WhatsApp */}
            <div className="info-card whatsapp-card">
              <div className="info-icon whatsapp-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.023 0-2.031.394-2.773 1.122-.744.738-1.155 1.72-1.155 2.756 0 1.09.38 2.128 1.075 2.933l-.067.67.685-.179c.79.458 1.734.721 2.77.721 1.024 0 2.031-.394 2.773-1.122s1.155-1.72 1.155-2.756c0-1.089-.38-2.128-1.075-2.933-.743-.728-1.882-1.212-2.963-1.212m5.471-1.122C17.002 2.391 14.193 0 10.823 0 4.998 0 .25 4.748.25 10.573c0 1.897.407 3.745 1.215 5.407L.031 24l8.563-2.712c1.604.839 3.397 1.285 5.229 1.285 5.824 0 10.573-4.748 10.573-10.573 0-2.828-1.144-5.493-3.221-7.489z"/>
                </svg>
              </div>
              <h4>WhatsApp</h4>
              <p className="info-text">Disponible 24h/24</p>
              <a href="https://wa.me/772509543" target="_blank" rel="noopener noreferrer" className="info-link">
                77 250 95 43
              </a>
            </div>

            {/* Email */}
            <div className="info-card">
              <div className="info-icon email-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h4>Email</h4>
              <p className="info-text">Nous répondons rapidement</p>
              <a href="mailto:contact@parfum.com" className="info-link">
                contact@parfum.com
              </a>
            </div>

            {/* Adresse */}
            <div className="info-card">
              <div className="info-icon location-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h4>Localisation</h4>
              <p className="info-text">Dakar, Sénégal</p>
              <p className="info-subtext">Visite sur rendez-vous</p>
            </div>

            {/* Horaires */}
            <div className="info-card">
              <div className="info-icon clock-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h4>Horaires</h4>
              <p className="info-text">Lun - Ven: 9h - 18h</p>
              <p className="info-text">Sam: 10h - 16h</p>
            </div>
          </div>

          {/* Bouton WhatsApp Primaire */}
          <button onClick={handleWhatsAppClick} className="whatsapp-primary-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            Contactez-nous sur WhatsApp
          </button>

        </div>
      </div>
    </section>
  )
}
