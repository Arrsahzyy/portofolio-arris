#!/usr/bin/env node

/**
 * Verification script for project reorganization
 * Checks if all files are in their expected locations
 */

const fs = require('fs');
const path = require('path');

class ReorganizationVerifier {
    constructor() {
        this.projectDir = path.dirname(__dirname); // Parent directory of scripts
        this.errors = [];
        this.warnings = [];
        this.success = [];
    }

    verify() {
        console.log('🔍 Verifying project reorganization...\n');
        
        this.checkBlogStructure();
        this.checkDocsStructure();
        this.checkDevStructure();
        this.checkScriptsStructure();
        this.checkRootCleanliness();
        
        this.showResults();
    }

    checkBlogStructure() {
        console.log('📁 Checking blog/ structure...');
        
        const expectedFiles = [
            'blog/blog.html',
            'blog/generators/blog-generator.js',
            'blog/generators/blog-generator-enhanced.js',
            'blog/templates/blog-article-template.html',
            'blog/articles/blog-esp32-guide.html',
            'blog/articles/blog-spwm-inverters.html',
            'blog/articles/blog-ml-electrical.html'
        ];

        expectedFiles.forEach(file => {
            const fullPath = path.join(this.projectDir, file);
            if (fs.existsSync(fullPath)) {
                this.success.push(`✅ ${file} - Found`);
            } else {
                this.errors.push(`❌ ${file} - Missing`);
            }
        });
    }

    checkDocsStructure() {
        console.log('📁 Checking docs/ structure...');
        
        const expectedFiles = [
            'docs/blog/BLOG_GENERATOR_ENHANCEMENT_GUIDE.md',
            'docs/blog/BLOG_SYSTEM_GUIDE.md',
            'docs/improvements/accessibility-improvements.md',
            'docs/improvements/performance-optimization-plan.md'
        ];

        expectedFiles.forEach(file => {
            const fullPath = path.join(this.projectDir, file);
            if (fs.existsSync(fullPath)) {
                this.success.push(`✅ ${file} - Found`);
            } else {
                this.errors.push(`❌ ${file} - Missing`);
            }
        });
    }

    checkDevStructure() {
        console.log('📁 Checking dev/ structure...');
        
        const expectedFiles = [
            'dev/backups/blog-backup.html',
            'dev/testing/enhanced-meta-tags.html',
            'dev/testing/ga-verification.html'
        ];

        expectedFiles.forEach(file => {
            const fullPath = path.join(this.projectDir, file);
            if (fs.existsSync(fullPath)) {
                this.success.push(`✅ ${file} - Found`);
            } else {
                this.errors.push(`❌ ${file} - Missing`);
            }
        });
    }

    checkScriptsStructure() {
        console.log('📁 Checking scripts/ structure...');
        
        const expectedFiles = [
            'scripts/restore-articles.js',
            'scripts/migrate-articles.js'
        ];

        expectedFiles.forEach(file => {
            const fullPath = path.join(this.projectDir, file);
            if (fs.existsSync(fullPath)) {
                this.success.push(`✅ ${file} - Found`);
            } else {
                this.warnings.push(`⚠️ ${file} - Missing (may be optional)`);
            }
        });
    }

    checkRootCleanliness() {
        console.log('📁 Checking root directory cleanliness...');
        
        const unwantedFiles = [
            'blog-*.html',
            'BLOG_*.md',
            'enhanced-meta-tags.html',
            'ga-verification.html'
        ];

        unwantedFiles.forEach(pattern => {
            // Simple check for specific files that shouldn't be in root
            const files = fs.readdirSync(this.projectDir);
            files.forEach(file => {
                if (pattern.includes('*')) {
                    const regex = new RegExp(pattern.replace('*', '.*'));
                    if (regex.test(file)) {
                        this.warnings.push(`⚠️ ${file} - Still in root directory`);
                    }
                } else if (file === pattern) {
                    this.warnings.push(`⚠️ ${file} - Still in root directory`);
                }
            });
        });
    }

    showResults() {
        console.log('\n📊 Verification Results:');
        console.log('=' .repeat(50));
        
        if (this.success.length > 0) {
            console.log('\n✅ Successfully relocated files:');
            this.success.forEach(item => console.log(`  ${item}`));
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️ Warnings:');
            this.warnings.forEach(item => console.log(`  ${item}`));
        }
        
        if (this.errors.length > 0) {
            console.log('\n❌ Errors:');
            this.errors.forEach(item => console.log(`  ${item}`));
        }
        
        console.log('\n📈 Summary:');
        console.log(`  ✅ Success: ${this.success.length}`);
        console.log(`  ⚠️ Warnings: ${this.warnings.length}`);
        console.log(`  ❌ Errors: ${this.errors.length}`);
        
        if (this.errors.length === 0) {
            console.log('\n🎉 Reorganization verification completed successfully!');
        } else {
            console.log('\n💡 Some issues found. Please review and fix.');
        }
    }
}

// Run verification if called directly
if (require.main === module) {
    const verifier = new ReorganizationVerifier();
    verifier.verify();
}

module.exports = ReorganizationVerifier;
