export interface AnalysisResult {
  bias: string;
  confidence: number;
}

export interface SummaryResult {
  summary: string;
}

export interface EmotionResult {
  dominant_emotion: string;
  confidence: number;
  all_emotions: {
    [key: string]: number;
  };
}

export interface HistoryItem {
  id: string;
  textSnippet: string;
  bias: string;
  confidence: number;
  timestamp: number;
}
