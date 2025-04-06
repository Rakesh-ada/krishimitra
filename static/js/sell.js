// Additional sell page specific JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Image upload functionality
    const imageUpload = document.getElementById('image-upload');
    const imageInput = document.getElementById('image-input');
    const uploadedImages = document.getElementById('uploaded-images');

    if (imageUpload && imageInput) {
        imageUpload.addEventListener('click', function () {
            imageInput.click();
        });

        imageInput.addEventListener('change', function () {
            const files = this.files;

            for (let i = 0; i < files.length; i++) {
                if (uploadedImages.children.length >= 5) {
                    showToast('Maximum 5 images allowed');
                    break;
                }

                const file = files[i];

                // Check if it's an image
                if (!file.type.match('image.*')) {
                    continue;
                }

                const reader = new FileReader();

                reader.onload = function (e) {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'uploaded-image';

                    const img = document.createElement('img');
                    img.src = e.target.result;

                    const removeBtn = document.createElement('div');
                    removeBtn.className = 'remove-image';
                    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    removeBtn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        imgContainer.remove();
                    });

                    imgContainer.appendChild(img);
                    imgContainer.appendChild(removeBtn);
                    uploadedImages.appendChild(imgContainer);
                };

                reader.readAsDataURL(file);
            }
        });

        // Drag and drop functionality
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            imageUpload.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            imageUpload.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            imageUpload.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            imageUpload.classList.add('highlight');
        }

        function unhighlight() {
            imageUpload.classList.remove('highlight');
        }

        imageUpload.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            imageInput.files = files;

            // Trigger change event
            const event = new Event('change');
            imageInput.dispatchEvent(event);
        }
    }

    // Form submission
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // In a real application, you would send the form data to the server
            // For demonstration, we'll just show a success message
            showToast('Product listing created successfully!');

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        });
    }

    // Show toast function
    function showToast(message) {
        // Check if a toast container already exists
        let toastContainer = document.querySelector('.toast-container');

        // If not, create one
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);

            // Add styles if not already in the CSS
            const style = document.createElement('style');
            style.textContent = `
          .toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
          }
          .toast {
            background-color: var(--bg-tertiary);
            color: var(--text-white);
            padding: 12px 20px;
            border-radius: 4px;
            margin-top: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
            max-width: 300px;
          }
          .toast::before {
            content: '';
            width: 4px;
            height: 100%;
            background-color: var(--accent-green);
            position: absolute;
            left: 0;
            top: 0;
            border-radius: 4px 0 0 4px;
          }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `;
            document.head.appendChild(style);
        }

        // Create the toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        // Add to container
        toastContainer.appendChild(toast);

        // Remove after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});