import React from 'react';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl h-[512px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full max-w-2xl h-[512px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Your generated image will appear here</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <img
        src={`data:image/png;base64,${imageUrl}`}
        alt="Generated"
        className="w-full rounded-lg shadow-lg"
      />
    </div>
  );
};