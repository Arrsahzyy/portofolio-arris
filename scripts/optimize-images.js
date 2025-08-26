#!/usr/bin/env node

/**
 * Image Optimization Script
 * Automatically optimizes images for blog articles
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class ImageOptimizer {
    constructor() {
        this.inputDir = path.join(__dirname, '..', 'assets', 'images', 'blog');
        this.outputDir = path.join(__dirname, '..', 'assets', 'images', 'blog', 'optimized');
        this.sizes = {
            featured: { width: 1200, height: 630 },
            thumbnail: { width: 400, height: 225 },
            mobile: { width: 768, height: 432 }
        };
        
        this.formats = ['webp', 'jpg'];
        this.quality = {
            webp: 80,
            jpg: 85
        };
        
        this.init();
    }

    init() {
        // Ensure directories exist
        if (!fs.existsSync(this.inputDir)) {
            fs.mkdirSync(this.inputDir, { recursive: true });
            console.log('📁 Created input directory:', this.inputDir);
        }
        
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
            console.log('📁 Created output directory:', this.outputDir);
        }
    }

    async optimizeImage(inputPath, outputPath, options = {}) {
        const {
            width = 1200,
            height = 630,
            format = 'webp',
            quality = 80
        } = options;

        try {
            let sharpInstance = sharp(inputPath)
                .resize(width, height, {
                    fit: 'cover',
                    position: 'center'
                });

            if (format === 'webp') {
                sharpInstance = sharpInstance.webp({ quality });
            } else if (format === 'jpg' || format === 'jpeg') {
                sharpInstance = sharpInstance.jpeg({ quality });
            } else if (format === 'png') {
                sharpInstance = sharpInstance.png({ quality });
            }

            await sharpInstance.toFile(outputPath);
            
            // Get file sizes
            const originalSize = fs.statSync(inputPath).size;
            const optimizedSize = fs.statSync(outputPath).size;
            const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
            
            console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
            console.log(`   📊 ${this.formatBytes(originalSize)} → ${this.formatBytes(optimizedSize)} (${savings}% saved)`);
            
            return {
                original: originalSize,
                optimized: optimizedSize,
                savings: parseFloat(savings)
            };
        } catch (error) {
            console.error(`❌ Error optimizing ${inputPath}:`, error.message);
            return null;
        }
    }

    async optimizeAllImages() {
        const files = fs.readdirSync(this.inputDir).filter(file => 
            /\.(jpg|jpeg|png)$/i.test(file)
        );

        if (files.length === 0) {
            console.log('📷 No images found to optimize');
            return;
        }

        console.log(`🖼️  Found ${files.length} images to optimize\n`);

        let totalOriginal = 0;
        let totalOptimized = 0;
        let processedCount = 0;

        for (const file of files) {
            const inputPath = path.join(this.inputDir, file);
            const baseName = path.parse(file).name;
            
            console.log(`🔄 Processing: ${file}`);

            // Generate multiple sizes and formats
            for (const [sizeName, dimensions] of Object.entries(this.sizes)) {
                for (const format of this.formats) {
                    const outputFileName = `${baseName}-${sizeName}.${format}`;
                    const outputPath = path.join(this.outputDir, outputFileName);

                    const result = await this.optimizeImage(inputPath, outputPath, {
                        ...dimensions,
                        format,
                        quality: this.quality[format]
                    });

                    if (result) {
                        totalOriginal += result.original;
                        totalOptimized += result.optimized;
                        processedCount++;
                    }
                }
            }
            
            console.log(''); // Empty line for readability
        }

        // Summary
        const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);
        console.log('📊 Optimization Summary:');
        console.log(`   📁 Processed: ${processedCount} images`);
        console.log(`   💾 Total size: ${this.formatBytes(totalOriginal)} → ${this.formatBytes(totalOptimized)}`);
        console.log(`   🎯 Total savings: ${totalSavings}%`);
        console.log(`   📂 Output directory: ${this.outputDir}`);
    }

    async generateResponsiveImages(imageName) {
        const inputPath = path.join(this.inputDir, imageName);
        
        if (!fs.existsSync(inputPath)) {
            console.error(`❌ Image not found: ${imageName}`);
            return;
        }

        const baseName = path.parse(imageName).name;
        
        console.log(`🔄 Generating responsive images for: ${imageName}`);

        // Generate different sizes
        const responsiveSizes = [
            { suffix: '-sm', width: 400, height: 225 },
            { suffix: '-md', width: 768, height: 432 },
            { suffix: '-lg', width: 1200, height: 630 },
            { suffix: '-xl', width: 1600, height: 900 }
        ];

        for (const size of responsiveSizes) {
            for (const format of this.formats) {
                const outputFileName = `${baseName}${size.suffix}.${format}`;
                const outputPath = path.join(this.outputDir, outputFileName);

                await this.optimizeImage(inputPath, outputPath, {
                    width: size.width,
                    height: size.height,
                    format,
                    quality: this.quality[format]
                });
            }
        }

        // Generate HTML snippet
        this.generatePictureElement(baseName);
    }

    generatePictureElement(baseName) {
        const pictureHTML = `
<!-- Responsive image: ${baseName} -->
<picture>
    <source 
        media="(max-width: 400px)" 
        srcset="
            /assets/images/blog/optimized/${baseName}-sm.webp 400w,
            /assets/images/blog/optimized/${baseName}-md.webp 768w
        " 
        type="image/webp">
    <source 
        media="(max-width: 400px)" 
        srcset="
            /assets/images/blog/optimized/${baseName}-sm.jpg 400w,
            /assets/images/blog/optimized/${baseName}-md.jpg 768w
        " 
        type="image/jpeg">
    <source 
        media="(max-width: 768px)" 
        srcset="
            /assets/images/blog/optimized/${baseName}-md.webp 768w,
            /assets/images/blog/optimized/${baseName}-lg.webp 1200w
        " 
        type="image/webp">
    <source 
        media="(max-width: 768px)" 
        srcset="
            /assets/images/blog/optimized/${baseName}-md.jpg 768w,
            /assets/images/blog/optimized/${baseName}-lg.jpg 1200w
        " 
        type="image/jpeg">
    <source 
        srcset="
            /assets/images/blog/optimized/${baseName}-lg.webp 1200w,
            /assets/images/blog/optimized/${baseName}-xl.webp 1600w
        " 
        type="image/webp">
    <img 
        src="/assets/images/blog/optimized/${baseName}-lg.jpg" 
        alt="${baseName.replace(/-/g, ' ')}" 
        class="w-full h-auto rounded-lg shadow-lg"
        loading="lazy">
</picture>`;

        console.log('📝 Generated HTML snippet:');
        console.log(pictureHTML);
        
        // Save to file
        const htmlPath = path.join(this.outputDir, `${baseName}-responsive.html`);
        fs.writeFileSync(htmlPath, pictureHTML);
        console.log(`💾 Saved HTML snippet to: ${htmlPath}`);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async convertToWebP(inputPath, outputPath, quality = 80) {
        try {
            await sharp(inputPath)
                .webp({ quality })
                .toFile(outputPath);
            
            console.log(`✅ Converted to WebP: ${path.basename(outputPath)}`);
        } catch (error) {
            console.error(`❌ WebP conversion failed:`, error.message);
        }
    }

    async batchConvertToWebP() {
        const files = fs.readdirSync(this.inputDir).filter(file => 
            /\.(jpg|jpeg|png)$/i.test(file)
        );

        console.log(`🔄 Converting ${files.length} images to WebP format...\n`);

        for (const file of files) {
            const inputPath = path.join(this.inputDir, file);
            const baseName = path.parse(file).name;
            const outputPath = path.join(this.outputDir, `${baseName}.webp`);
            
            await this.convertToWebP(inputPath, outputPath);
        }

        console.log('\n✅ WebP conversion completed!');
    }

    showHelp() {
        console.log(`
🖼️  Image Optimizer - Help

Usage:
  node scripts/optimize-images.js <command> [options]

Commands:
  optimize         Optimize all images in multiple sizes and formats
  responsive       Generate responsive images for a specific file
  webp            Convert all images to WebP format
  help            Show this help message

Examples:
  node scripts/optimize-images.js optimize
  node scripts/optimize-images.js responsive featured-image.jpg
  node scripts/optimize-images.js webp

Output Structure:
  assets/images/blog/optimized/
  ├── image-name-featured.webp     (1200x630)
  ├── image-name-featured.jpg      (1200x630)
  ├── image-name-thumbnail.webp    (400x225)
  ├── image-name-thumbnail.jpg     (400x225)
  ├── image-name-mobile.webp       (768x432)
  └── image-name-mobile.jpg        (768x432)

Quality Settings:
  WebP: 80%
  JPEG: 85%

Supported Input Formats: JPG, JPEG, PNG
        `);
    }
}

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    const imageName = args[1];
    
    const optimizer = new ImageOptimizer();
    
    switch (command) {
        case 'optimize':
            optimizer.optimizeAllImages();
            break;
            
        case 'responsive':
            if (!imageName) {
                console.error('❌ Please provide an image name');
                console.log('Usage: node scripts/optimize-images.js responsive image.jpg');
                process.exit(1);
            }
            optimizer.generateResponsiveImages(imageName);
            break;
            
        case 'webp':
            optimizer.batchConvertToWebP();
            break;
            
        case 'help':
        default:
            optimizer.showHelp();
    }
}

module.exports = ImageOptimizer;
