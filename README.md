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

## Próximos passos (roadmap)

- Integração de formulário com backend/API
- Painel com indicadores agro
- Módulos de IA para análise preditiva (safra, produtividade e recomendações)
- Versionamento e estratégia de conteúdo para crescimento da startup

---

Projeto desenvolvido para validação de mercado e presença digital inicial de uma startup agrotech orientada por IA.
