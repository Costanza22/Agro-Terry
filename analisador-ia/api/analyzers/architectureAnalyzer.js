const esprima = require('esprima');

/**
 * Analisador de Arquitetura
 * Avalia a estrutura e organização do código
 */
function analyzeArchitecture(code, language = 'javascript') {
  const issues = [];
  let totalChecks = 0;

  if (language === 'javascript' || language === 'typescript') {
    try {
      const ast = esprima.parseScript(code, { tolerant: true, loc: true });
      totalChecks = 0;

      // 1. Verificar tamanho de arquivo/função
      totalChecks++;
      const lines = code.split('\n').length;
      if (lines > 500) {
        issues.push({
          type: 'large_file',
          severity: 'medium',
          message: `Arquivo muito grande (${lines} linhas)`,
          line: null,
          recommendation: 'Considere dividir o arquivo em módulos menores. Arquivos grandes são difíceis de manter.'
        });
      }

      // 2. Verificar funções muito longas
      totalChecks++;
      const functionLengths = analyzeFunctionLengths(ast);
      functionLengths.forEach(func => {
        if (func.length > 50) {
          issues.push({
            type: 'long_function',
            severity: 'medium',
            message: `Função "${func.name}" muito longa (${func.length} linhas)`,
            line: func.line,
            recommendation: 'Funções devem ter no máximo 20-30 linhas. Divida em funções menores e mais específicas.'
          });
        }
      });

      // 3. Verificar complexidade ciclomática
      totalChecks++;
      const complexFunctions = analyzeComplexity(ast);
      complexFunctions.forEach(func => {
        if (func.complexity > 10) {
          issues.push({
            type: 'high_complexity',
            severity: 'high',
            message: `Função "${func.name}" com alta complexidade ciclomática (${func.complexity})`,
            line: func.line,
            recommendation: 'Reduza a complexidade dividindo em funções menores ou usando padrões como Strategy ou Command.'
          });
        }
      });

      // 4. Verificar acoplamento (muitas dependências)
      totalChecks++;
      const dependencies = countDependencies(code);
      if (dependencies > 10) {
        issues.push({
          type: 'high_coupling',
          severity: 'medium',
          message: `Muitas dependências detectadas (${dependencies})`,
          line: null,
          recommendation: 'Reduza o acoplamento usando injeção de dependências ou padrões como Dependency Injection.'
        });
      }

      // 5. Verificar separação de responsabilidades
      totalChecks++;
      const hasMixedConcerns = checkMixedConcerns(code);
      if (hasMixedConcerns) {
        issues.push({
          type: 'mixed_concerns',
          severity: 'medium',
          message: 'Possível mistura de responsabilidades detectada',
          line: null,
          recommendation: 'Separe lógica de negócio, apresentação e acesso a dados em camadas distintas.'
        });
      }

      // 6. Verificar padrões de design
      totalChecks++;
      const designPatterns = detectDesignPatterns(code);
      if (designPatterns.length === 0 && lines > 100) {
        issues.push({
          type: 'no_design_patterns',
          severity: 'low',
          message: 'Nenhum padrão de design detectado em código complexo',
          line: null,
          recommendation: 'Considere aplicar padrões de design apropriados (Factory, Singleton, Observer, etc.) para melhor organização.'
        });
      }

      // 7. Verificar estrutura de pastas/modulos
      totalChecks++;
      const hasModuleStructure = code.includes('module.exports') || code.includes('export ') || code.includes('import ');
      if (!hasModuleStructure && lines > 200) {
        issues.push({
          type: 'no_modularization',
          severity: 'medium',
          message: 'Código não parece estar modularizado',
          line: null,
          recommendation: 'Organize o código em módulos/classes separados por responsabilidade.'
        });
      }

      // 8. Verificar comentários e documentação
      totalChecks++;
      const commentRatio = countComments(code) / lines;
      if (commentRatio < 0.1 && lines > 100) {
        issues.push({
          type: 'low_documentation',
          severity: 'low',
          message: 'Pouca documentação no código',
          line: null,
          recommendation: 'Adicione comentários explicativos e documentação JSDoc para funções e classes complexas.'
        });
      }

      // 9. Verificar nomenclatura
      totalChecks++;
      const namingIssues = checkNamingConventions(code);
      namingIssues.forEach(issue => {
        issues.push({
          type: 'naming_convention',
          severity: 'low',
          message: issue.message,
          line: issue.line,
          recommendation: 'Use nomes descritivos e siga convenções da linguagem (camelCase para variáveis, PascalCase para classes).'
        });
      });

      // 10. Verificar duplicação de código
      totalChecks++;
      const duplication = detectCodeDuplication(code);
      console.log('Duplicação detectada:', duplication);
      if (duplication.ratio > 0.1) { // Reduzido para 10%
        issues.push({
          type: 'code_duplication',
          severity: 'high',
          message: `Alta duplicação de código detectada (${Math.round(duplication.ratio * 100)}%)`,
          line: null,
          recommendation: 'Extraia código duplicado para funções reutilizáveis ou utilitários. Violação do princípio DRY (Don\'t Repeat Yourself).'
        });
      }

      // 11. Verificar funções similares (duplicação lógica)
      totalChecks++;
      try {
        const similarFunctions = detectSimilarFunctions(ast, code);
        console.log('Funções similares detectadas:', similarFunctions);
        if (similarFunctions && similarFunctions.length > 0) {
          similarFunctions.forEach(group => {
            issues.push({
              type: 'similar_functions',
              severity: 'high',
              message: `${group.functions.length} funções muito similares detectadas: ${group.functions.join(', ')} (${group.similarity}% similar)`,
              line: group.line,
              recommendation: 'Considere criar uma função genérica ou usar parâmetros para eliminar a duplicação. Isso viola o princípio DRY (Don\'t Repeat Yourself).'
            });
          });
        }
      } catch (err) {
        console.error('Erro ao detectar funções similares:', err);
      }


    } catch (error) {
      console.error('Erro ao analisar arquitetura:', error.message);
      console.error(error.stack);
    }
  }

  console.log(`Arquitetura - Total de issues: ${issues.length}, Total de checks: ${totalChecks}`);
  console.log('Arquitetura - Issues:', issues.map(i => ({ type: i.type, severity: i.severity, message: i.message })));

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

function analyzeFunctionLengths(ast) {
  const functions = [];
  
  function traverse(node) {
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || 
        node.type === 'ArrowFunctionExpression') {
      const start = node.loc ? node.loc.start.line : null;
      const end = node.loc ? node.loc.end.line : null;
      const length = end && start ? end - start : 0;
      const name = node.id ? node.id.name : 'anonymous';
      
      functions.push({ name, length, line: start });
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

function analyzeComplexity(ast) {
  const functions = [];
  let currentFunction = null;
  let complexity = 1; // Base complexity
  
  function traverse(node) {
    // Increase complexity for decision points
    if (['IfStatement', 'ForStatement', 'WhileStatement', 'DoWhileStatement', 
         'SwitchStatement', 'ConditionalExpression', 'LogicalExpression'].includes(node.type)) {
      complexity++;
    }
    
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || 
        node.type === 'ArrowFunctionExpression') {
      if (currentFunction) {
        functions.push({ ...currentFunction, complexity });
      }
      complexity = 1;
      currentFunction = {
        name: node.id ? node.id.name : 'anonymous',
        line: node.loc ? node.loc.start.line : null
      };
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
  if (currentFunction) {
    functions.push({ ...currentFunction, complexity });
  }
  
  return functions;
}

function countDependencies(code) {
  const requireMatches = code.match(/require\(['"]([^'"]+)['"]\)/g) || [];
  const importMatches = code.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/g) || [];
  return requireMatches.length + importMatches.length;
}

function checkMixedConcerns(code) {
  const hasDB = /(mysql|mongodb|postgres|sqlite|database|db\.)/i.test(code);
  const hasUI = /(document\.|window\.|DOM|render|component)/i.test(code);
  const hasAPI = /(fetch|axios|http|api|request)/i.test(code);
  
  // Se tem mais de um tipo de preocupação, pode ser misturado
  const concerns = [hasDB, hasUI, hasAPI].filter(Boolean).length;
  return concerns > 1;
}

function detectDesignPatterns(code) {
  const patterns = [];
  if (/class\s+\w+\s+extends/.test(code)) patterns.push('inheritance');
  if (/factory|Factory/.test(code)) patterns.push('factory');
  if (/singleton|Singleton/.test(code)) patterns.push('singleton');
  if (/observer|Observer|subscribe|publish/.test(code)) patterns.push('observer');
  if (/strategy|Strategy/.test(code)) patterns.push('strategy');
  return patterns;
}

function countComments(code) {
  const singleLine = (code.match(/\/\/.*/g) || []).length;
  const multiLine = (code.match(/\/\*[\s\S]*?\*\//g) || []).length;
  return singleLine + multiLine;
}

function checkNamingConventions(code) {
  const issues = [];
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    // Verificar variáveis com nomes muito curtos ou genéricos
    const shortVars = /\b(var|let|const)\s+([a-z]{1,2})\s*=/gi;
    const matches = line.matchAll(shortVars);
    for (const match of matches) {
      if (match[2] && !['i', 'j', 'k', 'x', 'y', 'z'].includes(match[2].toLowerCase())) {
        issues.push({
          message: `Variável com nome muito curto ou genérico: "${match[2]}"`,
          line: index + 1
        });
      }
    }
  });
  
  return issues;
}

function detectCodeDuplication(code) {
  const lines = code.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed.length > 0 && !trimmed.startsWith('//') && !trimmed.startsWith('*');
  });
  
  // Normalizar linhas (remover espaços extras, variáveis comuns)
  const normalizedLines = lines.map(line => {
    let normalized = line.trim()
      .replace(/\s+/g, ' ')
      .replace(/['"]/g, '"')
      .replace(/\b(user|company|freelancer|customer|client|entity)\b/gi, 'ENTITY')
      .replace(/\b(amount|value|price|cost|total)\b/gi, 'AMOUNT')
      .replace(/\b(email|mail|contact)\b/gi, 'EMAIL')
      .replace(/\b(active|enabled|status)\b/gi, 'STATUS')
      .replace(/console\.(log|warn|error|info)\([^)]*\)/g, 'LOG()')
      .replace(/\b\d+\.\d+\b/g, 'NUMBER')
      .replace(/\b\d+\b/g, 'NUMBER')
      .replace(/function\s+\w+/g, 'function NAME');
    
    return normalized;
  });
  
  const uniqueLines = new Set(normalizedLines);
  const ratio = normalizedLines.length > 0 ? 1 - (uniqueLines.size / normalizedLines.length) : 0;
  
  console.log(`Duplicação: ${normalizedLines.length} linhas totais, ${uniqueLines.size} únicas, ratio: ${Math.round(ratio * 100)}%`);
  
  return { ratio, unique: uniqueLines.size, total: normalizedLines.length };
}

function detectSimilarFunctions(ast, code) {
  const functions = [];
  const similarGroups = [];
  const codeLines = code.split('\n');
  
  if (!ast) {
    return [];
  }
  
  // Extrair todas as funções
  function traverse(node) {
    if (!node || typeof node !== 'object') return;
    
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      if (node.id && node.id.name) {
        const start = node.loc ? node.loc.start.line : null;
        const end = node.loc ? node.loc.end.line : null;
        
        if (start && end && start <= codeLines.length) {
          const funcCode = codeLines.slice(start - 1, end).join('\n');
          
          // Normalizar código da função - remover comentários, espaços, normalizar variáveis
          let normalized = funcCode
            .replace(/\/\/.*$/gm, '') // Remove comentários de linha
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários de bloco
            .replace(/\s+/g, ' ') // Normaliza espaços
            .replace(/['"]/g, '"') // Normaliza aspas
            .replace(/\b(user|company|freelancer|customer|client|entity)\b/gi, 'ENTITY')
            .replace(/\b(amount|value|price|cost|total)\b/gi, 'AMOUNT')
            .replace(/\b(email|mail|contact)\b/gi, 'EMAIL')
            .replace(/\b(active|enabled|status)\b/gi, 'STATUS')
            .replace(/console\.(log|warn|error|info)\([^)]*\)/g, 'LOG()')
            .replace(/\b\d+\.\d+\b/g, 'NUMBER')
            .replace(/\b\d+\b/g, 'NUMBER')
            .trim();
          
          // Remover nome da função e parâmetros para comparar apenas o corpo
          normalized = normalized.replace(/function\s+\w+\s*\([^)]*\)\s*\{/, 'function ENTITY() {');
          
          if (normalized.length > 20) { // Só adiciona se tiver conteúdo suficiente
            functions.push({
              name: node.id.name,
              line: start,
              normalized: normalized,
              length: end - start
            });
          }
        }
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
  
  try {
    traverse(ast);
  } catch (err) {
    console.error('Erro ao percorrer AST:', err);
    return [];
  }
  
  console.log(`Encontradas ${functions.length} funções para comparar`);
  
  // Se temos menos de 2 funções, não há como comparar
  if (functions.length < 2) {
    return [];
  }
  
  // Comparar funções para encontrar similares
  for (let i = 0; i < functions.length; i++) {
    for (let j = i + 1; j < functions.length; j++) {
      const func1 = functions[i];
      const func2 = functions[j];
      
      // Calcular similaridade
      const similarity = calculateSimilarity(func1.normalized, func2.normalized);
      console.log(`Similaridade entre ${func1.name} e ${func2.name}: ${Math.round(similarity * 100)}%`);
      
      // Reduzir threshold para 40% para detectar mais casos
      if (similarity > 0.4) {
        // Verificar se já existe um grupo com essas funções
        let foundGroup = false;
        for (const group of similarGroups) {
          if (group.functions.includes(func1.name) || group.functions.includes(func2.name)) {
            if (!group.functions.includes(func1.name)) group.functions.push(func1.name);
            if (!group.functions.includes(func2.name)) group.functions.push(func2.name);
            // Atualizar similaridade se for maior
            if (similarity > group.similarity / 100) {
              group.similarity = Math.round(similarity * 100);
            }
            foundGroup = true;
            break;
          }
        }
        
        if (!foundGroup) {
          similarGroups.push({
            functions: [func1.name, func2.name],
            line: func1.line,
            similarity: Math.round(similarity * 100)
          });
        }
      }
    }
  }
  
  return similarGroups;
}

function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  if (shorter.length === 0) return 0;
  
  // Método 1: Comparar tokens (palavras)
  const tokens1 = str1.split(/\s+/).filter(t => t.length > 0);
  const tokens2 = str2.split(/\s+/).filter(t => t.length > 0);
  const commonTokens = tokens1.filter(t => tokens2.includes(t));
  const tokenSimilarity = (commonTokens.length * 2) / (tokens1.length + tokens2.length);
  
  // Método 2: Substrings comuns
  let commonSubstrings = 0;
  const windowSize = Math.min(15, Math.floor(shorter.length / 3));
  
  if (windowSize > 0) {
    for (let i = 0; i <= str1.length - windowSize; i++) {
      const substring = str1.substring(i, i + windowSize);
      if (str2.includes(substring)) {
        commonSubstrings += windowSize;
      }
    }
  }
  
  const substringSimilarity = Math.min(1, commonSubstrings / Math.max(str1.length, str2.length));
  
  // Método 3: Caracteres comuns na mesma posição
  let commonChars = 0;
  const minLength = Math.min(str1.length, str2.length);
  for (let i = 0; i < minLength; i++) {
    if (str1[i] === str2[i]) commonChars++;
  }
  const charSimilarity = commonChars / longer.length;
  
  // Combinar os três métodos
  return (tokenSimilarity * 0.5 + substringSimilarity * 0.3 + charSimilarity * 0.2);
}

module.exports = { analyzeArchitecture };

