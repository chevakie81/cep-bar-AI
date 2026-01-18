
export enum TabType {
  DESCRIPTION = 'DESCRIPTION',
  GENERATOR = 'GENERATOR'
}

export interface ImageData {
  base64: string;
  mimeType: string;
}

export interface HistoryItem {
  id: string;
  type: TabType;
  inputImage?: string;
  inputPrompt?: string;
  output: string;
  timestamp: number;
}
