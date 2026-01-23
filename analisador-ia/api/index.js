const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { analyzeSecurity } = require('./analyzers/securityAnalyzer');
const { analyzeArchitecture } = require('./analyzers/architectureAnalyzer');
const { analyzeCleanCode } = require('./analyzers/cleanCodeAnalyzer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Multer para upload de arquivos (usando memória no Vercel)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Endpoint para análise de código via texto
app.post('/api/analyze', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Código não fornecido' });
    }

    // Executar análises
    const securityAnalysis = analyzeSecurity(code, language);
    const architectureAnalysis = analyzeArchitecture(code, language);
    const cleanCodeAnalysis = analyzeCleanCode(code, language);

    // Calcular score geral (0-100)
    const securityScore = calculateScore(securityAnalysis.issues, securityAnalysis.totalChecks);
    const architectureScore = calculateScore(architectureAnalysis.issues, architectureAnalysis.totalChecks);
    const cleanCodeScore = calculateScore(cleanCodeAnalysis.issues, cleanCodeAnalysis.totalChecks);
    
    const overallScore = Math.round((securityScore + architectureScore + cleanCodeScore) / 3);

    const result = {
      overallScore,
      security: {
        score: securityScore,
        ...securityAnalysis
      },
      architecture: {
        score: architectureScore,
        ...architectureAnalysis
      },
      cleanCode: {
        score: cleanCodeScore,
        ...cleanCodeAnalysis
      },
      timestamp: new Date().toISOString()
    };

    res.json(result);
  } catch (error) {
    console.error('Erro na análise:', error);
    res.status(500).json({ error: 'Erro ao analisar código', details: error.message });
  }
});

// Endpoint para análise de arquivo
app.post('/api/analyze-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo não fornecido' });
    }

    const code = req.file.buffer.toString('utf8');
    const language = detectLanguage(req.file.originalname);

    // Executar análises
    const securityAnalysis = analyzeSecurity(code, language);
    const architectureAnalysis = analyzeArchitecture(code, language);
    const cleanCodeAnalysis = analyzeCleanCode(code, language);

    // Calcular scores
    const securityScore = calculateScore(securityAnalysis.issues, securityAnalysis.totalChecks);
    const architectureScore = calculateScore(architectureAnalysis.issues, architectureAnalysis.totalChecks);
    const cleanCodeScore = calculateScore(cleanCodeAnalysis.issues, cleanCodeAnalysis.totalChecks);
    
    const overallScore = Math.round((securityScore + architectureScore + cleanCodeScore) / 3);

    const result = {
      overallScore,
      security: {
        score: securityScore,
        ...securityAnalysis
      },
      architecture: {
        score: architectureScore,
        ...architectureAnalysis
      },
      cleanCode: {
        score: cleanCodeScore,
        ...cleanCodeAnalysis
      },
      filename: req.file.originalname,
      timestamp: new Date().toISOString()
    };

    res.json(result);
  } catch (error) {
    console.error('Erro na análise:', error);
    res.status(500).json({ error: 'Erro ao analisar arquivo', details: error.message });
  }
});

// Função auxiliar para calcular score
function calculateScore(issues, totalChecks) {
  if (totalChecks === 0) return 100;
  const severity = {
    critical: 10,
    high: 7,
    medium: 4,
    low: 2,
    info: 1
  };
  
  let totalPenalty = 0;
  issues.forEach(issue => {
    totalPenalty += severity[issue.severity] || 1;
  });
  
  const maxPenalty = totalChecks * 10;
  const score = Math.max(0, 100 - (totalPenalty / maxPenalty * 100));
  return Math.round(score);
}

// Função para detectar linguagem pelo nome do arquivo
function detectLanguage(filename) {
  const ext = path.extname(filename).toLowerCase();
  const languageMap = {
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.py': 'python',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.cs': 'csharp',
    '.php': 'php',
    '.rb': 'ruby',
    '.go': 'go'
  };
  return languageMap[ext] || 'javascript';
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Analisador de código está funcionando' });
});

// Exportar para Vercel
module.exports = app;
