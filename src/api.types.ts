export interface DatasetRow {
  id: string;
  genre: string[];
  spotify_id: string;
  popularity: number;
  release: string;
  danceability: number;
  energy: number;
  song_key: number;
  mode: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  artist: string;
  song: string;
  album_name: string;
  url: string;
  total_listens: number;
  '(tag, weight)': { [key: string]: number };
}

export type RetrievalSystemName =
  | "TF-IDF"
  | "MFCC"
  | "BERT"
  | "VGG19"
  | "Spectral Contrast"
  | "Inception Net";

export interface Metadata {
  [key: string]: number | string | string[] | RetrievalSystemName;
  IR_system_name: RetrievalSystemName;
  N: number;
  feature_columns: string[];
  "Precision@10": number;
  "Recall@10": number;
  "NDCG@10": number;
  MRR: number;
  similarity_metric: string;
}

export interface MetadataByFile {
  [filename: string]: Metadata;
}

export interface PrecomputedData {
  metadata: Metadata;
  content: Record<string, string[]>;
}
