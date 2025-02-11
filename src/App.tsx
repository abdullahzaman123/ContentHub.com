import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ImageUploader } from './components/ImageProcessor/ImageUploader';
import { BackgroundOptions } from './components/ImageProcessor/BackgroundOptions';
import { ProcessedImageDisplay } from './components/ImageProcessor/ProcessedImageDisplay';
import { processImage } from './services/imageProcessingService';
import { downloadImage } from './utils/imageUtils';
import { ProcessedImage, BackgroundType } from './types/image';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setProcessedImage(null);
  };

  const handleBackgroundOption = async (type: BackgroundType, color?: string) => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsLoading(true);
    try {
      const result = await processImage(selectedFile, type, color);
      setProcessedImage(result);
      toast.success('Image processed successfully!');
    } catch (error) {
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      downloadImage(processedImage.processedImage, 'processed-image.png');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Photo Background Processor
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Remove, blur, or change your photo background in seconds
          </p>
        </div>

        <div className="space-y-8">
          <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} />
          
          {selectedFile && (
            <BackgroundOptions
              onSelect={handleBackgroundOption}
              isLoading={isLoading}
            />
          )}
          
          <ProcessedImageDisplay
            image={processedImage}
            onDownload={handleDownload}
          />
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;