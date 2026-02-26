import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { SCENARIOS } from '../constants';

import { motion } from 'motion/react';

interface Props {
  onNavigate: (page: 'home' | 'scenarios' | 'chat' | 'report') => void;
  onStartScenario: (scenario: any) => void;
}

export default function ScenarioSelection({ onNavigate, onStartScenario }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-full overflow-hidden bg-background-light"
    >
      <header className="sticky top-0 z-10 bg-background-light/95 backdrop-blur-sm px-4 pt-6 pb-4 border-b border-primary/10">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="text-slate-900" />
          </button>
          <h1 className="text-lg font-bold">练习模式</h1>
          <div className="w-10"></div>
        </div>
        <div className="mt-4 px-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">选择练习场景</h2>
          <p className="text-slate-600 text-base leading-relaxed">
            选择以下场景进行角色扮演，提升与孩子的沟通技巧。
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-12">
        <div className="flex flex-col gap-6">
          {SCENARIOS.map((scenario, index) => (
            <div key={scenario.id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md active:scale-[0.98]">
              <div className="relative h-48 w-full bg-slate-200">
                <img 
                  src={scenario.image} 
                  alt={scenario.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className={`inline-flex items-center rounded-full backdrop-blur-md px-2.5 py-0.5 text-xs font-medium text-white ring-1 ring-inset ring-white/20 mb-2 ${index === 0 ? 'bg-primary/30' : index === 1 ? 'bg-orange-500/30' : 'bg-blue-500/30'}`}>
                    <span className="material-symbols-outlined text-[16px] mr-1">{scenario.icon}</span>
                    {scenario.category}
                  </span>
                  <h3 className="text-xl font-bold text-white">{scenario.title}</h3>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {scenario.description}
                </p>
                <button 
                  onClick={() => onStartScenario(scenario)}
                  className={`mt-2 w-full rounded-xl py-3 text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 ${index === 0 ? 'bg-primary text-slate-900 hover:bg-primary/90' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                >
                  开始练习
                  <Play size={18} fill="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </motion.div>
  );
}
