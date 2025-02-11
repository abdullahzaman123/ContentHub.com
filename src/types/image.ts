export type BackgroundType = 'remove' | 'blur' | 'color';

export interface ProcessedImage {
  originalImage: string;
  processedImage: string;
  type: BackgroundType;
}

export interface ImageProcessingOptions {
  backgroundType: BackgroundType;
  backgroundColor?: string;
}