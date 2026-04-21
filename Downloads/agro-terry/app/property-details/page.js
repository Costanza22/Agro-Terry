import SiteFrame from "@/components/SiteFrame";

export default function PropertyDetailsPage() {
  return (
    <SiteFrame activePage="property-details" footerNoGap>
      <div className="page-heading header-text">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <span className="breadcrumb">
                <a href="/">Início</a> / Operação Modelo
              </span>
              <h3>Operação Modelo</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="single-property section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="main-image">
                <img src="/assets/images/single-property.jpg" alt="Single Property" />
              </div>
              <div className="main-content">
                <span className="category">Sistema Integrado</span>
                <h4>Fazenda Modelo AgroTerry - Castro, PR</h4>
                <p>
                  Esta unidade combina agricultura de precisão, rotação de culturas e monitoramento de solo em tempo real.
                  O objetivo é aumentar o rendimento por hectare com sustentabilidade e previsibilidade de safra.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="info-table">
                <ul>
                  <li>
                    <img src="/assets/images/info-icon-01.png" alt="" style={{ maxWidth: "52px" }} />
                    <h4>
                      420 ha
                      <br />
                      <span>Área Total em Operação</span>
                    </h4>
                  </li>
                  <li>
                    <img src="/assets/images/info-icon-02.png" alt="" style={{ maxWidth: "52px" }} />
                    <h4>
                      3 culturas
                      <br />
                      <span>Soja, Milho e Trigo</span>
                    </h4>
                  </li>
                  <li>
                    <img src="/assets/images/info-icon-03.png" alt="" style={{ maxWidth: "52px" }} />
                    <h4>
                      100% rastreado
                      <br />
                      <span>Manejo e aplicações digitais</span>
                    </h4>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteFrame>
  );
}
