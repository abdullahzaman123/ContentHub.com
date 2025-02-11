class DropZoneHandler {
    constructor(dropZone, fileInput, onImageLoad) {
        this.dropZone = dropZone;
        this.fileInput = fileInput;
        this.onImageLoad = onImageLoad;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) this.processFile(file);
        });
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) this.processFile(file);
    }

    async processFile(file) {
        try {
            const image = await ImageLoader.loadImage(file);
            this.onImageLoad(image);
        } catch (error) {
            alert('Error loading image: ' + error.message);
        }
    }
}