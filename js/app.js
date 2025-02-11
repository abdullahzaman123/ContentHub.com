document.addEventListener('DOMContentLoaded', () => {
    const imageProcessor = new ImageProcessor();
    const textInput = document.getElementById('textInput');
    const generateBtn = document.getElementById('generateBtn');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const resultsSection = document.getElementById('resultsSection');
    const originalImage = document.getElementById('originalImage');
    const processedImage = document.getElementById('processedImage');
    const downloadBtn = document.getElementById('downloadBtn');

    // Text to Image handling
    generateBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (!text) {
            alert('Please enter some text');
            return;
        }

        try {
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';

            const base64Image = await imageProcessor.textToImage(text);
            
            originalImage.src = `data:image/png;base64,${base64Image}`;
            processedImage.src = `data:image/png;base64,${base64Image}`;
            resultsSection.style.display = 'block';
        } catch (error) {
            alert('Failed to generate image. Please try again.');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Image';
        }
    });

    // Image upload handling
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) await processImage(file);
    });

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) await processImage(file);
    });

    async function processImage(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        try {
            dropZone.classList.add('processing');
            
            // Display original image
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImage.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // Process image
            const processedBase64 = await imageProcessor.removeBackground(file);
            processedImage.src = `data:image/png;base64,${processedBase64}`;
            resultsSection.style.display = 'block';
        } catch (error) {
            alert('Failed to process image. Please try again.');
        } finally {
            dropZone.classList.remove('processing');
        }
    }

    // Download handling
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = processedImage.src;
        link.download = 'processed-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});