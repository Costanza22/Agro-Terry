import React, { useState, useMemo } from 'react';
import './App.css';
import { 
  FiSearch, 
  FiUpload, 
  FiAlertCircle, 
  FiCheckCircle,
  FiClock,
  FiPlay,
  FiFilter,
  FiCopy,
  FiX
} from 'react-icons/fi';
import { 
  MdSecurity, 
  MdArchitecture, 
  MdCleaningServices,
  MdLightbulb
} from 'react-icons/md';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('input');

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Por favor, insira algum código para analisar.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error('Erro ao analisar código');
      }

      const data = await response.json();
      setResults(data);
      setActiveTab('results');
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor. Certifique-se de que o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/analyze-file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao analisar arquivo');
      }

      const data = await response.json();
      setResults(data);
      setActiveTab('results');
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-700 border-green-700';
    if (score >= 60) return 'text-amber-600 border-amber-600';
    return 'text-red-700 border-red-700';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-600',
      high: 'bg-orange-600',
      medium: 'bg-amber-500',
      low: 'bg-slate-600',
      info: 'bg-gray-500'
    };
    return colors[severity] || 'bg-gray-500';
  };

  const getSeverityTextColor = (severity) => {
    const colors = {
      critical: 'text-red-700',
      high: 'text-orange-700',
      medium: 'text-amber-700',
      low: 'text-slate-700',
      info: 'text-gray-700'
    };
    return colors[severity] || 'text-gray-700';
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
      <div className="relative z-10">
        <header className="bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-300 py-8 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiSearch className="w-10 h-10 text-gray-700" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Analisador de Código</h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto italic">
            Analise código em busca de problemas de segurança, arquitetura e clean code
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-300 overflow-hidden">
          <div className="flex bg-gray-50 border-b border-gray-200">
            <button 
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === 'input' 
                  ? 'bg-white text-gray-900 border-b-2 border-gray-900' 
                  : 'text-gray-600 hover:bg-white hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('input')}
            >
              Entrada
            </button>
            {results && (
              <button 
                className={`flex-1 px-6 py-4 font-medium transition-all ${
                  activeTab === 'results' 
                    ? 'bg-white text-gray-900 border-b-2 border-gray-900' 
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('results')}
              >
                Resultados
              </button>
            )}
          </div>

          {activeTab === 'input' && (
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label 
                    htmlFor="file-upload" 
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-900 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FiUpload className="w-5 h-5" />
                    Upload de Arquivo
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go"
                    className="hidden"
                  />
                </div>

                <div className="flex-1 flex items-center gap-3">
                  <label htmlFor="language" className="font-medium text-gray-700 whitespace-nowrap">
                    Linguagem:
                  </label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors bg-white"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="csharp">C#</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                    <option value="go">Go</option>
                  </select>
                </div>
              </div>

              <textarea
                className="w-full p-5 border border-gray-300 rounded-lg font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors mb-6 bg-white italic"
                placeholder="Cole seu código aqui ou faça upload de um arquivo..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={20}
              />

              <button
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={handleAnalyze}
                disabled={loading || !code.trim()}
              >
                {loading ? (
                  <>
                    <FiClock className="w-5 h-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <FiPlay className="w-5 h-5" />
                    Analisar Código
                  </>
                )}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-800 flex items-start gap-2">
                  <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'results' && results && (
            <div className="p-6 md:p-8 animate-fade-in">
              <div className="text-center mb-10 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Score Geral</h2>
                <div 
                  className={`inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-8 ${getScoreColor(results.overallScore)} bg-white shadow-lg transform transition-transform hover:scale-105`}
                >
                  <span className="text-5xl font-bold">{results.overallScore}</span>
                  <span className="text-lg opacity-70">/100</span>
                </div>
                <p className="mt-4 text-gray-600 italic">
                  {results.overallScore >= 80 
                    ? 'Excelente!' 
                    : results.overallScore >= 60 
                      ? 'Bom, mas pode melhorar' 
                      : 'Precisa de atenção'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <AnalysisCard
                  title="Segurança"
                  icon={<MdSecurity className="w-6 h-6" />}
                  analysis={results.security}
                  colorClass={getScoreColor(results.security.score)}
                />
                <AnalysisCard
                  title="Arquitetura"
                  icon={<MdArchitecture className="w-6 h-6" />}
                  analysis={results.architecture}
                  colorClass={getScoreColor(results.architecture.score)}
                />
                <AnalysisCard
                  title="Clean Code"
                  icon={<MdCleaningServices className="w-6 h-6" />}
                  analysis={results.cleanCode}
                  colorClass={getScoreColor(results.cleanCode.score)}
                />
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Problemas Encontrados</h2>
                <IssuesList 
                  issues={[
                    ...results.security.issues.map(i => ({ ...i, category: 'Segurança' })),
                    ...results.architecture.issues.map(i => ({ ...i, category: 'Arquitetura' })),
                    ...results.cleanCode.issues.map(i => ({ ...i, category: 'Clean Code' }))
                  ]}
                  getSeverityColor={getSeverityColor}
                  getSeverityTextColor={getSeverityTextColor}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

function AnalysisCard({ title, icon, analysis, colorClass }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in">
      <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-2">
          <div className="text-gray-700">{icon}</div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <div className={`text-2xl font-bold ${colorClass}`}>
          {analysis.score}/100
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded">
          <span className="font-medium text-gray-700">Crítico:</span>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
            {analysis.summary.critical}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded">
          <span className="font-medium text-gray-700">Alto:</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">
            {analysis.summary.high}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded">
          <span className="font-medium text-gray-700">Médio:</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold">
            {analysis.summary.medium}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded">
          <span className="font-medium text-gray-700">Baixo:</span>
          <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-bold">
            {analysis.summary.low}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded">
          <span className="font-medium text-gray-700">Info:</span>
          <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-bold">
            {analysis.summary.info}
          </span>
        </div>
      </div>
      <div className="pt-4 border-t border-gray-200 text-center">
        <span className="text-sm text-gray-600 italic">
          {analysis.issues.length} problema(s) encontrado(s)
        </span>
      </div>
    </div>
  );
}

function IssuesList({ issues, getSeverityColor, getSeverityTextColor }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredIssues = useMemo(() => {
    let filtered = [...issues];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.recommendation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de severidade
    if (severityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.severity === severityFilter);
    }

    // Filtro de categoria
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }

    // Ordenar por severidade
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    return filtered.sort((a, b) => 
      (severityOrder[a.severity] || 5) - (severityOrder[b.severity] || 5)
    );
  }, [issues, searchTerm, severityFilter, categoryFilter]);

  const categories = useMemo(() => {
    return [...new Set(issues.map(i => i.category))];
  }, [issues]);

  const handleCopyReport = () => {
    const report = JSON.stringify(issues, null, 2);
    navigator.clipboard.writeText(report);
    alert('Relatório copiado para a área de transferência!');
  };

  if (issues.length === 0) {
    return (
      <div className="text-center py-12 bg-green-50 text-green-800 rounded-lg border border-green-200 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FiCheckCircle className="w-6 h-6" />
          <span className="text-xl font-semibold">Nenhum problema encontrado!</span>
        </div>
        <p className="text-gray-700 italic">Seu código está excelente!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros e Busca */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar problemas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filtro de Severidade */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-600 w-5 h-5" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white"
            >
              <option value="all">Todas Severidades</option>
              <option value="critical">Crítico</option>
              <option value="high">Alto</option>
              <option value="medium">Médio</option>
              <option value="low">Baixo</option>
              <option value="info">Info</option>
            </select>
          </div>

          {/* Filtro de Categoria */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white"
          >
            <option value="all">Todas Categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Botão Copiar */}
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            title="Copiar relatório JSON"
          >
            <FiCopy className="w-4 h-4" />
            <span className="hidden md:inline">Copiar</span>
          </button>
        </div>

        {/* Contador de resultados */}
        <div className="text-sm text-gray-600">
          Mostrando {filteredIssues.length} de {issues.length} problema(s)
        </div>
      </div>

      {/* Lista de Problemas */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">Nenhum problema encontrado com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue, index) => (
            <div 
              key={`${issue.type}-${issue.line || index}-${issue.message.substring(0, 20)}`} 
              className="bg-white rounded-lg p-5 border-l-4 border-gray-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span 
                  className={`px-3 py-1 rounded text-xs font-semibold text-white ${getSeverityColor(issue.severity)}`}
                >
                  {issue.severity.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700">
                  {issue.category}
                </span>
                {issue.line && (
                  <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm font-mono font-medium">
                    Linha {issue.line}
                  </span>
                )}
              </div>
              <div className="text-gray-900 font-medium mb-3">{issue.message}</div>
              {issue.recommendation && (
                <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                  <div className="flex items-start gap-2">
                    <MdLightbulb className="w-5 h-5 mt-0.5 text-amber-700 flex-shrink-0" />
                    <div>
                      <strong className="text-amber-900 block mb-1">Recomendação:</strong>
                      <p className="text-amber-800 text-sm leading-relaxed italic">{issue.recommendation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
