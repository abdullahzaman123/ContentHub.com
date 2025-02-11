class ToolsHandler {
    constructor(originalCanvas, processedCanvas) {
        this.originalCanvas = originalCanvas;
        this.processedCanvas = processedCanvas;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('removeBackgroundBtn').onclick = () => this.removeBackground();
        document.getElementById('blurBackgroundBtn').onclick = () => this.blurBackground();
        document.getElementById('colorBackgroundBtn').onclick = () => this.changeBackgroundColor();
        document.getElementById('downloadBtn').onclick = () => this.downloadImage();
    }

    async removeBackground() {
        await BackgroundRemover.process(this.processedCanvas);
    }

    async blurBackground() {
        await BackgroundEffects.applyBlur(this.processedCanvas);
    }

    changeBackgroundColor() {
        const color = document.getElementById('colorPicker').value;
        BackgroundEffects.applyColor(this.processedCanvas, color);
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = 'processed-image.png';
        link.href = this.processedCanvas.toDataURL('image/png');
        link.click();
    }

    resetCanvas() {
        const ctx = this.processedCanvas.getContext('2d');
        ctx.drawImage(this.originalCanvas, 0, 0);
    }
}