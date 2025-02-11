const BackgroundEffects = {
    async applyBlur(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Create temporary canvas for blur effect
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Draw with blur
        tempCtx.filter = 'blur(10px)';
        tempCtx.drawImage(canvas, 0, 0);
        
        // Draw original image on top
        tempCtx.filter = 'none';
        tempCtx.drawImage(canvas, 0, 0);
        
        // Update original canvas
        ctx.drawImage(tempCanvas, 0, 0);
    },

    applyColor(canvas, color) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Create temporary canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Fill with color
        tempCtx.fillStyle = color;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw original image
        tempCtx.drawImage(canvas, 0, 0);
        
        // Update original canvas
        ctx.drawImage(tempCanvas, 0, 0);
    }
};