const fs = require('fs');
const path = require('path');

// List of blog article files
const blogArticles = [
    'blog-esp32-guide.html',
    'blog-ml-electrical.html', 
    'blog-spwm-inverters.html'
];

// Base directory for blog articles
const blogDir = 'e:/PROJECT/portofolio-arris/blog/articles/';

console.log('Fixing CSS and navigation paths in blog articles...');

blogArticles.forEach(filename => {
    const filePath = path.join(blogDir, filename);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Fix favicon path
        content = content.replace(
            'href="assets/icons/arrisahmad.jpg"',
            'href="../../assets/icons/arrisahmad.jpg"'
        );
        
        // Fix CSS paths
        content = content.replace(
            `<!-- Custom CSS File -->
    <link rel="stylesheet" href="style.css">
    
    <!-- Mobile Article Fix CSS -->
    <link rel="stylesheet" href="assets/css/mobile-article-fix.css">`,
            `<!-- Custom CSS Files -->
    <link rel="stylesheet" href="../../style.css">
    <link rel="stylesheet" href="../../assets/css/blog-article-enhanced.css">
    <link rel="stylesheet" href="../../assets/css/mobile-article-fix.css">
    <link rel="stylesheet" href="../../assets/css/blog-layout-fixes.css">`
        );
        
        // Fix navigation links in header
        content = content.replace(
            'href="index.html"',
            'href="../../index.html"'
        );
        content = content.replace(
            'href="blog.html"',
            'href="../blog.html"'
        );
        content = content.replace(
            'href="index.html#about"',
            'href="../../index.html#about"'
        );
        content = content.replace(
            'href="index.html#contact"',
            'href="../../index.html#contact"'
        );
        
        // Write the fixed content back
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed paths in ${filename}`);
        
    } catch (error) {
        console.error(`❌ Error fixing ${filename}:`, error.message);
    }
});

console.log('All blog articles have been updated!');
