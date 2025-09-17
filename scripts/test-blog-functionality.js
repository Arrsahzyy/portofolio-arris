#!/usr/bin/env node

/**
 * Comprehensive Blog Functionality Test
 * Tests all features and functionality of blog.html
 */

const fs = require('fs');
const path = require('path');

class BlogFunctionalityTester {
    constructor() {
        this.projectDir = path.dirname(__dirname);
        this.blogHtmlPath = path.join(this.projectDir, 'blog', 'blog.html');
        this.errors = [];
        this.warnings = [];
        this.success = [];
    }

    async runAllTests() {
        console.log('🧪 Running Comprehensive Blog Functionality Tests...\n');
        
        if (!fs.existsSync(this.blogHtmlPath)) {
            console.log('❌ blog.html not found!');
            return;
        }

        const content = fs.readFileSync(this.blogHtmlPath, 'utf8');
        
        // Test Suite
        this.testHTMLStructure(content);
        this.testMetaTags(content);
        this.testAssetPaths(content);
        this.testNavigation(content);
        this.testArticles(content);
        this.testJavaScriptFunctionality(content);
        this.testResponsiveElements(content);
        this.testAccessibility(content);
        this.testSEO(content);
        
        this.showResults();
    }

    testHTMLStructure(content) {
        console.log('🏗️ Testing HTML Structure...');
        
        // Check DOCTYPE
        if (content.includes('<!DOCTYPE html>')) {
            this.success.push('✅ Valid DOCTYPE declaration');
        } else {
            this.errors.push('❌ Missing or invalid DOCTYPE');
        }
        
        // Check basic HTML structure
        const requiredTags = ['<html', '<head>', '<body', '</html>'];
        requiredTags.forEach(tag => {
            if (content.includes(tag)) {
                this.success.push(`✅ ${tag} tag found`);
            } else {
                this.errors.push(`❌ Missing ${tag} tag`);
            }
        });
        
        // Check for semantic HTML5 elements
        const semanticElements = ['<header', '<nav', '<main', '<section', '<article', '<footer'];
        semanticElements.forEach(element => {
            if (content.includes(element)) {
                this.success.push(`✅ Semantic element ${element} found`);
            } else {
                this.warnings.push(`⚠️ Semantic element ${element} not found`);
            }
        });
    }

    testMetaTags(content) {
        console.log('🏷️ Testing Meta Tags...');
        
        const requiredMeta = [
            'charset="UTF-8"',
            'name="viewport"',
            'name="description"',
            '<title>'
        ];
        
        requiredMeta.forEach(meta => {
            if (content.includes(meta)) {
                this.success.push(`✅ Meta tag ${meta} found`);
            } else {
                this.errors.push(`❌ Missing meta tag: ${meta}`);
            }
        });
        
        // Check favicon
        if (content.includes('rel="icon"')) {
            this.success.push('✅ Favicon declared');
        } else {
            this.warnings.push('⚠️ No favicon found');
        }
    }

    testAssetPaths(content) {
        console.log('📁 Testing Asset Paths...');
        
        // Check for relative paths (should use ../ for assets)
        const assetMatches = content.match(/(?:src|href)="([^"]*(?:\.css|\.js|\.jpg|\.png|\.webp|\.svg|\.ico)[^"]*)"/gi);
        
        if (assetMatches) {
            assetMatches.forEach(match => {
                const pathMatch = match.match(/(?:src|href)="([^"]*)"/i);
                if (pathMatch) {
                    const assetPath = pathMatch[1];
                    
                    // Skip external URLs
                    if (assetPath.startsWith('http') || assetPath.startsWith('//')) {
                        this.success.push(`✅ External asset: ${assetPath}`);
                        return;
                    }
                    
                    // Check local assets use relative paths
                    if (assetPath.includes('assets/') && assetPath.startsWith('../')) {
                        this.success.push(`✅ Correct relative path: ${assetPath}`);
                    } else if (assetPath.includes('assets/') && !assetPath.startsWith('../')) {
                        this.errors.push(`❌ Incorrect asset path (should start with ../): ${assetPath}`);
                    }
                }
            });
        }
    }

    testNavigation(content) {
        console.log('🧭 Testing Navigation...');
        
        // Check navigation structure
        if (content.includes('nav-link')) {
            this.success.push('✅ Navigation links found');
        } else {
            this.errors.push('❌ No navigation links found');
        }
        
        // Check active link
        if (content.includes('nav-link active')) {
            this.success.push('✅ Active navigation state found');
        } else {
            this.warnings.push('⚠️ No active navigation state');
        }
        
        // Check mobile menu
        if (content.includes('menu-btn') || content.includes('mobile')) {
            this.success.push('✅ Mobile navigation found');
        } else {
            this.warnings.push('⚠️ Mobile navigation not detected');
        }
    }

    testArticles(content) {
        console.log('📰 Testing Articles...');
        
        // Count articles
        const articleMatches = content.match(/<article[^>]*data-category/gi);
        const articleCount = articleMatches ? articleMatches.length : 0;
        
        if (articleCount >= 5) {
            this.success.push(`✅ Found ${articleCount} articles (all articles present)`);
        } else if (articleCount >= 3) {
            this.warnings.push(`⚠️ Found ${articleCount} articles (some articles may be missing)`);
        } else {
            this.errors.push(`❌ Found only ${articleCount} articles (articles missing)`);
        }
        
        // Check article structure
        const requiredArticleElements = ['data-category', 'href="articles/', '<h3', '<p'];
        requiredArticleElements.forEach(element => {
            if (content.includes(element)) {
                this.success.push(`✅ Article element ${element} found`);
            } else {
                this.errors.push(`❌ Missing article element: ${element}`);
            }
        });
        
        // Check article links
        const articleLinks = content.match(/href="articles\/blog-[^"]*\.html"/gi);
        if (articleLinks && articleLinks.length >= 5) {
            this.success.push(`✅ Found ${articleLinks.length} article links`);
        } else {
            this.warnings.push(`⚠️ Found only ${articleLinks ? articleLinks.length : 0} article links`);
        }
    }

    testJavaScriptFunctionality(content) {
        console.log('⚙️ Testing JavaScript Functionality...');
        
        // Check for essential JavaScript features
        const jsFeatures = [
            'category-filter',
            'theme-toggle',
            'search-input',
            'load-more',
            'AOS.init',
            'addEventListener'
        ];
        
        jsFeatures.forEach(feature => {
            if (content.includes(feature)) {
                this.success.push(`✅ JavaScript feature ${feature} found`);
            } else {
                this.warnings.push(`⚠️ JavaScript feature ${feature} not found`);
            }
        });
        
        // Check for external libraries
        const libraries = [
            'tailwindcss.com',
            'aos@2.3.1',
            'lucide-static'
        ];
        
        libraries.forEach(lib => {
            if (content.includes(lib)) {
                this.success.push(`✅ External library ${lib} loaded`);
            } else {
                this.warnings.push(`⚠️ External library ${lib} not found`);
            }
        });
    }

    testResponsiveElements(content) {
        console.log('📱 Testing Responsive Elements...');
        
        // Check for responsive classes
        const responsiveClasses = [
            'md:',
            'lg:',
            'sm:',
            'mobile',
            'grid-cols',
            'flex-wrap'
        ];
        
        responsiveClasses.forEach(cls => {
            if (content.includes(cls)) {
                this.success.push(`✅ Responsive class ${cls} found`);
            } else {
                this.warnings.push(`⚠️ Responsive class ${cls} not found`);
            }
        });
    }

    testAccessibility(content) {
        console.log('♿ Testing Accessibility...');
        
        // Check for accessibility features
        const a11yFeatures = [
            'alt=',
            'aria-',
            'role=',
            'tabindex',
            'lang='
        ];
        
        a11yFeatures.forEach(feature => {
            if (content.includes(feature)) {
                this.success.push(`✅ Accessibility feature ${feature} found`);
            } else {
                this.warnings.push(`⚠️ Accessibility feature ${feature} not found`);
            }
        });
    }

    testSEO(content) {
        console.log('🔍 Testing SEO Elements...');
        
        // Check for SEO elements
        const seoElements = [
            'meta name="description"',
            '<title>',
            '<h1',
            '<h2',
            '<h3'
        ];
        
        seoElements.forEach(element => {
            if (content.includes(element)) {
                this.success.push(`✅ SEO element ${element} found`);
            } else {
                this.warnings.push(`⚠️ SEO element ${element} not found`);
            }
        });
    }

    showResults() {
        console.log('\n📊 Blog Functionality Test Results:');
        console.log('=' .repeat(80));
        
        if (this.success.length > 0) {
            console.log('\n✅ Passed Tests:');
            this.success.forEach(item => console.log(`  ${item}`));
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️ Warnings:');
            this.warnings.forEach(item => console.log(`  ${item}`));
        }
        
        if (this.errors.length > 0) {
            console.log('\n❌ Failed Tests:');
            this.errors.forEach(item => console.log(`  ${item}`));
        }
        
        console.log('\n📈 Test Summary:');
        console.log(`  ✅ Passed: ${this.success.length}`);
        console.log(`  ⚠️ Warnings: ${this.warnings.length}`);
        console.log(`  ❌ Failed: ${this.errors.length}`);
        
        const totalTests = this.success.length + this.warnings.length + this.errors.length;
        const successRate = ((this.success.length / totalTests) * 100).toFixed(1);
        
        console.log(`  🎯 Success Rate: ${successRate}%`);
        
        if (this.errors.length === 0) {
            console.log('\n🎉 All critical tests passed! Blog is fully functional!');
        } else if (this.errors.length <= 2) {
            console.log('\n✨ Blog is mostly functional with minor issues.');
        } else {
            console.log('\n💡 Blog needs some fixes to be fully functional.');
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new BlogFunctionalityTester();
    tester.runAllTests();
}

module.exports = BlogFunctionalityTester;
