import React, { useState } from 'react';
import {
  Copy, Check, ArrowRight, GitBranch, Sparkles,
  ExternalLink, ShieldCheck, RefreshCw, Play, CheckCircle2,
  BookOpen, Zap, Users, FileText, Search
} from 'lucide-react';

const GITHUB_PROFILE = 'https://github.com/MrBereketK';
const GITHUB_REPO = 'https://github.com/MrBereketK/semantic-git';

export default function App() {
  const [copiedNpm, setCopiedNpm] = useState(false);
  const [copiedPip, setCopiedPip] = useState(false);

  const [simStep, setSimStep] = useState(1);
  const [stagedFiles, setStagedFiles] = useState([
    { path: 'packages/python-cli/semgit/api.py', staged: false, size: '2.4 KB' },
    { path: 'packages/node-cli/src/auth.js', staged: false, size: '1.8 KB' },
    { path: 'packages/web-dashboard/package.json', staged: false, size: '459 B' }
  ]);
  const [simCommand, setSimCommand] = useState('');
  const [commandOutput, setCommandOutput] = useState([]);
  const [naturalInput, setNaturalInput] = useState('fixed the dashboard crashing when refreshing on phone sizes');
  const [aiOptions, setAiOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [simulatorStatus, setSimulatorStatus] = useState('idle');

  const handleCopyNpm = () => {
    navigator.clipboard.writeText('npm install -g semanticgit');
    setCopiedNpm(true);
    setTimeout(() => setCopiedNpm(false), 2000);
  };

  const handleCopyPip = () => {
    navigator.clipboard.writeText('pip install semgit');
    setCopiedPip(true);
    setTimeout(() => setCopiedPip(false), 2000);
  };

  const toggleStageFile = (index) => {
    const updated = [...stagedFiles];
    updated[index].staged = !updated[index].staged;
    setStagedFiles(updated);
    if (updated.some(f => f.staged) && simStep === 1) {
      setTimeout(() => setSimStep(2), 600);
    }
  };

  const stageAllFiles = () => {
    setStagedFiles(stagedFiles.map(f => ({ ...f, staged: true })));
    if (simStep === 1) {
      setTimeout(() => setSimStep(2), 600);
    }
  };

  const handleCliSubmit = (e) => {
    e.preventDefault();
    if (simCommand.trim() === 'semgit') {
      setSimStep(3);
    } else {
      setCommandOutput([...commandOutput, `semgit: command not found: "${simCommand}"`]);
      setSimCommand('');
    }
  };

  const handleGenerateOptions = () => {
    if (!naturalInput.trim()) return;
    setSimulatorStatus('generating');
    setTimeout(() => {
      setAiOptions([
        { type: 'fix', scope: 'ui', msg: 'resolve dashboard crash during layout changes on mobile viewports' },
        { type: 'fix', scope: 'web-dashboard', msg: 'correct responsiveness crash when page is reloaded at mobile dimensions' },
        { type: 'refactor', scope: 'ui', msg: 'harden dashboard resizing listener hook to prevent reload crash on phone views' }
      ]);
      setSimStep(4);
      setSimulatorStatus('idle');
    }, 1200);
  };

  const handleFinalCommit = () => {
    setSimulatorStatus('committed');
    setTimeout(() => {
      setSimStep(5);
      setSimulatorStatus('idle');
    }, 1000);
  };

  const resetSimulator = () => {
    setSimStep(1);
    setStagedFiles(stagedFiles.map(f => ({ ...f, staged: false })));
    setSimCommand('');
    setCommandOutput([]);
    setNaturalInput('fixed the dashboard crashing when refreshing on phone sizes');
    setAiOptions([]);
    setSelectedOption(0);
    setSimulatorStatus('idle');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-slate-100 font-sans selection:bg-purple-500/25 selection:text-purple-300">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-darkBg/80 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <GitBranch className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tight text-lg">SemanticGit</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <button onClick={() => scrollToSection('about')} className="px-3 py-2 text-sm text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5">About</button>
            <button onClick={() => scrollToSection('workflow')} className="px-3 py-2 text-sm text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5">Workflow</button>
            <button onClick={() => scrollToSection('achievements')} className="px-3 py-2 text-sm text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5">Achievements</button>
            <button onClick={() => scrollToSection('installation')} className="px-3 py-2 text-sm text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5">Install</button>
          </div>

          <div className="flex items-center space-x-3">
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5" title="GitHub Repository">
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={() => scrollToSection('about')}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Conventional Commits 1.0.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            AI-Powered<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">Conventional Commits</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            SemanticGit (semgit) is an AI-powered, cross-runtime CLI tool that automates the Conventional Commits 1.0.0 specification.
            Describe your changes in plain English — AI handles the formatting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('about')}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold transition hover:bg-white/5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* WHAT IS SEMANTICGIT */}
      <section id="about" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase font-semibold">About</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">What is SemanticGit?</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-purple-400 font-medium">SemanticGit (semgit)</strong> is an AI-powered, cross-runtime command-line tool that automates and enforces the <strong className="text-slate-200">Conventional Commits 1.0.0</strong> specification.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Instead of memorizing commit message formats such as <code className="text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-xs">feat(auth): ...</code>, <code className="text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-xs">fix(ui): ...</code>, or <code className="text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-xs">refactor(api): ...</code>, SemanticGit lets developers describe their changes in plain English while AI generates properly structured commit messages.
            </p>
            <p className="text-lg font-semibold text-white italic">
              Think about your code, not commit syntax.
            </p>
          </div>
        </div>
      </section>

      {/* WHY SEMANTICGIT */}
      <section className="py-20 px-4 sm:px-6 bg-[#0c0d14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase font-semibold">Benefits</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">Why SemanticGit?</h2>
            <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
              Writing semantic commit messages improves your entire development workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: BookOpen, title: 'Project History Readability', desc: 'Structured commits make it easy to understand what changed and why at a glance.' },
              { icon: Users, title: 'Team Collaboration', desc: 'Consistent commit messages help teams stay aligned and onboard new members faster.' },
              { icon: FileText, title: 'Automated Changelogs', desc: 'Semantic commits enable automatic changelog generation from your git history.' },
              { icon: Zap, title: 'Semantic Versioning', desc: 'feat, fix, and breaking change tags drive automated version bumps.' },
              { icon: Search, title: 'Easier Debugging', desc: 'Pinpoint commits by type and scope when tracing regressions.' }
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="bg-darkCard border border-slate-800/80 rounded-xl p-5 hover:border-purple-500/30 transition group">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3 group-hover:bg-purple-500/15 transition">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
            <div className="bg-darkCard border border-slate-800/80 rounded-xl p-5 sm:col-span-2 lg:col-span-1 flex items-center">
              <p className="text-sm text-slate-300 italic leading-relaxed">
                However, remembering Conventional Commits during rapid development interrupts workflow.
                <span className="block mt-2 font-semibold text-purple-400 not-italic">SemanticGit removes that friction by handling the formatting automatically.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE WORKFLOW */}
      <section id="workflow" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center mb-4">
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase font-semibold">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">Core Workflow</h2>
          </div>

          {/* Flow Diagram */}
          <div className="hidden sm:flex items-center justify-center bg-darkCard border border-slate-800/60 rounded-xl p-4 font-mono text-xs">
            <span className="text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/60">git add .</span>
            <ArrowRight className="w-4 h-4 text-purple-500 mx-3 flex-shrink-0" />
            <span className="text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/60">semgit</span>
            <ArrowRight className="w-4 h-4 text-purple-500 mx-3 flex-shrink-0" />
            <span className="text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/60">Describe changes</span>
            <ArrowRight className="w-4 h-4 text-purple-500 mx-3 flex-shrink-0" />
            <span className="text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/60">Select & commit</span>
          </div>

          {/* Step Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { step: '01', label: 'Stage Code', code: 'git add .', desc: 'Stage your modified files.' },
              { step: '02', label: 'Run semgit', code: 'semgit', desc: 'Instead of git commit -m.' },
              { step: '03', label: 'Describe', code: 'Type naturally', desc: 'Write changes in plain English.' },
              { step: '04', label: 'AI Generates', code: '3 options', desc: 'Select from AI-generated formats.' },
              { step: '05', label: 'Commit', code: 'git commit', desc: 'Native git execution.' }
            ].map(({ step, label, code, desc }) => (
              <div key={step} className="bg-darkCard border border-slate-800/60 rounded-xl p-4 text-center">
                <span className="text-[10px] font-mono text-purple-400 font-bold tracking-wider">STEP {step}</span>
                <h3 className="text-sm font-bold text-white mt-1">{label}</h3>
                <code className="text-[11px] text-slate-400 font-mono mt-1 block">{code}</code>
                <p className="text-[10px] text-slate-500 mt-2">{desc}</p>
              </div>
            ))}
          </div>

          {/* Example Input */}
          <div className="max-w-2xl mx-auto bg-darkCard border border-slate-800/60 rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Example</h3>
            <div className="space-y-2">
              <p className="text-xs text-slate-400">Instead of:</p>
              <code className="block text-xs text-slate-500 bg-slate-900/60 p-2.5 rounded-lg font-mono">git commit -m "fix(dashboard): resolve crash on mobile viewport refresh"</code>
              <p className="text-xs text-slate-400 pt-1">You write:</p>
              <code className="block text-xs text-purple-300 bg-slate-900/60 p-2.5 rounded-lg font-mono">"fixed the dashboard crashing when refreshing on phone sizes"</code>
            </div>
          </div>

          {/* Interactive Simulator */}
          <div className="border-t border-slate-800/50 pt-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                Interactive Simulator
              </h3>
              <button
                onClick={resetSimulator}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-800 text-xs hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-darkCard border border-slate-800/60 rounded-xl p-5">
              {/* Simulator Left */}
              <div className="lg:col-span-1 space-y-4 pb-4 lg:pb-0 lg:pr-5 border-b lg:border-b-0 lg:border-r border-slate-800/40 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Simulator State</h4>

                  {simStep === 1 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-purple-300 font-semibold">STAGE CHANGES</p>
                      <p className="text-[11px] text-slate-400">Stage your modified files by toggling the checkboxes.</p>
                    </div>
                  )}
                  {simStep === 2 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-purple-300 font-semibold">RUN SEMGIT</p>
                      <p className="text-[11px] text-slate-400">Type <code className="text-purple-400">semgit</code> in the terminal or click Run Command.</p>
                    </div>
                  )}
                  {simStep === 3 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-purple-300 font-semibold">PLAIN ENGLISH INPUT</p>
                      <p className="text-[11px] text-slate-400">Describe what you changed naturally.</p>
                    </div>
                  )}
                  {simStep === 4 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-purple-300 font-semibold">AI PARSING</p>
                      <p className="text-[11px] text-slate-400">Select one of the three conventional commit options.</p>
                    </div>
                  )}
                  {simStep === 5 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-emerald-400 font-semibold flex items-center">
                        <Check className="w-3.5 h-3.5 mr-1" />
                        COMMITTED
                      </p>
                      <p className="text-[11px] text-slate-400">Commit executed successfully.</p>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Local Git Transaction</span>
                </div>
              </div>

              {/* Simulator Right */}
              <div className="lg:col-span-2 flex flex-col justify-center min-h-[180px]">

                {/* Step 1 */}
                {simStep === 1 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-300">Staged Files</span>
                      <button onClick={stageAllFiles} className="text-[10px] text-purple-400 hover:underline">Stage All</button>
                    </div>
                    <div className="space-y-2">
                      {stagedFiles.map((file, i) => (
                        <div
                          key={i}
                          onClick={() => toggleStageFile(i)}
                          className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between cursor-pointer transition ${
                            file.staged
                              ? 'bg-emerald-950/10 border-emerald-500/40'
                              : 'bg-darkBg border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                              file.staged ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-black/25'
                            }`}>
                              {file.staged && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="text-slate-300 text-[11px] truncate max-w-[200px] md:max-w-md">{file.path}</span>
                          </div>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                            file.staged ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {file.staged ? 'Staged' : 'Unstaged'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {simStep === 2 && (
                  <div className="bg-black/90 border border-slate-800 rounded-lg overflow-hidden font-mono text-[11px] shadow-xl">
                    <div className="bg-slate-900/80 px-3 py-1.5 border-b border-slate-800/60 flex items-center justify-between">
                      <span className="text-slate-500 text-[9px]">Terminal</span>
                      <div className="flex space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500/70" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/70" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {commandOutput.map((out, idx) => (
                        <div key={idx} className="text-rose-400">{out}</div>
                      ))}
                      <div className="flex items-center text-slate-300">
                        <span className="text-purple-400 mr-2">$</span>
                        <form onSubmit={handleCliSubmit} className="flex-1">
                          <input
                            type="text"
                            value={simCommand}
                            onChange={(e) => setSimCommand(e.target.value)}
                            placeholder="Type 'semgit' and press enter"
                            className="bg-transparent border-none outline-none text-slate-100 w-full focus:ring-0"
                          />
                        </form>
                      </div>
                      <div className="flex justify-end pt-1 border-t border-slate-900">
                        <button
                          onClick={() => { setSimCommand('semgit'); setSimStep(3); }}
                          className="inline-flex items-center space-x-1 px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-semibold transition"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>Run Command</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {simStep === 3 && (
                  <div className="space-y-3">
                    <div className="bg-black/40 border border-slate-800 rounded-lg p-3.5 space-y-2">
                      <label className="text-[11px] font-semibold text-slate-300 flex items-center">
                        <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" />
                        Describe your changes
                      </label>
                      <textarea
                        rows="2"
                        value={naturalInput}
                        onChange={(e) => setNaturalInput(e.target.value)}
                        placeholder="Type changes casually..."
                        className="w-full bg-darkBg border border-slate-800 rounded-lg p-2 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-purple-500 outline-none transition"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleGenerateOptions}
                        disabled={simulatorStatus === 'generating'}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800/40 text-white text-xs font-semibold shadow transition"
                      >
                        {simulatorStatus === 'generating' ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Parsing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            <span>Generate Commits</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                {simStep === 4 && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold text-slate-400">Select a conventional commit format:</p>
                    <div className="space-y-1.5">
                      {aiOptions.map((opt, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedOption(i)}
                          className={`p-2.5 rounded-lg border text-xs font-mono flex items-start space-x-2.5 cursor-pointer transition ${
                            selectedOption === i
                              ? 'bg-purple-600/10 border-purple-500'
                              : 'bg-darkBg border-slate-800/80 hover:border-slate-700/60'
                          }`}
                        >
                          <div className="mt-0.5">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              selectedOption === i ? 'border-purple-400 text-purple-400 bg-purple-500/15' : 'border-slate-700 bg-black/25'
                            }`}>
                              {selectedOption === i && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span className={`text-[8px] uppercase px-1 rounded font-bold border ${
                                opt.type === 'fix' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              }`}>
                                {opt.type}
                              </span>
                              <span className="text-slate-500 text-[10px]">({opt.scope}):</span>
                            </div>
                            <p className="text-slate-200 mt-1 text-[11px]">{opt.msg}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={handleFinalCommit}
                        disabled={simulatorStatus === 'committed'}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/40 text-white text-xs font-semibold shadow transition"
                      >
                        {simulatorStatus === 'committed' ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Committing...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Confirm & Commit</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 5 */}
                {simStep === 5 && (
                  <div className="text-center py-4 space-y-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Commit Successful</h4>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-0.5">
                        SemanticGit parsed, formatted, and committed via native Git.
                      </p>
                    </div>
                    <div className="bg-black/35 rounded-lg border border-slate-900 p-2.5 max-w-sm mx-auto font-mono text-[10px] text-left">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5 text-slate-500">
                        <span>Conventional Commit</span>
                        <span>{aiOptions[selectedOption]?.type}({aiOptions[selectedOption]?.scope})</span>
                      </div>
                      <span className="text-purple-400">{aiOptions[selectedOption]?.type}({aiOptions[selectedOption]?.scope}):</span>
                      <span className="text-slate-200 ml-1 font-sans">{aiOptions[selectedOption]?.msg}</span>
                    </div>
                    <button
                      onClick={resetSimulator}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/25 text-purple-300 text-[10px] font-semibold transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Simulate Again</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL ACHIEVEMENTS */}
      <section id="achievements" className="py-20 px-4 sm:px-6 bg-[#0c0d14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase font-semibold">What is Done</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">Technical Achievements</h2>
            <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
              The foundational core engine is verified and working across two major programming environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-darkCard border border-slate-800/80 rounded-xl p-6 hover:border-purple-500/20 transition">
              <div className="flex items-center space-x-2.5 mb-3">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <h3 className="text-sm font-bold text-white">Node.js CLI</h3>
                <code className="text-[10px] text-purple-400 bg-purple-950/30 px-1.5 py-0.5 rounded font-mono">node-cli</code>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Built with <strong className="text-slate-300">@clack/prompts</strong> for beautiful terminal UI</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Global executable: <code className="text-slate-300 font-mono bg-slate-900 px-1 rounded">semgit</code></span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Installable via <strong className="text-slate-300">npm</strong></span>
                </li>
              </ul>
            </div>

            <div className="bg-darkCard border border-slate-800/80 rounded-xl p-6 hover:border-indigo-500/20 transition">
              <div className="flex items-center space-x-2.5 mb-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <h3 className="text-sm font-bold text-white">Python CLI</h3>
                <code className="text-[10px] text-indigo-400 bg-indigo-950/30 px-1.5 py-0.5 rounded font-mono">python-cli</code>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>Built with <strong className="text-slate-300">questionary</strong> and <strong className="text-slate-300">requests</strong></span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>Installable via <strong className="text-slate-300">pip</strong></span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>Feature parity with the Node.js version</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            These implementations make SemanticGit portable across both JavaScript and Python ecosystems.
          </p>
        </div>
      </section>

      {/* INSTALLATION */}
      <section id="installation" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase font-semibold">Get Started</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">Installation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* npm */}
            <div className="bg-darkCard border border-slate-800/80 rounded-xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition">
              <div className="absolute top-3 right-3 font-mono text-[9px] text-purple-400 uppercase font-semibold bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/30">
                npm
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Node.js</h3>
              <p className="text-xs text-slate-400 mb-4">Install globally via npm to get the <code className="text-slate-300 font-mono">semgit</code> command.</p>
              <div className="bg-black/40 rounded-lg p-3 flex items-center justify-between border border-slate-900 font-mono text-[11px]">
                <span className="text-slate-300 select-all">$ npm install -g semanticgit</span>
                <button onClick={handleCopyNpm} className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition border border-transparent hover:border-slate-700/60">
                  {copiedNpm ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* pip */}
            <div className="bg-darkCard border border-slate-800/80 rounded-xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition">
              <div className="absolute top-3 right-3 font-mono text-[9px] text-indigo-400 uppercase font-semibold bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/30">
                pip
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Python</h3>
              <p className="text-xs text-slate-400 mb-4">Install via pip for the Python CLI equivalent.</p>
              <div className="bg-black/40 rounded-lg p-3 flex items-center justify-between border border-slate-900 font-mono text-[11px]">
                <span className="text-slate-300 select-all">$ pip install semgit</span>
                <button onClick={handleCopyPip} className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition border border-transparent hover:border-slate-700/60">
                  {copiedPip ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="py-20 px-4 sm:px-6 bg-[#0c0d14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase font-semibold">Future</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">Vision</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-darkCard border border-slate-800/80 rounded-xl p-6 text-center">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                SemanticGit is a cross-runtime developer tool.
              </p>
              <p className="text-sm text-slate-400 mt-3">
                Currently supported: <strong className="text-purple-400">Node.js (npm)</strong> and <strong className="text-indigo-400">Python (pip)</strong>.
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Future releases will support additional programming languages, package managers, and runtimes so developers can install SemanticGit natively regardless of their ecosystem.
              </p>
            </div>

            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 mb-6">
                One command. Every language. Every developer.
              </p>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Contribute on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 sm:px-6 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span>Built by</span>
            <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-semibold transition">
              MrBereketK
            </a>
            <span>&middot;</span>
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition flex items-center">
              GitHub <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
          <div className="flex items-center space-x-2 font-mono text-[10px]">
            <span>Conventional Commits 1.0.0</span>
            <span>&middot;</span>
            <span className="text-emerald-500 font-semibold">Open Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
