import SiteFrame from "@/components/SiteFrame";

const properties = [
  { image: "property-01.jpg", category: "Grãos", price: "Área: 320 ha", address: "Fazenda Alto Horizonte - Guarapuava, PR" },
  { image: "property-02.jpg", category: "Pecuária leiteira", price: "Produção: 3.800 L/dia", address: "Sítio Bela Vista - Ponta Grossa, PR" },
  { image: "property-03.jpg", category: "Agricultura de precisão", price: "Área: 260 ha", address: "Estância São Bento - Maringá, PR" },
  { image: "property-04.jpg", category: "Horticultura", price: "Área: 45 ha", address: "Polo Hortifruti - Colombo, PR" },
  { image: "property-05.jpg", category: "Cereais de inverno", price: "Área: 75 ha", address: "Vale Produtivo - Vacaria, RS" },
  { image: "property-06.jpg", category: "Integração lavoura-mecanização", price: "Área: 260 ha", address: "Projeto Terra Viva - Cascavel, PR" }
];

export default function PropertiesPage() {
  return (
    <SiteFrame activePage="properties">
      <div className="page-heading header-text">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <span className="breadcrumb">
                <a href="/">Início</a> / Áreas Produtivas
              </span>
              <h3>Áreas Produtivas</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="section properties">
        <div className="container">
          <div className="row properties-box">
            {properties.map((property) => (
              <div className="col-lg-4 col-md-6 align-self-center mb-30 properties-items" key={property.address}>
                <div className="item">
                  <a href="/property-details">
                    <img src={`/assets/images/${property.image}`} alt={property.category} />
                  </a>
                  <span className="category">{property.category}</span>
                  <h6>{property.price}</h6>
                  <h4>
                    <a href="/property-details">{property.address}</a>
                  </h4>
                  <div className="main-button">
                    <a href="/property-details">Ver operação</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteFrame>
  );
}
