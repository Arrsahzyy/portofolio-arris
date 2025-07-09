// Menunggu hingga seluruh konten halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    
    // =================================================================
    // 1. INISIALISASI LIBRARY
    // =================================================================

    // Inisialisasi AOS (Animate On Scroll) untuk animasi saat scroll
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
        });
    }

    // Inisialisasi Typed.js untuk efek mengetik
    const typedElement = document.getElementById('typed-text');
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: ['Problem Solver.', 'Inovator.', 'Pengembang Software.', 'Pecinta Robotika.', 'Future Engineer, Machine Learning Learner.'],
            typeSpeed: 70,
            backSpeed: 40,
            loop: true,
            smartBackspace: true,
        });
    }

    // Render semua ikon Lucide
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }

    // =================================================================
    // 2. ANIMASI GSAP (GreenSock Animation Platform)
    // =================================================================

    // Periksa apakah GSAP tersedia
    if (typeof gsap !== 'undefined') {
        // Animasi intro untuk Hero Section
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            gsap.timeline({ defaults: { ease: "power3.out" } })
                .to('.hero-content > div', { opacity: 1, y: 0, duration: 1, delay: 0.2 })
                .to('.hero-content > h1', { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
                .to('.hero-content > p', { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }, "-=0.6")
                .to('.hero-content > .flex', { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");
        }
        
        // Animasi "magnetic" untuk tombol
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;

                gsap.to(btn, { x: x, y: y, duration: 0.5, ease: 'power3.out' });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
            });
        });
    }


    // =================================================================
    // 3. EFEK PARTIKEL INTERAKTIF PADA CANVAS
    // =================================================================

    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return; // Exit if canvas not found
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Exit if context not available
    
    // Fungsi untuk mengatur ukuran canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();

    let particlesArray = [];

    // Objek untuk posisi mouse
    const mouse = {
        x: null,
        y: null,
        radius: Math.min(canvas.height, canvas.width) / 80
    }

    window.addEventListener('mousemove', e => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // Class untuk membuat satu partikel
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    // Fungsi untuk inisialisasi partikel
    function initParticles() {
        particlesArray = [];
        if (canvas.width === 0 || canvas.height === 0) return;
        
        let numberOfParticles = Math.min(100, (canvas.height * canvas.width) / 9000);
        let particleColor = document.documentElement.classList.contains('dark') ? 'rgba(45, 212, 191, 0.5)' : 'rgba(0, 0, 0, 0.3)';
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = Math.random() * (canvas.width - size * 2) + size;
            let y = Math.random() * (canvas.height - size * 2) + size;
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }

    // Fungsi untuk menghubungkan partikel yang berdekatan
    function connectParticles() {
        let lineColor = document.documentElement.classList.contains('dark') ? 'rgba(45, 212, 191, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        let maxDistance = Math.min(canvas.width, canvas.height) / 7;
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let distance = Math.sqrt(
                    Math.pow(particlesArray[a].x - particlesArray[b].x, 2) +
                    Math.pow(particlesArray[a].y - particlesArray[b].y, 2)
                );
                
                if (distance < maxDistance) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Loop animasi
    function animateParticles() {
        if (!ctx || !canvas) return;
        
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (particlesArray.length > 0) {
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
        }
    }
    
    // Event listener untuk resize window
    window.addEventListener('resize', () => {
        resizeCanvas();
        mouse.radius = Math.min(canvas.height, canvas.width) / 80;
        initParticles();
    });

    // Inisialisasi dan mulai animasi partikel
    initParticles();
    animateParticles();


    // =================================================================
    // 4. FUNGSI UTILITAS LAINNYA
    // =================================================================

    // Fungsionalitas Dark/Light Mode
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const htmlEl = document.documentElement;

    // Periksa apakah elemen ada sebelum menggunakan
    if (themeToggleBtn && themeToggleDarkIcon && themeToggleLightIcon) {
        // Inisialisasi tema
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            htmlEl.classList.add('dark');
            themeToggleLightIcon.classList.remove('hidden');
            themeToggleDarkIcon.classList.add('hidden');
        } else {
            htmlEl.classList.remove('dark');
            themeToggleDarkIcon.classList.remove('hidden');
            themeToggleLightIcon.classList.add('hidden');
        }

        // Event listener untuk toggle theme
        themeToggleBtn.addEventListener('click', function() {
            htmlEl.classList.toggle('dark');
            const isDark = htmlEl.classList.contains('dark');
            localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
            
            // Update ikon
            themeToggleDarkIcon.classList.toggle('hidden', isDark);
            themeToggleLightIcon.classList.toggle('hidden', !isDark);
            
            // Re-inisialisasi partikel dengan warna baru
            if (typeof initParticles === 'function') {
                initParticles();
            }
        });
    }

    // Navigasi Smooth Scroll & Active Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav a');
    const mobileNavLinks = document.querySelectorAll('#mobile-menu a');

    function setActiveLink() {
        let current = 'hero';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop - 150 && window.pageYOffset < sectionTop + sectionHeight - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === current) {
                link.classList.add('active');
            }
        });

        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // Jalankan setActiveLink hanya jika ada section dan navLinks
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', setActiveLink);
        setActiveLink(); // Panggil saat memuat
    }

    // Efek Navbar saat scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('py-2');
                navbar.classList.remove('py-4');
            } else {
                navbar.classList.add('py-4');
                navbar.classList.remove('py-2');
            }
        });
    }

    // Fungsionalitas Salin Email
    const copyBtn = document.getElementById('copy-email-btn');
    const emailTextEl = document.getElementById('email-text');
    const copyFeedback = document.getElementById('copy-feedback');

    if (copyBtn && emailTextEl && copyFeedback) {
        copyBtn.addEventListener('click', () => {
            const emailText = emailTextEl.innerText;
            
            // Cek apakah browser mendukung clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(emailText).then(() => {
                    showCopyFeedback();
                }).catch(err => {
                    console.error('Gagal menyalin email:', err);
                    // Fallback ke method lama
                    fallbackCopyToClipboard(emailText);
                });
            } else {
                // Fallback untuk browser yang tidak mendukung clipboard API
                fallbackCopyToClipboard(emailText);
            }
        });
    }

    function showCopyFeedback() {
        copyFeedback.classList.remove('opacity-0');
        setTimeout(() => {
            copyFeedback.classList.add('opacity-0');
        }, 2000);
    }

    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback();
        } catch (err) {
            console.error('Gagal menyalin email:', err);
        }
        
        document.body.removeChild(textArea);
    }

    // Update tahun di Footer
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }


    // =================================================================
    // 5. ANIMASI INTERAKTIF SKILL CARDS
    // =================================================================
    
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        // Mouse enter animation
        card.addEventListener('mouseenter', function(e) {
            // Create ripple effect
            const ripple = document.createElement('div');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            ripple.classList.add('ripple-effect');
            
            card.appendChild(ripple);
            
            // Add glow effect
            card.style.boxShadow = '0 0 30px rgba(45, 212, 191, 0.6)';
            
            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
        
        // Mouse leave animation
        card.addEventListener('mouseleave', function() {
            // Reset styles
            card.style.boxShadow = '';
            card.style.transform = '';
        });
        
        // Mouse move animation (following cursor)
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `translateY(-15px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
    
    // Add CSS for ripple effect
    const rippleStyles = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(45, 212, 191, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = rippleStyles;
    document.head.appendChild(styleSheet);


    // =================================================================
    // 6. ANIMASI INTERAKTIF FOTO ABOUT SECTION
    // =================================================================
    
    const photoContainer = document.querySelector('.photo-container');
    const aboutPhoto = document.querySelector('.about-photo');
    
    if (photoContainer && aboutPhoto) {
        // Mouse move effect - 3D rotation following cursor
        photoContainer.addEventListener('mousemove', function(e) {
            const rect = photoContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;
            
            aboutPhoto.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        // Mouse leave - reset transform
        photoContainer.addEventListener('mouseleave', function() {
            aboutPhoto.style.transform = '';
        });
        
        // Mouse enter - add special effects
        photoContainer.addEventListener('mouseenter', function() {
            // Create sparkle effect
            createSparkles(photoContainer);
        });
        
        // Click effect - pulse animation
        photoContainer.addEventListener('click', function() {
            photoContainer.style.animation = 'none';
            photoContainer.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                photoContainer.style.transform = '';
                photoContainer.style.animation = 'float-photo 6s ease-in-out infinite';
            }, 150);
        });
    }
    
    // Function to create sparkle effect
    function createSparkles(container) {
        for (let i = 0; i < 12; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, rgba(45, 212, 191, 1) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 20;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: sparkle-animation 1.5s ease-out forwards;
            `;
            
            container.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1500);
        }
    }
    
    // Add sparkle animation styles
    const sparkleStyles = `
        @keyframes sparkle-animation {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: scale(1) rotate(180deg);
                opacity: 1;
            }
            100% {
                transform: scale(0) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    
    const sparkleStyleSheet = document.createElement('style');
    sparkleStyleSheet.textContent = sparkleStyles;
    document.head.appendChild(sparkleStyleSheet);


    // =================================================================
    // 7. PERBAIKAN ICON SYSTEM UNTUK SKILL CARDS
    // =================================================================
    
    // Ensure all skill icons are displayed properly
    const skillIcons = document.querySelectorAll('.skill-icon');
    
    skillIcons.forEach(iconContainer => {
        const img = iconContainer.querySelector('img');
        const fallbackIcon = iconContainer.querySelector('i');
        
        if (img && fallbackIcon) {
            // Set fallback icon to display by default
            fallbackIcon.style.display = 'flex';
            fallbackIcon.style.alignItems = 'center';
            fallbackIcon.style.justifyContent = 'center';
            fallbackIcon.style.width = '2.5rem';
            fallbackIcon.style.height = '2.5rem';
            fallbackIcon.style.color = '#14b8a6';
            
            // Try to load the image
            img.onload = function() {
                fallbackIcon.style.display = 'none';
                img.style.display = 'block';
            };
            
            img.onerror = function() {
                img.style.display = 'none';
                fallbackIcon.style.display = 'flex';
            };
            
            // Force check if image exists
            if (img.complete) {
                if (img.naturalWidth === 0) {
                    img.style.display = 'none';
                    fallbackIcon.style.display = 'flex';
                } else {
                    fallbackIcon.style.display = 'none';
                    img.style.display = 'block';
                }
            }
        }
    });
    
    // Add enhanced hover effects for skill icons
    skillIcons.forEach(icon => {
        const img = icon.querySelector('img');
        const lucideIcon = icon.querySelector('i');
        
        icon.addEventListener('mouseenter', function() {
            if (img && img.style.display !== 'none') {
                img.style.transform = 'scale(1.1) rotate(5deg)';
                img.style.filter = 'brightness(1.2) saturate(1.3)';
            }
            if (lucideIcon && lucideIcon.style.display !== 'none') {
                lucideIcon.style.transform = 'scale(1.2) rotate(10deg)';
                lucideIcon.style.color = '#0d9488';
            }
        });
        
        icon.addEventListener('mouseleave', function() {
            if (img) {
                img.style.transform = '';
                img.style.filter = '';
            }
            if (lucideIcon) {
                lucideIcon.style.transform = '';
                lucideIcon.style.color = '#14b8a6';
            }
        });
    });


    // =================================================================
    // 8. PERBAIKAN UNTUK MEMASTIKAN LUCIDE ICONS TAMPIL
    // =================================================================
    
    // Pastikan semua ikon Lucide di-render dengan benar
    function ensureLucideIconsDisplay() {
        // Render ulang semua ikon Lucide
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        
        // Pastikan ikon sosial media visible
        const socialIcons = document.querySelectorAll('.social-icon i');
        socialIcons.forEach(icon => {
            icon.style.display = 'flex';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
        });
        
        // Pastikan ikon download visible
        const downloadIcons = document.querySelectorAll('.btn-primary i, .btn-secondary i');
        downloadIcons.forEach(icon => {
            icon.style.display = 'inline-flex';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
        });
    }
    
    // Panggil fungsi setelah DOM loaded
    ensureLucideIconsDisplay();
    
    // Panggil lagi setelah semua library dimuat
    setTimeout(ensureLucideIconsDisplay, 500);
    
    // =================================================================
    // 9. SMOOTH SCROLL UNTUK NAVIGATION DOWNLOAD
    // =================================================================
    
    // Tambahkan smooth scroll untuk link download di navigation
    const downloadNavLinks = document.querySelectorAll('a[href="#download"]');
    downloadNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('download');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });



    // =================================================================
    // 10. PERBAIKAN POSITIONING SKILL ICONS
    // =================================================================
    
    // Perbaiki positioning ikon skill cards
    function fixSkillIconPositioning() {
        const skillCards = document.querySelectorAll('.skill-card');
        
        skillCards.forEach(card => {
            const iconContainer = card.querySelector('.skill-icon');
            const img = iconContainer?.querySelector('img');
            const lucideIcon = iconContainer?.querySelector('i[data-lucide]');
            
            if (iconContainer) {
                // Reset semua positioning
                iconContainer.style.display = 'flex';
                iconContainer.style.alignItems = 'center';
                iconContainer.style.justifyContent = 'center';
                iconContainer.style.textAlign = 'center';
                iconContainer.style.position = 'relative';
                iconContainer.style.left = 'auto';
                iconContainer.style.right = 'auto';
                iconContainer.style.transform = 'none';
                
                // Perbaiki positioning image
                if (img) {
                    img.style.position = 'static';
                    img.style.left = 'auto';
                    img.style.right = 'auto';
                    img.style.transform = 'none';
                    img.style.margin = '0 auto';
                    img.style.display = 'block';
                }
                
                // Perbaiki positioning lucide icon
                if (lucideIcon) {
                    lucideIcon.style.position = 'static';
                    lucideIcon.style.left = 'auto';
                    lucideIcon.style.right = 'auto';
                    lucideIcon.style.transform = 'none';
                    lucideIcon.style.margin = '0 auto';
                    lucideIcon.style.display = 'flex';
                    lucideIcon.style.alignItems = 'center';
                    lucideIcon.style.justifyContent = 'center';
                }
            }
        });
    }
    
    // Panggil setelah DOM loaded
    fixSkillIconPositioning();
    
    // Panggil lagi setelah Lucide icons di-render
    setTimeout(fixSkillIconPositioning, 1000);
    
    // =================================================================
    // 11. PERBAIKAN THEME TOGGLE ICON
    // =================================================================
    
    // Pastikan theme toggle icons tampil dengan benar
    function fixThemeToggleIcons() {
        const lightIcon = document.getElementById('theme-toggle-light-icon');
        const darkIcon = document.getElementById('theme-toggle-dark-icon');
        
        if (lightIcon && darkIcon) {
            // Perbaiki styling untuk light icon (sun)
            lightIcon.style.fill = 'none';
            lightIcon.style.stroke = 'currentColor';
            lightIcon.style.strokeWidth = '2';
            lightIcon.style.strokeLinecap = 'round';
            lightIcon.style.strokeLinejoin = 'round';
            
            // Perbaiki styling untuk dark icon (moon)
            darkIcon.style.fill = 'currentColor';
            darkIcon.style.stroke = 'none';
        }
    }
    
    // Panggil setelah DOM loaded
    fixThemeToggleIcons();

    // Handle social media icons specifically
    const socialIcons = document.querySelectorAll('.social-icon-container');
    
    socialIcons.forEach(iconContainer => {
        const img = iconContainer.querySelector('img');
        const fallbackIcon = iconContainer.querySelector('i');
        
        if (img && fallbackIcon) {
            // Set fallback icon to display by default
            fallbackIcon.style.display = 'flex';
            fallbackIcon.style.alignItems = 'center';
            fallbackIcon.style.justifyContent = 'center';
            fallbackIcon.style.width = '100%';
            fallbackIcon.style.height = '100%';
            fallbackIcon.style.color = '#14b8a6';
            
            // Try to load the image
            img.onload = function() {
                fallbackIcon.style.display = 'none';
                img.style.display = 'block';
            };
            
            img.onerror = function() {
                img.style.display = 'none';
                fallbackIcon.style.display = 'flex';
            };
            
            // Force check if image exists
            if (img.complete) {
                if (img.naturalWidth === 0) {
                    img.style.display = 'none';
                    fallbackIcon.style.display = 'flex';
                } else {
                    fallbackIcon.style.display = 'none';
                    img.style.display = 'block';
                }
            }
        }
    });


    // =================================================================
    // 12. DOWNLOAD FUNCTIONALITY FIX
    // =================================================================
    
    // Menangani download CV dan Sertifikat
    function initializeDownloadButtons() {
        // Ambil semua tombol download
        const downloadButtons = document.querySelectorAll('a[download]');
        
        downloadButtons.forEach(button => {
            // Pastikan tombol dapat diklik
            button.style.pointerEvents = 'auto';
            button.style.cursor = 'pointer';
            button.style.position = 'relative';
            button.style.zIndex = '200';
            
            // Event listener untuk download
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const href = this.getAttribute('href');
                const downloadName = this.getAttribute('download');
                
                console.log('Download clicked:', href);
                
                // Buat element anchor baru untuk memastikan download
                const tempLink = document.createElement('a');
                tempLink.href = href;
                tempLink.download = downloadName || '';
                tempLink.style.display = 'none';
                
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                
                // Feedback visual
                const originalText = this.innerHTML;
                this.innerHTML = '<i data-lucide="check" class="w-5 h-5 mr-2"></i>Downloaded!';
                
                // Render ulang ikon
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    lucide.createIcons();
                }
                
                // Kembali ke teks original setelah 2 detik
                setTimeout(() => {
                    this.innerHTML = originalText;
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    }
                }, 2000);
            });
            
            // Hover effect khusus
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
                this.style.boxShadow = '0 10px 25px rgba(45, 212, 191, 0.3)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = 'none';
            });
        });
    }
    
    // Panggil fungsi setelah DOM loaded
    initializeDownloadButtons();
    
    // Panggil lagi setelah delay untuk memastikan
    setTimeout(initializeDownloadButtons, 1000);


    // =================================================================
    // 13. SMOOTH SKILL CARDS ANIMATION OPTIMIZATION
    // =================================================================
    
    function initSmoothSkillAnimations() {
        const skillCards = document.querySelectorAll('.skill-card');
        
        // Tambahkan class no-animate sementara untuk mencegah lag saat load
        skillCards.forEach(card => {
            card.classList.add('no-animate');
        });
        
        // Hapus no-animate class setelah delay untuk memulai animasi
        setTimeout(() => {
            skillCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('no-animate');
                }, index * 100); // Stagger removal untuk efek yang lebih natural
            });
        }, 500);
        
        // Optimasi untuk intersection observer - pause animasi ketika tidak terlihat
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const card = entry.target;
                    if (entry.isIntersecting) {
                        card.style.animationPlayState = 'running';
                    } else {
                        card.style.animationPlayState = 'paused';
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            skillCards.forEach(card => {
                observer.observe(card);
            });
        }
        
        // Optimasi hover - tambahkan debounce untuk performa
        skillCards.forEach(card => {
            let hoverTimeout;
            
            card.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                card.style.animationPlayState = 'paused';
            });
            
            card.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    card.style.animationPlayState = 'running';
                }, 100);
            });
        });
        
        console.log('Smooth skill card animations initialized');
    }
    
    // Jalankan optimasi animasi skill cards
    initSmoothSkillAnimations();
});
