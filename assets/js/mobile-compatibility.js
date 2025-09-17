/**
 * Mobile Compatibility Layer
 * Ensures compatibility across various mobile devices and browsers
 */

class MobileCompatibility {
    constructor() {
        this.init();
    }

    init() {
        this.detectMobileFeatures();
        this.addCompatibilityStyles();
        this.handleViewportIssues();
        this.optimizeScrolling();
        this.handleOrientationChanges();
    }

    detectMobileFeatures() {
        const features = {
            touch: 'ontouchstart' in window,
            vibration: 'vibrate' in navigator,
            deviceMotion: 'DeviceMotionEvent' in window,
            orientation: 'orientation' in window,
            webgl: this.hasWebGL(),
            webp: this.supportsWebP(),
            serviceWorker: 'serviceWorker' in navigator
        };

        // Add feature classes to document
        Object.keys(features).forEach(feature => {
            if (features[feature]) {
                document.documentElement.classList.add(`supports-${feature}`);
            } else {
                document.documentElement.classList.add(`no-${feature}`);
            }
        });

        return features;
    }

    hasWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('webp') !== -1;
    }

    addCompatibilityStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* iOS Safari specific fixes */
            @supports (-webkit-touch-callout: none) {
                .mobile-enhanced {
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -webkit-tap-highlight-color: transparent;
                }
            }

            /* Android specific fixes */
            @media screen and (-webkit-min-device-pixel-ratio: 0) {
                .mobile-enhanced input[type="text"],
                .mobile-enhanced input[type="email"],
                .mobile-enhanced textarea {
                    font-size: 16px; /* Prevent zoom on focus */
                }
            }

            /* Safe area adjustments for devices with notches */
            @supports (padding: max(0px)) {
                .mobile-safe-area {
                    padding-left: max(1rem, env(safe-area-inset-left));
                    padding-right: max(1rem, env(safe-area-inset-right));
                    padding-top: max(1rem, env(safe-area-inset-top));
                    padding-bottom: max(1rem, env(safe-area-inset-bottom));
                }
            }

            /* Fallback for older browsers */
            .no-supports-webp img[src$=".webp"] {
                content: url(attr(data-fallback));
            }
        `;
        document.head.appendChild(style);
    }

    handleViewportIssues() {
        // Fix for iOS viewport height issues
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);

        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Handle iOS body scroll lock
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            this.handleIOSScrollLock();
        }
    }

    handleIOSScrollLock() {
        let scrollPosition = 0;

        window.addEventListener('scroll-lock', () => {
            scrollPosition = window.pageYOffset;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
        });

        window.addEventListener('scroll-unlock', () => {
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('position');
            document.body.style.removeProperty('top');
            document.body.style.removeProperty('width');
            window.scrollTo(0, scrollPosition);
        });
    }

    optimizeScrolling() {
        // Improve scroll performance
        const scrollElements = document.querySelectorAll('.scroll-smooth');
        scrollElements.forEach(element => {
            element.style.willChange = 'scroll-position';
            element.style.webkitOverflowScrolling = 'touch';
        });

        // Add momentum scrolling for iOS
        document.body.style.webkitOverflowScrolling = 'touch';
    }

    handleOrientationChanges() {
        const handleOrientationChange = () => {
            // Delay to ensure viewport has updated
            setTimeout(() => {
                // Force reflow to handle orientation issues
                document.body.style.height = 'auto';
                
                // Dispatch custom event for other components
                window.dispatchEvent(new CustomEvent('orientation-changed', {
                    detail: {
                        orientation: screen.orientation?.angle || window.orientation || 0,
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                }));
            }, 100);
        };

        // Listen for orientation changes
        if (screen.orientation) {
            screen.orientation.addEventListener('change', handleOrientationChange);
        } else {
            window.addEventListener('orientationchange', handleOrientationChange);
        }
    }

    // Public API for other components
    static getInstance() {
        if (!MobileCompatibility.instance) {
            MobileCompatibility.instance = new MobileCompatibility();
        }
        return MobileCompatibility.instance;
    }

    static isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    static isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

    static isMobile() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    static getDevicePixelRatio() {
        return window.devicePixelRatio || 1;
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        MobileCompatibility.getInstance();
    });
} else {
    MobileCompatibility.getInstance();
}

// Export for use in other modules
window.MobileCompatibility = MobileCompatibility;
