export default function SiteFrame({ activePage, children, footerNoGap = false }) {
  return (
    <>
      <div id="js-preloader" className="js-preloader">
        <div className="preloader-inner">
          <span className="dot"></span>
          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div className="sub-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-8">
              <ul className="info">
                <li>
                  <i className="fa fa-envelope"></i> contato@agroterry.com.br
                </li>
                <li>
                  <i className="fa fa-map"></i> Curitiba - PR, Atendimento Nacional
                </li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-4">
              <ul className="social-links">
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    <i className="fab fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://x.com/minthu" target="_blank" rel="noreferrer">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer">
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                <a href="/" className="logo">
                  <h1 className="brand-with-logo">
                    <img src="/logo%20cow.png" alt="Logo AgroTerry" className="brand-icon" />
                    <span>AgroTerry</span>
                  </h1>
                </a>
                <ul className="nav">
                  <li>
                    <a href="/" className={activePage === "home" ? "active" : ""}>
                      Início
                    </a>
                  </li>
                  <li>
                    <a href="/properties" className={activePage === "properties" ? "active" : ""}>
                      Áreas Produtivas
                    </a>
                  </li>
                  <li>
                    <a href="/property-details" className={activePage === "property-details" ? "active" : ""}>
                      Operação Modelo
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className={activePage === "contact" ? "active" : ""}>
                      Contato
                    </a>
                  </li>
                </ul>
                <button type="button" className="menu-trigger" aria-label="Abrir menu">
                  <span>Menu</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {children}

      <footer className={footerNoGap ? "footer-no-gap" : ""}>
        <div className="container">
          <div className="col-lg-12">
            <p>
              Copyright © 2026 AgroTerry. Soluções para agricultura e pecuária com foco em produtividade.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
