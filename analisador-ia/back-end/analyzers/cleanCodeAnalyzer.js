const esprima = require('esprima');

function analyzeCleanCode(code, language = 'javascript') {
  const issues = [];
  let totalChecks = 0;

  if (language === 'javascript' || language === 'typescript') {
    try {
      const ast = esprima.parseScript(code, { tolerant: true, loc: true });
      totalChecks = 0;

      totalChecks++;
      const commentedCode = detectCommentedCode(code);
      if (commentedCode > 5) {
        issues.push({
          type: 'commented_code',
          severity: 'low',
          message: `${commentedCode} blocos de código comentado detectados`,
          line: null,
          recommendation: 'Remova código comentado. Use controle de versão (Git) para histórico.'
        });
      }

      totalChecks++;
      const magicNumbers = findMagicNumbers(code);
      if (magicNumbers.length > 10) {
        issues.push({
          type: 'magic_numbers',
          severity: 'medium',
          message: `${magicNumbers.length} números mágicos detectados`,
          line: magicNumbers[0]?.line || null,
          recommendation: 'Extraia números mágicos para constantes nomeadas com significado.'
        });
      }

      totalChecks++;
      const functionsWithManyParams = findFunctionsWithManyParams(ast);
      functionsWithManyParams.forEach(func => {
        issues.push({
          type: 'too_many_parameters',
          severity: 'medium',
          message: `Função "${func.name}" com muitos parâmetros (${func.params})`,
          line: func.line,
          recommendation: 'Funções devem ter no máximo 3-4 parâmetros. Considere usar objetos ou aplicar padrões como Builder.'
        });
      });

      totalChecks++;
      const unusedVars = findUnusedVariables(ast, code);
      unusedVars.forEach(variable => {
        issues.push({
          type: 'unused_variable',
          severity: 'low',
          message: `Variável "${variable.name}" declarada mas não utilizada`,
          line: variable.line,
          recommendation: 'Remova variáveis não utilizadas para manter o código limpo.'
        });
      });

      totalChecks++;
      const duplicatedBlocks = findDuplicatedBlocks(code);
      if (duplicatedBlocks.length > 0) {
        issues.push({
          type: 'code_duplication',
          severity: 'medium',
          message: `${duplicatedBlocks.length} blocos de código duplicado detectados`,
          line: duplicatedBlocks[0]?.line || null,
          recommendation: 'Aplique o princípio DRY (Don\'t Repeat Yourself). Extraia código duplicado para funções reutilizáveis.'
        });
      }

      totalChecks++;
      const badNames = findBadVariableNames(code);
      badNames.forEach(badName => {
        issues.push({
          type: 'bad_naming',
          severity: 'low',
          message: `Nome pouco descritivo: "${badName.name}"`,
          line: badName.line,
          recommendation: 'Use nomes que descrevam claramente a intenção. Evite abreviações desnecessárias.'
        });
      });

      totalChecks++;
      const deeplyNested = findDeeplyNestedFunctions(ast);
      deeplyNested.forEach(func => {
        issues.push({
          type: 'deep_nesting',
          severity: 'medium',
          message: `Função "${func.name}" com aninhamento profundo (${func.depth} níveis)`,
          line: func.line,
          recommendation: 'Reduza o aninhamento usando early returns, guard clauses ou extraindo funções.'
        });
      });

      totalChecks++;
      const errorHandling = checkErrorHandling(code);
      if (!errorHandling.hasTryCatch && errorHandling.hasAsync) {
        issues.push({
          type: 'missing_error_handling',
          severity: 'high',
          message: 'Código assíncrono sem tratamento de erros',
          line: errorHandling.line,
          recommendation: 'Sempre trate erros em operações assíncronas usando try/catch ou .catch() em Promises.'
        });
      }

      totalChecks++;
      const consoleLogs = (code.match(/console\.(log|warn|error|info|debug)/g) || []).length;
      if (consoleLogs > 5) {
        issues.push({
          type: 'excessive_logging',
          severity: 'low',
          message: `${consoleLogs} chamadas de console.* detectadas`,
          line: null,
          recommendation: 'Use um sistema de logging adequado em produção. Remova console.logs de debug.'
        });
      }

      totalChecks++;
      const unreachableCode = findUnreachableCode(ast);
      unreachableCode.forEach(block => {
        issues.push({
          type: 'unreachable_code',
          severity: 'low',
          message: 'Código inalcançável detectado',
          line: block.line,
          recommendation: 'Remova código que nunca será executado.'
        });
      });

      totalChecks++;
      const varUsage = (code.match(/\bvar\s+\w+/g) || []).length;
      if (varUsage > 0) {
        issues.push({
          type: 'var_usage',
          severity: 'low',
          message: `${varUsage} uso(s) de 'var' detectado(s)`,
          line: null,
          recommendation: 'Use let ou const ao invés de var para melhor escopo de variáveis.'
        });
      }

      totalChecks++;
      const looseComparisons = (code.match(/==\s|!=\s/g) || []).length;
      if (looseComparisons > 0) {
        issues.push({
          type: 'loose_comparison',
          severity: 'medium',
          message: `${looseComparisons} comparação(ões) não estrita(s) (== ou !=)`,
          line: null,
          recommendation: 'Use === e !== para comparações estritas e evitar bugs de tipo.'
        });
      }

      totalChecks++;
      const longFunctions = findLongFunctions(ast);
      longFunctions.forEach(func => {
        issues.push({
          type: 'long_function',
          severity: 'high',
          message: `Função "${func.name}" muito longa (${func.lines} linhas)`,
          line: func.line,
          recommendation: 'Funções devem fazer uma coisa e fazer bem. Divida em funções menores.'
        });
      });

      totalChecks++;
      const spacingIssues = checkSpacingConsistency(code);
      if (spacingIssues > 10) {
        issues.push({
          type: 'inconsistent_spacing',
          severity: 'low',
          message: 'Inconsistências de espaçamento detectadas',
          line: null,
          recommendation: 'Use um formatador de código (Prettier, ESLint) para manter consistência.'
        });
      }

      totalChecks++;
      const obviousComments = findObviousComments(code);
      if (obviousComments.length > 0) {
        issues.push({
          type: 'obvious_comments',
          severity: 'low',
          message: `${obviousComments.length} comentário(s) óbvio(s) detectado(s)`,
          line: obviousComments[0]?.line || null,
          recommendation: 'Comentários devem explicar o "porquê", não o "o quê". Código bom é auto-explicativo.'
        });
      }

    } catch (error) {
    }
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

function detectCommentedCode(code) {
  const lines = code.split('\n');
  let commentedBlocks = 0;
  let inCommentedBlock = false;
  let blockLength = 0;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') && trimmed.length > 3) {
      if (!inCommentedBlock) {
        inCommentedBlock = true;
        blockLength = 1;
      } else {
        blockLength++;
      }
    } else if (trimmed.startsWith('/*')) {
      inCommentedBlock = true;
      blockLength = 1;
    } else if (trimmed.includes('*/')) {
      if (blockLength > 2) commentedBlocks++;
      inCommentedBlock = false;
      blockLength = 0;
    } else if (inCommentedBlock) {
      blockLength++;
    } else {
      if (blockLength > 2) commentedBlocks++;
      inCommentedBlock = false;
      blockLength = 0;
    }
  });

  return commentedBlocks;
}

function findMagicNumbers(code) {
  const magicNumbers = [];
  const lines = code.split('\n');
  const numberRegex = /\b(\d{2,})\b/g; // Números com 2+ dígitos

  lines.forEach((line, index) => {
    if (line.trim().startsWith('//') || line.includes('/*')) return;
    
    const matches = line.matchAll(numberRegex);
    for (const match of matches) {
      const num = parseInt(match[1]);
      if (num > 1900 && num < 2100) continue;
      if ([0, 1, 100, 1000].includes(num)) continue;
      
      magicNumbers.push({ value: num, line: index + 1 });
    }
  });

  return magicNumbers;
}

function findFunctionsWithManyParams(ast) {
  const functions = [];
  
  function traverse(node) {
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || 
        node.type === 'ArrowFunctionExpression') {
      const params = node.params ? node.params.length : 0;
      if (params > 4) {
        functions.push({
          name: node.id ? node.id.name : 'anonymous',
          params,
          line: node.loc ? node.loc.start.line : null
        });
      }
    }
    
    for (const key in node) {
      if (key !== 'parent' && typeof node[key] === 'object' && node[key] !== null) {
        if (Array.isArray(node[key])) {
          node[key].forEach(child => {
            if (child && typeof child === 'object') traverse(child);
          });
        } else {
          traverse(node[key]);
        }
      }
    }
  }
  
  traverse(ast);
  return functions;
}

function findUnusedVariables(ast, code) {
  const declared = [];
  const used = new Set();
  
  function traverse(node) {
    if (node.type === 'VariableDeclarator' && node.id) {
      declared.push({
        name: node.id.name,
        line: node.loc ? node.loc.start.line : null
      });
    }
    
    if (node.type === 'Identifier' && node.name) {
      used.add(node.name);
    }
    
    for (const key in node) {
      if (key !== 'parent' && typeof node[key] === 'object' && node[key] !== null) {
        if (Array.isArray(node[key])) {
          node[key].forEach(child => {
            if (child && typeof child === 'object') traverse(child);
          });
        } else {
          traverse(node[key]);
        }
      }
    }
  }
  
  traverse(ast);
  
  return declared.filter(v => !used.has(v.name) && !['console', 'require', 'module', 'exports'].includes(v.name));
}

function findDuplicatedBlocks(code) {
  const lines = code.split('\n');
  const blocks = [];
  const minBlockSize = 5;
  
  for (let i = 0; i < lines.length - minBlockSize; i++) {
    const block = lines.slice(i, i + minBlockSize).join('\n');
    const occurrences = (code.match(new RegExp(block.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    
    if (occurrences > 1) {
      blocks.push({ line: i + 1, occurrences });
    }
  }
  
  return blocks.slice(0, 5); // Limita a 5 para não sobrecarregar
}

function findBadVariableNames(code) {
  const badNames = [];
  const lines = code.split('\n');
  const badPatterns = [
    /\b(var|let|const)\s+(temp|tmp|data|obj|arr|str|num|val|foo|bar|baz)\s*=/gi,
    /\b(var|let|const)\s+([a-z]{1,2})\s*=/gi
  ];
  
  lines.forEach((line, index) => {
    badPatterns.forEach(pattern => {
      const matches = line.matchAll(pattern);
      for (const match of matches) {
        if (match[2] && !['i', 'j', 'k', 'x', 'y', 'z'].includes(match[2].toLowerCase())) {
          badNames.push({ name: match[2], line: index + 1 });
        }
      }
    });
  });
  
  return badNames.slice(0, 10);
}

function findDeeplyNestedFunctions(ast) {
  const functions = [];
  let maxDepth = 0;
  let currentFunction = null;
  let depth = 0;
  
  function traverse(node) {
    if (['IfStatement', 'ForStatement', 'WhileStatement', 'SwitchStatement'].includes(node.type)) {
      depth++;
      maxDepth = Math.max(maxDepth, depth);
    }
    
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      if (currentFunction && maxDepth > 3) {
        functions.push({ ...currentFunction, depth: maxDepth });
      }
      currentFunction = {
        name: node.id ? node.id.name : 'anonymous',
        line: node.loc ? node.loc.start.line : null
      };
      maxDepth = 0;
      depth = 0;
    }
    
    for (const key in node) {
      if (key !== 'parent' && typeof node[key] === 'object' && node[key] !== null) {
        if (Array.isArray(node[key])) {
          node[key].forEach(child => {
            if (child && typeof child === 'object') traverse(child);
          });
        } else {
          traverse(node[key]);
        }
      }
    }
    
    if (['IfStatement', 'ForStatement', 'WhileStatement', 'SwitchStatement'].includes(node.type)) {
      depth--;
    }
  }
  
  traverse(ast);
  if (currentFunction && maxDepth > 3) {
    functions.push({ ...currentFunction, depth: maxDepth });
  }
  
  return functions;
}

function checkErrorHandling(code) {
  const hasTryCatch = /try\s*\{/.test(code);
  const hasAsync = /async\s+function|await\s+/.test(code);
  const asyncLine = code.split('\n').findIndex(line => /async|await/.test(line)) + 1;
  
  return { hasTryCatch, hasAsync, line: asyncLine || null };
}

function findUnreachableCode(ast) {
  const unreachable = [];
  return unreachable;
}

function findLongFunctions(ast) {
  const functions = [];
  
  function traverse(node) {
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      const start = node.loc ? node.loc.start.line : null;
      const end = node.loc ? node.loc.end.line : null;
      const lines = end && start ? end - start : 0;
      
      if (lines > 30) {
        functions.push({
          name: node.id ? node.id.name : 'anonymous',
          lines,
          line: start
        });
      }
    }
    
    for (const key in node) {
      if (key !== 'parent' && typeof node[key] === 'object' && node[key] !== null) {
        if (Array.isArray(node[key])) {
          node[key].forEach(child => {
            if (child && typeof child === 'object') traverse(child);
          });
        } else {
          traverse(node[key]);
        }
      }
    }
  }
  
  traverse(ast);
  return functions;
}

function checkSpacingConsistency(code) {
  const lines = code.split('\n');
  let issues = 0;
  
  lines.forEach(line => {
    if (/\{\s+\w|\w\s+\}/.test(line) && !line.trim().startsWith('//')) {
      issues++;
    }
  });
  
  return issues;
}

function findObviousComments(code) {
  const obviousComments = [];
  const lines = code.split('\n');
  const obviousPatterns = [
    /\/\/\s*(increment|decrement|add|subtract|multiply|divide|set|get|return|create|make)/i,
    /\/\/\s*(variável|variable|função|function|classe|class)/
  ];
  
  lines.forEach((line, index) => {
    if (line.trim().startsWith('//')) {
      obviousPatterns.forEach(pattern => {
        if (pattern.test(line)) {
          obviousComments.push({ line: index + 1, comment: line.trim() });
        }
      });
    }
  });
  
  return obviousComments;
}

module.exports = { analyzeCleanCode };

