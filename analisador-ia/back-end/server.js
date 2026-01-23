const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('node:fs');
const path = require('node:path');
const { analyzeSecurity } = require('./analyzers/securityAnalyzer');
const { analyzeArchitecture } = require('./analyzers/architectureAnalyzer');
const { analyzeCleanCode } = require('./analyzers/cleanCodeAnalyzer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }
});

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
app.post('/api/analyze', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Código não fornecido' });
    }

    const securityAnalysis = analyzeSecurity(code, language);
    const architectureAnalysis = analyzeArchitecture(code, language);
    const cleanCodeAnalysis = analyzeCleanCode(code, language);
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

app.post('/api/analyze-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo não fornecido' });
    }

    const filePath = req.file.path;
    const code = fs.readFileSync(filePath, 'utf8');
    const language = detectLanguage(req.file.originalname);

    const securityAnalysis = analyzeSecurity(code, language);
    const architectureAnalysis = analyzeArchitecture(code, language);
    const cleanCodeAnalysis = analyzeCleanCode(code, language);
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

    fs.unlinkSync(filePath);

    res.json(result);
  } catch (error) {
    console.error('Erro na análise:', error);
    res.status(500).json({ error: 'Erro ao analisar arquivo', details: error.message });
  }
});

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Analisador de código está funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

