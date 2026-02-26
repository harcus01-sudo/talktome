import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, StopCircle, CheckCheck, User } from 'lucide-react';
import { Scenario, Message, ReportData } from '../types';
import { generateChildResponse, generateReport } from '../services/geminiService';

import { motion, AnimatePresence } from 'motion/react';

interface Props {
  scenario: Scenario;
  chatHistory: Message[];
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  onNavigate: (page: 'home' | 'scenarios' | 'chat' | 'report') => void;
  setReportData: (data: ReportData, history: Message[]) => void;
}

export default function Chat({ scenario, chatHistory, setChatHistory, onNavigate, setReportData }: Props) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [endWarning, setEndWarning] = useState<'empty' | 'few' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userMessageCount = chatHistory.filter(m => m.role === 'user').length;
  const isMaxMessagesReached = userMessageCount >= 10;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim() || isTyping || isMaxMessagesReached) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    const newHistory = [...chatHistory, newUserMsg];
    setChatHistory(newHistory);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponseText = await generateChildResponse(scenario.description, newHistory.map(m => ({ role: m.role, text: m.text })));
      
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiResponseText,
        timestamp: new Date()
      };
      
      setChatHistory([...newHistory, newAiMsg]);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEndChat = () => {
    const userMessages = chatHistory.filter(m => m.role === 'user');
    const userMessageCount = userMessages.length;

    if (userMessageCount === 0) {
      setEndWarning('empty');
      return;
    }

    if (userMessageCount < 3) {
      setEndWarning('few');
      return;
    }

    proceedWithEndChat();
  };

  const proceedWithEndChat = async () => {
    setIsGeneratingReport(true);
    try {
      const report = await generateReport(chatHistory.map(m => ({ role: m.role, text: m.text })));
      if (report) {
        setReportData(report, chatHistory);
        onNavigate('report');
      } else {
        alert("生成报告失败，请重试。");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("生成报告失败，请重试。");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light">
      <div className="flex-none bg-surface-light/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => onNavigate('scenarios')} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft size={24} className="text-slate-800" />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-base font-bold leading-tight">沟通练习会话</h1>
            <span className="text-xs font-medium text-green-600">场景：{scenario.title}</span>
          </div>
          <div className="w-10"></div>
        </div>
        <div className="w-full bg-slate-200 h-1">
          <div className="bg-primary h-1 w-1/3 rounded-r-full"></div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">{scenario.icon}</span>
            <h3 className="font-bold text-emerald-800 text-sm">{scenario.title}</h3>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed whitespace-pre-wrap">
            {scenario.description}
          </p>
        </div>

        <div className="flex justify-center">
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            今天 {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {chatHistory.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex items-end gap-3 group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
            {msg.role === 'model' ? (
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-100 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="Child" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-primary/20 text-primary-dark font-bold text-sm">
                <User size={20} />
              </div>
            )}
            
            <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.role === 'model' && <span className="text-xs font-medium text-slate-500 ml-1">孩子</span>}
              <div className={`p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'rounded-br-none bg-primary text-slate-900 shadow-primary/20' 
                  : 'rounded-bl-none bg-surface-light text-slate-800 border border-slate-100'
              }`}>
                <p className={`leading-relaxed ${msg.role === 'user' ? 'font-medium' : ''}`}>{msg.text}</p>
              </div>
              {msg.role === 'user' && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  已送达 <CheckCheck size={14} />
                </span>
              )}
            </div>
          </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex items-end gap-3 group">
            <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-100 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="Child" className="w-full h-full object-cover" />
            </div>
            <div className="p-4 rounded-2xl rounded-bl-none bg-surface-light text-slate-800 border border-slate-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="flex-none bg-surface-light border-t border-slate-200 p-4 pb-8 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-end gap-2 bg-slate-100 p-2 rounded-3xl border border-transparent focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <button className="flex-none w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-primary transition-colors">
            <Mic size={20} />
          </button>
          <div className="flex-1 min-w-0 py-2.5">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isMaxMessagesReached || isTyping}
              className="w-full bg-transparent border-none p-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 text-base outline-none disabled:opacity-50 disabled:bg-transparent" 
              placeholder={isMaxMessagesReached ? "已达到最大对话次数" : "输入你的回复..."} 
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping || isMaxMessagesReached}
            className="flex-none w-10 h-10 flex items-center justify-center rounded-full bg-primary hover:bg-opacity-90 text-slate-900 transition-all shadow-sm disabled:opacity-50"
          >
            <Send size={18} className="ml-1" />
          </button>
        </div>
        
        {chatHistory.filter(m => m.role === 'user').length >= 8 && chatHistory.filter(m => m.role === 'user').length < 10 && (
          <div className="mt-2 text-center">
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 animate-pulse">
              提示：距离对话结束还有 {10 - chatHistory.filter(m => m.role === 'user').length} 次机会
            </span>
          </div>
        )}

        {chatHistory.filter(m => m.role === 'user').length >= 10 && (
          <div className="mt-2 text-center">
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              已达到最大对话次数，请点击下方按钮查看报告
            </span>
          </div>
        )}

        <div className="mt-4 pt-2">
          <button 
            onClick={handleEndChat}
            disabled={isGeneratingReport}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm disabled:opacity-50"
          >
            {isGeneratingReport ? (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <StopCircle size={20} />
            )}
            {isGeneratingReport ? '正在生成报告...' : '结束对话并查看报告'}
          </button>
        </div>
      </footer>

      {/* Custom Alert/Confirm Modal */}
      <AnimatePresence>
        {endWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {endWarning === 'empty' ? '提示' : '确认结束对话？'}
              </h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {endWarning === 'empty' 
                  ? '请先开始对话后再生成报告，以确保分析的有效性。' 
                  : '当前对话次数较少（少于3次），AI分析结果可能不够准确。是否坚持生成报告？'}
              </p>
              <div className="flex gap-3">
                {endWarning === 'empty' ? (
                  <button 
                    onClick={() => setEndWarning(null)}
                    className="flex-1 bg-primary hover:bg-primary-dark text-slate-900 font-bold py-3.5 rounded-xl transition-colors"
                  >
                    知道了
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => setEndWarning(null)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors"
                    >
                      继续沟通
                    </button>
                    <button 
                      onClick={() => {
                        setEndWarning(null);
                        proceedWithEndChat();
                      }}
                      className="flex-1 bg-primary hover:bg-primary-dark text-slate-900 font-bold py-3.5 rounded-xl transition-colors"
                    >
                      坚持生成
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
