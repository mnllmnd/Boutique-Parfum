import './About.css'

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <h2>À Propos de LUXE</h2>
            <p>
              Chez LUXE, nous croyons que chaque parfum raconte une histoire. 
              Nos créations sont le fruit d'une quête incessante d'excellence et d'authenticité.
            </p>
            <p>
              Chaque flacon est soigneusement sélectionné et composé avec les meilleures 
              essences du monde, garantissant une qualité inégalée.
            </p>
            <div className="about-features">
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  <h4>Qualité Premium</h4>
                  <p>Essences pures et naturelles</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  <h4>Livraison Rapide</h4>
                  <p>Partout en 48-72h</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  <h4>Garantie</h4>
                  <p>Satisfait ou remboursé</p>
                </div>
              </div>
            </div>
          </div>
          <div className="about-image">
            <div className="image-placeholder"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
