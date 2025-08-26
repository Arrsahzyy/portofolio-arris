# Accessibility Enhancement Plan

## 1. ARIA Labels and Semantic HTML

### Current Issues & Solutions
```html
<!-- Current: Missing ARIA labels -->
<button id="theme-toggle" class="p-2 rounded-full">
    <svg>...</svg>
</button>

<!-- Enhanced: With proper ARIA -->
<button id="theme-toggle" 
        class="p-2 rounded-full"
        aria-label="Toggle dark mode"
        aria-pressed="false"
        role="switch">
    <svg aria-hidden="true">...</svg>
</button>

<!-- Current: Social links without descriptions -->
<a href="https://linkedin.com/in/arrisahmadfadillah" target="_blank">
    <img src="linkedin.png" alt="LinkedIn">
</a>

<!-- Enhanced: With descriptive labels -->
<a href="https://linkedin.com/in/arrisahmadfadillah" 
   target="_blank"
   aria-label="Visit Arris Ahmad Fadillah's LinkedIn profile (opens in new tab)">
    <img src="linkedin.png" alt="LinkedIn logo">
</a>
```

## 2. Keyboard Navigation

### Focus Management
```css
/* Enhanced focus styles */
.btn-primary:focus,
.btn-secondary:focus,
.nav-link:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.1);
}

/* Skip link for keyboard users */
.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--color-primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
}

.skip-link:focus {
    top: 6px;
}
```

### Keyboard Event Handlers
```javascript
// Enhanced keyboard navigation
class KeyboardNavigation {
    constructor() {
        this.initSkipLinks();
        this.initModalKeyboard();
        this.initMenuKeyboard();
    }
    
    initSkipLinks() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    initModalKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('[data-modal-open]');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    }
    
    initMenuKeyboard() {
        const menuItems = document.querySelectorAll('.nav-link');
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % menuItems.length;
                    menuItems[nextIndex].focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + menuItems.length) % menuItems.length;
                    menuItems[prevIndex].focus();
                }
            });
        });
    }
}
```

## 3. Color Contrast & Typography

### WCAG AA Compliance
```css
/* Ensure minimum contrast ratios */
:root {
    /* Light mode - WCAG AA compliant colors */
    --text-primary: #1f2937;      /* Contrast: 14.8:1 */
    --text-secondary: #4b5563;    /* Contrast: 7.0:1 */
    --text-muted: #6b7280;        /* Contrast: 4.5:1 */
    
    /* Dark mode - WCAG AA compliant colors */
    --dark-text-primary: #f9fafb;    /* Contrast: 17.5:1 */
    --dark-text-secondary: #e5e7eb;  /* Contrast: 12.6:1 */
    --dark-text-muted: #d1d5db;      /* Contrast: 8.2:1 */
}

/* Font sizes for better readability */
.body-text {
    font-size: 1rem;        /* 16px minimum */
    line-height: 1.6;       /* Optimal readability */
    letter-spacing: 0.01em;
}

.small-text {
    font-size: 0.875rem;    /* 14px minimum for small text */
    line-height: 1.5;
}

/* Interactive elements minimum size */
.clickable {
    min-height: 44px;       /* WCAG minimum touch target */
    min-width: 44px;
}
```

## 4. Screen Reader Support

### Enhanced HTML Structure
```html
<!-- Main landmark -->
<main id="main-content" role="main" aria-label="Portfolio content">
    <!-- Hero section -->
    <section id="hero" 
             role="banner" 
             aria-labelledby="hero-title">
        <h1 id="hero-title">Halo, saya Arris Ahmad Fadillah</h1>
        <p aria-describedby="hero-title">Mahasiswa Teknik Elektro & ...</p>
    </section>
    
    <!-- Navigation -->
    <nav role="navigation" 
         aria-label="Main navigation"
         aria-describedby="nav-description">
        <span id="nav-description" class="sr-only">
            Navigate to different sections of the portfolio
        </span>
        <ul role="menubar">
            <li role="none">
                <a href="#about" 
                   role="menuitem" 
                   aria-current="page">About</a>
            </li>
        </ul>
    </nav>
</main>

<!-- Screen reader only content -->
<style>
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>
```

### Dynamic Content Announcements
```javascript
// Live region for dynamic content updates
class ScreenReaderAnnouncements {
    constructor() {
        this.createLiveRegion();
    }
    
    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }
    
    announce(message, priority = 'polite') {
        const liveRegion = document.getElementById('live-region');
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Usage examples
const announcer = new ScreenReaderAnnouncements();

// When theme changes
announcer.announce('Dark mode enabled');

// When section loads
announcer.announce('Projects section loaded');

// When form submits
announcer.announce('Email copied to clipboard');
```

## 5. Mobile Accessibility

### Touch Target Optimization
```css
/* Ensure proper touch targets on mobile */
@media (max-width: 768px) {
    .touch-target {
        min-height: 48px;
        min-width: 48px;
        padding: 12px;
    }
    
    /* Increase spacing between interactive elements */
    .nav-link + .nav-link {
        margin-top: 8px;
    }
    
    /* Ensure proper focus indicators on touch devices */
    button:focus-visible,
    a:focus-visible {
        outline: 3px solid var(--color-accent);
        outline-offset: 2px;
    }
}
```

### Voice Control Support
```html
<!-- Voice control friendly attributes -->
<button data-voice-command="toggle menu" 
        aria-label="Toggle navigation menu">
    Menu
</button>

<button data-voice-command="toggle theme" 
        aria-label="Switch between light and dark theme">
    Theme
</button>
```

## 6. Accessibility Testing Checklist

### Automated Testing
```javascript
// Integration with axe-core for accessibility testing
import axe from 'axe-core';

async function runAccessibilityTests() {
    try {
        const results = await axe.run();
        console.log('Accessibility Results:', results);
        
        if (results.violations.length > 0) {
            console.error('Accessibility violations found:', results.violations);
        }
    } catch (error) {
        console.error('Accessibility testing failed:', error);
    }
}

// Run tests after page load
window.addEventListener('load', runAccessibilityTests);
```

### Manual Testing Guidelines
```markdown
## Manual Accessibility Testing Checklist

### Keyboard Navigation
- [ ] Can navigate entire site using only keyboard
- [ ] Tab order is logical and predictable
- [ ] All interactive elements are focusable
- [ ] Focus indicators are clearly visible
- [ ] Escape key closes modals/menus

### Screen Reader Testing
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] All content is announced properly
- [ ] Navigation landmarks work correctly
- [ ] Form labels are associated properly
- [ ] Dynamic content changes are announced

### Visual Testing
- [ ] Text contrast meets WCAG AA standards (4.5:1)
- [ ] Site works at 200% zoom level
- [ ] No content is lost when zoomed
- [ ] Color is not the only means of conveying information

### Motor Accessibility
- [ ] All touch targets are minimum 44px
- [ ] Hover effects have keyboard equivalents
- [ ] No content requires precise pointer movements
```
