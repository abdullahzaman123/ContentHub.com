import { ProcessedImage, BackgroundType } from '../types/image';
import { createCanvas, loadImage } from '../utils/canvasUtils';

export const processImage = async (
  imageFile: File,
  backgroundType: BackgroundType,
  backgroundColor?: string
): Promise<ProcessedImage> => {
  const image = await loadImage(imageFile);
  const { canvas: originalCanvas, ctx: originalCtx } = createCanvas(image.width, image.height);
  const { canvas: processedCanvas, ctx: processedCtx } = createCanvas(image.width, image.height);

  // Draw original image
  originalCtx.drawImage(image, 0, 0);
  processedCtx.drawImage(image, 0, 0);

  // Get image data for processing
  const imageData = originalCtx.getImageData(0, 0, image.width, image.height);
  const data = imageData.data;

  switch (backgroundType) {
    case 'remove':
      removeBackground(data);
      break;
    case 'blur':
      await applyBlurBackground(processedCanvas, image);
      break;
    case 'color':
      if (backgroundColor) {
        applyColorBackground(processedCanvas, image, backgroundColor);
      }
      break;
  }

  processedCtx.putImageData(imageData, 0, 0);

  return {
    originalImage: originalCanvas.toDataURL(),
    processedImage: processedCanvas.toDataURL(),
    type: backgroundType,
  };
};

function removeBackground(data: Uint8ClampedArray) {
  const threshold = 30;
  const backgroundColor = getBackgroundColor(data);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (
      Math.abs(r - backgroundColor.r) < threshold &&
      Math.abs(g - backgroundColor.g) < threshold &&
      Math.abs(b - backgroundColor.b) < threshold
    ) {
      data[i + 3] = 0;
    }
  }
}

async function applyBlurBackground(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const ctx = canvas.getContext('2d')!;
  ctx.filter = 'blur(10px)';
  ctx.drawImage(image, 0, 0);
  ctx.filter = 'none';
  ctx.drawImage(image, 0, 0);
}

function applyColorBackground(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  color: string
) {
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
}

function getBackgroundColor(data: Uint8ClampedArray) {
  return {
    r: data[0],
    g: data[1],
    b: data[2],
  };
}