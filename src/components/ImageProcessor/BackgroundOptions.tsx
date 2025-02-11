import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '../common/Button';
import { BackgroundType } from '../../types/image';

interface BackgroundOptionsProps {
  onSelect: (type: BackgroundType, color?: string) => void;
  isLoading: boolean;
}

export const BackgroundOptions: React.FC<BackgroundOptionsProps> = ({
  onSelect,
  isLoading,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() => onSelect('remove')}
          isLoading={isLoading}
        >
          Remove Background
        </Button>
        <Button
          variant="secondary"
          onClick={() => onSelect('blur')}
          isLoading={isLoading}
        >
          Blur Background
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowColorPicker(!showColorPicker)}
          isLoading={isLoading}
        >
          Custom Color
        </Button>
      </div>

      {showColorPicker && (
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <HexColorPicker
            color={selectedColor}
            onChange={(color) => {
              setSelectedColor(color);
              onSelect('color', color);
            }}
          />
        </div>
      )}
    </div>
  );
}