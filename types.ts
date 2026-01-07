
export interface GeneratedImage {
  id: string;
  url: string;
  timestamp: number;
}

export interface GenerationStatus {
  loading: boolean;
  error: string | null;
}
