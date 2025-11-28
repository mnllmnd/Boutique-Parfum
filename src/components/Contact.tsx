import './Contact.css'

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Nous Contacter</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon">📧</div>
              <div>
                <h3>Email</h3>
                <p>contact@luxeperfum.com</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <h3>Adresse</h3>
                <p>Casablanca, Maroc</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">💬</div>
              <div>
                <h3>WhatsApp</h3>
                <a href="https://wa.me/772509543" target="_blank" rel="noopener noreferrer">
                  +212 772 509 543
                </a>
              </div>
            </div>
          </div>

          <form className="contact-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Votre nom"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Votre email"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Votre message"
                rows={5}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
