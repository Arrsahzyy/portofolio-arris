// Article Layout Verification Script
// Memverifikasi semua perbaikan layout artikel telah diterapkan dengan benar

console.log('🔍 Starting Article Layout Verification...\n');

// Check if we're on an article page
const isArticlePage = window.location.pathname.includes('/blog/articles/');
if (!isArticlePage) {
    console.log('❌ Not on an article page. Please run this script on an article page.');
    throw new Error('Not on article page');
}

console.log('✅ Running on article page:', window.location.pathname);

// Verification Tests
const tests = [];

// Test 1: Check Navbar Background
function testNavbarBackground() {
    const navbar = document.querySelector('.glass-effect, header');
    if (!navbar) return { passed: false, message: 'Navbar not found' };
    
    const styles = window.getComputedStyle(navbar);
    const background = styles.backgroundColor;
    const backdrop = styles.backdropFilter;
    
    const hasBackground = background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent';
    const hasBlur = backdrop && backdrop.includes('blur');
    
    return {
        passed: hasBackground && hasBlur,
        message: `Background: ${background}, Backdrop: ${backdrop}`,
        details: `Has solid background: ${hasBackground}, Has blur: ${hasBlur}`
    };
}

// Test 2: Check Article Container Margins
function testArticleMargins() {
    const container = document.querySelector('.blog-article-container');
    if (!container) return { passed: false, message: 'Article container not found' };
    
    const styles = window.getComputedStyle(container);
    const paddingLeft = parseInt(styles.paddingLeft);
    const paddingRight = parseInt(styles.paddingRight);
    
    // Check if padding is reasonable (at least 16px on mobile, more on desktop)
    const hasAdequateMargins = paddingLeft >= 16 && paddingRight >= 16;
    
    return {
        passed: hasAdequateMargins,
        message: `Padding: ${paddingLeft}px left, ${paddingRight}px right`,
        details: `Adequate margins: ${hasAdequateMargins}`
    };
}

// Test 3: Check Footer Spacing
function testFooterSpacing() {
    const footer = document.querySelector('footer');
    const mainContent = document.querySelector('.article-content');
    
    if (!footer || !mainContent) {
        return { passed: false, message: 'Footer or main content not found' };
    }
    
    const footerRect = footer.getBoundingClientRect();
    const contentRect = mainContent.getBoundingClientRect();
    
    // Calculate distance between content and footer
    const distance = footerRect.top - (contentRect.bottom + window.scrollY - window.scrollY);
    
    // Check if there's adequate spacing (at least 100px gap)
    const hasAdequateSpacing = distance >= 80;
    
    return {
        passed: hasAdequateSpacing,
        message: `Distance: ${Math.round(distance)}px`,
        details: `Adequate spacing: ${hasAdequateSpacing}`
    };
}

// Test 4: Check Article Content Spacing
function testContentSpacing() {
    const paragraphs = document.querySelectorAll('.article-content p');
    if (paragraphs.length === 0) return { passed: false, message: 'No paragraphs found' };
    
    const firstP = paragraphs[0];
    const styles = window.getComputedStyle(firstP);
    const marginTop = parseInt(styles.marginTop);
    const marginBottom = parseInt(styles.marginBottom);
    const lineHeight = parseFloat(styles.lineHeight);
    
    const hasGoodSpacing = marginTop >= 20 && marginBottom >= 20 && lineHeight >= 1.5;
    
    return {
        passed: hasGoodSpacing,
        message: `Margin: ${marginTop}px top, ${marginBottom}px bottom, Line height: ${lineHeight}`,
        details: `Good spacing: ${hasGoodSpacing}`
    };
}

// Test 5: Check CSS File Loading
function testCSSLoading() {
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    const enhancedCSS = Array.from(cssLinks).find(link => 
        link.href.includes('article-layout-enhanced.css')
    );
    
    return {
        passed: !!enhancedCSS,
        message: enhancedCSS ? 'Enhanced CSS loaded' : 'Enhanced CSS not found',
        details: `CSS file: ${enhancedCSS ? enhancedCSS.href : 'Not found'}`
    };
}

// Test 6: Check Mobile Responsiveness
function testMobileResponsiveness() {
    const container = document.querySelector('.blog-article-container');
    if (!container) return { passed: false, message: 'Container not found' };
    
    // Simulate mobile viewport
    const originalWidth = window.innerWidth;
    const isMobile = window.innerWidth <= 768;
    
    const styles = window.getComputedStyle(container);
    const padding = parseInt(styles.paddingLeft);
    
    // On mobile, padding should be smaller but still adequate
    const appropriatePadding = isMobile ? padding >= 16 && padding <= 32 : padding >= 32;
    
    return {
        passed: appropriatePadding,
        message: `Viewport: ${window.innerWidth}px, Padding: ${padding}px`,
        details: `Mobile: ${isMobile}, Appropriate: ${appropriatePadding}`
    };
}

// Run all tests
const testFunctions = [
    { name: 'Navbar Background', fn: testNavbarBackground },
    { name: 'Article Margins', fn: testArticleMargins },
    { name: 'Footer Spacing', fn: testFooterSpacing },
    { name: 'Content Spacing', fn: testContentSpacing },
    { name: 'CSS Loading', fn: testCSSLoading },
    { name: 'Mobile Responsiveness', fn: testMobileResponsiveness }
];

console.log('\n📊 Running Layout Tests...\n');

let passedTests = 0;
let totalTests = testFunctions.length;

testFunctions.forEach((test, index) => {
    console.log(`${index + 1}. Testing ${test.name}...`);
    
    try {
        const result = test.fn();
        if (result.passed) {
            console.log(`   ✅ PASSED: ${result.message}`);
            if (result.details) console.log(`      📝 ${result.details}`);
            passedTests++;
        } else {
            console.log(`   ❌ FAILED: ${result.message}`);
            if (result.details) console.log(`      📝 ${result.details}`);
        }
    } catch (error) {
        console.log(`   ⚠️  ERROR: ${error.message}`);
    }
    
    console.log('');
});

// Final Results
console.log('📈 VERIFICATION RESULTS:');
console.log(`   Tests Passed: ${passedTests}/${totalTests}`);
console.log(`   Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);

if (passedTests === totalTests) {
    console.log('   🎉 ALL TESTS PASSED! Article layout is perfect.');
} else if (passedTests >= totalTests * 0.8) {
    console.log('   ✅ Most tests passed. Minor issues may exist.');
} else {
    console.log('   ⚠️  Multiple issues detected. Review needed.');
}

// Additional Visual Inspection Helpers
console.log('\n🔧 Visual Inspection Helpers:');
console.log('Run these commands for manual verification:');
console.log('');
console.log('// Check navbar visibility while scrolling:');
console.log('window.scrollTo(0, 500); // Scroll down to test navbar');
console.log('');
console.log('// Highlight article margins:');
console.log('document.querySelector(".blog-article-container").style.outline = "2px solid red";');
console.log('');
console.log('// Check footer distance:');
console.log('document.querySelector("footer").style.outline = "2px solid blue";');
console.log('');
console.log('// Test mobile view (if on desktop):');
console.log('// Open DevTools → Toggle Device Mode → Select mobile device');

// Return test results for programmatic use
window.layoutTestResults = {
    passed: passedTests,
    total: totalTests,
    successRate: Math.round((passedTests/totalTests) * 100),
    allPassed: passedTests === totalTests
};
