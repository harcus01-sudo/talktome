export interface Scenario {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  initialMessage: string;
  image: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DimensionReport {
  level: '需注意' | '一般' | '较好';
  reason: string;
}

export interface ReportData {
  empathy: DimensionReport;
  listening: DimensionReport;
  emotion: DimensionReport;
  boundary: DimensionReport;
  needs: DimensionReport;
}

export interface PracticeRecord {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  scenarioIcon: string;
  timestamp: Date;
  report: ReportData;
  chatHistory: Message[];
}
