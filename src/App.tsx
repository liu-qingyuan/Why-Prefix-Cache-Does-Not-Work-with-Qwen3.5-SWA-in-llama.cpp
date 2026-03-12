import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  History, 
  Scissors, 
  FileText, 
  Minimize, 
  Cpu, 
  Box 
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-blue-200">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
            <AlertCircle size={16} />
            Architecture Deep Dive
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            Why Prefix Cache Does Not Work with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Qwen3.5 (SWA)
            </span> in llama.cpp
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            Understanding why traditional Transformer prefix caching succeeds, and why the Sliding Window Attention (SWA) / hybrid memory architecture fundamentally breaks the assumptions required for safe KV cache reuse.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        
        {/* Section 1: Traditional Transformer */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">1. The Traditional Transformer Assumption</h2>
            <p className="text-slate-600">In standard Transformers (like LLaMA or Mistral), the KV cache for a specific token depends <strong className="text-slate-900">only on the preceding tokens</strong>. If two requests share the exact same prefix, their KV states are mathematically identical.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <svg viewBox="0 0 800 220" className="w-full h-auto font-mono text-sm">
              <defs>
                <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
              </defs>
              
              {/* Request A */}
              <text x="0" y="30" fill="#64748b" className="font-semibold text-xs uppercase tracking-wider">Request A</text>
              <rect x="80" y="15" width="320" height="40" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="240" y="40" textAnchor="middle" fill="#1d4ed8" className="font-medium">System Prompt + "Hello world"</text>
              <rect x="410" y="15" width="180" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="500" y="40" textAnchor="middle" fill="#475569">| question A</text>

              {/* Request B */}
              <text x="0" y="95" fill="#64748b" className="font-semibold text-xs uppercase tracking-wider">Request B</text>
              <rect x="80" y="80" width="320" height="40" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="240" y="105" textAnchor="middle" fill="#1d4ed8" className="font-medium">System Prompt + "Hello world"</text>
              <rect x="410" y="80" width="180" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="500" y="105" textAnchor="middle" fill="#475569">| another question</text>

              {/* KV Cache */}
              <rect x="80" y="160" width="320" height="36" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
              <text x="240" y="183" textAnchor="middle" fill="#047857" className="font-bold">Shared KV Cache (Safely Reused)</text>

              {/* Connections */}
              <path d="M 240 55 L 240 80" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M 240 120 L 240 155" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-green)" />
            </svg>
          </div>
        </section>

        {/* Section 2: SWA / Hybrid Memory */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">2. The SWA / Hybrid Memory Reality</h2>
            <p className="text-slate-600">Qwen3.5 utilizes Sliding Window Attention (SWA) combined with recurrent memory states. The representation of a token is no longer just a function of the prefix tokens; it depends on a continuously updated <strong className="text-slate-900">memory state</strong> that rolls forward outside the attention window.</p>
          </div>
          
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <svg viewBox="0 0 800 260" className="w-full h-auto font-mono text-sm">
              <defs>
                <marker id="arrow-yellow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#eab308" />
                </marker>
                <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
                </marker>
              </defs>

              {/* Memory Track */}
              <rect x="80" y="40" width="140" height="44" rx="6" fill="#422006" stroke="#eab308" strokeWidth="1.5" />
              <text x="150" y="67" textAnchor="middle" fill="#fef08a" className="font-medium">Memory State (t-1)</text>

              <rect x="480" y="40" width="140" height="44" rx="6" fill="#422006" stroke="#eab308" strokeWidth="1.5" />
              <text x="550" y="67" textAnchor="middle" fill="#fef08a" className="font-medium">Memory State (t)</text>

              {/* Attention Node */}
              <rect x="280" y="30" width="140" height="64" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
              <text x="350" y="58" textAnchor="middle" fill="#c7d2fe" className="font-bold">Hybrid Attention</text>
              <text x="350" y="78" textAnchor="middle" fill="#818cf8" className="text-[10px]">Update & Compute</text>

              {/* Tokens */}
              <rect x="80" y="180" width="80" height="40" rx="4" fill="#1e293b" stroke="#475569" />
              <text x="120" y="205" textAnchor="middle" fill="#94a3b8">Token 1</text>
              
              <rect x="180" y="180" width="80" height="40" rx="4" fill="#172554" stroke="#3b82f6" />
              <text x="220" y="205" textAnchor="middle" fill="#bfdbfe">Token 2</text>
              
              <rect x="280" y="180" width="80" height="40" rx="4" fill="#172554" stroke="#3b82f6" />
              <text x="320" y="205" textAnchor="middle" fill="#bfdbfe">Token 3</text>
              
              <rect x="380" y="180" width="80" height="40" rx="4" fill="#172554" stroke="#3b82f6" />
              <text x="420" y="205" textAnchor="middle" fill="#bfdbfe">Token 4</text>

              <rect x="480" y="180" width="80" height="40" rx="4" fill="#1e293b" stroke="#475569" strokeDasharray="4" />
              <text x="520" y="205" textAnchor="middle" fill="#94a3b8">Next...</text>

              {/* Sliding Window Box */}
              <rect x="170" y="165" width="300" height="70" rx="6" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="6 4" />
              <text x="320" y="255" textAnchor="middle" fill="#60a5fa" className="font-medium">Sliding Window (Size=3)</text>

              {/* Arrows */}
              <path d="M 220 62 L 275 62" stroke="#eab308" strokeWidth="2" markerEnd="url(#arrow-yellow)" />
              <path d="M 420 62 L 475 62" stroke="#eab308" strokeWidth="2" markerEnd="url(#arrow-yellow)" />
              <path d="M 320 165 L 320 98" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow-blue)" />
            </svg>
          </div>
        </section>

        {/* Section 3: Core Comparison */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">3. The Mathematical Disconnect</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="font-semibold text-lg">Traditional Transformer</h3>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl font-mono text-sm text-slate-800 border border-slate-200 mb-4">
                State = <span className="text-blue-600">f</span>(Prefix_Tokens)
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Because the state is a pure function of the prefix tokens, if <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">Prefix A == Prefix B</code>, then <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">State A == State B</code>. Caching is 100% safe.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -z-10"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                  <XCircle size={20} />
                </div>
                <h3 className="font-semibold text-lg">SWA / Hybrid Model</h3>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl font-mono text-sm text-slate-800 border border-slate-200 mb-4">
                State = <span className="text-blue-600">f</span>(Prefix_Tokens, <span className="text-amber-600">Memory_State</span>)
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                The <code className="bg-amber-50 text-amber-800 px-1 py-0.5 rounded">Memory_State</code> is influenced by the entire history of the sequence, including tokens that have fallen out of the sliding window. A matching prefix does <strong>not</strong> guarantee a matching memory state.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: llama.cpp Log Explanation */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">4. Why llama.cpp Forces Reprocessing</h2>
          
          <div className="bg-[#0d1117] rounded-xl border border-slate-800 shadow-lg overflow-hidden">
            <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-slate-800">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <div className="ml-4 text-xs font-mono text-slate-400">llama-server.log</div>
            </div>
            <div className="p-5 font-mono text-sm overflow-x-auto">
              <div className="text-slate-300">
                <span className="text-slate-500">09:24:12 | INFO |</span> llama_decode: <span className="text-amber-400">forcing full prompt re-processing due to lack of cache data</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
            <Info className="text-blue-600 shrink-0 mt-1" />
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">What this log means</h4>
              <p className="text-blue-800/80 text-sm leading-relaxed">
                When <code className="bg-blue-100/50 px-1.5 py-0.5 rounded">llama.cpp</code> detects a model utilizing SWA or hybrid attention (like Qwen3.5), it realizes that blindly copying the KV cache from a previous request would lead to corrupted memory states and hallucinated outputs. To guarantee correctness, it intentionally discards the cache hit and re-evaluates the prompt to rebuild the correct recurrent state.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Engineering Conclusion & Table */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">5. Engineering Conclusion</h2>
            <p className="text-slate-600">This behavior is <strong>not a configuration error</strong> in your client (e.g., openclaw) nor a missing flag in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">llama.cpp</code>. It is a fundamental limitation of the model's architecture.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-900">Architecture</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Examples</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Prefix Cache Compatibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900">Standard Transformer</td>
                  <td className="px-6 py-4 text-slate-600">LLaMA 2/3, Mistral, Qwen 1.5</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium text-xs border border-emerald-200">
                      <CheckCircle2 size={14} /> Fully Supported
                    </span>
                  </td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">SWA / Hybrid Memory</td>
                  <td className="px-6 py-4 text-slate-600">Qwen 3.5, Mistral Nemo (SWA)</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-medium text-xs border border-red-200">
                      <XCircle size={14} /> Forces Full Reprocessing
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900">RNN / SSM</td>
                  <td className="px-6 py-4 text-slate-600">RWKV, Mamba, Jamba</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-xs border border-slate-200">
                      <Info size={14} /> N/A (Uses State Vectors)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6: Recommendations */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">6. Optimization Strategies</h2>
          <p className="text-slate-600 mb-8">Since prefix caching is unavailable, you must optimize the prefill phase through other means:</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: History, title: "History Limiting", desc: "Strictly truncate conversation history. Keep only the last N turns to minimize prefill latency." },
              { icon: Scissors, title: "Prompt Trimming", desc: "Remove redundant context, verbose instructions, and unused few-shot examples from the system prompt." },
              { icon: FileText, title: "Summarization", desc: "Periodically summarize older context into a dense block rather than passing raw message history." },
              { icon: Minimize, title: "Reduce Payload", desc: "Minimize the size of injected tools, JSON schemas, and RAG context chunks." },
              { icon: Cpu, title: "Decode Optimization", desc: "Focus on batching and decode speed (e.g., Flash Attention, quantization) to offset prefill costs." },
              { icon: Box, title: "Alternative Models", desc: "If your workload heavily relies on massive shared prefixes (e.g., multi-turn RAG), evaluate standard Transformers like LLaMA 3." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-700">
                  <item.icon size={20} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      
      <footer className="border-t border-gray-200 bg-white py-8 mt-12">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-slate-500">
          Internal Engineering Documentation &bull; LLM Inference Team
        </div>
      </footer>
    </div>
  );
}
