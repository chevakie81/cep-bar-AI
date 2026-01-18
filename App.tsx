
import React, { useState } from 'react';
import { TabType } from './types';
import DescriptionTab from './components/DescriptionTab';
import GeneratorTab from './components/GeneratorTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DESCRIPTION);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-900/60 pt-8 pb-4">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 group cursor-default">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform">
              <span className="font-black text-xl text-white">C</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white">
              CEP<span className="text-emerald-500">-</span>BAR
            </h1>
          </div>

          <nav className="flex p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800/50 w-full max-w-md">
            <button
              onClick={() => setActiveTab(TabType.DESCRIPTION)}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300
                ${activeTab === TabType.DESCRIPTION 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              App Deskripsi
            </button>
            <button
              onClick={() => setActiveTab(TabType.GENERATOR)}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300
                ${activeTab === TabType.GENERATOR 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              App Generator
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {activeTab === TabType.DESCRIPTION ? (
          <DescriptionTab />
        ) : (
          <GeneratorTab />
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center">
        <p className="text-slate-500 text-xs">
          © {new Date().getFullYear()} CEP-BAR AI Engine. Built for professional creative workflows.
        </p>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
