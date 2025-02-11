import React from 'react';
import { Button } from '../common/Button';
import { ImageProcessingOptions } from '../../types/image';

interface ProcessingOptionsProps {
  onProcess: (options: ImageProcessingOptions) => void;
  isLoading: boolean;
}

export const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({
  onProcess,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button
          onClick={() => onProcess({ removeBackground: true })}
          isLoading={isLoading}
        >
          Remove Background
        </Button>
        <Button
          variant="secondary"
          onClick={() => onProcess({ removeBackground: true, newBackground: 'blur' })}
          isLoading={isLoading}
        >
          Blur Background
        </Button>
      </div>
    </div>
  );
}