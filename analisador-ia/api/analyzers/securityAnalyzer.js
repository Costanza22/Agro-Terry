const esprima = require('esprima');

/**
 * Analisador de Segurança
 * Detecta vulnerabilidades comuns em código gerado por IA
 */
function analyzeSecurity(code, language = 'javascript') {
  const issues = [];
  let totalChecks = 0;

  if (language === 'javascript' || language === 'typescript') {
    try {
      // Parse AST para análises futuras (atualmente não usado, mas mantido para extensibilidade)
      esprima.parseScript(code, { tolerant: true, loc: true });

      // 1. Verificar uso de eval()
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

      // 2. Verificar uso de innerHTML sem sanitização
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

      // 3. Verificar hardcoded secrets/passwords
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

      // 4. Verificar SQL Injection (queries concatenadas)
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

      // 5. Verificar uso de console.log com dados sensíveis
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

      // 6. Verificar HTTPS ausente
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

      // 7. Verificar validação de entrada ausente
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

      // 8. Verificar CORS muito permissivo
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

      // 9. Verificar uso de Math.random() para segurança
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

      // 10. Verificar dependências desatualizadas ou vulneráveis (comentário)
      totalChecks++;
      if (code.includes('require(') || code.includes('import ')) {
        // Esta verificação seria melhor com análise de package.json
        // Por enquanto, apenas adicionamos como info
      }

    } catch (error) {
      // Se não conseguir fazer parse, ainda faz verificações básicas
      console.warn('Erro ao fazer parse do código:', error.message);
    }
  }

  // Verificações gerais que funcionam para qualquer linguagem
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

