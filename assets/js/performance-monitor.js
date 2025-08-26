/**
 * Performance Monitor for Blog System
 * Tracks Core Web Vitals and user experience metrics
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Track page load performance
        this.trackPageLoad();
        
        // Track Core Web Vitals
        this.trackCoreWebVitals();
        
        // Track mobile-specific metrics
        this.trackMobileMetrics();
        
        // Track interaction metrics
        this.trackInteractions();
    }

    trackPageLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                
                if (navigation) {
                    this.metrics.pageLoad = {
                        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                        totalTime: navigation.loadEventEnd - navigation.navigationStart,
                        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                        tcpConnect: navigation.connectEnd - navigation.connectStart,
                        serverResponse: navigation.responseEnd - navigation.requestStart
                    };
                    
                    this.reportMetrics('page_load', this.metrics.pageLoad);
                }
            }, 1000);
        });
    }

    trackCoreWebVitals() {
        // First Contentful Paint (FCP)
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.fcp = entry.startTime;
                    this.reportMetrics('fcp', entry.startTime);
                }
            }
        });
        observer.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            this.reportMetrics('lcp', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.metrics.fid = entry.processingStart - entry.startTime;
                this.reportMetrics('fid', this.metrics.fid);
            }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Report CLS on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.reportMetrics('cls', this.metrics.cls);
            }
        });
    }

    trackMobileMetrics() {
        if (this.isMobile()) {
            // Track viewport changes (orientation, keyboard)
            let viewportHeight = window.innerHeight;
            
            window.addEventListener('resize', () => {
                const newHeight = window.innerHeight;
                const heightDiff = Math.abs(newHeight - viewportHeight);
                
                // Detect virtual keyboard
                if (heightDiff > 150) {
                    this.reportMetrics('mobile_interaction', {
                        type: 'virtual_keyboard',
                        action: newHeight < viewportHeight ? 'opened' : 'closed',
                        heightChange: heightDiff
                    });
                }
                
                viewportHeight = newHeight;
            });

            // Track orientation changes
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.reportMetrics('mobile_interaction', {
                        type: 'orientation_change',
                        orientation: screen.orientation ? screen.orientation.angle : window.orientation,
                        viewport: `${window.innerWidth}x${window.innerHeight}`
                    });
                }, 500);
            });

            // Track touch interactions
            let touchStartTime;
            document.addEventListener('touchstart', () => {
                touchStartTime = performance.now();
            });

            document.addEventListener('touchend', () => {
                if (touchStartTime) {
                    const touchDuration = performance.now() - touchStartTime;
                    if (touchDuration > 100) { // Long press
                        this.reportMetrics('mobile_interaction', {
                            type: 'long_press',
                            duration: touchDuration
                        });
                    }
                }
            });
        }
    }

    trackInteractions() {
        // Track menu interactions
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-mobile-menu-toggle], .toc-item, .share-btn');
            if (target) {
                this.reportMetrics('user_interaction', {
                    type: 'click',
                    element: target.className,
                    page: window.location.pathname,
                    timestamp: Date.now()
                });
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        let lastReportedDepth = 0;
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            maxScroll = Math.max(maxScroll, scrollPercent);
            
            // Report at 25%, 50%, 75%, 100% thresholds
            const thresholds = [25, 50, 75, 100];
            const nextThreshold = thresholds.find(t => t > lastReportedDepth && maxScroll >= t);
            
            if (nextThreshold) {
                lastReportedDepth = nextThreshold;
                this.reportMetrics('scroll_depth', {
                    depth: nextThreshold,
                    page: window.location.pathname
                });
            }
        }, 1000));

        // Track time on page
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            this.reportMetrics('time_on_page', {
                duration: timeOnPage,
                page: window.location.pathname,
                maxScroll: maxScroll
            });
        });
    }

    reportMetrics(eventName, data) {
        // Report to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                custom_parameter: JSON.stringify(data),
                page_title: document.title,
                page_location: window.location.href
            });
        }

        // Log to console in development
        if (this.isDevelopment()) {
            console.log(`Performance Metric - ${eventName}:`, data);
        }

        // Store for potential API reporting
        this.metrics[eventName] = data;
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('dev');
    }

    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    // Public method to get all metrics
    getMetrics() {
        return { ...this.metrics };
    }

    // Public method to get performance score
    getPerformanceScore() {
        const scores = {};
        
        // FCP scoring (Good: <1.8s, Needs Improvement: 1.8s-3s, Poor: >3s)
        if (this.metrics.fcp) {
            scores.fcp = this.metrics.fcp < 1800 ? 'good' : this.metrics.fcp < 3000 ? 'needs-improvement' : 'poor';
        }
        
        // LCP scoring (Good: <2.5s, Needs Improvement: 2.5s-4s, Poor: >4s)
        if (this.metrics.lcp) {
            scores.lcp = this.metrics.lcp < 2500 ? 'good' : this.metrics.lcp < 4000 ? 'needs-improvement' : 'poor';
        }
        
        // FID scoring (Good: <100ms, Needs Improvement: 100ms-300ms, Poor: >300ms)
        if (this.metrics.fid) {
            scores.fid = this.metrics.fid < 100 ? 'good' : this.metrics.fid < 300 ? 'needs-improvement' : 'poor';
        }
        
        // CLS scoring (Good: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25)
        if (this.metrics.cls !== undefined) {
            scores.cls = this.metrics.cls < 0.1 ? 'good' : this.metrics.cls < 0.25 ? 'needs-improvement' : 'poor';
        }
        
        return scores;
    }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
    window.performanceMonitor = new PerformanceMonitor();
}

export default PerformanceMonitor;
