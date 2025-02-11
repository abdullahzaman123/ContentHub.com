class ImageProcessor {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api';
    }

    async textToImage(text) {
        try {
            const response = await fetch(`${this.apiUrl}/text-to-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();
            return data.image;
        } catch (error) {
            console.error('Error generating image:', error);
            throw error;
        }
    }

    async removeBackground(file) {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${this.apiUrl}/remove-background`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to remove background');
            }

            const data = await response.json();
            return data.image;
        } catch (error) {
            console.error('Error removing background:', error);
            throw error;
        }
    }
}