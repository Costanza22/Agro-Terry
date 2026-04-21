import SiteFrame from "@/components/SiteFrame";

export default function HomePage() {
  return (
    <SiteFrame activePage="home">
      <div className="main-banner">
        <div className="owl-carousel owl-banner">
          <div className="item item-1">
            <div className="header-text">
              <span className="category">
                Campos Gerais, <em>Paraná</em>
              </span>
              <h2>
                Tecnologia no campo
                <br />
                Bem-vindo ao AgroTerry
              </h2>
            </div>
          </div>
          <div className="item item-2">
            <div className="header-text">
              <span className="category">
                São José dos Pinhais, <em>PR</em>
              </span>
              <h2>
                Pecuária inteligente com
                <br />
                manejo e bem-estar animal
              </h2>
            </div>
          </div>
          <div className="item item-3">
            <div className="header-text">
              <span className="category">
                Cascavel, <em>PR</em>
              </span>
              <h2>
                Produção de grãos com
                <br />
                foco em alta produtividade
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="featured section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="left-image">
                <img src="/assets/images/featured.jpg" alt="" />
                <a href="/property-details">
                  <img src="/assets/images/featured-icon.png" alt="" style={{ maxWidth: "60px", padding: "0px" }} />
                </a>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="section-heading">
                <h6>| Operações em Destaque</h6>
                <h2>Gestão de Safra &amp; Pecuária</h2>
              </div>
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Como ajudamos o produtor?
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne">
                    <div className="accordion-body">
                      Combinamos <strong>análise de dados</strong>, planejamento agronômico e acompanhamento de campo
                      para aumentar produtividade e reduzir perdas.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      Quais culturas atendemos?
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo">
                    <div className="accordion-body">
                      Atuamos com soja, milho, trigo, horticultura e sistemas integrados com pecuária.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="info-table">
                <ul>
                  <li>
                    <img src="/assets/images/info-icon-01.png" alt="" style={{ maxWidth: "52px" }} />
                    <h4>
                      1.200 ha
                      <br />
                      <span>Área Monitorada</span>
                    </h4>
                  </li>
                  <li>
                    <img src="/assets/images/info-icon-02.png" alt="" style={{ maxWidth: "52px" }} />
                    <h4>
                      Certificação
                      <br />
                      <span>Boas Práticas e Rastreio</span>
                    </h4>
                  </li>
                  <li>
                    <img src="/assets/images/info-icon-03.png" alt="" style={{ maxWidth: "52px" }} />
                    <h4>
                      Eficiência
                      <br />
                      <span>Gestão de Insumos</span>
                    </h4>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="properties section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 offset-lg-4">
              <div className="section-heading text-center">
                <h6>| Áreas Produtivas</h6>
                <h2>Conheça nossos projetos agro</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="item">
                <a href="/property-details">
                  <img src="/assets/images/property-01.jpg" alt="" />
                </a>
                <span className="category">Grãos</span>
                <h6>Produtividade: 78 sc/ha</h6>
                <h4>
                  <a href="/property-details">Fazenda Santa Clara - Castro, PR</a>
                </h4>
                <div className="main-button">
                  <a href="/property-details">Ver detalhes</a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="item">
                <a href="/property-details">
                  <img src="/assets/images/property-02.jpg" alt="" />
                </a>
                <span className="category">Pecuária leiteira</span>
                <h6>Produção: 3.800 L/dia</h6>
                <h4>
                  <a href="/property-details">Sítio Boa Esperança - Lapa, PR</a>
                </h4>
                <div className="main-button">
                  <a href="/property-details">Ver detalhes</a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="item">
                <a href="/property-details">
                  <img src="/assets/images/property-04.jpg" alt="" />
                </a>
                <span className="category">Horticultura</span>
                <h6>Colheita: 12 t/mês</h6>
                <h4>
                  <a href="/property-details">Unidade Verde Vida - Colombo, PR</a>
                </h4>
                <div className="main-button">
                  <a href="/property-details">Ver detalhes</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteFrame>
  );
}
