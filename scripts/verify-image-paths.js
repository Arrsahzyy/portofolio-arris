#!/usr/bin/env node

/**
 * Script untuk memverifikasi path gambar di blog.html
 */

const fs = require('fs');
const path = require('path');

class ImagePathVerifier {
    constructor() {
        this.projectDir = path.dirname(__dirname);
        this.blogHtmlPath = path.join(this.projectDir, 'blog', 'blog.html');
        this.errors = [];
        this.success = [];
    }

    verify() {
        console.log('🔍 Verifying image paths in blog.html...\n');
        
        if (!fs.existsSync(this.blogHtmlPath)) {
            console.log('❌ blog.html not found!');
            return;
        }

        const content = fs.readFileSync(this.blogHtmlPath, 'utf8');
        
        // Extract image sources
        const imgMatches = content.match(/src="([^"]*\.(jpg|jpeg|png|webp|gif))"/gi);
        
        if (!imgMatches) {
            console.log('⚠️ No image sources found in blog.html');
            return;
        }

        console.log(`Found ${imgMatches.length} image references:\n`);

        imgMatches.forEach((match, index) => {
            const srcMatch = match.match(/src="([^"]*)"/i);
            if (srcMatch) {
                const imgSrc = srcMatch[1];
                this.checkImagePath(imgSrc, index + 1);
            }
        });

        this.showResults();
    }

    checkImagePath(imgSrc, index) {
        // Skip external URLs
        if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) {
            this.success.push(`✅ Image ${index}: ${imgSrc} (External URL)`);
            return;
        }

        // Convert relative path to absolute file path
        let absolutePath;
        if (imgSrc.startsWith('../')) {
            // Relative path from blog/ folder
            absolutePath = path.join(this.projectDir, imgSrc.substring(3));
        } else if (imgSrc.startsWith('/')) {
            // Absolute path from project root
            absolutePath = path.join(this.projectDir, imgSrc.substring(1));
        } else {
            // Relative path from current directory
            absolutePath = path.join(this.projectDir, 'blog', imgSrc);
        }

        // Check if file exists
        if (fs.existsSync(absolutePath)) {
            this.success.push(`✅ Image ${index}: ${imgSrc} -> ${absolutePath}`);
        } else {
            this.errors.push(`❌ Image ${index}: ${imgSrc} -> ${absolutePath} (NOT FOUND)`);
        }
    }

    showResults() {
        console.log('\n📊 Verification Results:');
        console.log('=' .repeat(60));
        
        if (this.success.length > 0) {
            console.log('\n✅ Valid image paths:');
            this.success.forEach(item => console.log(`  ${item}`));
        }
        
        if (this.errors.length > 0) {
            console.log('\n❌ Invalid image paths:');
            this.errors.forEach(item => console.log(`  ${item}`));
        }
        
        console.log('\n📈 Summary:');
        console.log(`  ✅ Valid: ${this.success.length}`);
        console.log(`  ❌ Invalid: ${this.errors.length}`);
        
        if (this.errors.length === 0) {
            console.log('\n🎉 All image paths are valid!');
        } else {
            console.log('\n💡 Some image paths need to be fixed.');
        }
    }
}

// Run verification if called directly
if (require.main === module) {
    const verifier = new ImagePathVerifier();
    verifier.verify();
}

module.exports = ImagePathVerifier;
