#!/usr/bin/env node

/**
 * Script untuk restore artikel lama yang hilang
 */

const fs = require('fs');
const path = require('path');

// Data artikel lama yang hilang
const oldArticles = [
    {
        "title": "Complete Guide to ESP32 Development: From Setup to IoT Project",
        "slug": "esp32-guide",
        "filename": "blog-esp32-guide.html",
        "category": "iot",
        "description": "Learn how to set up ESP32 development environment, understand pin configurations, and build a complete IoT monitoring system with web interface and real-time data visualization.",
        "author": "Arris Ahmad Fadillah",
        "tags": ["ESP32", "Arduino", "IoT"],
        "difficulty": "Intermediate",
        "publishDate": "August 10, 2025",
        "created": "2025-08-10T00:00:00.000Z",
        "wordCount": 250,
        "readTime": 8
    },
    {
        "title": "Understanding SPWM Inverters: Theory, Design, and MATLAB Implementation",
        "slug": "spwm-inverters", 
        "filename": "blog-spwm-inverters.html",
        "category": "power-systems",
        "description": "Deep dive into Sinusoidal Pulse Width Modulation techniques for power electronics applications. Includes mathematical analysis, design considerations, and complete MATLAB/Simulink implementation.",
        "author": "Arris Ahmad Fadillah",
        "tags": ["MATLAB", "Simulink", "Power Electronics"],
        "difficulty": "Advanced",
        "publishDate": "August 5, 2025", 
        "created": "2025-08-05T00:00:00.000Z",
        "wordCount": 350,
        "readTime": 12
    },
    {
        "title": "Machine Learning for Predictive Maintenance in Electrical Systems",
        "slug": "ml-electrical",
        "filename": "blog-ml-electrical.html", 
        "category": "machine-learning",
        "description": "Research findings on implementing ML algorithms for predicting equipment failures in power distribution systems. Includes data preprocessing, feature engineering, and model deployment strategies.",
        "author": "Arris Ahmad Fadillah",
        "tags": ["Python", "TensorFlow", "Predictive"],
        "difficulty": "Advanced",
        "publishDate": "July 28, 2025",
        "created": "2025-07-28T00:00:00.000Z", 
        "wordCount": 420,
        "readTime": 15
    }
];

function restoreArticles() {
    const metadataPath = path.join(__dirname, 'assets', 'data', 'articles.json');
    
    // Baca artikel yang ada
    let existingArticles = [];
    if (fs.existsSync(metadataPath)) {
        existingArticles = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    }
    
    // Gabungkan artikel lama + yang ada (tanpa duplikasi)
    const existingSlugs = existingArticles.map(a => a.slug);
    const newArticles = oldArticles.filter(a => !existingSlugs.includes(a.slug));
    
    const allArticles = [...existingArticles, ...newArticles];
    
    // Sortir berdasarkan tanggal (terbaru dulu)
    allArticles.sort((a, b) => new Date(b.created) - new Date(a.created));
    
    // Simpan ke file
    fs.writeFileSync(metadataPath, JSON.stringify(allArticles, null, 2));
    
    console.log(`✅ Restored ${newArticles.length} missing articles`);
    console.log(`📚 Total articles: ${allArticles.length}`);
    
    // Show articles
    allArticles.forEach(article => {
        console.log(`  📄 ${article.title} (${article.category})`);
    });
}

if (require.main === module) {
    restoreArticles();
}

module.exports = { restoreArticles, oldArticles };
