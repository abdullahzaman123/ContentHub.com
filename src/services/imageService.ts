import axios from 'axios';

const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

export interface ImageGenerationParams {
  prompt: string;
  negativePrompt?: string;
  steps?: number;
  width?: number;
  height?: number;
}

export const generateImage = async ({
  prompt,
  negativePrompt = '',
  steps = 30,
  width = 1024,
  height = 1024,
}: ImageGenerationParams) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        text_prompts: [
          {
            text: prompt,
            weight: 1,
          },
          {
            text: negativePrompt,
            weight: -1,
          },
        ],
        cfg_scale: 7,
        steps: steps,
        width: width,
        height: height,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return response.data.artifacts[0].base64;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};