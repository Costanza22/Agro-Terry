import SiteFrame from "@/components/SiteFrame";

export default function ContactPage() {
  return (
    <SiteFrame activePage="contact">
      <div className="page-heading header-text">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <span className="breadcrumb">
                <a href="/">Início</a> / Contato
              </span>
              <h3>Contato</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-page section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-heading">
                <h6>| Contato</h6>
                <h2>Fale com especialistas do agro</h2>
              </div>
              <p>
                Conte o desafio da sua fazenda e nossa equipe monta um plano técnico com foco em produtividade,
                manejo eficiente e sustentabilidade.
              </p>
              <div className="row">
                <div className="col-lg-12">
                  <div className="item phone">
                    <img src="/assets/images/phone-icon.png" alt="" style={{ maxWidth: "52px" }} />
                    <h6>
                      (41) 3333-2026
                      <br />
                      <span>Telefone</span>
                    </h6>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="item email">
                    <img src="/assets/images/email-icon.png" alt="" style={{ maxWidth: "52px" }} />
                    <h6>
                      contato@agroterry.com.br
                      <br />
                      <span>Email comercial</span>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <form id="contact-form" action="" method="post">
                <div className="row">
                  <div className="col-lg-12">
                    <fieldset>
                      <label htmlFor="name">Nome completo</label>
                      <input type="text" name="name" id="name" placeholder="Seu nome..." autoComplete="on" required />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <label htmlFor="email">Email</label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        pattern="[^ @]*@[^ @]*"
                        placeholder="Seu email..."
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <label htmlFor="subject">Assunto</label>
                      <input type="text" name="subject" id="subject" placeholder="Assunto..." autoComplete="on" />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <label htmlFor="message">Mensagem</label>
                      <textarea name="message" id="message" placeholder="Descreva sua necessidade"></textarea>
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <button type="submit" id="form-submit" className="orange-button">
                        Enviar mensagem
                      </button>
                    </fieldset>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SiteFrame>
  );
}
