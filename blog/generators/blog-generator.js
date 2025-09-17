#!/usr/bin/env node

/**
 * Blog Generator Script
 * Automated blog article creation and management system
 * 
 * Usage:
 * node blog-generator.js create --title "Article Title" --category iot
 * node blog-generator.js build-index
 * node blog-generator.js optimize-images
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BlogGenerator {
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
        console.log(`� Location: ${outputPath}`);
        console.log(`🏷️  Category: ${this.categoryConfig[category].name}`);
        console.log(`📊 Word count: ${metadata.wordCount} words`);
        console.log(`⏱️  Reading time: ${metadata.readTime} minutes`);
        console.log(`📅 Published: ${publishDate}`);
        
        return { filename, metadata };
    }

    generateDefaultContent(title, category) {
        const categoryContent = {
            'iot': `
                <!-- Introduction Section -->
                <section id="introduction">
                    <h2>Pendahuluan ${title}</h2>
                    <p>
                        Dalam era digital saat ini, ${title} menjadi salah satu teknologi yang sangat penting dalam pengembangan sistem IoT. 
                        Tutorial komprehensif ini akan membahas semua aspek fundamental dari ${title}, mulai dari dasar-dasar teoritis 
                        hingga implementasi praktis yang dapat langsung diterapkan dalam proyek nyata.
                    </p>
                    
                    <p>
                        Artikel ini cocok untuk pemula yang ingin memahami konsep dasar maupun developer berpengalaman yang ingin 
                        memperdalam pengetahuan tentang ${title}. Kita akan mempelajari step-by-step implementasi dengan contoh 
                        kode yang lengkap dan mudah dipahami.
                    </p>
                    
                    <blockquote>
                        <p>💡 <strong>Tips:</strong> ${title} adalah teknologi yang sangat powerful untuk pengembangan sistem IoT modern. 
                        Dengan mengikuti tutorial ini, Anda akan dapat membangun proyek IoT yang efisien dan reliable.</p>
                    </blockquote>
                </section>

                <!-- Prerequisites Section -->
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
                    
                    <h3>Pengetahuan Dasar</h3>
                    <ul>
                        <li>Pemahaman dasar elektronika dan rangkaian</li>
                        <li>Familiarity dengan bahasa pemrograman C/C++</li>
                        <li>Konsep dasar jaringan dan protokol komunikasi</li>
                        <li>Basic understanding of IoT concepts</li>
                    </ul>
                </section>

                <!-- Setup Section -->
                <section id="setup">
                    <h2>Setup Development Environment</h2>
                    
                    <h3>Instalasi Arduino IDE</h3>
                    <p>
                        Langkah pertama adalah mempersiapkan development environment yang akan kita gunakan untuk programming.
                    </p>
                    
                    <ol>
                        <li>Download Arduino IDE dari website resmi</li>
                        <li>Install sesuai dengan operating system Anda</li>
                        <li>Buka Arduino IDE dan masuk ke File → Preferences</li>
                        <li>Tambahkan URL board manager untuk ESP32 atau board yang digunakan</li>
                        <li>Install board package melalui Tools → Board → Board Manager</li>
                    </ol>
                    
                    <h3>Konfigurasi Board dan Port</h3>
                    <p>
                        Setelah installation selesai, kita perlu mengkonfigurasi board dan port yang akan digunakan.
                    </p>
                    
                    <pre><code class="language-text">
// URL Board Manager untuk ESP32:
https://dl.espressif.com/dl/package_esp32_index.json
                    </code></pre>
                    
                    <figure class="my-8">
                        <div class="w-full h-64 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-lg flex items-center justify-center">
                            <div class="text-center">
                                <i data-lucide="settings" class="w-16 h-16 text-teal-600 mx-auto mb-4"></i>
                                <p class="text-gray-600 dark:text-gray-300">Arduino IDE Configuration</p>
                            </div>
                        </div>
                        <figcaption class="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Gambar 1: Konfigurasi Arduino IDE untuk ${title}
                        </figcaption>
                    </figure>
                </section>

                <!-- Implementation Section -->
                <section id="implementation">
                    <h2>Implementasi ${title}</h2>
                    
                    <h3>Program Dasar</h3>
                    <p>
                        Mari kita mulai dengan membuat program dasar untuk memahami cara kerja ${title}.
                    </p>
                    
                    <pre><code class="language-cpp">
#include &lt;WiFi.h&gt;
#include &lt;WebServer.h&gt;

// WiFi credentials
const char* ssid = "Your_WiFi_SSID";
const char* password = "Your_WiFi_Password";

WebServer server(80);

void setup() {
    Serial.begin(115200);
    
    // Initialize pins
    pinMode(LED_BUILTIN, OUTPUT);
    
    // Connect to WiFi
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
    
    // Setup server routes
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
    html += "&lt;p&gt;&lt;a href=\"/led/on\"&gt;Turn LED ON&lt;/a&gt;&lt;/p&gt;";
    html += "&lt;p&gt;&lt;a href=\"/led/off\"&gt;Turn LED OFF&lt;/a&gt;&lt;/p&gt;";
    
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
                    
                    <h3>Penjelasan Kode</h3>
                    <p>
                        Mari kita breakdown kode di atas untuk memahami setiap bagiannya:
                    </p>
                    
                    <ul>
                        <li><strong>Include Libraries:</strong> Mengimport library yang diperlukan untuk WiFi dan web server</li>
                        <li><strong>WiFi Connection:</strong> Menghubungkan device ke jaringan WiFi</li>
                        <li><strong>Server Setup:</strong> Membuat web server dan mendefinisikan routes</li>
                        <li><strong>Handler Functions:</strong> Fungsi-fungsi untuk menangani HTTP requests</li>
                    </ul>
                </section>

                <!-- Advanced Features Section -->
                <section id="advanced">
                    <h2>Fitur Lanjutan</h2>
                    
                    <h3>Sensor Integration</h3>
                    <p>
                        Sekarang kita akan mengintegrasikan sensor untuk membuat sistem yang lebih kompleks.
                    </p>
                    
                    <h3>Data Logging</h3>
                    <p>
                        Implementasi sistem logging untuk menyimpan data sensor secara berkala.
                    </p>
                    
                    <h3>Remote Monitoring</h3>
                    <p>
                        Membuat sistem monitoring jarak jauh menggunakan protokol IoT.
                    </p>
                </section>

                <!-- Troubleshooting Section -->
                <section id="troubleshooting">
                    <h2>Troubleshooting</h2>
                    
                    <h3>Masalah Umum dan Solusinya</h3>
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
                    
                    <div class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 my-6">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <i data-lucide="x-circle" class="w-5 h-5 text-red-400"></i>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-red-800 dark:text-red-200">
                                    <strong>Upload Error:</strong> Periksa koneksi USB, driver, dan pastikan board yang dipilih sudah benar.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 my-6">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <i data-lucide="info" class="w-5 h-5 text-blue-400"></i>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-blue-800 dark:text-blue-200">
                                    <strong>Performance Issues:</strong> Optimasi kode dengan mengurangi delay dan menggunakan non-blocking operations.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Conclusion Section -->
                <section id="conclusion">
                    <h2>Kesimpulan</h2>
                    <p>
                        Dalam tutorial ini, kita telah mempelajari implementasi ${title} dari dasar hingga aplikasi yang lebih kompleks. 
                        Anda sekarang memiliki pemahaman yang solid tentang cara menggunakan teknologi ini untuk proyek IoT.
                    </p>
                    
                    <p>
                        Beberapa poin penting yang telah kita bahas:
                    </p>
                    
                    <ul>
                        <li>Setup development environment yang proper</li>
                        <li>Implementasi dasar dan konfigurasi sistem</li>
                        <li>Integrasi dengan sensor dan actuator</li>
                        <li>Best practices untuk development IoT</li>
                        <li>Troubleshooting common issues</li>
                    </ul>
                    
                    <p>
                        Continue experimenting dengan teknologi ini dan jangan ragu untuk mengombinasikan dengan teknologi lain 
                        untuk menciptakan solusi IoT yang inovatif. Happy coding! 🚀
                    </p>
                    
                    <div class="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 my-6">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <i data-lucide="check-circle" class="w-5 h-5 text-green-400"></i>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-green-800 dark:text-green-200">
                                    <strong>Next Steps:</strong> Coba implementasikan proyek sendiri menggunakan konsep yang telah dipelajari. 
                                    Eksplorasi lebih lanjut dengan sensor dan protokol komunikasi yang berbeda.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            `

                <h3>Software Setup</h3>
                <pre><code class="language-cpp">
#include &lt;WiFi.h&gt;
#include &lt;WebServer.h&gt;

const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";

WebServer server(80);

void setup() {
    Serial.begin(115200);
    
    // Connect to WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    
    server.begin();
}

void loop() {
    server.handleClient();
}
                </code></pre>

                <h2>Implementation Details</h2>
                <p>Now let's dive into the specific implementation details for ${title}.</p>

                <h2>Best Practices</h2>
                <ul>
                    <li>Always validate input data</li>
                    <li>Implement proper error handling</li>
                    <li>Use secure communication protocols</li>
                    <li>Optimize for power consumption</li>
                </ul>

                <h2>Troubleshooting</h2>
                <p>Common issues and their solutions when working with ${title}.</p>

                <h2>Conclusion</h2>
                <p>In this tutorial, we've covered the essential aspects of ${title}. Continue experimenting and building upon these concepts to create innovative IoT solutions.</p>
            },
            'power-systems': `
                <!-- Introduction Section -->
                <section id="introduction">
                    <h2>Memahami ${title}</h2>
                    <p>
                        Tutorial komprehensif ini akan memandu Anda melalui fundamental ${title} dalam sistem tenaga listrik. 
                        Materi mencakup teori dasar, analisis matematis, dan implementasi praktis dengan software engineering tools.
                    </p>
                    
                    <p>
                        Sistem tenaga listrik modern memerlukan pemahaman mendalam tentang ${title} untuk ensure reliability, 
                        efficiency, dan sustainability. Artikel ini dirancang untuk electrical engineers dan researchers yang 
                        ingin mendalami aspek teknis dan praktis.
                    </p>
                    
                    <blockquote>
                        <p>⚡ <strong>Fokus Pembelajaran:</strong> Kombinasi teori solid dengan implementasi praktis menggunakan 
                        MATLAB/Simulink dan tools engineering lainnya untuk analisis power systems.</p>
                    </blockquote>
                </section>

                <!-- Theoretical Background -->
                <section id="theory">
                    <h2>Landasan Teori</h2>
                    
                    <h3>Konsep Fundamental</h3>
                    <p>
                        Mari kita mulai dengan memahami prinsip-prinsip dasar yang mengatur ${title} dalam power systems.
                    </p>
                    
                    <h3>Persamaan Matematis Utama</h3>
                    <p>
                        Beberapa persamaan fundamental yang perlu dipahami:
                    </p>
                    
                    <ul>
                        <li>Hukum Ohm dan Kirchhoff untuk analisis rangkaian</li>
                        <li>Persamaan daya AC dan DC</li>
                        <li>Transformasi phasor untuk sistem AC</li>
                        <li>Analisis stabilitas sistem</li>
                    </ul>
                </section>

                <!-- MATLAB Implementation -->
                <section id="matlab">
                    <h2>Implementasi MATLAB/Simulink</h2>
                    
                    <h3>Setup Environment</h3>
                    <p>
                        Persiapan MATLAB environment untuk analisis power systems.
                    </p>
                    
                    <pre><code class="language-matlab">
% ${title} Analysis Script
clear all; clc; close all;

% System Parameters
f = 50;           % Frequency (Hz)
Vm = 311;         % Peak voltage (V)
R = 50;           % Load resistance (Ohm)
L = 0.1;          % Inductance (H)
C = 100e-6;       % Capacitance (F)

% Time vector
t = 0:0.0001:0.04;  % One period for 50Hz

% Generate voltage and current waveforms
voltage = Vm * sin(2*pi*f*t);

% For RL load
Z = sqrt(R^2 + (2*pi*f*L)^2);
phi = atan2(2*pi*f*L, R);
current = (Vm/Z) * sin(2*pi*f*t - phi);

% Power calculations
instantaneous_power = voltage .* current;
average_power = mean(instantaneous_power);

% Display results
fprintf('System Analysis Results:\\n');
fprintf('Average Power: %.2f W\\n', average_power);
fprintf('Power Factor: %.3f\\n', cos(phi));
                    </code></pre>
                    
                    <h3>Visualization dan Analysis</h3>
                    <pre><code class="language-matlab">
% Create comprehensive plots
figure('Position', [100, 100, 1200, 800]);

% Subplot 1: Voltage and Current
subplot(3,1,1);
plot(t*1000, voltage, 'b-', 'LineWidth', 2);
hold on;
plot(t*1000, current*10, 'r-', 'LineWidth', 2);
grid on;
title('Voltage and Current Waveforms');
xlabel('Time (ms)');
ylabel('Amplitude');
legend('Voltage (V)', 'Current x10 (A)', 'Location', 'best');

% Subplot 2: Power
subplot(3,1,2);
plot(t*1000, instantaneous_power, 'g-', 'LineWidth', 2);
hold on;
plot(t*1000, average_power*ones(size(t)), 'k--', 'LineWidth', 2);
grid on;
title('Instantaneous and Average Power');
xlabel('Time (ms)');
ylabel('Power (W)');
legend('Instantaneous Power', 'Average Power', 'Location', 'best');

% Subplot 3: Phasor Diagram
subplot(3,1,3);
compass(real(Vm), imag(Vm), 'b');
hold on;
compass(real(Vm/Z*exp(-1j*phi)), imag(Vm/Z*exp(-1j*phi)), 'r');
title('Phasor Diagram');
legend('Voltage', 'Current', 'Location', 'best');
                    </code></pre>
                </section>

                <!-- Simulation Results -->
                <section id="results">
                    <h2>Hasil Simulasi dan Analisis</h2>
                    
                    <figure class="my-8">
                        <div class="w-full h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-lg flex items-center justify-center">
                            <div class="text-center">
                                <i data-lucide="bar-chart-3" class="w-16 h-16 text-purple-600 mx-auto mb-4"></i>
                                <p class="text-gray-600 dark:text-gray-300">Power System Analysis Results</p>
                            </div>
                        </div>
                        <figcaption class="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Gambar 1: Hasil analisis ${title} dengan MATLAB
                        </figcaption>
                    </figure>
                    
                    <h3>Interpretasi Hasil</h3>
                    <p>
                        Berdasarkan simulasi yang telah dilakukan, kita dapat menganalisis:
                    </p>
                    
                    <ul>
                        <li>Karakteristik voltage dan current waveforms</li>
                        <li>Power factor dan efficiency sistem</li>
                        <li>Harmonic content dan distortion</li>
                        <li>Stability margins dan transient response</li>
                    </ul>
                </section>

                <!-- Real-world Applications -->
                <section id="applications">
                    <h2>Aplikasi di Dunia Nyata</h2>
                    
                    <h3>Industrial Applications</h3>
                    <p>
                        ${title} memiliki aplikasi luas dalam berbagai industri:
                    </p>
                    
                    <ul>
                        <li>Power generation dan distribution systems</li>
                        <li>Motor drives dan variable frequency drives</li>
                        <li>Renewable energy integration</li>
                        <li>Smart grid technologies</li>
                    </ul>
                    
                    <h3>Case Study</h3>
                    <p>
                        Implementasi ${title} dalam proyek power system optimization di industrial facility.
                    </p>
                </section>

                <!-- Safety Considerations -->
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
                                    Gunakan alat pelindung diri yang sesuai dan pastikan sistem dalam kondisi de-energized saat maintenance.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <ul>
                        <li>Ikuti standar IEC dan IEEE untuk electrical safety</li>
                        <li>Gunakan proper protective equipment (PPE)</li>
                        <li>Verifikasi semua perhitungan sebelum implementasi</li>
                        <li>Implement proper grounding dan protection systems</li>
                    </ul>
                </section>

                <!-- Conclusion -->
                <section id="conclusion">
                    <h2>Kesimpulan</h2>
                    <p>
                        Pemahaman mendalam tentang ${title} sangat penting untuk engineer yang bekerja di bidang power systems. 
                        Kombinasi antara teori yang solid dan tools simulasi modern memungkinkan kita untuk menganalisis dan 
                        mengoptimalkan sistem dengan akurasi tinggi.
                    </p>
                    
                    <p>
                        Key takeaways dari tutorial ini:
                    </p>
                    
                    <ul>
                        <li>Mastery konsep fundamental power systems</li>
                        <li>Penggunaan MATLAB untuk analisis kompleks</li>
                        <li>Implementasi safety practices dalam engineering</li>
                        <li>Application knowledge untuk real-world projects</li>
                    </ul>
                </section>
                </ul>

                <h2>Conclusion</h2>
                <p>Understanding ${title} is crucial for modern power system design and operation.</p>
            `,
            'machine-learning': `
                <h2>Introduction to ${title}</h2>
                <p>Explore the fundamentals of ${title} and its applications in electrical engineering and automation.</p>
                
                <h2>Data Preparation</h2>
                <p>Before we begin with the machine learning implementation, let's prepare our dataset.</p>

                <h3>Python Implementation</h3>
                <pre><code class="language-python">
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Load and prepare data
def load_data():
    """Load and preprocess the dataset"""
    # Example: Load electrical system data
    data = pd.read_csv('electrical_data.csv')
    
    # Feature engineering
    X = data.drop(['target'], axis=1)
    y = data['target']
    
    return X, y

# Train the model
def train_model(X, y):
    """Train machine learning model"""
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test_scaled)
    
    # Evaluate model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.2f}")
    
    return model, scaler

# Main execution
if __name__ == "__main__":
    X, y = load_data()
    model, scaler = train_model(X, y)
                </code></pre>

                <h2>Model Evaluation</h2>
                <p>Analyzing the performance metrics and improving the model.</p>

                <h2>Feature Engineering</h2>
                <p>Creating meaningful features from raw electrical data.</p>

                <h2>Real-World Case Study</h2>
                <p>Implementing ${title} in a practical electrical engineering scenario.</p>

                <h2>Best Practices</h2>
                <ul>
                    <li>Always validate your data quality</li>
                    <li>Use cross-validation for robust evaluation</li>
                    <li>Consider interpretability in critical systems</li>
                    <li>Implement proper monitoring and alerting</li>
                </ul>

                <h2>Conclusion</h2>
                <p>Machine learning applications in electrical engineering continue to evolve, offering new opportunities for automation and optimization.</p>
            `
        };

        return categoryContent[category] || `
            <h2>Introduction</h2>
            <p>Welcome to this comprehensive guide on ${title}.</p>
            
            <h2>Main Content</h2>
            <p>Add your detailed content here following the template structure.</p>
            
            <h2>Implementation</h2>
            <p>Practical implementation details and code examples.</p>
            
            <h2>Conclusion</h2>
            <p>Summary and next steps for ${title}.</p>
        `;
    }

    generateTOC(title, category) {
        const tocItems = {
            'iot': [
                { id: 'introduction', text: 'Pendahuluan', level: 1 },
                { id: 'prerequisites', text: 'Persiapan dan Persyaratan', level: 1 },
                { id: 'setup', text: 'Setup Development Environment', level: 1 },
                { id: 'implementation', text: 'Implementasi', level: 1 },
                { id: 'troubleshooting', text: 'Troubleshooting', level: 1 },
                { id: 'conclusion', text: 'Kesimpulan', level: 1 }
            ],
            'power-systems': [
                { id: 'introduction', text: 'Pendahuluan', level: 1 },
                { id: 'theory', text: 'Landasan Teori', level: 1 },
                { id: 'matlab', text: 'Implementasi MATLAB', level: 1 },
                { id: 'safety', text: 'Pertimbangan Keselamatan', level: 1 },
                { id: 'conclusion', text: 'Kesimpulan', level: 1 }
            ],
            'machine-learning': [
                { id: 'introduction', text: 'Pendahuluan', level: 1 },
                { id: 'data-preparation', text: 'Persiapan Data', level: 1 },
                { id: 'implementation', text: 'Implementasi Python', level: 1 },
                { id: 'applications', text: 'Aplikasi Engineering', level: 1 },
                { id: 'conclusion', text: 'Kesimpulan', level: 1 }
            ],
            'programming': [
                { id: 'introduction', text: 'Pendahuluan', level: 1 },
                { id: 'fundamentals', text: 'Fundamental Concepts', level: 1 },
                { id: 'implementation', text: 'Implementasi Praktis', level: 1 },
                { id: 'conclusion', text: 'Kesimpulan', level: 1 }
            ],
            'electronics': [
                { id: 'introduction', text: 'Pendahuluan', level: 1 },
                { id: 'theory', text: 'Teori Dasar', level: 1 },
                { id: 'implementation', text: 'Implementasi Rangkaian', level: 1 },
                { id: 'conclusion', text: 'Kesimpulan', level: 1 }
            ],
            'automation': [
                { id: 'introduction', text: 'Pendahuluan', level: 1 },
                { id: 'control-systems', text: 'Control Systems', level: 1 },
                { id: 'implementation', text: 'Implementasi Sistem', level: 1 },
                { id: 'conclusion', text: 'Kesimpulan', level: 1 }
            ]
        };

        const items = tocItems[category] || tocItems['programming'];
        
        return items.map(item => 
            `<a href="#${item.id}" class="block py-1 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors ${item.level === 2 ? 'ml-4' : 'font-medium'}">${item.text}</a>`
        ).join('\n            ');
    }

    generateRelatedArticles(category) {
        const articles = this.getArticlesByCategory(category).slice(0, 2);
        
        return articles.map(article => `
            <a href="/${article.filename}" class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-md transition-shadow block">
                <h4 class="font-semibold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">${article.title}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">${article.description}</p>
                <div class="mt-2">
                    <span class="text-xs bg-${this.categoryConfig[article.category].color}-100 dark:bg-${this.categoryConfig[article.category].color}-900 text-${this.categoryConfig[article.category].color}-800 dark:text-${this.categoryConfig[article.category].color}-200 px-2 py-1 rounded">${this.categoryConfig[article.category].name}</span>
                </div>
            </a>
        `).join('') || '<p class="text-gray-500">No related articles found.</p>';
    }

    calculateWordCount(content) {
        return content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    }

    saveArticleMetadata(metadata) {
        const metadataPath = path.join(this.assetsDir, 'data', 'articles.json');
        let articles = [];
        
        if (fs.existsSync(metadataPath)) {
            articles = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        }
        
        // Remove existing article with same slug
        articles = articles.filter(article => article.slug !== metadata.slug);
        
        // Add new article
        articles.unshift(metadata);
        
        fs.writeFileSync(metadataPath, JSON.stringify(articles, null, 2));
    }

    getArticlesByCategory(category) {
        const metadataPath = path.join(this.assetsDir, 'data', 'articles.json');
        
        if (!fs.existsSync(metadataPath)) {
            return [];
        }
        
        const articles = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        return articles.filter(article => article.category === category);
    }

    // Build search index
    buildSearchIndex() {
        const metadataPath = path.join(this.assetsDir, 'data', 'articles.json');
        
        if (!fs.existsSync(metadataPath)) {
            console.log('❌ No articles found. Create some articles first.');
            return;
        }
        
        const articles = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        
        const searchIndex = {
            articles: articles.map(article => ({
                title: article.title,
                url: `/${article.filename}`,
                excerpt: article.description,
                content: '', // Would need to extract from HTML
                tags: article.tags,
                category: article.category
            }))
        };
        
        const indexPath = path.join(this.assetsDir, 'data', 'search-index.json');
        fs.writeFileSync(indexPath, JSON.stringify(searchIndex, null, 2));
        
        console.log(`✅ Search index built with ${articles.length} articles`);
    }

    // Update blog index page
    updateBlogIndex() {
        const metadataPath = path.join(this.assetsDir, 'data', 'articles.json');
        
        if (!fs.existsSync(metadataPath)) {
            console.log('❌ No articles found.');
            return;
        }
        
        const articles = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        
        // Generate blog cards HTML
        const blogCards = articles.map(article => {
            const categoryConfig = this.categoryConfig[article.category];
            return `
                <article class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300" data-aos="fade-up">
                    <img src="/assets/images/blog/${article.slug}-featured.jpg" alt="${article.title}" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-3">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${categoryConfig.color}-100 text-${categoryConfig.color}-800 dark:bg-${categoryConfig.color}-900 dark:text-${categoryConfig.color}-200">
                                ${categoryConfig.name}
                            </span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">${article.readTime} min read</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <a href="/${article.filename}">${article.title}</a>
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">${article.description}</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center text-sm text-gray-500 dark:text-gray-500">
                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                                </svg>
                                ${article.publishDate}
                            </div>
                            <a href="/${article.filename}" class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                                Read More
                                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
        
        console.log(`✅ Generated blog cards for ${articles.length} articles`);
        
        // Auto-update blog.html
        this.injectCardsIntoBlogHtml(blogCards, articles.length);
        
        return blogCards;
    }

    // Inject generated cards into blog.html (MERGE with existing)
    injectCardsIntoBlogHtml(blogCards, articleCount) {
        const blogHtmlPath = path.join(this.baseDir, 'blog.html');
        
        if (!fs.existsSync(blogHtmlPath)) {
            console.log('❌ blog.html not found');
            return;
        }
        
        let blogContent = fs.readFileSync(blogHtmlPath, 'utf8');
        
        // Check if we need to restore original cards first
        const hasOriginalCards = blogContent.includes('data-category="iot tutorial"') || 
                                blogContent.includes('data-category="power"') ||
                                blogContent.includes('data-category="ml"');
        
        if (!hasOriginalCards) {
            console.log('🔄 Restoring original article cards...');
            this.restoreOriginalCards(blogContent);
            // Re-read the updated content
            blogContent = fs.readFileSync(blogHtmlPath, 'utf8');
        }
        
        console.log(`✅ Blog.html already contains original articles - no injection needed`);
        console.log(`📚 Use the web interface to see all ${articleCount} articles`);
    }

    // Restore original hardcoded cards
    restoreOriginalCards(blogContent) {
        const originalCards = `
                    <!-- Article 1 -->
                    <article class="blog-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700" data-category="iot tutorial" data-aos="fade-up">
                        <div class="relative h-48 overflow-hidden">
                            <img src="assets/blog/esp32.webp" alt="ESP32 Development Board" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                            <div class="absolute top-4 left-4 z-10">
                                <span class="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">IoT Tutorial</span>
                            </div>
                            <div class="absolute top-4 right-4 z-10">
                                <span class="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs shadow-lg">8 min read</span>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>August 10, 2025</span>
                                <span class="mx-2">•</span>
                                <span>IoT</span>
                            </div>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                                Complete Guide to ESP32 Development: From Setup to IoT Project
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                Learn how to set up ESP32 development environment, understand pin configurations, and build a complete IoT monitoring system with web interface and real-time data visualization.
                            </p>
                            <div class="flex justify-between items-center">
                                <div class="flex flex-wrap gap-2">
                                    <span class="text-xs bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-2 py-1 rounded">ESP32</span>
                                    <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">Arduino</span>
                                    <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">IoT</span>
                                </div>
                                <a href="blog-esp32-guide.html" class="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium text-sm flex items-center transition-colors">
                                    Read More
                                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </article>

                    <!-- Article 2 -->
                    <article class="blog-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700" data-category="power" data-aos="fade-up" data-aos-delay="100">
                        <div class="relative h-48 overflow-hidden">
                            <img src="assets/blog/spwm.jpg" alt="SPWM Inverter Waveform" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                            <div class="absolute top-4 left-4 z-10">
                                <span class="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">Power Systems</span>
                            </div>
                            <div class="absolute top-4 right-4 z-10">
                                <span class="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs shadow-lg">12 min read</span>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>August 5, 2025</span>
                                <span class="mx-2">•</span>
                                <span>Analysis</span>
                            </div>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                                Understanding SPWM Inverters: Theory, Design, and MATLAB Implementation
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                Deep dive into Sinusoidal Pulse Width Modulation techniques for power electronics applications. Includes mathematical analysis, design considerations, and complete MATLAB/Simulink implementation.
                            </p>
                            <div class="flex justify-between items-center">
                                <div class="flex flex-wrap gap-2">
                                    <span class="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">MATLAB</span>
                                    <span class="text-xs bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-2 py-1 rounded">Simulink</span>
                                    <span class="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">Power Electronics</span>
                                </div>
                                <a href="blog-spwm-inverters.html" class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm flex items-center transition-colors">
                                    Read More
                                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </article>

                    <!-- Article 3 -->
                    <article class="blog-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700" data-category="ml" data-aos="fade-up" data-aos-delay="200">
                        <div class="relative h-48 overflow-hidden">
                            <img src="assets/blog/machine learning.jpg" alt="Machine Learning Neural Network" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                            <div class="absolute top-4 left-4 z-10">
                                <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">Machine Learning</span>
                            </div>
                            <div class="absolute top-4 right-4 z-10">
                                <span class="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs shadow-lg">15 min read</span>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>July 28, 2025</span>
                                <span class="mx-2">•</span>
                                <span>Research</span>
                            </div>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer">
                                Machine Learning for Predictive Maintenance in Electrical Systems
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                Research findings on implementing ML algorithms for predicting equipment failures in power distribution systems. Includes data preprocessing, feature engineering, and model deployment strategies.
                            </p>
                            <div class="flex justify-between items-center">
                                <div class="flex flex-wrap gap-2">
                                    <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">Python</span>
                                    <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">TensorFlow</span>
                                    <span class="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">Predictive</span>
                                </div>
                                <a href="blog-ml-electrical.html" class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium text-sm flex items-center transition-colors">
                                    Read More
                                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </article>
        `;
        
        // Inject original cards back
        const gridStartMarker = '<div id="articles-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">';
        const gridEndMarker = '                </div>';
        
        const gridStartIndex = blogContent.indexOf(gridStartMarker);
        if (gridStartIndex !== -1) {
            let gridEndIndex = gridStartIndex + gridStartMarker.length;
            let depth = 1;
            let searchIndex = gridEndIndex;
            
            while (depth > 0 && searchIndex < blogContent.length) {
                const nextDiv = blogContent.indexOf('<div', searchIndex);
                const nextCloseDiv = blogContent.indexOf('</div>', searchIndex);
                
                if (nextCloseDiv === -1) break;
                
                if (nextDiv !== -1 && nextDiv < nextCloseDiv) {
                    depth++;
                    searchIndex = nextDiv + 4;
                } else {
                    depth--;
                    if (depth === 0) {
                        gridEndIndex = nextCloseDiv;
                        break;
                    }
                    searchIndex = nextCloseDiv + 6;
                }
            }
            
            const beforeGrid = blogContent.substring(0, gridStartIndex + gridStartMarker.length);
            const afterGrid = blogContent.substring(gridEndIndex);
            
            const newContent = beforeGrid + originalCards + '\n                ' + afterGrid;
            
            // Write back to blog.html
            const blogHtmlPath = path.join(this.baseDir, 'blog.html');
            fs.writeFileSync(blogHtmlPath, newContent, 'utf8');
            
            console.log('✅ Original article cards restored to blog.html');
        }
    }

    // Optimize images
    optimizeImages() {
        const imagesDir = path.join(this.assetsDir, 'images', 'blog');
        
        if (!fs.existsSync(imagesDir)) {
            console.log('❌ Blog images directory not found');
            return;
        }
        
        const images = fs.readdirSync(imagesDir).filter(file => 
            /\.(jpg|jpeg|png|webp)$/i.test(file)
        );
        
        console.log(`🖼️  Found ${images.length} images to optimize`);
        
        // Here you could implement image optimization logic
        // For now, just list the images
        images.forEach(image => {
            console.log(`  📸 ${image}`);
        });
        
        console.log('💡 Consider using tools like imagemin or sharp for automatic optimization');
    }

    // Main CLI handler
    handleCommand(command, options = {}) {
        switch (command) {
            case 'create':
                return this.createArticle(options);
            
            case 'build-index':
                this.buildSearchIndex();
                return this.updateBlogIndex();
            
            case 'optimize-images':
                return this.optimizeImages();
            
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
📝 Blog Generator - Help

Usage:
  node blog-generator.js <command> [options]

Commands:
  create           Create a new blog article
  build-index      Build search index and update blog listing
  optimize-images  Optimize blog images
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
  node blog-generator.js create --title "ESP32 WiFi Setup" --category iot
  node blog-generator.js create --title "Power System Analysis" --category power-systems --difficulty Advanced
  node blog-generator.js build-index
        `);
    }
}

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (!command) {
        const generator = new BlogGenerator();
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
        const generator = new BlogGenerator();
        generator.handleCommand(command, options);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = BlogGenerator;
