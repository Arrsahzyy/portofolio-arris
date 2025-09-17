#!/usr/bin/env node

/**
 * Enhanced Blog Generator Script
 * Automated blog article creation and management system
 * 
 * Usage:
 * node blog-generator-enhanced.js create --title "Article Title" --category iot
 * node blog-generator-enhanced.js build-index
 * node blog-generator-enhanced.js optimize-images
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class EnhancedBlogGenerator {
    constructor() {
        this.baseDir = path.join(__dirname, '..');  // Parent directory (portofolio-arris)
        this.templatesDir = path.join(__dirname, '..', 'templates');
        this.articlesDir = path.join(__dirname, '..', 'articles');
        this.assetsDir = path.join(__dirname, '..', 'assets');
        this.outputDir = path.join(__dirname, '..');
        
        this.categoryConfig = {
            'iot': {
                name: 'IoT & Embedded Systems',
                class: 'iot',
                color: 'teal'
            },
            'power-systems': {
                name: 'Power Systems',
                class: 'power-systems',
                color: 'purple'
            },
            'machine-learning': {
                name: 'Machine Learning',
                class: 'machine-learning',
                color: 'green'
            },
            'programming': {
                name: 'Programming',
                class: 'programming',
                color: 'blue'
            },
            'electronics': {
                name: 'Electronics',
                class: 'electronics',
                color: 'yellow'
            },
            'automation': {
                name: 'Automation',
                class: 'automation',
                color: 'red'
            }
        };

        this.init();
    }

    init() {
        // Create necessary directories
        this.ensureDir(this.articlesDir);
        this.ensureDir(path.join(this.assetsDir, 'data'));
        this.ensureDir(path.join(this.assetsDir, 'images', 'blog'));
        this.ensureDir(this.templatesDir);
    }

    ensureDir(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    // Generate slug from title
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Calculate reading time
    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
        return Math.ceil(words / wordsPerMinute);
    }

    // Calculate word count
    calculateWordCount(content) {
        return content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
    }

    // Generate current date in ISO format
    getCurrentDateISO() {
        return new Date().toISOString();
    }

    // Generate formatted publish date
    getFormattedDate() {
        return new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Create new blog article
    createArticle(options) {
        const {
            title,
            category,
            description = '',
            author = 'Arris Ahmad Fadillah',
            tags = [],
            difficulty = 'Intermediate'
        } = options;

        if (!title || !category) {
            throw new Error('Title and category are required');
        }

        if (!this.categoryConfig[category]) {
            throw new Error(`Invalid category: ${category}`);
        }

        const slug = this.generateSlug(title);
        const filename = `blog-${slug}.html`;
        const publishDate = this.getFormattedDate();
        const publishDateISO = this.getCurrentDateISO();

        // Load master template
        const templatePath = path.join(this.templatesDir, 'blog-master-template.html');
        if (!fs.existsSync(templatePath)) {
            throw new Error('Master template not found. Please ensure blog-master-template.html exists in templates folder.');
        }

        let template = fs.readFileSync(templatePath, 'utf8');

        // Generate content components
        const articleContent = this.generateDefaultContent(title, category);
        const tableOfContents = this.generateTOC(title, category);
        const relatedArticles = this.generateRelatedArticles(category);
        const readTime = this.calculateReadingTime(articleContent);
        
        // Enhanced placeholder replacement with proper formatting
        const placeholders = {
            'ARTICLE_TITLE': title,
            'ARTICLE_DESCRIPTION': description || `Comprehensive guide about ${title}. Learn the fundamentals, best practices, and practical implementation with step-by-step examples.`,
            'ARTICLE_KEYWORDS': [category, ...tags, 'tutorial', 'guide', 'technology'].join(', '),
            'ARTICLE_URL': `https://arrisahmad.dev/${filename}`,
            'ARTICLE_IMAGE': `/assets/blog/${slug}-featured.webp`,
            'ARTICLE_CATEGORY': this.categoryConfig[category].name,
            'CATEGORY_CLASS': this.categoryConfig[category].class,
            'PUBLISH_DATE': publishDate,
            'PUBLISH_DATE_ISO': publishDateISO,
            'READ_TIME': readTime.toString(),
            'DIFFICULTY_LEVEL': difficulty,
            'FEATURED_IMAGE': `/assets/blog/${slug}-featured.webp`,
            'ARTICLE_CONTENT': articleContent,
            'TABLE_OF_CONTENTS': tableOfContents,
            'RELATED_ARTICLES': relatedArticles
        };

        // Replace placeholders with enhanced error checking
        Object.keys(placeholders).forEach(placeholder => {
            const regex = new RegExp(`{{${placeholder}}}`, 'g');
            const value = placeholders[placeholder];
            if (value !== undefined && value !== null) {
                template = template.replace(regex, value);
            } else {
                console.warn(`⚠️  Warning: Placeholder {{${placeholder}}} has no value`);
            }
        });

        // Check for unreplaced placeholders
        const remainingPlaceholders = template.match(/{{[^}]+}}/g);
        if (remainingPlaceholders) {
            console.warn('⚠️  Unreplaced placeholders found:', remainingPlaceholders);
        }

        // Write file
        const outputPath = path.join(this.outputDir, filename);
        fs.writeFileSync(outputPath, template);

        // Create article metadata
        const metadata = {
            title,
            slug,
            filename,
            category,
            description: placeholders.ARTICLE_DESCRIPTION,
            author,
            tags,
            difficulty,
            publishDate,
            publishDateISO,
            created: new Date().toISOString(),
            wordCount: this.calculateWordCount(articleContent),
            readTime: readTime,
            featuredImage: placeholders.FEATURED_IMAGE,
            url: placeholders.ARTICLE_URL
        };

        this.saveArticleMetadata(metadata);

        console.log(`✅ Article created successfully!`);
        console.log(`📂 File: ${filename}`);
        console.log(`📍 Location: ${outputPath}`);
        console.log(`🏷️  Category: ${this.categoryConfig[category].name}`);
        console.log(`📊 Word count: ${metadata.wordCount} words`);
        console.log(`⏱️  Reading time: ${metadata.readTime} minutes`);
        console.log(`📅 Published: ${publishDate}`);
        
        return { filename, metadata };
    }

    generateDefaultContent(title, category) {
        const categoryContent = {
            'iot': `
                <section id="introduction">
                    <h2>Pendahuluan ${title}</h2>
                    <p>Dalam era digital saat ini, ${title} menjadi salah satu teknologi yang sangat penting dalam pengembangan sistem IoT. Tutorial komprehensif ini akan membahas semua aspek fundamental dari ${title}, mulai dari dasar-dasar teoritis hingga implementasi praktis yang dapat langsung diterapkan dalam proyek nyata.</p>
                    
                    <p>Artikel ini cocok untuk pemula yang ingin memahami konsep dasar maupun developer berpengalaman yang ingin memperdalam pengetahuan tentang ${title}. Kita akan mempelajari step-by-step implementasi dengan contoh kode yang lengkap dan mudah dipahami.</p>
                    
                    <blockquote>
                        <p>💡 <strong>Tips:</strong> ${title} adalah teknologi yang sangat powerful untuk pengembangan sistem IoT modern. Dengan mengikuti tutorial ini, Anda akan dapat membangun proyek IoT yang efisien dan reliable.</p>
                    </blockquote>
                </section>

                <section id="prerequisites">
                    <h2>Persiapan dan Persyaratan</h2>
                    
                    <h3>Hardware yang Dibutuhkan</h3>
                    <ul>
                        <li>ESP32 atau Arduino development board</li>
                        <li>Kabel USB untuk programming</li>
                        <li>Breadboard dan jumper wires</li>
                        <li>LED dan resistor untuk testing</li>
                        <li>Sensor-sensor sesuai kebutuhan proyek</li>
                    </ul>
                    
                    <h3>Software Requirements</h3>
                    <ul>
                        <li>Arduino IDE versi terbaru</li>
                        <li>Driver USB-to-Serial yang sesuai</li>
                        <li>Library dan dependencies yang diperlukan</li>
                        <li>Text editor atau IDE pilihan Anda</li>
                    </ul>
                </section>

                <section id="setup">
                    <h2>Setup Development Environment</h2>
                    
                    <h3>Instalasi Arduino IDE</h3>
                    <p>Langkah pertama adalah mempersiapkan development environment yang akan kita gunakan untuk programming.</p>
                    
                    <ol>
                        <li>Download Arduino IDE dari website resmi</li>
                        <li>Install sesuai dengan operating system Anda</li>
                        <li>Buka Arduino IDE dan masuk ke File → Preferences</li>
                        <li>Tambahkan URL board manager untuk ESP32</li>
                        <li>Install board package melalui Tools → Board → Board Manager</li>
                    </ol>
                    
                    <pre><code class="language-text">
// URL Board Manager untuk ESP32:
https://dl.espressif.com/dl/package_esp32_index.json
                    </code></pre>
                </section>

                <section id="implementation">
                    <h2>Implementasi ${title}</h2>
                    
                    <h3>Program Dasar</h3>
                    <p>Mari kita mulai dengan membuat program dasar untuk memahami cara kerja ${title}.</p>
                    
                    <pre><code class="language-cpp">
#include &lt;WiFi.h&gt;
#include &lt;WebServer.h&gt;

const char* ssid = "Your_WiFi_SSID";
const char* password = "Your_WiFi_Password";

WebServer server(80);

void setup() {
    Serial.begin(115200);
    pinMode(LED_BUILTIN, OUTPUT);
    
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println();
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    
    server.on("/", handleRoot);
    server.on("/led/on", handleLEDOn);
    server.on("/led/off", handleLEDOff);
    
    server.begin();
    Serial.println("HTTP server started");
}

void loop() {
    server.handleClient();
}

void handleRoot() {
    String html = "&lt;h1&gt;${title} Web Server&lt;/h1&gt;";
    html += "&lt;p&gt;&lt;a href=\\"/led/on\\"&gt;Turn LED ON&lt;/a&gt;&lt;/p&gt;";
    html += "&lt;p&gt;&lt;a href=\\"/led/off\\"&gt;Turn LED OFF&lt;/a&gt;&lt;/p&gt;";
    
    server.send(200, "text/html", html);
}

void handleLEDOn() {
    digitalWrite(LED_BUILTIN, HIGH);
    server.send(200, "text/plain", "LED is ON");
}

void handleLEDOff() {
    digitalWrite(LED_BUILTIN, LOW);
    server.send(200, "text/plain", "LED is OFF");
}
                    </code></pre>
                </section>

                <section id="troubleshooting">
                    <h2>Troubleshooting</h2>
                    
                    <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 my-6">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <i data-lucide="alert-triangle" class="w-5 h-5 text-yellow-400"></i>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-yellow-800 dark:text-yellow-200">
                                    <strong>WiFi Connection Failed:</strong> Pastikan SSID dan password sudah benar, dan periksa kualitas sinyal WiFi.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="conclusion">
                    <h2>Kesimpulan</h2>
                    <p>Dalam tutorial ini, kita telah mempelajari implementasi ${title} dari dasar hingga aplikasi yang lebih kompleks. Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan teknologi ini untuk proyek IoT.</p>
                    
                    <p>Continue experimenting dengan teknologi ini dan jangan ragu untuk mengombinasikan dengan teknologi lain untuk menciptakan solusi IoT yang inovatif. Happy coding! 🚀</p>
                </section>
            `,
            
            'power-systems': `
                <section id="introduction">
                    <h2>Memahami ${title}</h2>
                    <p>Tutorial komprehensif ini akan memandu Anda melalui fundamental ${title} dalam sistem tenaga listrik. Materi mencakup teori dasar, analisis matematis, dan implementasi praktis dengan software engineering tools.</p>
                    
                    <blockquote>
                        <p>⚡ <strong>Fokus Pembelajaran:</strong> Kombinasi teori solid dengan implementasi praktis menggunakan MATLAB/Simulink dan tools engineering lainnya untuk analisis power systems.</p>
                    </blockquote>
                </section>

                <section id="theory">
                    <h2>Landasan Teori</h2>
                    
                    <h3>Konsep Fundamental</h3>
                    <p>Mari kita mulai dengan memahami prinsip-prinsip dasar yang mengatur ${title} dalam power systems.</p>
                    
                    <ul>
                        <li>Hukum Ohm dan Kirchhoff untuk analisis rangkaian</li>
                        <li>Persamaan daya AC dan DC</li>
                        <li>Transformasi phasor untuk sistem AC</li>
                        <li>Analisis stabilitas sistem</li>
                    </ul>
                </section>

                <section id="matlab">
                    <h2>Implementasi MATLAB/Simulink</h2>
                    
                    <pre><code class="language-matlab">
% ${title} Analysis Script
clear all; clc; close all;

% System Parameters
f = 50;           % Frequency (Hz)
Vm = 311;         % Peak voltage (V)
R = 50;           % Load resistance (Ohm)

% Time vector
t = 0:0.0001:0.04;  % One period for 50Hz

% Generate voltage and current waveforms
voltage = Vm * sin(2*pi*f*t);
current = voltage / R;

% Display results
fprintf('System Analysis Results:\\n');
fprintf('Peak Voltage: %.2f V\\n', Vm);
fprintf('Frequency: %.2f Hz\\n', f);
                    </code></pre>
                </section>

                <section id="safety">
                    <h2>Pertimbangan Keselamatan</h2>
                    
                    <div class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 my-6">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <i data-lucide="alert-triangle" class="w-5 h-5 text-red-400"></i>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-red-800 dark:text-red-200">
                                    <strong>Peringatan Keselamatan:</strong> Selalu ikuti standar keselamatan listrik ketika bekerja dengan power systems.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <ul>
                        <li>Ikuti standar IEC dan IEEE untuk electrical safety</li>
                        <li>Gunakan proper protective equipment (PPE)</li>
                        <li>Verifikasi semua perhitungan sebelum implementasi</li>
                    </ul>
                </section>

                <section id="conclusion">
                    <h2>Kesimpulan</h2>
                    <p>Pemahaman mendalam tentang ${title} sangat penting untuk engineer yang bekerja di bidang power systems. Kombinasi antara teori yang solid dan tools simulasi modern memungkinkan kita untuk menganalisis dan mengoptimalkan sistem dengan akurasi tinggi.</p>
                </section>
            `,
            
            'machine-learning': `
                <section id="introduction">
                    <h2>Pengantar ${title}</h2>
                    <p>Eksplorasi fundamental ${title} dan aplikasinya dalam electrical engineering dan automation. Tutorial ini mencakup konsep dasar machine learning, preprocessing data, model selection, dan deployment untuk aplikasi engineering.</p>
                    
                    <blockquote>
                        <p>🧠 <strong>Learning Focus:</strong> Practical implementation of machine learning techniques dengan focus pada electrical engineering applications dan real-world problem solving.</p>
                    </blockquote>
                </section>

                <section id="data-preparation">
                    <h2>Persiapan Data</h2>
                    
                    <h3>Data Collection</h3>
                    <p>Langkah pertama dalam ${title} adalah mengumpulkan dan mempersiapkan data yang berkualitas.</p>
                    
                    <ul>
                        <li>Sensor data acquisition dari electrical systems</li>
                        <li>Data cleaning dan preprocessing techniques</li>
                        <li>Feature engineering untuk engineering data</li>
                        <li>Data validation dan quality assessment</li>
                    </ul>
                </section>

                <section id="implementation">
                    <h2>Implementasi Python</h2>
                    
                    <pre><code class="language-python">
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor

# Load electrical system data
data = pd.read_csv('electrical_data.csv')

# Feature engineering
features = ['voltage', 'current', 'power', 'frequency']
target = 'efficiency'

X = data[features]
y = data[target]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

print("Model training completed successfully!")
                    </code></pre>
                </section>

                <section id="conclusion">
                    <h2>Kesimpulan</h2>
                    <p>Machine learning provides powerful tools untuk solving complex engineering problems. Dengan pemahaman yang proper tentang data preparation, model selection, dan evaluation techniques, engineers dapat mengimplementasikan ML solutions yang effective dan reliable.</p>
                </section>
            `
        };

        return categoryContent[category] || `
            <section id="introduction">
                <h2>Introduction to ${title}</h2>
                <p>Welcome to this comprehensive guide on ${title}.</p>
            </section>
            
            <section id="implementation">
                <h2>Implementation</h2>
                <p>Practical implementation details and code examples.</p>
            </section>
            
            <section id="conclusion">
                <h2>Conclusion</h2>
                <p>Summary and next steps for ${title}.</p>
            </section>
        `;
    }

    generateTOC(title, category) {
        const tocItems = {
            'iot': [
                { id: 'introduction', text: 'Pendahuluan' },
                { id: 'prerequisites', text: 'Persiapan dan Persyaratan' },
                { id: 'setup', text: 'Setup Development Environment' },
                { id: 'implementation', text: 'Implementasi' },
                { id: 'troubleshooting', text: 'Troubleshooting' },
                { id: 'conclusion', text: 'Kesimpulan' }
            ],
            'power-systems': [
                { id: 'introduction', text: 'Pendahuluan' },
                { id: 'theory', text: 'Landasan Teori' },
                { id: 'matlab', text: 'Implementasi MATLAB' },
                { id: 'safety', text: 'Pertimbangan Keselamatan' },
                { id: 'conclusion', text: 'Kesimpulan' }
            ],
            'machine-learning': [
                { id: 'introduction', text: 'Pendahuluan' },
                { id: 'data-preparation', text: 'Persiapan Data' },
                { id: 'implementation', text: 'Implementasi Python' },
                { id: 'conclusion', text: 'Kesimpulan' }
            ]
        };

        const items = tocItems[category] || [
            { id: 'introduction', text: 'Introduction' },
            { id: 'implementation', text: 'Implementation' },
            { id: 'conclusion', text: 'Conclusion' }
        ];
        
        return items.map(item => 
            `<a href="#${item.id}" class="block py-1 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors font-medium">${item.text}</a>`
        ).join('\\n            ');
    }

    generateRelatedArticles(category) {
        return `
            <a href="/blog-esp32-guide.html" class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-md transition-shadow block">
                <h4 class="font-semibold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Getting Started with ESP32</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Complete beginner guide to ESP32 development</p>
            </a>
            <a href="/blog-spwm-inverters.html" class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-md transition-shadow block">
                <h4 class="font-semibold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">SPWM Inverters Analysis</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Understanding SPWM techniques for power electronics</p>
            </a>
        `;
    }

    saveArticleMetadata(metadata) {
        const metadataPath = path.join(this.assetsDir, 'data', 'articles.json');
        
        let articles = [];
        if (fs.existsSync(metadataPath)) {
            try {
                articles = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            } catch (error) {
                console.warn('Warning: Could not parse existing articles.json, creating new one');
                articles = [];
            }
        }
        
        // Remove existing article with same slug
        articles = articles.filter(article => article.slug !== metadata.slug);
        
        // Add new article
        articles.unshift(metadata);
        
        // Save updated articles
        fs.writeFileSync(metadataPath, JSON.stringify(articles, null, 2));
    }

    // Main CLI handler
    handleCommand(command, options = {}) {
        switch (command) {
            case 'create':
                return this.createArticle(options);
            
            case 'list':
                const metadataPath = path.join(this.assetsDir, 'data', 'articles.json');
                if (fs.existsSync(metadataPath)) {
                    const articles = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                    console.log(`📚 Found ${articles.length} articles:`);
                    articles.forEach(article => {
                        console.log(`  📄 ${article.title} (${article.category})`);
                    });
                } else {
                    console.log('❌ No articles found');
                }
                break;
            
            default:
                console.log(`❌ Unknown command: ${command}`);
                this.showHelp();
        }
    }

    showHelp() {
        console.log(`
📝 Enhanced Blog Generator - Help

Usage:
  node blog-generator-enhanced.js <command> [options]

Commands:
  create           Create a new blog article
  list            List all articles

Create Options:
  --title "Title"       Article title (required)
  --category category   Article category (required)
  --description "Desc"  Article description
  --tags tag1,tag2      Comma-separated tags
  --difficulty level    Difficulty level (Beginner/Intermediate/Advanced)

Categories:
  iot, power-systems, machine-learning, programming, electronics, automation

Examples:
  node blog-generator-enhanced.js create --title "ESP32 WiFi Setup" --category iot
  node blog-generator-enhanced.js create --title "Power System Analysis" --category power-systems --difficulty Advanced
        `);
    }
}

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (!command) {
        const generator = new EnhancedBlogGenerator();
        generator.showHelp();
        process.exit(1);
    }
    
    // Parse options
    const options = {};
    for (let i = 1; i < args.length; i += 2) {
        const key = args[i]?.replace('--', '');
        const value = args[i + 1];
        if (key && value) {
            if (key === 'tags') {
                options[key] = value.split(',').map(tag => tag.trim());
            } else {
                options[key] = value;
            }
        }
    }
    
    try {
        const generator = new EnhancedBlogGenerator();
        generator.handleCommand(command, options);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = EnhancedBlogGenerator;
