const esprima = require('esprima');

function analyzeSecurity(code, language = 'javascript') {
  const issues = [];
  let totalChecks = 0;

  if (language === 'javascript' || language === 'typescript') {
    try {
      esprima.parseScript(code, { tolerant: true, loc: true });

      totalChecks++;
      if (code.includes('eval(')) {
        issues.push({
          type: 'eval_usage',
          severity: 'critical',
          message: 'Uso de eval() detectado - risco crítico de segurança',
          line: findLineNumber(code, 'eval'),
          recommendation: 'Evite usar eval(). Use alternativas seguras como JSON.parse() ou funções específicas.'
        });
      }

      totalChecks++;
      const innerHTMLRegex = /\.innerHTML\s*=/g;
      if (innerHTMLRegex.test(code)) {
        const matches = code.matchAll(innerHTMLRegex);
        for (const match of matches) {
          issues.push({
            type: 'innerhtml_usage',
            severity: 'high',
            message: 'Uso de innerHTML sem sanitização detectado',
            line: getLineNumber(code, match.index),
            recommendation: 'Use textContent ou sanitize o HTML antes de inserir. Considere usar bibliotecas como DOMPurify.'
          });
        }
      }

      totalChecks++;
      const secretPatterns = [
        /password\s*[:=]\s*['"]([^'"]+)['"]/gi,
        /api[_-]?key\s*[:=]\s*['"]([^'"]+)['"]/gi,
        /secret\s*[:=]\s*['"]([^'"]+)['"]/gi,
        /token\s*[:=]\s*['"]([^'"]+)['"]/gi
      ];

      secretPatterns.forEach(pattern => {
        const matches = code.matchAll(pattern);
        for (const match of matches) {
          if (match[1] && match[1].length > 3) {
            issues.push({
              type: 'hardcoded_secret',
              severity: 'critical',
              message: 'Credencial hardcoded detectada no código',
              line: getLineNumber(code, match.index),
              recommendation: 'Use variáveis de ambiente ou um gerenciador de secrets. Nunca commite credenciais no código.'
            });
          }
        }
      });

      totalChecks++;
      const sqlPatterns = [
        /query\s*[+=]\s*['"`]/gi,
        /SELECT.*\+.*['"`]/gi,
        /INSERT.*\+.*['"`]/gi,
        /UPDATE.*\+.*['"`]/gi
      ];

      sqlPatterns.forEach(pattern => {
        if (pattern.test(code)) {
          issues.push({
            type: 'sql_injection_risk',
            severity: 'high',
            message: 'Possível risco de SQL Injection detectado',
            line: findLineNumber(code, 'query'),
            recommendation: 'Use prepared statements ou ORMs. Nunca concatene strings diretamente em queries SQL.'
          });
        }
      });

      totalChecks++;
      const consoleLogPattern = /console\.(log|warn|error|info)\([^)]*(password|token|secret|key|api[_-]?key)[^)]*\)/gi;
      if (consoleLogPattern.test(code)) {
        issues.push({
          type: 'sensitive_data_logging',
          severity: 'medium',
          message: 'Possível log de dados sensíveis detectado',
          line: findLineNumber(code, 'console.log'),
          recommendation: 'Remova logs de dados sensíveis em produção. Use variáveis de ambiente para debug.'
        });
      }

      totalChecks++;
      if (code.includes('http://') && !code.includes('https://')) {
        issues.push({
          type: 'insecure_protocol',
          severity: 'high',
          message: 'Uso de HTTP não seguro detectado',
          line: findLineNumber(code, 'http://'),
          recommendation: 'Sempre use HTTPS para comunicação segura. HTTP expõe dados a interceptação.'
        });
      }

      totalChecks++;
      const inputFunctions = ['req.body', 'req.query', 'req.params', 'document.getElementById', 'document.querySelector'];
      const hasInput = inputFunctions.some(func => code.includes(func));
      const hasValidation = code.includes('validate') || code.includes('sanitize') || code.includes('validator');
      
      if (hasInput && !hasValidation) {
        issues.push({
          type: 'missing_input_validation',
          severity: 'medium',
          message: 'Entrada de dados sem validação aparente',
          line: findLineNumber(code, 'req.body'),
          recommendation: 'Sempre valide e sanitize entradas do usuário. Use bibliotecas como Joi, Yup ou express-validator.'
        });
      }

      totalChecks++;
      if (code.includes('cors') && (code.includes('origin: "*"') || code.includes('origin: true'))) {
        issues.push({
          type: 'permissive_cors',
          severity: 'medium',
          message: 'Configuração CORS muito permissiva detectada',
          line: findLineNumber(code, 'cors'),
          recommendation: 'Configure CORS com origens específicas. Evite usar "*" ou true em produção.'
        });
      }

      totalChecks++;
      if (code.includes('Math.random()') && (code.includes('token') || code.includes('password') || code.includes('session'))) {
        issues.push({
          type: 'insecure_random',
          severity: 'high',
          message: 'Uso de Math.random() para geração de valores seguros',
          line: findLineNumber(code, 'Math.random'),
          recommendation: 'Use crypto.randomBytes() ou crypto.getRandomValues() para valores criptograficamente seguros.'
        });
      }

      totalChecks++;

    } catch (error) {
    }
  }

  totalChecks++;
  if (code.includes('TODO') || code.includes('FIXME') || code.includes('HACK')) {
    issues.push({
      type: 'security_todo',
      severity: 'info',
      message: 'Comentários TODO/FIXME encontrados - verifique se não há pendências de segurança',
      line: findLineNumber(code, 'TODO'),
      recommendation: 'Revise todos os TODOs relacionados a segurança antes de fazer deploy.'
    });
  }

  return {
    issues,
    totalChecks,
    summary: {
      critical: issues.filter(i => i.severity === 'critical').length,
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length,
      info: issues.filter(i => i.severity === 'info').length
    }
  };
}

function findLineNumber(code, searchString) {
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchString)) {
      return i + 1;
    }
  }
  return null;
}

function getLineNumber(code, index) {
  return code.substring(0, index).split('\n').length;
}

module.exports = { analyzeSecurity };

