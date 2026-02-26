import React, { useState } from 'react';
import { ArrowLeft, PlayCircle, Check, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Scenario } from '../types';
import { generateInitialMessage, generateScenarioTitle } from '../services/geminiService';

interface Props {
  onNavigate: (page: 'home' | 'scenarios' | 'chat' | 'report' | 'custom_scenario') => void;
  onStartScenario: (scenario: Scenario) => void;
}

export default function CustomScenario({ onNavigate, onStartScenario }: Props) {
  const [description, setDescription] = useState('');
  const [childState, setChildState] = useState('沉默');
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const states = [
    { id: '沉默', icon: 'sentiment_neutral', label: '沉默' },
    { id: '叛逆', icon: 'thunderstorm', label: '叛逆' },
    { id: '焦虑', icon: 'sentiment_worried', label: '焦虑' },
    { id: '悲伤', icon: 'sentiment_sad', label: '悲伤' },
    { id: '愤怒', icon: 'local_fire_department', label: '愤怒' },
    { id: '自定义', icon: 'add', label: '自定义' },
  ];

  const handleStart = async () => {
    if (!description.trim()) {
      alert('请填写场景描述');
      return;
    }

    setIsGenerating(true);
    try {
      const scenarioDesc = `场景描述：${description}\n孩子当前状态：${childState}\n沟通目标：${goal || '无特定目标'}`;
      
      const [initialMsg, generatedTitle] = await Promise.all([
        generateInitialMessage(scenarioDesc),
        generateScenarioTitle(description)
      ]);

      const customScenario: Scenario = {
        id: `custom_${Date.now()}`,
        title: generatedTitle,
        category: '自定义',
        icon: 'edit_note',
        description: scenarioDesc,
        initialMessage: initialMsg,
        image: 'https://images.unsplash.com/photo-1494887205043-c5f291293cf6?q=80&w=800&auto=format&fit=crop'
      };

      onStartScenario(customScenario);
    } catch (error) {
      console.error("Failed to generate initial message", error);
      alert("生成场景失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col h-full overflow-hidden bg-background-light"
    >
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-50 bg-background-light/95 backdrop-blur-sm">
        <button 
          onClick={() => onNavigate('home')}
          className="text-slate-900 flex size-10 shrink-0 items-center justify-start focus:outline-none hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight text-center flex-1">自定义场景</h2>
        <div className="size-10 shrink-0"></div> 
      </div>

      <div className="flex-1 flex flex-col px-5 pt-2 pb-24 overflow-y-auto space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-primary/20 text-primary-dark p-1 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
            </span>
            场景描述
          </label>
          <div className="relative group">
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              className="w-full h-32 bg-white border-0 rounded-2xl p-4 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-primary placeholder:text-slate-400 resize-none transition-shadow outline-none" 
              placeholder="例如：孩子放学回家后一直躲在房间里，不出来吃饭，也不愿意说话..."
            ></textarea>
            <div className="absolute bottom-3 right-3 text-xs text-slate-400 pointer-events-none">
              {description.length}/200
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-1 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">face</span>
            </span>
            角色设定 (孩子状态)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {states.map((state) => {
              const isActive = childState === state.id;
              return (
                <button 
                  key={state.id}
                  onClick={() => setChildState(state.id)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all active:scale-95 ${
                    isActive 
                      ? 'bg-primary/10 border-2 border-primary text-primary-dark' 
                      : state.id === '自定义'
                        ? 'bg-slate-50 border border-dashed border-slate-300 text-slate-400 hover:bg-slate-100'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[24px] mb-1 ${isActive ? 'icon-filled' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {state.icon}
                  </span>
                  <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{state.label}</span>
                  {isActive && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-0.5 shadow-sm">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-amber-100 text-amber-600 p-1 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">flag</span>
            </span>
            核心目标
          </label>
          <div className="relative">
            <input 
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-white border-0 rounded-2xl py-4 pl-4 pr-10 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-primary placeholder:text-slate-400 transition-shadow outline-none" 
              placeholder="例如：了解孩子为什么不开心" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="material-symbols-outlined text-slate-300 text-[20px]">target</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 pl-1">
            明确的目标有助于AI扮演更合适的角色。
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md bg-background-light/95 backdrop-blur-md pb-8 pt-4 px-6 border-t border-slate-100 z-50">
        <button 
          onClick={handleStart}
          disabled={isGenerating}
          className="w-full bg-primary hover:bg-primary-dark text-slate-900 font-bold text-lg py-4 rounded-full shadow-lg shadow-green-200 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              正在生成场景...
            </>
          ) : (
            <>
              <PlayCircle size={24} className="group-hover:translate-x-1 transition-transform" />
              开始练习
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
