import axios from 'axios';

const API_KEY = 'YOUR_REMOVE_BG_API_KEY'; // Replace with your actual Remove.bg API key
const API_URL = 'https://api.remove.bg/v1.0/removebg';

export const removeBackground = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image_file', imageFile);
  formData.append('size', 'auto');

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'X-Api-Key': API_KEY,
      },
      responseType: 'arraybuffer',
    });

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return base64Image;
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};