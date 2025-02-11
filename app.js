document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS animation library
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Upload functionality
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = uploadProgress.querySelector('.progress-fill');
    const progressText = uploadProgress.querySelector('.progress-text');
    const uploadedFiles = document.getElementById('uploadedFiles');
    const libraryGrid = document.querySelector('.library-grid');

    // Handle file upload via click
    dropZone.addEventListener('click', () => fileInput.click());

    // Handle file selection
    fileInput.addEventListener('change', handleFiles);

    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-active');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-active');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-active');
        handleFiles({ target: { files: e.dataTransfer.files } });
    });

    // Handle file upload
    function handleFiles(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (validateFile(file)) {
                uploadFile(file);
            } else {
                showNotification('Invalid file type or size', 'error');
            }
        });
    }

    // Validate file
    function validateFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'];
        const maxSize = 50 * 1024 * 1024; // 50MB
        return validTypes.includes(file.type) && file.size <= maxSize;
    }

    // Simulate file upload
    function uploadFile(file) {
        uploadProgress.classList.remove('hidden');
        let progress = 0;
        
        // Simulate upload progress
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
            
            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    uploadProgress.classList.add('hidden');
                    addFileToLibrary(file);
                    showNotification('File uploaded successfully!', 'success');
                }, 500);
            }
        }, 200);
    }

    // Add file to library
    function addFileToLibrary(file) {
        const fileType = file.type.split('/')[0];
        const fileCard = createFileCard(file, fileType);
        libraryGrid.appendChild(fileCard);
        
        // Animate the new card
        fileCard.style.animation = 'fadeIn 0.5s ease forwards';
    }

    // Create file card
    function createFileCard(file, type) {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.dataset.type = type;
        
        const icon = getFileIcon(type);
        const preview = type === 'image' ? URL.createObjectURL(file) : null;
        
        card.innerHTML = `
            <div class="file-card-content">
                ${preview ? 
                    `<img src="${preview}" alt="${file.name}" class="file-preview">` :
                    `<i class="${icon}"></i>`
                }
                <div class="file-info">
                    <h3>${file.name}</h3>
                    <p>${formatFileSize(file.size)}</p>
                </div>
                <div class="file-actions">
                    <button onclick="downloadFile('${file.name}')" class="action-btn">
                        <i class="fas fa-download"></i>
                    </button>
                    <button onclick="deleteFile(this)" class="action-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    // Filter library items
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items
            const items = libraryGrid.querySelectorAll('.file-card');
            items.forEach(item => {
                if (filter === 'all' || item.dataset.type === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Utility functions
    function getFileIcon(type) {
        const icons = {
            image: 'fas fa-image',
            video: 'fas fa-video',
            application: 'fas fa-file-pdf'
        };
        return icons[type] || 'fas fa-file';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll to upload section
    window.scrollToUpload = () => {
        document.querySelector('#upload').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    // Handle file actions
    window.downloadFile = (fileName) => {
        // Simulate file download
        showNotification(`Downloading ${fileName}...`, 'success');
    };

    window.deleteFile = (button) => {
        const card = button.closest('.file-card');
        card.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => card.remove(), 300);
        showNotification('File deleted successfully', 'success');
    };

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    
});