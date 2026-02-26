import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import ScenarioSelection from './components/ScenarioSelection';
import Chat from './components/Chat';
import Report from './components/Report';
import CustomScenario from './components/CustomScenario';
import HistoryList from './components/HistoryList';
import { Scenario, Message, ReportData, PracticeRecord } from './types';

import { SCENARIOS } from './constants';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'scenarios' | 'chat' | 'report' | 'custom_scenario' | 'history'>('home');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [history, setHistory] = useState<PracticeRecord[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('parent_child_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Convert string timestamps back to Date objects
        const formatted = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(formatted);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('parent_child_history', JSON.stringify(history));
  }, [history]);

  const deleteHistoryRecord = (id: string) => {
    setHistory(prev => prev.filter(record => record.id !== id));
  };

  const navigateTo = (page: 'home' | 'scenarios' | 'chat' | 'report' | 'custom_scenario' | 'history') => {
    setCurrentPage(page);
  };

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setChatHistory([{
      id: Date.now().toString(),
      role: 'model',
      text: scenario.initialMessage,
      timestamp: new Date()
    }]);
    navigateTo('chat');
  };

  const handleReportComplete = (data: ReportData, historyMessages: Message[]) => {
    if (selectedScenario) {
      const newRecord: PracticeRecord = {
        id: Date.now().toString(),
        scenarioId: selectedScenario.id,
        scenarioTitle: selectedScenario.title,
        scenarioIcon: selectedScenario.icon,
        timestamp: new Date(),
        report: data,
        chatHistory: [...historyMessages]
      };
      setHistory(prev => [newRecord, ...prev]);
    }
    setReportData(data);
  };

  const viewHistoryRecord = (record: PracticeRecord) => {
    const scenario = SCENARIOS.find(s => s.id === record.scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
      setReportData(record.report);
      setChatHistory(record.chatHistory);
      navigateTo('report');
    }
  };

  return (
    <div className="min-h-screen bg-background-light text-slate-900 font-sans flex justify-center">
      <div className="w-full max-w-md bg-background-light shadow-xl relative overflow-hidden flex flex-col">
        {currentPage === 'home' && (
          <Home 
            onNavigate={navigateTo} 
            onStartScenario={startScenario} 
            history={history}
            onViewRecord={viewHistoryRecord}
            onDeleteRecord={deleteHistoryRecord}
          />
        )}
        {currentPage === 'scenarios' && <ScenarioSelection onNavigate={navigateTo} onStartScenario={startScenario} />}
        {currentPage === 'custom_scenario' && <CustomScenario onNavigate={navigateTo} onStartScenario={startScenario} />}
        {currentPage === 'history' && (
          <HistoryList 
            onNavigate={navigateTo} 
            history={history} 
            onViewRecord={viewHistoryRecord} 
            onDeleteRecord={deleteHistoryRecord} 
          />
        )}
        {currentPage === 'chat' && selectedScenario && (
          <Chat 
            scenario={selectedScenario} 
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory} 
            onNavigate={navigateTo} 
            setReportData={handleReportComplete}
          />
        )}
        {currentPage === 'report' && reportData && selectedScenario && (
          <Report 
            reportData={reportData} 
            chatHistory={chatHistory} 
            onNavigate={navigateTo} 
            onRetry={() => startScenario(selectedScenario)}
          />
        )}
      </div>
    </div>
  );
}
