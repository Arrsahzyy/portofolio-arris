/**
 * Error Handling Manager
 * Provides user-friendly error handling and recovery
 * Maintains consistent design and UX
 */

class ErrorHandler {
    constructor() {
        this.errorQueue = [];
        this.isOnline = navigator.onLine;
        this.retryAttempts = new Map();
        this.maxRetries = 3;
        
        this.errorMessages = {
            network: {
                title: "Koneksi Bermasalah",
                message: "Silakan periksa koneksi internet Anda dan coba lagi.",
                action: "Coba Lagi",
                icon: "🌐"
            },
            timeout: {
                title: "Waktu Habis",
                message: "Permintaan memakan waktu terlalu lama. Silakan coba lagi.",
                action: "Coba Lagi",
                icon: "⏱️"
            },
            server: {
                title: "Kesalahan Server",
                message: "Terjadi kesalahan pada server. Tim kami sedang memperbaikinya.",
                action: "Laporkan",
                icon: "🔧"
            },
            validation: {
                title: "Data Tidak Valid",
                message: "Silakan periksa data yang dimasukkan dan coba lagi.",
                action: "Perbaiki",
                icon: "⚠️"
            },
            notFound: {
                title: "Tidak Ditemukan",
                message: "Halaman atau resource yang dicari tidak ditemukan.",
                action: "Kembali",
                icon: "🔍"
            },
            offline: {
                title: "Mode Offline",
                message: "Anda sedang offline. Beberapa fitur mungkin tidak tersedia.",
                action: "OK",
                icon: "📡"
            },
            default: {
                title: "Terjadi Kesalahan",
                message: "Terjadi kesalahan tak terduga. Silakan refresh halaman.",
                action: "Refresh",
                icon: "❌"
            }
        };

        this.init();
    }

    init() {
        this.createErrorStyles();
        this.setupGlobalErrorHandlers();
        this.setupNetworkMonitoring();
        this.setupRetryMechanism();
        this.setupOfflineHandling();
    }

    createErrorStyles() {
        const style = document.createElement('style');
        style.id = 'error-handler-styles';
        style.textContent = `
            /* Error Toast Styles */
            .error-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                min-width: 300px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                transform: translateX(420px);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border-left: 4px solid #ef4444;
            }

            .error-toast.show {
                transform: translateX(0);
            }

            .error-toast.success {
                border-left-color: #10b981;
            }

            .error-toast.warning {
                border-left-color: #f59e0b;
            }

            .error-toast.info {
                border-left-color: #3b82f6;
            }

            .dark .error-toast {
                background: #1f2937;
                color: #f9fafb;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }

            .error-content {
                padding: 16px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }

            .error-icon {
                font-size: 20px;
                flex-shrink: 0;
                margin-top: 2px;
            }

            .error-details {
                flex: 1;
                min-width: 0;
            }

            .error-title {
                font-weight: 600;
                font-size: 14px;
                color: #111827;
                margin-bottom: 4px;
            }

            .dark .error-title {
                color: #f9fafb;
            }

            .error-message {
                font-size: 13px;
                color: #6b7280;
                line-height: 1.4;
                margin-bottom: 8px;
            }

            .dark .error-message {
                color: #d1d5db;
            }

            .error-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }

            .error-action {
                background: #f3f4f6;
                border: none;
                border-radius: 6px;
                padding: 4px 12px;
                font-size: 12px;
                font-weight: 500;
                color: #374151;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .error-action:hover {
                background: #e5e7eb;
            }

            .error-action.primary {
                background: #3b82f6;
                color: white;
            }

            .error-action.primary:hover {
                background: #2563eb;
            }

            .dark .error-action {
                background: #374151;
                color: #d1d5db;
            }

            .dark .error-action:hover {
                background: #4b5563;
            }

            .error-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                font-size: 18px;
                padding: 4px;
                border-radius: 4px;
                transition: color 0.2s;
                flex-shrink: 0;
            }

            .error-close:hover {
                color: #6b7280;
            }

            /* Offline Banner */
            .offline-banner {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #f59e0b;
                color: white;
                text-align: center;
                padding: 8px 16px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10001;
                transform: translateY(-100%);
                transition: transform 0.3s ease;
            }

            .offline-banner.show {
                transform: translateY(0);
            }

            /* Error Page Overlay */
            .error-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }

            .error-overlay.show {
                opacity: 1;
                visibility: visible;
            }

            .error-modal {
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .error-overlay.show .error-modal {
                transform: scale(1);
            }

            .dark .error-modal {
                background: #1f2937;
                color: #f9fafb;
            }

            .error-modal-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }

            .error-modal-title {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #111827;
            }

            .dark .error-modal-title {
                color: #f9fafb;
            }

            .error-modal-message {
                color: #6b7280;
                margin-bottom: 20px;
                line-height: 1.5;
            }

            .dark .error-modal-message {
                color: #d1d5db;
            }

            .error-modal-actions {
                display: flex;
                gap: 12px;
                justify-content: center;
            }

            .error-modal-action {
                padding: 10px 20px;
                border-radius: 8px;
                border: none;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .error-modal-action.primary {
                background: #3b82f6;
                color: white;
            }

            .error-modal-action.primary:hover {
                background: #2563eb;
            }

            .error-modal-action.secondary {
                background: #f3f4f6;
                color: #374151;
            }

            .error-modal-action.secondary:hover {
                background: #e5e7eb;
            }

            .dark .error-modal-action.secondary {
                background: #374151;
                color: #d1d5db;
            }

            .dark .error-modal-action.secondary:hover {
                background: #4b5563;
            }

            /* Mobile Styles */
            @media (max-width: 768px) {
                .error-toast {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    min-width: auto;
                    transform: translateY(-100px);
                }

                .error-toast.show {
                    transform: translateY(0);
                }

                .error-modal {
                    margin: 20px;
                    width: auto;
                }
            }

            /* Animation Classes */
            .shake {
                animation: shake 0.5s ease-in-out;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            .pulse-error {
                animation: pulse-error 0.3s ease-in-out;
            }

            @keyframes pulse-error {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        
        if (!document.getElementById('error-handler-styles')) {
            document.head.appendChild(style);
        }
    }

    setupGlobalErrorHandlers() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            
            this.trackError({
                type: 'javascript',
                message: event.error?.message || 'Unknown error',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });

            // Don't show UI for every JS error, just log and track
        });

        // Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            
            this.trackError({
                type: 'promise_rejection',
                message: event.reason?.message || 'Promise rejected',
                reason: event.reason
            });
        });

        // Resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                const element = event.target;
                const errorInfo = {
                    type: 'resource',
                    element: element.tagName,
                    source: element.src || element.href,
                    message: 'Failed to load resource'
                };

                this.handleResourceError(element, errorInfo);
            }
        }, true);
    }

    setupNetworkMonitoring() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.hideOfflineBanner();
            this.showToast('success', {
                title: 'Koneksi Pulih',
                message: 'Koneksi internet telah pulih.',
                icon: '✅'
            });
            
            // Retry failed requests
            this.retryFailedRequests();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineBanner();
            this.showError('offline');
        });

        // Check initial network status
        if (!this.isOnline) {
            this.showOfflineBanner();
        }
    }

    setupRetryMechanism() {
        // Setup automatic retry for failed requests
        this.originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const url = args[0];
            const options = args[1] || {};
            
            try {
                const response = await this.originalFetch(...args);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                // Reset retry count on success
                this.retryAttempts.delete(url);
                
                return response;
            } catch (error) {
                return this.handleFetchError(url, options, error, args);
            }
        };
    }

    async handleFetchError(url, options, error, originalArgs) {
        const retryCount = this.retryAttempts.get(url) || 0;
        
        // Determine error type
        let errorType = 'default';
        if (!navigator.onLine) {
            errorType = 'network';
        } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            errorType = 'network';
        } else if (error.message.includes('timeout')) {
            errorType = 'timeout';
        } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
            errorType = 'server';
        }

        // Show error to user
        this.showError(errorType, {
            url: url,
            retryCount: retryCount,
            canRetry: retryCount < this.maxRetries
        });

        // Track error
        this.trackError({
            type: 'fetch',
            url: url,
            method: options.method || 'GET',
            error: error.message,
            retryCount: retryCount
        });

        // Auto-retry for certain conditions
        if (retryCount < this.maxRetries && (errorType === 'network' || errorType === 'timeout')) {
            this.retryAttempts.set(url, retryCount + 1);
            
            // Exponential backoff
            const delay = Math.pow(2, retryCount) * 1000;
            
            await new Promise(resolve => setTimeout(resolve, delay));
            
            try {
                return await this.originalFetch(...originalArgs);
            } catch (retryError) {
                return this.handleFetchError(url, options, retryError, originalArgs);
            }
        }

        // Throw original error if retries exhausted
        throw error;
    }

    setupOfflineHandling() {
        // Create offline banner
        const offlineBanner = document.createElement('div');
        offlineBanner.id = 'offline-banner';
        offlineBanner.className = 'offline-banner';
        offlineBanner.innerHTML = `
            <span>📡 Anda sedang offline. Beberapa fitur mungkin tidak tersedia.</span>
        `;
        document.body.appendChild(offlineBanner);
    }

    showError(type, context = {}) {
        const errorConfig = this.errorMessages[type] || this.errorMessages.default;
        
        // Add to error queue
        const errorId = this.generateErrorId();
        const errorData = {
            id: errorId,
            type: type,
            config: errorConfig,
            context: context,
            timestamp: Date.now()
        };
        
        this.errorQueue.push(errorData);
        
        // Show error UI
        if (type === 'server' || type === 'notFound') {
            this.showErrorModal(errorData);
        } else {
            this.showToast('error', errorData);
        }

        return errorId;
    }

    showToast(severity, errorData) {
        const config = errorData.config || errorData;
        const toast = document.createElement('div');
        toast.className = `error-toast ${severity}`;
        toast.id = `error-toast-${errorData.id || Date.now()}`;
        
        toast.innerHTML = `
            <div class="error-content">
                <div class="error-icon">${config.icon}</div>
                <div class="error-details">
                    <div class="error-title">${config.title}</div>
                    <div class="error-message">${config.message}</div>
                    ${this.createErrorActions(errorData)}
                </div>
                <button class="error-close" aria-label="Close">&times;</button>
            </div>
        `;

        document.body.appendChild(toast);

        // Show toast
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-hide after delay
        setTimeout(() => {
            this.hideToast(toast);
        }, severity === 'error' ? 8000 : 5000);

        // Handle close button
        toast.querySelector('.error-close').addEventListener('click', () => {
            this.hideToast(toast);
        });

        // Handle action buttons
        this.setupToastActions(toast, errorData);
    }

    showErrorModal(errorData) {
        const config = errorData.config;
        const overlay = document.createElement('div');
        overlay.className = 'error-overlay';
        overlay.id = `error-modal-${errorData.id}`;
        
        overlay.innerHTML = `
            <div class="error-modal">
                <div class="error-modal-icon">${config.icon}</div>
                <div class="error-modal-title">${config.title}</div>
                <div class="error-modal-message">${config.message}</div>
                <div class="error-modal-actions">
                    <button class="error-modal-action primary" data-action="primary">
                        ${config.action}
                    </button>
                    <button class="error-modal-action secondary" data-action="close">
                        Tutup
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Show modal
        requestAnimationFrame(() => {
            overlay.classList.add('show');
        });

        // Handle actions
        this.setupModalActions(overlay, errorData);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideErrorModal(overlay);
            }
        });
    }

    createErrorActions(errorData) {
        if (!errorData.context?.canRetry && !errorData.config?.action) {
            return '';
        }

        let actions = '<div class="error-actions">';
        
        if (errorData.context?.canRetry) {
            actions += '<button class="error-action primary" data-action="retry">Coba Lagi</button>';
        }
        
        if (errorData.config?.action && errorData.config.action !== 'Coba Lagi') {
            actions += `<button class="error-action" data-action="primary">${errorData.config.action}</button>`;
        }
        
        actions += '</div>';
        return actions;
    }

    setupToastActions(toast, errorData) {
        const actionButtons = toast.querySelectorAll('.error-action');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                this.handleErrorAction(action, errorData);
                this.hideToast(toast);
            });
        });
    }

    setupModalActions(modal, errorData) {
        const actionButtons = modal.querySelectorAll('.error-modal-action');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                
                if (action === 'close') {
                    this.hideErrorModal(modal);
                } else {
                    this.handleErrorAction(action, errorData);
                    this.hideErrorModal(modal);
                }
            });
        });
    }

    handleErrorAction(action, errorData) {
        switch (action) {
            case 'retry':
                this.retryOperation(errorData);
                break;
            case 'refresh':
                window.location.reload();
                break;
            case 'primary':
                this.handlePrimaryAction(errorData);
                break;
            default:
                console.log('Unhandled error action:', action);
        }
    }

    handlePrimaryAction(errorData) {
        switch (errorData.type) {
            case 'server':
                this.reportError(errorData);
                break;
            case 'notFound':
                window.history.back();
                break;
            case 'validation':
                // Focus first invalid field
                const invalidField = document.querySelector('[aria-invalid="true"], .error');
                if (invalidField) {
                    invalidField.focus();
                }
                break;
            default:
                window.location.reload();
        }
    }

    retryOperation(errorData) {
        if (errorData.context?.url) {
            // Retry the failed request
            this.retryAttempts.set(errorData.context.url, 0);
            window.location.reload();
        } else {
            // Generic retry
            window.location.reload();
        }
    }

    retryFailedRequests() {
        // Clear retry attempts and reload page to retry failed operations
        this.retryAttempts.clear();
        this.errorQueue = [];
    }

    hideToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    hideErrorModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    showOfflineBanner() {
        const banner = document.getElementById('offline-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }

    hideOfflineBanner() {
        const banner = document.getElementById('offline-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    }

    handleResourceError(element, errorInfo) {
        // Add error styling to failed elements
        element.classList.add('resource-error');
        
        // Provide fallback for images
        if (element.tagName === 'IMG') {
            element.alt = 'Gambar gagal dimuat';
            element.style.display = 'none';
            
            // Create placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.style.cssText = `
                width: ${element.width || 'auto'};
                height: ${element.height || 'auto'};
                background: #f3f4f6;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6b7280;
                font-size: 14px;
                border-radius: 4px;
            `;
            placeholder.textContent = '🖼️ Gambar tidak tersedia';
            
            element.parentNode?.insertBefore(placeholder, element.nextSibling);
        }

        // Track resource error
        this.trackError(errorInfo);
    }

    trackError(errorInfo) {
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'error_occurred', {
                error_type: errorInfo.type,
                error_message: errorInfo.message,
                error_url: errorInfo.url || window.location.href,
                error_filename: errorInfo.filename,
                error_lineno: errorInfo.lineno,
                retry_count: errorInfo.retryCount || 0
            });
        }

        // Log to console in development
        if (window.location.hostname === 'localhost') {
            console.error('Error tracked:', errorInfo);
        }
    }

    reportError(errorData) {
        // Send error report to server or external service
        const reportData = {
            error: errorData,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now(),
            userId: this.getUserId()
        };

        // This would typically send to your error reporting service
        console.log('Error report:', reportData);
        
        this.showToast('info', {
            title: 'Laporan Terkirim',
            message: 'Terima kasih telah melaporkan masalah ini.',
            icon: '✅'
        });
    }

    getUserId() {
        // Generate or retrieve user ID for error tracking
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    generateErrorId() {
        return 'error-' + Math.random().toString(36).substr(2, 9);
    }

    // Public API methods
    showSuccess(message, title = 'Berhasil') {
        this.showToast('success', {
            title: title,
            message: message,
            icon: '✅'
        });
    }

    showWarning(message, title = 'Peringatan') {
        this.showToast('warning', {
            title: title,
            message: message,
            icon: '⚠️'
        });
    }

    showInfo(message, title = 'Informasi') {
        this.showToast('info', {
            title: title,
            message: message,
            icon: 'ℹ️'
        });
    }

    // Validate form and show errors
    validateForm(form) {
        const errors = [];
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                errors.push(`${input.name || input.id} wajib diisi`);
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
            
            // Email validation
            if (input.type === 'email' && input.value && !this.isValidEmail(input.value)) {
                errors.push('Format email tidak valid');
                input.classList.add('error');
            }
        });
        
        if (errors.length > 0) {
            this.showError('validation', { errors: errors });
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Graceful degradation for features
    handleFeatureError(feature, fallback) {
        try {
            return feature();
        } catch (error) {
            console.warn('Feature failed, using fallback:', error);
            this.trackError({
                type: 'feature_degradation',
                message: error.message,
                feature: feature.name
            });
            return fallback ? fallback() : null;
        }
    }
}

// Initialize error handler
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.errorHandler = new ErrorHandler();
    });
} else {
    window.errorHandler = new ErrorHandler();
}

export default ErrorHandler;
