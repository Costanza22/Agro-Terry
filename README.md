# AgroTerry
## Demo

[🔗Acessar site](https://agro-terry.vercel.app)

Site institucional responsivo para apresentação de soluções no agronegócio, com foco em produtividade, sustentabilidade e operação de campo.

Este projeto foi desenvolvido como **trabalho freelancer** para uma **futura startup** que pretende usar **Inteligência Artificial aplicada ao agronegócio**.

## Objetivo do projeto

- Apresentar a marca AgroTerry com identidade visual focada no agro
- Exibir operações e áreas produtivas de forma clara e moderna
- Disponibilizar canal de contato para captação de clientes e parceiros
- Servir como base para evolução futura com funcionalidades de IA

## Requisitos Funcionais (cliente)

- Exibir uma página inicial com identidade visual agro, incluindo banner e seções de destaque.
- Apresentar áreas produtivas/projetos com imagem, categoria, indicador principal e localidade.
- Disponibilizar página de detalhes da operação modelo com informações resumidas da fazenda.
- Disponibilizar página de contato com dados comerciais e formulário para captação de leads.
- Exibir navegação principal entre `Início`, `Áreas Produtivas`, `Operação Modelo` e `Contato`.
- Utilizar imagens reais de contexto agro (grãos, pecuária, horticultura etc.) em alta qualidade.
- Exibir logo da marca no cabeçalho e utilizar a mesma identidade como favicon.
- Garantir versão em português (PT-BR) com textos revisados e consistentes.

## Requisitos Não Funcionais (dev)

- Aplicação desenvolvida em `Next.js` com estrutura `App Router`.
- Layout responsivo para desktop, tablet e mobile.
- Código organizado por páginas e componentes reutilizáveis.
- Arquivos estáticos versionados em `public/` para facilitar manutenção e deploy.
- Build de produção obrigatoriamente sem erros (`npm run build`).
- Estilo visual customizado com CSS próprio, preservando compatibilidade com a base Bootstrap.
- Preparação para evolução futura com backend/API sem reescrita estrutural do frontend.

## Tecnologias utilizadas

- `Next.js` (App Router)
- `React`
- `JavaScript`
- `Bootstrap` (layout base)
- `CSS` customizado para identidade visual agro

## Estrutura principal

- `app/` - páginas principais (`home`, `properties`, `property-details`, `contact`)
- `components/` - componentes reutilizáveis (ex.: header/layout)
- `public/assets/` - imagens, estilos e scripts estáticos

## Como executar localmente

```bash
npm install
npm run dev
```

Abra em: [http://localhost:3000](http://localhost:3000)

## Build de produção

```bash
npm run build
npm run start
```

## Pagamento avulso

O Checkout Pro do Mercado Pago usa o preço da oferta configurada no servidor. O pedido e seu status são armazenados no Upstash Redis por ambiente. A página de retorno consulta esse registro, atualizado pelo webhook após consultar o pagamento no Mercado Pago.

Configure estas variáveis privadas no projeto da Vercel e faça um novo deploy.

- `CHECKOUT_OFFER_TITLE` — nome do serviço cobrado.
- `CHECKOUT_OFFER_AMOUNT_CENTS` — valor inteiro em centavos de real. Exemplo de teste: `15000` para R$ 150,00.
- `CHECKOUT_SITE_URL` — origem pública HTTPS do ambiente, sem caminho.
- `MERCADO_PAGO_ACCESS_TOKEN` — Access Token da conta e do ambiente usados no Checkout Pro.
- `MERCADO_PAGO_WEBHOOK_SECRET` — chave de assinatura das notificações.
- `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` — endpoint REST e token com acesso de escrita ao banco.

Em **Suas integrações** no Mercado Pago, configure o evento **Pagamentos** para `/api/webhooks/mercado-pago` na origem do deploy. O endpoint precisa estar acessível ao provedor. Use credenciais, URL de webhook e banco separados para teste e produção.

Abra `/pagamento` no deploy de teste, conclua uma compra de teste conforme a documentação do Checkout Pro e confirme que a página de retorno mostra o status após a notificação. Se o teste for feito em um preview da Vercel, use um endereço estável que aceite a notificação externa. O botão em **Contato** fica visível quando a configuração está completa.

- [API de preferências do Checkout Pro](https://www.mercadopago.com.br/developers/pt/reference/online-payments/checkout-pro-preferences/overview)
- [Notificações de pagamento do Checkout Pro](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/payment-notifications)
- [API REST do Upstash Redis](https://upstash.com/docs/redis/features/restapi)

## Próximos passos (roadmap)

- Integração de formulário com backend/API
- Painel com indicadores agro
- Módulos de IA para análise preditiva (safra, produtividade e recomendações)
- Versionamento e estratégia de conteúdo para crescimento da startup

---

Projeto desenvolvido para validação de mercado e presença digital inicial de uma startup agrotech orientada por IA.
