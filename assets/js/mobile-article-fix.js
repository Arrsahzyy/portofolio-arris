// Mobile Article Responsive Fix
// Script untuk memastikan semua elemen artikel mobile-friendly

class MobileArticleFix {
    constructor() {
        this.init();
    }

    init() {
        this.applyGlobalFixes();
        this.fixCodeBlocks();
        this.fixTables();
        this.fixImages();
        this.fixLongWords();
        this.addScrollIndicators();
        this.handleOrientationChange();
        this.observeViewportChanges();
    }

    applyGlobalFixes() {
        // Prevent horizontal scroll
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';

        // Add mobile-friendly viewport meta if not exists
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }

        // Force word wrapping on all text elements
        const textElements = document.querySelectorAll('p, div, span, li, td, th, blockquote, h1, h2, h3, h4, h5, h6');
        textElements.forEach(element => {
            element.style.wordWrap = 'break-word';
            element.style.overflowWrap = 'break-word';
            element.style.hyphens = 'auto';
            element.style.maxWidth = '100%';
        });
    }

    fixCodeBlocks() {
        // Fix pre and code elements
        const preElements = document.querySelectorAll('pre');
        preElements.forEach(pre => {
            pre.style.maxWidth = '100%';
            pre.style.overflowX = 'auto';
            pre.style.overflowY = 'hidden';
            pre.style.whiteSpace = 'pre';
            pre.style.fontSize = '0.875rem';
            pre.style.lineHeight = '1.5';
            pre.style.margin = '1rem 0';
            pre.style.padding = '1rem';
            pre.style.borderRadius = '0.5rem';
            pre.style.boxSizing = 'border-box';

            // Add scroll indicator if content overflows
            this.addScrollIndicator(pre);
        });

        // Fix inline code
        const codeElements = document.querySelectorAll('p code, li code, td code');
        codeElements.forEach(code => {
            code.style.whiteSpace = 'normal';
            code.style.wordBreak = 'break-all';
            code.style.overflowWrap = 'break-word';
            code.style.fontSize = '0.875rem';
            code.style.padding = '0.125rem 0.25rem';
        });
    }

    fixTables() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            // Create responsive wrapper
            if (!table.parentElement.classList.contains('table-responsive')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-responsive';
                wrapper.style.width = '100%';
                wrapper.style.overflowX = 'auto';
                wrapper.style.overflowY = 'hidden';
                wrapper.style.margin = '1rem 0';
                wrapper.style.borderRadius = '0.5rem';
                wrapper.style.border = '1px solid #e5e7eb';

                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }

            table.style.width = '100%';
            table.style.minWidth = '600px'; // Minimum width to maintain readability
            table.style.borderCollapse = 'collapse';

            // Fix table cells
            const cells = table.querySelectorAll('th, td');
            cells.forEach(cell => {
                cell.style.wordWrap = 'break-word';
                cell.style.overflowWrap = 'break-word';
                cell.style.maxWidth = '200px';
                cell.style.padding = '0.5rem';
                cell.style.border = '1px solid #e5e7eb';
                cell.style.verticalAlign = 'top';
            });

            // Add scroll indicator for tables
            this.addScrollIndicator(table.closest('.table-responsive'));
        });
    }

    fixImages() {
        const images = document.querySelectorAll('.article-content img');
        images.forEach(img => {
            img.style.width = '100%';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '0.5rem';
            img.style.margin = '1rem 0';
            img.style.display = 'block';

            // Ensure images don't cause horizontal scroll
            img.onload = () => {
                if (img.naturalWidth > img.parentElement.offsetWidth) {
                    img.style.width = '100%';
                }
            };
        });
    }

    fixLongWords() {
        // Find and fix extremely long words that might cause overflow
        const textNodes = this.getTextNodes(document.querySelector('.article-content'));
        
        textNodes.forEach(node => {
            const text = node.textContent;
            const words = text.split(' ');
            
            words.forEach((word, index) => {
                // If word is longer than 20 characters, add soft hyphens
                if (word.length > 20) {
                    const hyphenatedWord = this.addSoftHyphens(word);
                    words[index] = hyphenatedWord;
                }
            });
            
            node.textContent = words.join(' ');
        });
    }

    getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip script and style elements
                    const parent = node.parentElement;
                    if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Skip code elements to avoid breaking syntax
                    if (parent.tagName === 'CODE' || parent.tagName === 'PRE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        return textNodes;
    }

    addSoftHyphens(word) {
        // Add soft hyphens every 10 characters
        return word.replace(/(.{10})/g, '$1\u00AD');
    }

    addScrollIndicator(element) {
        if (!element) return;

        const checkScroll = () => {
            const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
            
            if (hasHorizontalScroll && !element.querySelector('.scroll-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'scroll-indicator';
                indicator.innerHTML = '← Geser untuk melihat lebih →';
                indicator.style.cssText = `
                    position: absolute;
                    bottom: 5px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    z-index: 10;
                    pointer-events: none;
                    opacity: 0.8;
                `;
                
                // Make parent relative if not already
                if (getComputedStyle(element).position === 'static') {
                    element.style.position = 'relative';
                }
                
                element.appendChild(indicator);

                // Hide indicator after scroll
                element.addEventListener('scroll', () => {
                    indicator.style.opacity = '0.3';
                    clearTimeout(element.scrollTimeout);
                    element.scrollTimeout = setTimeout(() => {
                        indicator.style.opacity = '0.8';
                    }, 1000);
                });
            }
        };

        // Check on load and resize
        checkScroll();
        window.addEventListener('resize', checkScroll);
    }

    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // Re-apply fixes after orientation change
            setTimeout(() => {
                this.init();
            }, 100);
        });
    }

    observeViewportChanges() {
        // Use ResizeObserver to monitor viewport changes
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                this.checkAndFixOverflow();
            });

            resizeObserver.observe(document.body);
        }

        // Fallback for browsers without ResizeObserver
        window.addEventListener('resize', () => {
            this.checkAndFixOverflow();
        });
    }

    checkAndFixOverflow() {
        // Check if any element is causing horizontal overflow
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;

        const allElements = articleContent.querySelectorAll('*');
        
        allElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            
            // If element extends beyond viewport
            if (rect.right > viewportWidth) {
                element.style.maxWidth = '100%';
                element.style.width = '100%';
                element.style.boxSizing = 'border-box';
                
                // Special handling for different element types
                if (element.tagName === 'PRE') {
                    element.style.overflowX = 'auto';
                } else if (element.tagName === 'TABLE') {
                    if (!element.closest('.table-responsive')) {
                        this.wrapInResponsiveContainer(element);
                    }
                } else {
                    element.style.overflowWrap = 'break-word';
                    element.style.wordWrap = 'break-word';
                }
            }
        });
    }

    wrapInResponsiveContainer(element) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        wrapper.style.cssText = `
            width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            margin: 1rem 0;
            border-radius: 0.5rem;
            border: 1px solid #e5e7eb;
        `;

        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
    }

    // Debug helper - can be removed in production
    debugOverflow() {
        const problematicElements = [];
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            
            if (rect.right > viewportWidth) {
                problematicElements.push({
                    element: element,
                    tag: element.tagName,
                    right: rect.right,
                    viewportWidth: viewportWidth,
                    overflow: rect.right - viewportWidth
                });
            }
        });

        if (problematicElements.length > 0) {
            console.log('Elements causing horizontal overflow:', problematicElements);
        }

        return problematicElements;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const mobileArticleFix = new MobileArticleFix();
    
    // Make available globally for debugging
    window.mobileArticleFix = mobileArticleFix;
});

// Also initialize if script loads after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const mobileArticleFix = new MobileArticleFix();
        window.mobileArticleFix = mobileArticleFix;
    });
} else {
    const mobileArticleFix = new MobileArticleFix();
    window.mobileArticleFix = mobileArticleFix;
}
