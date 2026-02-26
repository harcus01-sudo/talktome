import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Menu, MessageCircle, Edit3, History, ChevronRight, Lightbulb, Home as HomeIcon, User } from 'lucide-react';
import { SCENARIOS } from '../constants';

import { motion, AnimatePresence } from 'motion/react';

import { PracticeRecord } from '../types';
import { Calendar, Trash2 } from 'lucide-react';

interface Props {
  onNavigate: (page: 'home' | 'scenarios' | 'chat' | 'report') => void;
  onStartScenario: (scenario: any) => void;
  history: PracticeRecord[];
  onViewRecord: (record: PracticeRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export default function Home({ onNavigate, onStartScenario, history, onViewRecord, onDeleteRecord }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = SCENARIOS.slice(0, 3);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); // Auto-rotate every 5 seconds
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col h-full overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 pb-2 sticky top-0 z-50 bg-background-light/95 backdrop-blur-sm">
        <button className="text-slate-900 flex size-12 shrink-0 items-center justify-start focus:outline-none">
          <Menu size={28} />
        </button>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight text-center">和谐亲子家园</h2>
        <button className="flex size-12 items-center justify-end focus:outline-none text-slate-900">
          <Bell size={28} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-4 pt-4 pb-24 overflow-y-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-full h-64 mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 cursor-pointer"
                onClick={() => onStartScenario(slides[currentSlide])}
              >
                <div className="w-full h-56 rounded-3xl overflow-hidden relative shadow-sm group">
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                    style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                  <div className="absolute bottom-5 left-5 z-20 text-left flex flex-col items-start pr-4">
                    <div className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm flex items-center gap-1 mb-2">
                      <span className="material-symbols-outlined text-[12px]">{slides[currentSlide].icon}</span>
                      {slides[currentSlide].category}
                    </div>
                    <h2 className="text-white text-2xl font-bold tracking-tight drop-shadow-md mb-1">{slides[currentSlide].title}</h2>
                    <p className="text-white/80 text-xs line-clamp-1">{slides[currentSlide].description}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Pagination Dots */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1.5 z-30">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'w-6 bg-emerald-500' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigate('scenarios')}
            className="flex-1 bg-primary hover:bg-primary-dark text-slate-900 font-bold text-lg py-4 px-3 rounded-2xl shadow-lg shadow-green-200 transition-all duration-300 transform active:scale-[0.98] flex flex-col items-center justify-center gap-2 group h-28"
          >
            <div className="bg-white/30 p-2 rounded-full">
              <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-base">场景练习</span>
          </button>
          <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-lg py-4 px-3 rounded-2xl shadow-md border border-slate-200 transition-all duration-300 transform active:scale-[0.98] flex flex-col items-center justify-center gap-2 group h-28">
            <div className="bg-slate-200 p-2 rounded-full">
              <Edit3 size={28} className="group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-base">自定义场景</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="text-lg font-bold text-slate-900">历史练习</h3>
            <span className="text-xs text-slate-500">已完成 {history.length} 次练习</span>
          </div>
          
          {history.length > 0 ? (
            <div className="flex flex-col gap-3">
              {history.slice(0, 3).map((record) => (
                <div key={record.id} className="relative overflow-hidden rounded-2xl group">
                  {/* Delete Button (Background) */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRecord(record.id);
                    }}
                    className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </div>

                  {/* Record Content (Foreground) */}
                  <motion.div 
                    drag="x"
                    dragConstraints={{ left: -80, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => {
                      // If dragged far enough, keep it open or close it
                      // This is a simple implementation
                    }}
                    onClick={() => onViewRecord(record)}
                    className="relative bg-white p-4 border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow z-10 rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                        <span className="material-symbols-outlined">{record.scenarioIcon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">场景：{record.scenarioTitle}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar size={12} />
                          <span>{record.timestamp.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-300" />
                  </motion.div>
                </div>
              ))}
              {history.length > 3 && (
                <button className="text-center text-sm text-primary font-bold py-2">查看全部</button>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-slate-400 gap-2">
              <History size={40} className="opacity-20" />
              <p className="text-sm">暂无练习记录</p>
            </div>
          )}
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">每日小贴士</span>
          </div>
          <p className="text-slate-800 text-sm leading-relaxed font-medium">
            “当孩子情绪激动时，试着把他们的情绪‘映射’回去。比如可以说：‘听起来你对那件事感到很沮丧……’，然后再给出建议。”
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md border-t border-slate-100 bg-white pb-6 pt-3 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="grid grid-cols-2">
          <div className="flex flex-col items-center justify-end gap-1 group cursor-pointer">
            <div className="text-primary flex h-7 items-center justify-center transition-transform group-hover:-translate-y-1">
              <HomeIcon size={26} fill="currentColor" />
            </div>
            <p className="text-primary text-[10px] font-bold leading-normal tracking-wide">首页</p>
          </div>
          <div className="flex flex-col items-center justify-end gap-1 group cursor-pointer">
            <div className="text-slate-400 flex h-7 items-center justify-center transition-colors group-hover:text-primary">
              <User size={26} />
            </div>
            <p className="text-slate-400 text-[10px] font-medium leading-normal tracking-wide group-hover:text-primary transition-colors">我的</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
