import React from 'react';
import { ProcessedImage } from '../../types/image';
import { Button } from '../common/Button';

interface ProcessedImageDisplayProps {
  image: ProcessedImage | null;
  onDownload: () => void;
}

export const ProcessedImageDisplay: React.FC<ProcessedImageDisplayProps> = ({
  image,
  onDownload,
}) => {
  if (!image) {
    return (
      <div className="w-full max-w-2xl h-[512px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Your processed image will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Original Image</h3>
          <img
            src={image.originalImage}
            alt="Original"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Processed Image</h3>
          <img
            src={image.processedImage}
            alt="Processed"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button onClick={onDownload}>Download Processed Image</Button>
      </div>
    </div>
  );
}