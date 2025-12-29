
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
  SETTINGS = 'settings',
  ADMIN = 'admin'
}

export interface AIInsight {
  title: string;
  meaning: string;
  benefit: string;
  transliteration: string;
}

export interface PaymentLog {
  id: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  timestamp: number;
  status: 'successful' | 'failed';
}
