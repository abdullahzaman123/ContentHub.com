class ImageProcessor {
    constructor() {
        this.originalCanvas = document.getElementById('originalCanvas');
        this.processedCanvas = document.getElementById('processedCanvas');
        this.originalCtx = this.originalCanvas.getContext('2d');
        this.processedCtx = this.processedCanvas.getContext('2d');
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    async setImage(file) {
        const img = await this.loadImage(file);
        
        // Set canvas dimensions
        this.originalCanvas.width = img.width;
        this.originalCanvas.height = img.height;
        this.processedCanvas.width = img.width;
        this.processedCanvas.height = img.height;

        // Draw original image
        this.originalCtx.drawImage(img, 0, 0);
        this.processedCtx.drawImage(img, 0, 0);

        return img;
    }

    removeBackground() {
        const imageData = this.originalCtx.getImageData(
            0,
            0,
            this.originalCanvas.width,
            this.originalCanvas.height
        );
        const data = imageData.data;

        // Simple background removal using color similarity
        const threshold = 30;
        const targetColor = this.getBackgroundColor(data);

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (
                Math.abs(r - targetColor.r) < threshold &&
                Math.abs(g - targetColor.g) < threshold &&
                Math.abs(b - targetColor.b) < threshold
            ) {
                data[i + 3] = 0; // Set alpha to 0 (transparent)
            }
        }

        this.processedCtx.putImageData(imageData, 0, 0);
    }

    changeBackground(color) {
        // First remove the background
        this.removeBackground();

        // Create a new canvas for the final result
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = this.processedCanvas.width;
        finalCanvas.height = this.processedCanvas.height;
        const finalCtx = finalCanvas.getContext('2d');

        // Fill with the new background color
        finalCtx.fillStyle = color;
        finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

        // Draw the processed image on top
        finalCtx.drawImage(this.processedCanvas, 0, 0);

        // Update the processed canvas
        this.processedCtx.drawImage(finalCanvas, 0, 0);
    }

    getBackgroundColor(data) {
        // Simple method: assume the top-left pixel color is the background color
        return {
            r: data[0],
            g: data[1],
            b: data[2]
        };
    }

    reset() {
        this.processedCtx.drawImage(this.originalCanvas, 0, 0);
    }

    download() {
        const link = document.createElement('a');
        link.download = 'processed-image.png';
        link.href = this.processedCanvas.toDataURL();
        link.click();
    }
}