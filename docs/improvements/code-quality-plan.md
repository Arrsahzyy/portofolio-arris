# Code Quality Improvement Plan

## 1. JavaScript Refactoring

### Split Large Functions
```javascript
// Current: script.js contains 1243 lines
// Proposal: Split into modules

// modules/animations.js
export class AnimationManager {
    constructor() {
        this.initAOS();
        this.initGSAP();
        this.initTyped();
    }
}

// modules/navigation.js
export class NavigationManager {
    constructor() {
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initThemeToggle();
    }
}

// modules/portfolio.js
export class PortfolioManager {
    constructor() {
        this.initProjectCards();
        this.initSkillCards();
        this.initContactForm();
    }
}
```

### Error Handling Enhancement
```javascript
// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'javascript_error', {
            error_message: event.error.message,
            error_filename: event.filename,
            error_lineno: event.lineno
        });
    }
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
```

## 2. CSS Optimization

### Remove Unused Styles
```bash
# Install PurgeCSS
npm install @fullhuman/postcss-purgecss

# Purge unused CSS
npx purgecss --css style.css --content index.html --output purged.css
```

### CSS Custom Properties
```css
:root {
    /* Color System */
    --color-primary: #0d9488;
    --color-secondary: #06b6d4;
    --color-accent: #2dd4bf;
    
    /* Typography */
    --font-primary: 'Inter', sans-serif;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    /* Spacing System */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    
    /* Animation */
    --duration-fast: 0.15s;
    --duration-normal: 0.3s;
    --duration-slow: 0.5s;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

## 3. Component Architecture

### Create Reusable Components
```javascript
// components/Card.js
export class Card {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            hover: true,
            animation: 'fadeInUp',
            ...options
        };
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupAnimation();
    }
    
    bindEvents() {
        if (this.options.hover) {
            this.element.addEventListener('mouseenter', this.onHover.bind(this));
            this.element.addEventListener('mouseleave', this.onLeave.bind(this));
        }
    }
}

// components/Modal.js
export class Modal {
    constructor(selector, options = {}) {
        this.modal = document.querySelector(selector);
        this.options = {
            closeOnOverlay: true,
            closeOnEscape: true,
            ...options
        };
        this.init();
    }
}
```

## 4. Testing Strategy

### Unit Tests Setup
```javascript
// tests/utils.test.js
import { describe, it, expect } from 'vitest';
import { sanitizeEmail, validateForm } from '../src/utils.js';

describe('Utility Functions', () => {
    it('should sanitize email correctly', () => {
        expect(sanitizeEmail(' Test@Example.COM ')).toBe('test@example.com');
    });
    
    it('should validate form data', () => {
        const validData = { email: 'test@example.com', name: 'John Doe' };
        expect(validateForm(validData)).toBe(true);
    });
});
```

### E2E Tests with Playwright
```javascript
// tests/portfolio.spec.js
import { test, expect } from '@playwright/test';

test('portfolio page loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Arris Ahmad Fadillah');
    await expect(page.locator('.hero-content')).toBeVisible();
});

test('navigation works properly', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="#projects"]');
    await expect(page.locator('#projects')).toBeInViewport();
});
```

## 5. Performance Monitoring

### Lighthouse CI Integration
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - run: npx @lhci/cli@0.9.x autorun
```

### Core Web Vitals Dashboard
```javascript
// analytics/vitals.js
export function trackWebVitals() {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(sendToAnalytics);
        getFID(sendToAnalytics);
        getFCP(sendToAnalytics);
        getLCP(sendToAnalytics);
        getTTFB(sendToAnalytics);
    });
}

function sendToAnalytics(metric) {
    gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_delta: metric.delta,
    });
}
```
