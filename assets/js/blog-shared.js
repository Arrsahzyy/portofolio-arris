/**
 * Shared JavaScript functionality for blog system
 * Optimized for performance and maintainability
 */

class BlogManager {
    constructor() {
        this.config = {
            baseUrl: window.location.origin,
            articlesPath: '/articles/',
            assetsPath: '/assets/',
            maxRelatedArticles: 3,
            enableAnalytics: true,
            enableLazyLoading: true
        };
        this.cache = new Map();
        this.init();
    }

    init() {
        this.initializeTheme();
        this.initializeNavigation();
        this.initializeAnalytics();
        this.initializeLazyLoading();
        this.initializeSharedComponents();
    }

    // Theme Management
    initializeTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const darkIcon = document.getElementById('theme-toggle-dark-icon');
        const lightIcon = document.getElementById('theme-toggle-light-icon');

        if (!themeToggle) return;

        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        const darkIcon = document.getElementById('theme-toggle-dark-icon');
        const lightIcon = document.getElementById('theme-toggle-light-icon');

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            if (darkIcon) darkIcon.classList.add('hidden');
            if (lightIcon) lightIcon.classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            if (darkIcon) darkIcon.classList.remove('hidden');
            if (lightIcon) lightIcon.classList.add('hidden');
        }
        
        localStorage.setItem('theme', theme);
    }

    // Navigation Management
    initializeNavigation() {
        // Mobile menu with enhanced accessibility
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuOpenIcon = document.getElementById('menu-open-icon');
        const menuCloseIcon = document.getElementById('menu-close-icon');

        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                const isOpen = !mobileMenu.classList.contains('hidden');
                
                if (isOpen) {
                    mobileMenu.classList.add('hidden');
                    menuBtn.setAttribute('aria-expanded', 'false');
                    if (menuOpenIcon) menuOpenIcon.classList.remove('hidden');
                    if (menuCloseIcon) menuCloseIcon.classList.add('hidden');
                } else {
                    mobileMenu.classList.remove('hidden');
                    menuBtn.setAttribute('aria-expanded', 'true');
                    if (menuOpenIcon) menuOpenIcon.classList.add('hidden');
                    if (menuCloseIcon) menuCloseIcon.classList.remove('hidden');
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                    menuBtn.setAttribute('aria-expanded', 'false');
                    if (menuOpenIcon) menuOpenIcon.classList.remove('hidden');
                    if (menuCloseIcon) menuCloseIcon.classList.add('hidden');
                }
            });

            // Close mobile menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    menuBtn.setAttribute('aria-expanded', 'false');
                    menuBtn.focus();
                    if (menuOpenIcon) menuOpenIcon.classList.remove('hidden');
                    if (menuCloseIcon) menuCloseIcon.classList.add('hidden');
                }
            });

            // Close mobile menu when navigating to a page
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    menuBtn.setAttribute('aria-expanded', 'false');
                    if (menuOpenIcon) menuOpenIcon.classList.remove('hidden');
                    if (menuCloseIcon) menuCloseIcon.classList.add('hidden');
                });
            });
        }

        // Back to top with better mobile experience
        this.initializeBackToTop();

        // Smooth scrolling for table of contents with offset for mobile
        this.initializeSmoothScrolling();
    }

    initializeBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        if (!backToTop) return;

        let ticking = false;
        let isVisible = false;
        
        const updateButton = () => {
            const scrolled = window.pageYOffset > 300;
            
            if (scrolled && !isVisible) {
                backToTop.style.display = 'block';
                // Force reflow then add opacity
                backToTop.offsetHeight;
                backToTop.style.opacity = '1';
                backToTop.style.transform = 'translateY(0)';
                isVisible = true;
            } else if (!scrolled && isVisible) {
                backToTop.style.opacity = '0';
                backToTop.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    if (!isVisible) backToTop.style.display = 'none';
                }, 300);
                isVisible = false;
            }
            ticking = false;
        };

        // Use passive scroll listener for better performance
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateButton);
                ticking = true;
            }
        }, { passive: true });

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
            
            // Track analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll_to_top', {
                    page_title: document.title
                });
            }
        });

        // Add initial styles for smooth transition
        backToTop.style.opacity = '0';
        backToTop.style.transform = 'translateY(10px)';
        backToTop.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }

    initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    // Calculate offset based on viewport height for mobile
                    const isMobile = window.innerWidth < 768;
                    const offset = isMobile ? 80 : 100; // Adjust for mobile navigation
                    
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash after smooth scroll completes
                    setTimeout(() => {
                        history.pushState(null, null, anchor.getAttribute('href'));
                    }, 500);
                    
                    // Track ToC navigation
                    if (typeof gtag !== 'undefined' && anchor.closest('.toc-container')) {
                        gtag('event', 'toc_navigation', {
                            target_section: anchor.getAttribute('href').replace('#', ''),
                            page_title: document.title
                        });
                    }
                }
            });
        });

        // Handle direct hash navigation on page load
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    const isMobile = window.innerWidth < 768;
                    const offset = isMobile ? 80 : 100;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }

    // Analytics
    initializeAnalytics() {
        if (!this.config.enableAnalytics || typeof gtag === 'undefined') return;

        // Track page view
        gtag('config', 'G-Q136JZELGC', {
            page_title: document.title,
            page_location: window.location.href
        });

        // Track reading progress
        this.trackReadingProgress();
    }

    trackReadingProgress() {
        const article = document.querySelector('.article-content');
        if (!article) return;

        let hasTracked25 = false, hasTracked50 = false, hasTracked75 = false, hasTracked100 = false;

        const trackProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);

            if (scrollPercent >= 25 && !hasTracked25) {
                gtag('event', 'scroll', { percent_scrolled: 25 });
                hasTracked25 = true;
            } else if (scrollPercent >= 50 && !hasTracked50) {
                gtag('event', 'scroll', { percent_scrolled: 50 });
                hasTracked50 = true;
            } else if (scrollPercent >= 75 && !hasTracked75) {
                gtag('event', 'scroll', { percent_scrolled: 75 });
                hasTracked75 = true;
            } else if (scrollPercent >= 100 && !hasTracked100) {
                gtag('event', 'scroll', { percent_scrolled: 100 });
                hasTracked100 = true;
            }
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(trackProgress);
                ticking = true;
            }
        });
    }

    // Lazy Loading
    initializeLazyLoading() {
        if (!this.config.enableLazyLoading || !('IntersectionObserver' in window)) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Shared Components
    initializeSharedComponents() {
        this.initializeShareButtons();
        this.initializeCopyToClipboard();
        this.updateCurrentYear();
    }

    initializeShareButtons() {
        const shareButtons = document.querySelectorAll('[data-share]');
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = button.dataset.share;
                this.shareArticle(platform);
            });
        });
    }

    shareArticle(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            whatsapp: `https://wa.me/?text=${title} ${url}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            
            // Track share event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    method: platform,
                    content_type: 'article',
                    item_id: window.location.pathname
                });
            }
        }
    }

    initializeCopyToClipboard() {
        window.copyToClipboard = () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            }).catch(() => {
                this.showNotification('Failed to copy link', 'error');
            });
        };
    }

    updateCurrentYear() {
        document.querySelectorAll('#current-year, .current-year').forEach(element => {
            element.textContent = new Date().getFullYear();
        });
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('opacity-0', 'translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Performance Utilities
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Search Functionality
class BlogSearch {
    constructor() {
        this.searchIndex = null;
        this.articles = [];
        this.init();
    }

    async init() {
        await this.loadSearchIndex();
        this.initializeSearchUI();
    }

    async loadSearchIndex() {
        try {
            const response = await fetch('/assets/data/search-index.json');
            this.searchIndex = await response.json();
            this.articles = this.searchIndex.articles || [];
        } catch (error) {
            console.warn('Search index not found, search functionality disabled');
        }
    }

    initializeSearchUI() {
        const searchInput = document.getElementById('blog-search');
        const searchResults = document.getElementById('search-results');
        
        if (!searchInput) return;

        const debouncedSearch = this.debounce((query) => {
            this.performSearch(query, searchResults);
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }

    performSearch(query, resultsContainer) {
        if (!query.trim() || !this.articles.length) {
            if (resultsContainer) resultsContainer.innerHTML = '';
            return;
        }

        const results = this.articles.filter(article => 
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        this.displaySearchResults(results, resultsContainer);
    }

    displaySearchResults(results, container) {
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = '<p class="text-gray-500">No articles found</p>';
            return;
        }

        const resultsHTML = results.map(article => `
            <a href="${article.url}" class="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 class="font-semibold text-lg mb-2">${article.title}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">${article.excerpt}</p>
                <div class="flex flex-wrap gap-2">
                    ${article.tags.map(tag => `<span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">${tag}</span>`).join('')}
                </div>
            </a>
        `).join('');

        container.innerHTML = resultsHTML;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    // Initialize blog manager
    window.blogManager = new BlogManager();
    window.blogSearch = new BlogSearch();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlogManager, BlogSearch };
}
