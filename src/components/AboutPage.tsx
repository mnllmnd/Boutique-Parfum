import './AboutPage.css'

export default function AboutPage() {
  return (
    <section className="about-page">
      <div className="container">
        <div className="about-hero">
          <h1>À Propos de LUXE</h1>
          <p className="lead">Découvrez notre histoire et nos valeurs</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Notre Histoire</h2>
            <p>
              Chez LUXE, nous croyons que chaque parfum raconte une histoire. Fondée avec une passion pour l'excellence,
              notre maison de parfum s'est établie comme une référence en matière de qualité et d'authenticité.
            </p>
            <p>
              Chaque création est le fruit d'une quête incessante de perfection, combinant les meilleures essences
              du monde avec une expertise artisanale inégalée.
            </p>
          </div>

          <div className="about-section">
            <h2>Nos Valeurs</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-number">01</div>
                <h3>Qualité</h3>
                <p>Essences pures et naturelles sélectionnées avec soin</p>
              </div>
              <div className="value-card">
                <div className="value-number">02</div>
                <h3>Authenticité</h3>
                <p>Chaque parfum raconte une histoire véritable</p>
              </div>
              <div className="value-card">
                <div className="value-number">03</div>
                <h3>Élégance</h3>
                <p>Design et présentation impeccables</p>
              </div>
              <div className="value-card">
                <div className="value-number">04</div>
                <h3>Engagement</h3>
                <p>Satisfaction client et service excellence</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Engagements</h2>
            <div className="commitments">
              <div className="commitment">
                <span className="checkmark">✓</span>
                <div>
                  <h3>Qualité Premium</h3>
                  <p>Chaque produit est testé et sélectionné avec rigueur</p>
                </div>
              </div>
              <div className="commitment">
                <span className="checkmark">✓</span>
                <div>
                  <h3>Livraison Rapide</h3>
                  <p>Partout en 48-72h avec suivi de commande</p>
                </div>
              </div>
              <div className="commitment">
                <span className="checkmark">✓</span>
                <div>
                  <h3>Garantie Satisfait</h3>
                  <p>Satisfait ou remboursé, sans condition</p>
                </div>
              </div>
              <div className="commitment">
                <span className="checkmark">✓</span>
                <div>
                  <h3>Support 24/7</h3>
                  <p>À votre écoute via WhatsApp et email</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
