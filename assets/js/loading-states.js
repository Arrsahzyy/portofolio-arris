/**
 * Loading States Manager
 * Improves perceived performance and user feedback
 * Maintains original design aesthetic
 */

class LoadingStateManager {
    constructor() {
        this.loadingStates = new Map();
        this.defaultOptions = {
            showSpinner: true,
            showText: true,
            overlay: true,
            blur: false,
            preserveSize: true
        };
        
        this.init();
    }

    init() {
        this.createLoadingStyles();
        this.setupImageLoading();
        this.setupButtonLoading();
        this.setupSectionLoading();
        this.setupFormLoading();
    }

    createLoadingStyles() {
        const style = document.createElement('style');
        style.id = 'loading-states-styles';
        style.textContent = `
            /* Loading Overlay */
            .loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                border-radius: inherit;
                transition: opacity 0.3s ease;
            }

            .dark .loading-overlay {
                background: rgba(31, 41, 55, 0.9);
            }

            /* Loading Spinner */
            .loading-spinner {
                width: 32px;
                height: 32px;
                border: 3px solid #e5e7eb;
                border-top: 3px solid #0d9488;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 8px;
            }

            .dark .loading-spinner {
                border-color: #374151;
                border-top-color: #2dd4bf;
            }

            .loading-spinner.small {
                width: 20px;
                height: 20px;
                border-width: 2px;
                margin-bottom: 4px;
            }

            .loading-spinner.large {
                width: 48px;
                height: 48px;
                border-width: 4px;
                margin-bottom: 12px;
            }

            /* Loading Text */
            .loading-text {
                font-size: 14px;
                color: #6b7280;
                font-weight: 500;
                text-align: center;
            }

            .dark .loading-text {
                color: #9ca3af;
            }

            /* Button Loading States */
            .btn-loading {
                position: relative;
                color: transparent !important;
                pointer-events: none;
            }

            .btn-loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin: -10px 0 0 -10px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                opacity: 0.8;
            }

            /* Skeleton Loading */
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading-shimmer 1.5s infinite;
                border-radius: 4px;
            }

            .dark .skeleton {
                background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
                background-size: 200% 100%;
            }

            .skeleton-card {
                height: 200px;
                margin-bottom: 1rem;
                border-radius: 8px;
            }

            .skeleton-text {
                height: 1rem;
                margin-bottom: 0.5rem;
                border-radius: 4px;
            }

            .skeleton-text.title {
                height: 1.5rem;
                width: 70%;
                margin-bottom: 1rem;
            }

            .skeleton-text.short {
                width: 60%;
            }

            .skeleton-text.medium {
                width: 80%;
            }

            /* Image Loading */
            .image-loading {
                position: relative;
                overflow: hidden;
            }

            .image-loading::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading-shimmer 1.5s infinite;
                z-index: 1;
            }

            .dark .image-loading::before {
                background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
                background-size: 200% 100%;
            }

            .image-loading img {
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .image-loading.loaded::before {
                display: none;
            }

            .image-loading.loaded img {
                opacity: 1;
            }

            /* Progress Bar */
            .loading-progress {
                width: 100%;
                height: 4px;
                background: #e5e7eb;
                border-radius: 2px;
                overflow: hidden;
                margin-top: 8px;
            }

            .dark .loading-progress {
                background: #374151;
            }

            .loading-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #0d9488, #2dd4bf);
                border-radius: 2px;
                transition: width 0.3s ease;
                width: 0%;
            }

            /* Animations */
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes loading-shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            /* Fade animations */
            .fade-in {
                animation: fadeIn 0.3s ease-in;
            }

            .fade-out {
                animation: fadeOut 0.3s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            /* Loading states for mobile */
            @media (max-width: 768px) {
                .loading-overlay {
                    background: rgba(255, 255, 255, 0.95);
                }

                .dark .loading-overlay {
                    background: rgba(31, 41, 55, 0.95);
                }

                .loading-spinner {
                    width: 28px;
                    height: 28px;
                }

                .loading-text {
                    font-size: 13px;
                }
            }
        `;
        
        if (!document.getElementById('loading-states-styles')) {
            document.head.appendChild(style);
        }
    }

    // Show loading state for any element
    show(element, options = {}) {
        if (!element) return;

        const config = { ...this.defaultOptions, ...options };
        const loadingId = this.generateId();

        // Store original state
        const originalState = {
            position: element.style.position,
            overflow: element.style.overflow,
            minHeight: element.style.minHeight
        };

        // Prepare element for loading overlay
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        
        if (config.preserveSize && !element.style.minHeight) {
            element.style.minHeight = element.offsetHeight + 'px';
        }

        // Create loading overlay
        const overlay = this.createLoadingOverlay(config);
        overlay.dataset.loadingId = loadingId;

        // Add overlay to element
        element.appendChild(overlay);
        
        // Apply blur effect if requested
        if (config.blur) {
            const children = Array.from(element.children).filter(child => 
                !child.classList.contains('loading-overlay')
            );
            children.forEach(child => {
                child.style.filter = 'blur(2px)';
                child.style.transition = 'filter 0.3s ease';
            });
        }

        // Store loading state
        this.loadingStates.set(loadingId, {
            element,
            overlay,
            originalState,
            config
        });

        // Add fade-in animation
        requestAnimationFrame(() => {
            overlay.classList.add('fade-in');
        });

        return loadingId;
    }

    // Hide loading state
    hide(loadingId) {
        const state = this.loadingStates.get(loadingId);
        if (!state) return;

        const { element, overlay, originalState, config } = state;

        // Add fade-out animation
        overlay.classList.add('fade-out');

        setTimeout(() => {
            // Remove overlay
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }

            // Restore original state
            Object.assign(element.style, originalState);

            // Remove blur effect
            if (config.blur) {
                const children = Array.from(element.children);
                children.forEach(child => {
                    child.style.filter = '';
                });
            }

            // Clean up
            this.loadingStates.delete(loadingId);
        }, 300);
    }

    createLoadingOverlay(config) {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';

        let content = '';
        
        if (config.showSpinner) {
            const spinnerSize = config.size === 'small' ? 'small' : 
                             config.size === 'large' ? 'large' : '';
            content += `<div class="loading-spinner ${spinnerSize}"></div>`;
        }

        if (config.showText && config.text) {
            content += `<div class="loading-text">${config.text}</div>`;
        }

        if (config.showProgress) {
            content += `
                <div class="loading-progress">
                    <div class="loading-progress-bar"></div>
                </div>
            `;
        }

        overlay.innerHTML = content;
        return overlay;
    }

    // Button-specific loading
    showButtonLoading(button, text = '') {
        if (!button) return;

        const originalContent = button.innerHTML;
        const originalDisabled = button.disabled;

        button.disabled = true;
        button.classList.add('btn-loading');
        
        if (text) {
            button.setAttribute('data-loading-text', text);
        }

        const loadingId = this.generateId();
        this.loadingStates.set(loadingId, {
            element: button,
            originalContent,
            originalDisabled,
            type: 'button'
        });

        return loadingId;
    }

    hideButtonLoading(loadingId) {
        const state = this.loadingStates.get(loadingId);
        if (!state || state.type !== 'button') return;

        const { element: button, originalContent, originalDisabled } = state;

        button.classList.remove('btn-loading');
        button.innerHTML = originalContent;
        button.disabled = originalDisabled;
        button.removeAttribute('data-loading-text');

        this.loadingStates.delete(loadingId);
    }

    // Skeleton loading for content areas
    showSkeleton(container, type = 'card') {
        if (!container) return;

        const skeleton = document.createElement('div');
        skeleton.className = `skeleton skeleton-${type}`;

        if (type === 'text') {
            skeleton.innerHTML = `
                <div class="skeleton-text title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text medium"></div>
                <div class="skeleton-text short"></div>
            `;
        } else if (type === 'card') {
            skeleton.innerHTML = `
                <div style="padding: 1rem;">
                    <div class="skeleton-text title"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text medium"></div>
                </div>
            `;
        }

        const originalContent = container.innerHTML;
        container.innerHTML = '';
        container.appendChild(skeleton);

        const loadingId = this.generateId();
        this.loadingStates.set(loadingId, {
            element: container,
            skeleton,
            originalContent,
            type: 'skeleton'
        });

        return loadingId;
    }

    hideSkeleton(loadingId) {
        const state = this.loadingStates.get(loadingId);
        if (!state || state.type !== 'skeleton') return;

        const { element: container, originalContent } = state;
        
        container.innerHTML = originalContent;
        this.loadingStates.delete(loadingId);
    }

    setupImageLoading() {
        // Handle image loading states
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (img.complete) return;

            const container = img.parentElement;
            if (container) {
                container.classList.add('image-loading');
            }

            img.addEventListener('load', () => {
                if (container) {
                    container.classList.add('loaded');
                }
            });

            img.addEventListener('error', () => {
                if (container) {
                    container.classList.remove('image-loading');
                }
            });
        });
    }

    setupButtonLoading() {
        // Auto-handle button loading for common actions
        const downloadButtons = document.querySelectorAll('a[download], .btn-download');
        
        downloadButtons.forEach(button => {
            button.addEventListener('click', () => {
                const loadingId = this.showButtonLoading(button, 'Preparing...');
                
                // Auto-hide after realistic delay
                setTimeout(() => {
                    this.hideButtonLoading(loadingId);
                }, 2000);
            });
        });

        // Handle copy email button
        const copyButton = document.getElementById('copy-email-btn');
        if (copyButton) {
            copyButton.addEventListener('click', () => {
                const loadingId = this.showButtonLoading(copyButton, 'Copying...');
                
                setTimeout(() => {
                    this.hideButtonLoading(loadingId);
                }, 500);
            });
        }
    }

    setupSectionLoading() {
        // Show loading for sections that take time to render
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    
                    // Simulate loading for heavy sections
                    if (section.id === 'projects' || section.id === 'blog') {
                        this.simulateSectionLoading(section);
                    }
                    
                    observer.unobserve(section);
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => observer.observe(section));
    }

    setupFormLoading() {
        // Handle form submission loading
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    const loadingId = this.showButtonLoading(submitButton, 'Sending...');
                    
                    // Simulate form processing
                    setTimeout(() => {
                        this.hideButtonLoading(loadingId);
                    }, 2000);
                }
            });
        });
    }

    simulateSectionLoading(section) {
        const cards = section.querySelectorAll('.project-card, .blog-card');
        
        cards.forEach((card, index) => {
            const loadingId = this.showSkeleton(card, 'card');
            
            // Staggered loading animation
            setTimeout(() => {
                this.hideSkeleton(loadingId);
                card.classList.add('fade-in');
            }, 200 + (index * 100));
        });
    }

    // Update progress for long-running operations
    updateProgress(loadingId, progress) {
        const state = this.loadingStates.get(loadingId);
        if (!state) return;

        const progressBar = state.overlay.querySelector('.loading-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
    }

    generateId() {
        return 'loading-' + Math.random().toString(36).substr(2, 9);
    }

    // Utility method to show loading for async operations
    async wrapOperation(operation, element, options = {}) {
        const loadingId = this.show(element, options);
        
        try {
            const result = await operation();
            return result;
        } finally {
            this.hide(loadingId);
        }
    }
}

// Initialize loading states manager
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.loadingStateManager = new LoadingStateManager();
    });
} else {
    window.loadingStateManager = new LoadingStateManager();
}

export default LoadingStateManager;
