export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
  [key: string]: any; // For additional metadata
}

export interface WebVitalsConfig {
  enabled: boolean;
  endpoint?: string;
  sampleRate?: number;
}

export type PerformanceEntryCallback = (entry: any) => void;