#!/usr/bin/env node

/**
 * Script untuk memverifikasi semua link internal di blog.html
 */

const fs = require('fs');
const path = require('path');

class LinkVerifier {
    constructor() {
        this.projectDir = path.dirname(__dirname);
        this.blogHtmlPath = path.join(this.projectDir, 'blog', 'blog.html');
        this.errors = [];
        this.success = [];
        this.warnings = [];
    }

    verify() {
        console.log('🔍 Verifying all links in blog.html...\n');
        
        if (!fs.existsSync(this.blogHtmlPath)) {
            console.log('❌ blog.html not found!');
            return;
        }

        const content = fs.readFileSync(this.blogHtmlPath, 'utf8');
        
        // Extract all href attributes
        const linkMatches = content.match(/href="([^"]*)"([^>]*>)/gi);
        
        if (!linkMatches) {
            console.log('⚠️ No links found in blog.html');
            return;
        }

        console.log(`Found ${linkMatches.length} links:\n`);

        linkMatches.forEach((match, index) => {
            const hrefMatch = match.match(/href="([^"]*)"/i);
            if (hrefMatch) {
                const href = hrefMatch[1];
                this.checkLink(href, index + 1);
            }
        });

        this.showResults();
    }

    checkLink(href, index) {
        // Skip external URLs
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
            this.success.push(`✅ Link ${index}: ${href} (External URL)`);
            return;
        }

        // Skip anchor links
        if (href.startsWith('#')) {
            this.success.push(`✅ Link ${index}: ${href} (Anchor link)`);
            return;
        }

        // Skip mailto and tel links
        if (href.startsWith('mailto:') || href.startsWith('tel:')) {
            this.success.push(`✅ Link ${index}: ${href} (Email/Phone link)`);
            return;
        }

        // Handle fragment identifiers (hash in URL)
        const [filePath, fragment] = href.split('#');
        
        // Convert relative path to absolute file path
        let absolutePath;
        if (filePath.startsWith('../')) {
            // Relative path from blog/ folder
            absolutePath = path.join(this.projectDir, filePath.substring(3));
        } else if (filePath.startsWith('/')) {
            // Absolute path from project root
            absolutePath = path.join(this.projectDir, filePath.substring(1));
        } else if (filePath === '') {
            // Fragment only (same page)
            this.success.push(`✅ Link ${index}: ${href} (Same page fragment)`);
            return;
        } else {
            // Relative path from current directory
            absolutePath = path.join(this.projectDir, 'blog', filePath);
        }

        // Check if file exists
        if (fs.existsSync(absolutePath)) {
            this.success.push(`✅ Link ${index}: ${href} -> ${absolutePath}${fragment ? ' #' + fragment : ''}`);
        } else {
            this.errors.push(`❌ Link ${index}: ${href} -> ${absolutePath} (NOT FOUND)`);
        }
    }

    showResults() {
        console.log('\n📊 Link Verification Results:');
        console.log('=' .repeat(60));
        
        if (this.success.length > 0) {
            console.log('\n✅ Valid links:');
            this.success.forEach(item => console.log(`  ${item}`));
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️ Warnings:');
            this.warnings.forEach(item => console.log(`  ${item}`));
        }
        
        if (this.errors.length > 0) {
            console.log('\n❌ Broken links:');
            this.errors.forEach(item => console.log(`  ${item}`));
        }
        
        console.log('\n📈 Summary:');
        console.log(`  ✅ Valid: ${this.success.length}`);
        console.log(`  ⚠️ Warnings: ${this.warnings.length}`);
        console.log(`  ❌ Broken: ${this.errors.length}`);
        
        if (this.errors.length === 0) {
            console.log('\n🎉 All links are valid!');
        } else {
            console.log('\n💡 Some links need to be fixed.');
        }
    }
}

// Run verification if called directly
if (require.main === module) {
    const verifier = new LinkVerifier();
    verifier.verify();
}

module.exports = LinkVerifier;
