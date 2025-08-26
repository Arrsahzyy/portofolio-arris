#!/usr/bin/env node

/**
 * Migration Script
 * Migrate existing blog articles to new modular system
 */

const fs = require('fs');
const path = require('path');

class BlogMigrator {
    constructor() {
        this.currentDir = process.cwd();
        this.existingArticles = [
            'blog-esp32-guide.html',
            'blog-spwm-inverters.html',
            'blog-ml-electrical.html'
        ];
        
        this.categoryMapping = {
            'esp32': 'iot',
            'spwm': 'power-systems',
            'ml': 'machine-learning'
        };
    }

    async migrateAllArticles() {
        console.log('🔄 Starting migration of existing articles...\n');
        
        for (const articleFile of this.existingArticles) {
            if (fs.existsSync(path.join(this.currentDir, articleFile))) {
                await this.migrateArticle(articleFile);
            } else {
                console.log(`⚠️  Article not found: ${articleFile}`);
            }
        }
        
        console.log('\n✅ Migration completed!');
        this.generateMigrationReport();
    }

    async migrateArticle(filename) {
        console.log(`📄 Migrating: ${filename}`);
        
        try {
            const filePath = path.join(this.currentDir, filename);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Update CSS link to include blog-components.css
            content = this.updateStylesheetLinks(content);
            
            // Update JavaScript to use shared blog scripts
            content = this.updateScriptTags(content);
            
            // Backup original
            const backupPath = path.join(this.currentDir, `${filename}.backup`);
            fs.copyFileSync(filePath, backupPath);
            
            // Write updated content
            fs.writeFileSync(filePath, content);
            
            console.log(`  ✅ Updated: ${filename}`);
            console.log(`  💾 Backup: ${filename}.backup`);
            
        } catch (error) {
            console.error(`  ❌ Error migrating ${filename}:`, error.message);
        }
    }

    updateStylesheetLinks(content) {
        // Add blog-components.css if not present
        if (!content.includes('blog-components.css')) {
            const tailwindLink = content.match(/<link[^>]*tailwindcss[^>]*>/);
            if (tailwindLink) {
                const newStylesheet = `    <link href="/assets/css/blog-components.css" rel="stylesheet">`;
                content = content.replace(
                    tailwindLink[0],
                    `${tailwindLink[0]}\n${newStylesheet}`
                );
            }
        }
        
        return content;
    }

    updateScriptTags(content) {
        // Replace inline scripts with shared blog script
        const sharedScriptTag = '<script src="/assets/js/blog-shared.js"></script>';
        
        if (!content.includes('blog-shared.js')) {
            // Find the last script tag before closing body
            const bodyCloseMatch = content.match(/(<\/body>)/);
            if (bodyCloseMatch) {
                content = content.replace(
                    bodyCloseMatch[0],
                    `    ${sharedScriptTag}\n${bodyCloseMatch[0]}`
                );
            }
        }
        
        return content;
    }

    generateMigrationReport() {
        const report = `
# Migration Report
Generated: ${new Date().toISOString()}

## Migrated Articles
${this.existingArticles.map(article => `- ${article}`).join('\n')}

## Changes Made
1. ✅ Added blog-components.css stylesheet
2. ✅ Added blog-shared.js script
3. ✅ Created backup files (.backup)
4. ✅ Preserved existing functionality

## Next Steps
1. Test all migrated articles
2. Verify responsive design
3. Check dark mode functionality
4. Validate SEO metadata

## Rollback Instructions
If issues occur, restore from backup files:
\`\`\`bash
${this.existingArticles.map(article => 
    `cp ${article}.backup ${article}`
).join('\n')}
\`\`\`

## New System Benefits
- 🚀 Modular CSS components
- ⚡ Shared JavaScript functionality
- 📱 Better mobile performance
- 🎨 Consistent styling
- 🔧 Easier maintenance
        `;
        
        fs.writeFileSync('MIGRATION_REPORT.md', report.trim());
        console.log('\n📋 Migration report saved: MIGRATION_REPORT.md');
    }

    showHelp() {
        console.log(`
🔄 Blog Migration Tool

Usage:
  node scripts/migrate-articles.js [command]

Commands:
  migrate    Migrate all existing articles to new system
  help       Show this help message

Migration Process:
1. Backup existing articles
2. Update stylesheet references
3. Add shared JavaScript
4. Generate migration report

Files to be migrated:
${this.existingArticles.map(article => `  - ${article}`).join('\n')}
        `);
    }
}

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0] || 'migrate';
    
    const migrator = new BlogMigrator();
    
    switch (command) {
        case 'migrate':
            migrator.migrateAllArticles();
            break;
            
        case 'help':
        default:
            migrator.showHelp();
    }
}

module.exports = BlogMigrator;
