
export interface ZikrSession {
  id: string;
  name: string;
  count: number;
  target: number;
  timestamp: number;
}

export enum Tab {
  COUNTER = 'counter',
  HISTORY = 'history',
  AI = 'ai',
  SETTINGS = 'settings'
}

export interface AIInsight {
  title: string;
  meaning: string;
  benefit: string;
  transliteration: string;
}
