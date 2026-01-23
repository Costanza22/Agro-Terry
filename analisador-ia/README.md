# 🔍 Analisador de Código

Uma ferramenta completa para análise de código que verifica **segurança**, **arquitetura** e **clean code**.

## 🚀 Funcionalidades

### 🔒 Análise de Segurança
- Detecta uso de `eval()` e outras funções perigosas
- Identifica credenciais hardcoded
- Verifica riscos de SQL Injection
- Detecta uso de HTTP não seguro
- Verifica validação de entrada
- Identifica configurações CORS permissivas
- Detecta uso inseguro de Math.random()

### 🏗️ Análise de Arquitetura
- Avalia tamanho de arquivos e funções
- Calcula complexidade ciclomática
- Verifica acoplamento e dependências
- Detecta mistura de responsabilidades
- Identifica padrões de design
- Verifica modularização
- Avalia documentação e nomenclatura
- Detecta duplicação de código e funções similares

### ✨ Análise de Clean Code
- Identifica código comentado (dead code)
- Detecta números mágicos
- Verifica funções com muitos parâmetros
- Encontra variáveis não utilizadas
- Detecta código duplicado
- Avalia qualidade de nomes
- Verifica aninhamento profundo
- Identifica ausência de tratamento de erros
- Detecta console.logs em produção
- Verifica uso de `var` vs `let/const`
- Identifica comparações não estritas

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn

## 🛠️ Instalação

### Backend

```bash
cd back-end
npm install
```

### Frontend

```bash
cd front-end
npm install
```

## 🚀 Como Usar

### 1. Iniciar o Backend

```bash
cd back-end
npm start
# ou para desenvolvimento com auto-reload:
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

### 2. Iniciar o Frontend

Em outro terminal:

```bash
cd front-end
npm start
```

O frontend estará rodando em `http://localhost:3000`

### 3. Usar a Aplicação

1. Acesse `http://localhost:3000` no navegador
2. Cole seu código no editor ou faça upload de um arquivo
3. Selecione a linguagem do código
4. Clique em "Analisar Código"
5. Veja os resultados detalhados com scores e recomendações

## 📁 Estrutura do Projeto

```
analisador-ia/
├── back-end/
│   ├── analyzers/
│   │   ├── securityAnalyzer.js      # Analisador de segurança
│   │   ├── architectureAnalyzer.js # Analisador de arquitetura
│   │   └── cleanCodeAnalyzer.js     # Analisador de clean code
│   ├── server.js                    # Servidor Express
│   └── package.json
├── front-end/
│   ├── src/
│   │   ├── App.js                   # Componente principal
│   │   ├── App.css                  # Estilos
│   │   └── ...
│   └── package.json
├── api/                              # Serverless functions (Vercel)
└── README.md
```

## 🔌 API Endpoints

### POST `/api/analyze`
Analisa código enviado como texto.

**Body:**
```json
{
  "code": "seu código aqui",
  "language": "javascript"
}
```

**Response:**
```json
{
  "overallScore": 75,
  "security": {
    "score": 80,
    "issues": [...],
    "summary": {...}
  },
  "architecture": {...},
  "cleanCode": {...}
}
```

### POST `/api/analyze-file`
Analisa código enviado como arquivo.

**Form Data:**
- `file`: arquivo de código

### GET `/api/health`
Health check do servidor.

## 🎯 Linguagens Suportadas

- JavaScript
- TypeScript
- Python
- Java
- C/C++
- C#
- PHP
- Ruby
- Go

*Nota: Análises mais detalhadas estão disponíveis para JavaScript/TypeScript*

## 📊 Sistema de Pontuação

O sistema calcula scores de 0-100 para cada categoria:

- **80-100**: Excelente ✅
- **60-79**: Bom ⚠️
- **0-59**: Precisa melhorias ❌

Cada problema encontrado reduz a pontuação baseado na severidade:
- **Critical**: -10 pontos
- **High**: -7 pontos
- **Medium**: -4 pontos
- **Low**: -2 pontos
- **Info**: -1 ponto

## 🛡️ Segurança

⚠️ **Importante**: Este analisador é uma ferramenta de desenvolvimento. Não execute código não confiável diretamente. Sempre revise os resultados manualmente antes de fazer deploy em produção.

## 🌐 Deploy

### Vercel

O projeto está configurado para deploy no Vercel. Veja `README-VERCEL.md` para instruções detalhadas.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Adicionar novos checks de segurança
- Melhorar a análise de arquitetura
- Adicionar suporte para mais linguagens
- Melhorar a interface do usuário

## 📝 Licença

Este projeto é open source e está disponível para uso livre.

## 🐛 Problemas Conhecidos

- Análises mais profundas funcionam melhor com JavaScript/TypeScript
- Algumas verificações podem gerar falsos positivos
- Análise de código muito grande pode ser lenta

## 💡 Dicas

1. **Revise sempre os resultados**: O analisador é uma ferramenta de apoio, não substitui revisão humana
2. **Corrija problemas críticos primeiro**: Foque em segurança antes de clean code
3. **Use em CI/CD**: Integre o analisador no seu pipeline de desenvolvimento
4. **Mantenha atualizado**: Atualize as dependências regularmente

---

Desenvolvido com ❤️ para melhorar a qualidade do código
