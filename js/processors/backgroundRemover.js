const BackgroundRemover = {
    async process(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const backgroundColor = this.getBackgroundColor(data);
        this.removeBackground(data, backgroundColor);

        ctx.putImageData(imageData, 0, 0);
    },

    getBackgroundColor(data) {
        // Sample colors from the edges to determine background color
        const samples = [];
        const width = Math.sqrt(data.length / 4);
        
        // Sample top edge
        for (let i = 0; i < width * 4; i += 4) {
            samples.push({
                r: data[i],
                g: data[i + 1],
                b: data[i + 2]
            });
        }

        // Calculate average color
        return {
            r: Math.round(samples.reduce((sum, c) => sum + c.r, 0) / samples.length),
            g: Math.round(samples.reduce((sum, c) => sum + c.g, 0) / samples.length),
            b: Math.round(samples.reduce((sum, c) => sum + c.b, 0) / samples.length)
        };
    },

    removeBackground(data, backgroundColor) {
        const threshold = 30;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (
                Math.abs(r - backgroundColor.r) < threshold &&
                Math.abs(g - backgroundColor.g) < threshold &&
                Math.abs(b - backgroundColor.b) < threshold
            ) {
                data[i + 3] = 0; // Set alpha to 0 (transparent)
            }
        }
    }
};