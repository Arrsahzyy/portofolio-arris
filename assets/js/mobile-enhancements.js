/**
 * Mobile Experience Enhancements
 * Optimizes touch interactions, loading states, and error handling
 * Maintains original design while improving mobile UX
 */

class MobileEnhancements {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStart = { x: 0, y: 0, time: 0 };
        this.touchEnd = { x: 0, y: 0, time: 0 };
        this.isLoading = false;
        
        if (this.isMobile) {
            this.init();
        }
    }

    init() {
        this.optimizeTouchInteractions();
        this.improveLoadingStates();
        this.setupErrorHandling();
        this.enhanceScrolling();
        this.optimizeButtons();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && 'ontouchstart' in window);
    }

    optimizeTouchInteractions() {
        // Improve touch feedback for all interactive elements
        const interactiveElements = document.querySelectorAll(
            'button, .btn-primary, .btn-secondary, .nav-link, .social-icon, .project-card, .skill-card, .tech-tag'
        );

        interactiveElements.forEach(element => {
            this.addTouchFeedback(element);
        });

        // Add swipe gestures for navigation
        this.addSwipeNavigation();
        
        // Improve drag interactions
        this.optimizeDragInteractions();
    }

    addTouchFeedback(element) {
        let touchTimeout;
        let rippleEffect;

        // Touch start handler
        element.addEventListener('touchstart', (e) => {
            this.touchStart = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                time: Date.now()
            };

            // Add immediate visual feedback
            element.classList.add('touch-active');
            
            // Create ripple effect for buttons
            if (element.matches('button, .btn-primary, .btn-secondary')) {
                this.createRippleEffect(element, e.touches[0]);
            }

            // Long press detection
            touchTimeout = setTimeout(() => {
                this.handleLongPress(element, e);
            }, 500);
        }, { passive: true });

        // Touch move handler
        element.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - this.touchStart.x);
            const deltaY = Math.abs(touch.clientY - this.touchStart.y);

            // Cancel touch if moved too much
            if (deltaX > 10 || deltaY > 10) {
                clearTimeout(touchTimeout);
                element.classList.remove('touch-active');
            }
        }, { passive: true });

        // Touch end handler
        element.addEventListener('touchend', (e) => {
            clearTimeout(touchTimeout);
            
            this.touchEnd = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
                time: Date.now()
            };

            // Remove touch feedback after delay
            setTimeout(() => {
                element.classList.remove('touch-active');
            }, 150);

            // Handle tap gesture
            this.handleTap(element, e);
        }, { passive: true });

        // Touch cancel handler
        element.addEventListener('touchcancel', () => {
            clearTimeout(touchTimeout);
            element.classList.remove('touch-active');
        }, { passive: true });
    }

    createRippleEffect(element, touch) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = touch.clientX - rect.left - size / 2;
        const y = touch.clientY - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.classList.add('touch-ripple');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            pointer-events: none;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            z-index: 1000;
        `;

        // Ensure element has relative positioning
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        element.style.overflow = 'hidden';

        element.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    handleTap(element, event) {
        const tapDuration = this.touchEnd.time - this.touchStart.time;
        const deltaX = Math.abs(this.touchEnd.x - this.touchStart.x);
        const deltaY = Math.abs(this.touchEnd.y - this.touchStart.y);

        // Valid tap: short duration and minimal movement
        if (tapDuration < 500 && deltaX < 10 && deltaY < 10) {
            // Add haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }

            // Track tap in analytics
            this.trackMobileInteraction('tap', {
                element: element.className,
                duration: tapDuration
            });
        }
    }

    handleLongPress(element, event) {
        // Add haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([20, 10, 20]);
        }

        // Show contextual options for certain elements
        if (element.matches('.project-card, .skill-card')) {
            this.showContextMenu(element, event);
        }

        // Track long press
        this.trackMobileInteraction('long_press', {
            element: element.className
        });
    }

    showContextMenu(element, event) {
        // Create context menu
        const contextMenu = document.createElement('div');
        contextMenu.className = 'mobile-context-menu';
        contextMenu.innerHTML = `
            <div class="context-menu-content">
                <button class="context-option" data-action="share">Share</button>
                <button class="context-option" data-action="bookmark">Bookmark</button>
                <button class="context-option" data-action="info">More Info</button>
            </div>
        `;

        // Position context menu
        const rect = element.getBoundingClientRect();
        contextMenu.style.cssText = `
            position: fixed;
            top: ${rect.top - 10}px;
            left: ${rect.left + rect.width / 2}px;
            transform: translateX(-50%);
            z-index: 10000;
            background: white;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            padding: 8px 0;
            min-width: 120px;
            animation: contextMenuShow 0.2s ease-out;
        `;

        document.body.appendChild(contextMenu);

        // Handle context menu actions
        contextMenu.addEventListener('click', (e) => {
            if (e.target.matches('.context-option')) {
                const action = e.target.dataset.action;
                this.handleContextAction(action, element);
                this.hideContextMenu(contextMenu);
            }
        });

        // Hide on outside click
        setTimeout(() => {
            document.addEventListener('click', () => {
                this.hideContextMenu(contextMenu);
            }, { once: true });
        }, 100);
    }

    hideContextMenu(contextMenu) {
        contextMenu.style.animation = 'contextMenuHide 0.2s ease-in forwards';
        setTimeout(() => {
            if (contextMenu.parentNode) {
                contextMenu.parentNode.removeChild(contextMenu);
            }
        }, 200);
    }

    addSwipeNavigation() {
        let startX = 0;
        let startY = 0;
        let isNavigating = false;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isNavigating = false;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (isNavigating) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;

            // Horizontal swipe with minimal vertical movement
            if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 30) {
                isNavigating = true;
                
                if (deltaX > 0) {
                    // Swipe right - go to previous section
                    this.navigateToSection('previous');
                } else {
                    // Swipe left - go to next section
                    this.navigateToSection('next');
                }
            }
        }, { passive: true });
    }

    navigateToSection(direction) {
        const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'blog', 'download', 'contact'];
        const currentSection = this.getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);
        
        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % sections.length;
        } else {
            nextIndex = (currentIndex - 1 + sections.length) % sections.length;
        }

        const targetSection = sections[nextIndex];
        const targetElement = document.getElementById(targetSection);
        
        if (targetElement) {
            // Add haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(15);
            }

            // Smooth scroll to section
            targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });

            // Track navigation
            this.trackMobileInteraction('swipe_navigation', {
                from: currentSection,
                to: targetSection,
                direction: direction
            });
        }
    }

    getCurrentSection() {
        const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'blog', 'download', 'contact'];
        let currentSection = 'hero';
        
        for (const sectionId of sections) {
            const element = document.getElementById(sectionId);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2) {
                    currentSection = sectionId;
                }
            }
        }
        
        return currentSection;
    }

    optimizeDragInteractions() {
        // Prevent accidental drags on touch devices
        const draggableElements = document.querySelectorAll('img, .project-card img');
        
        draggableElements.forEach(element => {
            element.addEventListener('dragstart', (e) => {
                if (this.isMobile) {
                    e.preventDefault();
                }
            });
        });
    }

    enhanceScrolling() {
        // Add momentum scrolling for iOS
        document.documentElement.style.webkitOverflowScrolling = 'touch';
        
        // Improve scroll performance
        let isScrolling = false;
        
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(() => {
                    this.handleScroll();
                    isScrolling = false;
                });
            }
        }, { passive: true });
    }

    handleScroll() {
        // Update navigation state based on scroll position
        const scrollY = window.pageYOffset;
        const navbar = document.getElementById('navbar');
        
        if (navbar) {
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    optimizeButtons() {
        // Increase touch target size for small buttons
        const smallButtons = document.querySelectorAll('button, .btn-primary, .btn-secondary');
        
        smallButtons.forEach(button => {
            const rect = button.getBoundingClientRect();
            
            // Ensure minimum 44px touch target
            if (rect.width < 44 || rect.height < 44) {
                button.style.minWidth = '44px';
                button.style.minHeight = '44px';
                button.style.display = 'inline-flex';
                button.style.alignItems = 'center';
                button.style.justifyContent = 'center';
            }
        });
    }

    trackMobileInteraction(action, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'mobile_interaction', {
                action: action,
                device_type: 'mobile',
                ...data
            });
        }
    }
}

// Initialize mobile enhancements when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileEnhancements = new MobileEnhancements();
    });
} else {
    window.mobileEnhancements = new MobileEnhancements();
}

export default MobileEnhancements;
