import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Ear, Scale, Shield, Target, RotateCcw, Home } from 'lucide-react';
import { ReportData, Message } from '../types';

interface Props {
  reportData: ReportData;
  chatHistory: Message[];
  onNavigate: (page: 'home' | 'scenarios' | 'chat' | 'report') => void;
  onRetry: () => void;
}

export default function Report({ reportData, chatHistory, onNavigate, onRetry }: Props) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'history'>('analysis');

  const dimensions = [
    { key: 'empathy', title: '共情匹配度', icon: Heart, color: 'emerald' },
    { key: 'listening', title: '倾听匹配度', icon: Ear, color: 'amber' },
    { key: 'emotion', title: '情绪稳定度', icon: Scale, color: 'red' },
    { key: 'boundary', title: '边界匹配度', icon: Shield, color: 'emerald' },
    { key: 'needs', title: '需求捕捉匹配度', icon: Target, color: 'amber' },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case '较好': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case '一般': return 'bg-amber-100 text-amber-700 border-amber-200';
      case '需注意': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getIconColor = (level: string) => {
    switch (level) {
      case '较好': return 'text-emerald-500';
      case '一般': return 'text-amber-500';
      case '需注意': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const getBarColor = (level: string) => {
    switch (level) {
      case '较好': return 'bg-emerald-500';
      case '一般': return 'bg-amber-400';
      case '需注意': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getBarWidth = (level: string) => {
    switch (level) {
      case '较好': return '85%';
      case '一般': return '55%';
      case '需注意': return '25%';
      default: return '0%';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col h-full overflow-hidden bg-background-light"
    >
      <header className="pt-6 px-4 pb-2 sticky top-0 bg-background-light z-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => onNavigate('home')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="text-slate-800" />
          </button>
          <h1 className="text-lg font-bold text-slate-800">练习回顾</h1>
          <div className="w-10"></div>
        </div>
        <div className="bg-slate-200 p-1 rounded-xl flex mb-2 relative">
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-2 text-sm font-bold z-10 transition-all rounded-lg ${activeTab === 'analysis' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            分析报告
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-sm font-bold z-10 transition-all rounded-lg ${activeTab === 'history' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            对话回顾
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pb-12 overflow-y-auto">
        {activeTab === 'analysis' ? (
          <>
            <div className="mb-8 mt-4 text-center">
              <h2 className="text-2xl font-bold tracking-tight mb-2 text-slate-800">分析完成</h2>
              <p className="text-slate-500 text-sm">这是您在5个维度的详细沟通行为分析。</p>
            </div>
            <div className="grid grid-cols-1 gap-5 mb-8">
              {dimensions.map(({ key, title, icon: Icon }) => {
                const data = reportData[key as keyof ReportData];
                if (!data) return null;
                return (
                  <div key={key} className="bg-surface-light rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Icon size={20} className={getIconColor(data.level)} fill="currentColor" />
                        <h3 className="font-bold text-lg text-slate-800">{title}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(data.level)}`}>
                        {data.level}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-slate-600 text-sm leading-relaxed">
                      {data.reason}
                    </div>
                    <div className="mt-4 flex items-center gap-3 opacity-60">
                      <Icon size={16} className={getIconColor(data.level)} />
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div className={`${getBarColor(data.level)} h-1.5 rounded-full`} style={{ width: getBarWidth(data.level) }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-6 mt-4">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'model' ? (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="Child" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-sm">
                    父
                  </div>
                )}
                <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl shadow-sm border ${
                    msg.role === 'user' 
                      ? 'rounded-tr-none bg-primary/10 border-primary/20 text-slate-800' 
                      : 'rounded-tl-none bg-white border-slate-100 text-slate-800'
                  }`}>
                    <p className="text-base leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 pb-4">
          <button 
            onClick={onRetry}
            className="w-full bg-primary hover:bg-green-400 text-black font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <RotateCcw size={20} />
            再练一次
          </button>
          <button 
            onClick={() => onNavigate('home')}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200 shadow-sm"
          >
            <Home size={20} />
            返回首页
          </button>
        </div>

        <div className="pb-8 text-center">
          <p className="text-[10px] text-slate-400 leading-relaxed">
            免责声明：本报告由AI模拟生成，仅供沟通练习与参考体验，<br />
            不作为实际家庭教育或心理咨询的专业指导意见。
          </p>
        </div>
      </main>
    </motion.div>
  );
}
