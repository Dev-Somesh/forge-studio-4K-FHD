
export interface WallpaperTheme {
  id: string;
  name: string;
  colors: string[];
  promptColor: string;
  previewColor: string;
}

export interface WallpaperPattern {
  id: string;
  name: string;
  description: string;
  prompt: string;
  isCustom?: boolean;
}

export type MaterialFinish = 'Standard' | 'Frosted Glass' | 'Brushed Metal' | 'Neon Glow' | 'Grainy Film' | 'Paper Matte';
export type Orientation = 'Landscape' | 'Portrait';

export interface GenerationState {
  isGenerating: boolean;
  imageUrl: string | null;
  error: string | null;
  status: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  timestamp: number;
}
