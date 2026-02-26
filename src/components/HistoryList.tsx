import React from 'react';
import { ArrowLeft, Calendar, Trash2, History } from 'lucide-react';
import { motion } from 'motion/react';
import { PracticeRecord } from '../types';

interface Props {
  onNavigate: (page: 'home' | 'scenarios' | 'chat' | 'report' | 'custom_scenario' | 'history') => void;
  history: PracticeRecord[];
  onViewRecord: (record: PracticeRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export default function HistoryList({ onNavigate, history, onViewRecord, onDeleteRecord }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col h-full overflow-hidden bg-background-light"
    >
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-50 bg-background-light/95 backdrop-blur-sm shadow-sm">
        <button 
          onClick={() => onNavigate('home')}
          className="text-slate-900 flex size-10 shrink-0 items-center justify-start focus:outline-none hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight text-center flex-1">全部练习记录</h2>
        <div className="size-10 shrink-0"></div> 
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {history.length > 0 ? (
          history.map((record) => (
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
                onClick={() => onViewRecord(record)}
                className="relative bg-white p-4 border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow z-10 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                    <span className="material-symbols-outlined">{record.scenarioIcon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">场景：{record.scenarioTitle}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Calendar size={12} />
                      <span>{record.timestamp.toLocaleDateString()} {record.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    record.report.empathy.level === '较好' ? 'bg-green-100 text-green-700' :
                    record.report.empathy.level === '一般' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    共情: {record.report.empathy.level}
                  </span>
                  <span className="text-xs text-slate-400">查看报告 &gt;</span>
                </div>
              </motion.div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-slate-400 gap-2 mt-10">
            <History size={40} className="opacity-20" />
            <p className="text-sm">暂无练习记录</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
