#!/usr/bin/env node

/**
 * Quick Start Setup Script
 * One-command setup for the entire blog system
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class QuickStart {
    constructor() {
        this.projectDir = process.cwd();
        this.requiredDirs = [
            'assets/js',
            'assets/css', 
            'assets/data',
            'assets/images/blog',
            'templates',
            'scripts'
        ];
        
        this.requiredFiles = [
            'blog/generators/blog-generator.js',
            'assets/js/blog-shared.js',
            'assets/css/blog-components.css',
            'blog/templates/blog-master-template-old.html',
            'package.json'
        ];
    }

    async setup() {
        console.log('🚀 Starting Blog System Quick Setup...\n');
        
        try {
            await this.checkPrerequisites();
            await this.setupDirectories();
            await this.installDependencies();
            await this.initializeData();
            await this.createSampleArticle();
            await this.showCompletionMessage();
            
        } catch (error) {
            console.error('❌ Setup failed:', error.message);
            process.exit(1);
        }
    }

    async checkPrerequisites() {
        console.log('🔍 Checking prerequisites...');
        
        // Check Node.js version
        try {
            const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
            console.log(`  ✅ Node.js: ${nodeVersion}`);
            
            if (parseInt(nodeVersion.slice(1)) < 16) {
                throw new Error('Node.js 16.0.0 or higher required');
            }
        } catch (error) {
            throw new Error('Node.js not found. Please install Node.js 16.0.0 or higher');
        }
        
        // Check npm
        try {
            const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
            console.log(`  ✅ npm: ${npmVersion}`);
        } catch (error) {
            throw new Error('npm not found');
        }
        
        console.log('');
    }

    async setupDirectories() {
        console.log('📁 Setting up directory structure...');
        
        for (const dir of this.requiredDirs) {
            const fullPath = path.join(this.projectDir, dir);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                console.log(`  ✅ Created: ${dir}`);
            } else {
                console.log(`  ✅ Exists: ${dir}`);
            }
        }
        
        console.log('');
    }

    async installDependencies() {
        console.log('📦 Installing dependencies...');
        
        try {
            if (fs.existsSync(path.join(this.projectDir, 'package.json'))) {
                console.log('  🔄 Running npm install...');
                execSync('npm install', { 
                    stdio: 'pipe',
                    cwd: this.projectDir 
                });
                console.log('  ✅ Dependencies installed');
            } else {
                console.log('  ⚠️  package.json not found, skipping npm install');
            }
        } catch (error) {
            console.log('  ⚠️  npm install failed, you may need to run it manually');
        }
        
        console.log('');
    }

    async initializeData() {
        console.log('🗄️  Initializing data files...');
        
        // Create empty articles.json if not exists
        const articlesPath = path.join(this.projectDir, 'assets/data/articles.json');
        if (!fs.existsSync(articlesPath)) {
            fs.writeFileSync(articlesPath, JSON.stringify([], null, 2));
            console.log('  ✅ Created: assets/data/articles.json');
        }
        
        // Create empty search-index.json if not exists
        const searchIndexPath = path.join(this.projectDir, 'assets/data/search-index.json');
        if (!fs.existsSync(searchIndexPath)) {
            const searchIndex = {
                articles: []
            };
            fs.writeFileSync(searchIndexPath, JSON.stringify(searchIndex, null, 2));
            console.log('  ✅ Created: assets/data/search-index.json');
        }
        
        console.log('');
    }

    async createSampleArticle() {
        console.log('📝 Creating sample article...');
        
        try {
            const BlogGenerator = require('./blog-generator.js');
            const generator = new BlogGenerator();
            
            const sampleOptions = {
                title: 'Getting Started with the Blog System',
                category: 'programming',
                description: 'Learn how to use the new scalable blog management system',
                tags: ['tutorial', 'blog', 'getting-started'],
                difficulty: 'Beginner'
            };
            
            const result = generator.createArticle(sampleOptions);
            console.log(`  ✅ Sample article created: ${result.filename}`);
            
        } catch (error) {
            console.log('  ⚠️  Could not create sample article:', error.message);
        }
        
        console.log('');
    }

    async showCompletionMessage() {
        console.log('🎉 Blog System Setup Complete!\n');
        
        console.log('📚 Quick Commands:');
        console.log('  Create new article:     npm run create -- --title "Article Title" --category iot');
        console.log('  List all articles:      npm run list');
        console.log('  Build search index:     npm run build');
        console.log('  Start dev server:       npm run dev');
        console.log('  Optimize images:        npm run optimize');
        console.log('');
        
        console.log('📂 Important Files:');
        console.log('  📄 Blog Generator:      blog/generators/blog-generator.js');
        console.log('  🎨 Master Template:     blog/templates/blog-master-template-old.html');
        console.log('  ⚡ Shared JavaScript:   assets/js/blog-shared.js');
        console.log('  🎨 Shared CSS:          assets/css/blog-components.css');
        console.log('  📋 Documentation:       docs/blog/BLOG_SYSTEM_GUIDE.md');
        console.log('');
        
        console.log('🚀 Next Steps:');
        console.log('  1. Read the documentation: BLOG_SYSTEM_GUIDE.md');
        console.log('  2. Create your first article');
        console.log('  3. Customize the master template');
        console.log('  4. Add your own images to assets/images/blog/');
        console.log('');
        
        console.log('💡 Tips:');
        console.log('  - Use semantic file names for better organization');
        console.log('  - Optimize images before adding them');
        console.log('  - Run "npm run build" after adding multiple articles');
        console.log('  - Check BLOG_SYSTEM_GUIDE.md for advanced features');
        console.log('');
        
        // Show status
        this.showSystemStatus();
    }

    showSystemStatus() {
        console.log('📊 System Status:');
        
        // Check required files
        const missingFiles = this.requiredFiles.filter(file => 
            !fs.existsSync(path.join(this.projectDir, file))
        );
        
        if (missingFiles.length === 0) {
            console.log('  ✅ All required files present');
        } else {
            console.log('  ⚠️  Missing files:');
            missingFiles.forEach(file => console.log(`    - ${file}`));
        }
        
        // Check articles count
        const articlesPath = path.join(this.projectDir, 'assets/data/articles.json');
        if (fs.existsSync(articlesPath)) {
            const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
            console.log(`  📄 Articles: ${articles.length}`);
        }
        
        // Check blog pages
        const blogDir = path.join(this.projectDir, 'blog', 'articles');
        const blogFiles = fs.existsSync(blogDir) ? 
            fs.readdirSync(blogDir).filter(file => 
                file.startsWith('blog-') && file.endsWith('.html')
            ) : [];
        console.log(`  📝 Blog pages: ${blogFiles.length}`);
        
        console.log('');
    }

    showHelp() {
        console.log(`
🚀 Blog System Quick Start

Usage:
  node setup.js [command]

Commands:
  setup      Run complete setup (default)
  status     Show current system status
  help       Show this help message

What this script does:
1. ✅ Check Node.js and npm prerequisites
2. 📁 Create required directory structure
3. 📦 Install npm dependencies
4. 🗄️  Initialize data files
5. 📝 Create sample article
6. 📋 Show usage instructions

Requirements:
- Node.js 16.0.0 or higher
- npm 8.0.0 or higher

After setup, read BLOG_SYSTEM_GUIDE.md for detailed instructions.
        `);
    }

    showStatus() {
        console.log('📊 Blog System Status\n');
        this.showSystemStatus();
    }
}

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0] || 'setup';
    
    const quickStart = new QuickStart();
    
    switch (command) {
        case 'setup':
            quickStart.setup();
            break;
            
        case 'status':
            quickStart.showStatus();
            break;
            
        case 'help':
        default:
            quickStart.showHelp();
    }
}

module.exports = QuickStart;
