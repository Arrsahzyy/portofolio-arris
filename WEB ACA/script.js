document.addEventListener('DOMContentLoaded', () => {
    // Enhanced DOM element selections
    const startButton = document.getElementById('startButton');
    const nextButtons = document.querySelectorAll('.nextButton');
    const giftIcon = document.getElementById('giftIcon');
    const giftMessage = document.getElementById('giftMessage');
    const musicInfo = document.getElementById('music-info');
    const typedMessageElement = document.getElementById('typed-message');
    const heartsContainer = document.querySelector('.floating-hearts-container');
    const currentDateElement = document.getElementById('currentDate');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const backgroundMusic = document.getElementById('background-music');
    const particlesContainer = document.getElementById('particles-container');

    const sections = {
        opening: document.getElementById('opening-message'),
        wishes: document.getElementById('wishes'),
        memories: document.getElementById('memories'),
        specialNote: document.getElementById('special-note'),
        closing: document.getElementById('closing-message')
    };

    let currentSectionId = 'opening';
    let player; // YouTube player instance
    let isPlayerActuallyReady = false;
    let isMusicPlaying = false;
    let musicInitialized = false;
    let audioContext = null;
    let hasUserInteracted = false;

    console.log("Enhanced script loaded. DOMContentLoaded fired.");

    // Initialize audio context for better browser compatibility
    initializeAudioContext();

    // Initialize current date
    if (currentDateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = today.toLocaleDateString('id-ID', options);
    }

    // Initialize letter animation for title
    initializeLetterAnimation();
    
    // Initialize particles background
    initializeParticles();
    
    // Initialize music system
    initializeMusicSystem();

    // Initialize interactive elements
    initializeInteractiveElements();

    // Enhanced Functions
    
    // Initialize audio context for better browser support
    function initializeAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
        } catch (e) {
            console.warn("AudioContext not supported:", e);
        }
    }

    // Enhanced user interaction tracking with immediate audio context unlock
    function setupUserInteractionTracking() {
        const events = ['click', 'touchstart', 'keydown', 'mousemove', 'scroll'];
        const handleFirstInteraction = (event) => {
            if (!hasUserInteracted) {
                hasUserInteracted = true;
                console.log("First user interaction detected:", event.type);
                
                // Immediately unlock audio context
                if (audioContext && audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                        console.log("AudioContext resumed successfully");
                        // Try to start music immediately
                        setTimeout(attemptMusicStart, 100);
                    }).catch(e => console.warn("AudioContext resume failed:", e));
                }
                
                // Also try without audio context
                setTimeout(attemptMusicStart, 200);
                
                // Remove listeners after first interaction
                events.forEach(event => {
                    document.removeEventListener(event, handleFirstInteraction, true);
                });
            }
        };

        events.forEach(event => {
            document.addEventListener(event, handleFirstInteraction, { once: false, capture: true });
        });
        
        // Also listen for visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && hasUserInteracted && !isMusicPlaying) {
                setTimeout(attemptMusicStart, 500);
            }
        });
    }
    
    // Initialize letter animation for sparkle title
    function initializeLetterAnimation() {
        const letters = document.querySelectorAll('.letter');
        letters.forEach((letter, index) => {
            letter.style.setProperty('--i', index);
            
            // Add enhanced animation with random delays
            const randomDelay = Math.random() * 200;
            setTimeout(() => {
                letter.style.opacity = '1';
                letter.style.transform = 'translateY(0) rotate(0deg) scale(1)';
                
                // Add sparkle effect
                addSparkleEffect(letter);
            }, index * 100 + 500 + randomDelay);
        });
    }

    // Add sparkle effect to letters
    function addSparkleEffect(element) {
        const sparkle = document.createElement('div');
        sparkle.className = 'letter-sparkle';
        sparkle.innerHTML = '✨';
        element.style.position = 'relative';
        element.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 2000);
    }

    // Initialize floating particles background
    function initializeParticles() {
        if (!particlesContainer) return;
        
        const particleCount = 25;
        const particles = ['✨', '💕', '🌸', '💖', '🦋', '💫', '🌟', '💗', '🌺'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-element enhanced-particle';
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.setProperty('--delay', Math.random() * 10 + 's');
            particle.style.setProperty('--duration', (Math.random() * 8 + 6) + 's');
            particle.style.fontSize = (Math.random() * 1.5 + 0.8) + 'em';
            particle.style.setProperty('--rotate-speed', (Math.random() * 4 + 2) + 's');
            
            // Add interactive hover effect
            particle.addEventListener('mouseenter', () => {
                particle.style.transform = 'scale(1.5) rotate(180deg)';
                particle.style.transition = 'transform 0.3s ease';
            });
            
            particle.addEventListener('mouseleave', () => {
                particle.style.transform = '';
                particle.style.transition = '';
            });
            
            particlesContainer.appendChild(particle);
        }
    }

    // Simplified music system initialization - LOCAL ONLY
    function initializeMusicSystem() {
        console.log("Initializing local music system...");
        
        // Setup user interaction tracking first
        setupUserInteractionTracking();
        
        // Update music info
        if (musicInfo) {
            musicInfo.textContent = '🎵 Klik tombol untuk memulai musik! 💕';
        }

        // Initialize local music sources only
        initializeMultipleMusicSources();
        setupMusicToggle();
        
        console.log("Local music system initialized");
    }
    }

    // Initialize NIKI MP3 music source
    function initializeMultipleMusicSources() {
        // Setup local MP3 file only
        if (backgroundMusic) {
            backgroundMusic.volume = 0.7;
            backgroundMusic.loop = true;
            
            backgroundMusic.addEventListener('loadstart', () => {
                console.log("Local music: Loading started");
                updateMusicStatus('🎵 Memuat musik lokal... 💕');
            });
            
            backgroundMusic.addEventListener('canplaythrough', () => {
                console.log("Local music: Can play through");
                updateMusicStatus('🎵 Musik siap diputar! 💕');
                musicInitialized = true;
            });
            
            backgroundMusic.addEventListener('play', () => {
                console.log("Local music: Started playing");
                isMusicPlaying = true;
                updateMusicStatus('🎵 Musik sedang diputar... 💕');
                updateMusicButton('⏸️', 'Pause');
                if (musicInfo) musicInfo.style.display = 'none';
            });
            
            backgroundMusic.addEventListener('pause', () => {
                console.log("Local music: Paused");
                isMusicPlaying = false;
                updateMusicStatus('🎵 Musik dijeda 💕');
                updateMusicButton('🎵', 'Play');
                if (musicInfo) musicInfo.style.display = 'block';
            });
            
            backgroundMusic.addEventListener('error', (e) => {
                console.error("Local music error:", e);
                updateMusicStatus('🎵 Error memuat musik lokal 😔');
            });
            
            // Try to load the music
            try {
                backgroundMusic.load();
            } catch (e) {
                console.error("Error loading local music:", e);
            }
        } else {
            console.error("Background music element not found!");
        }
        
        console.log("Local music source initialized");
    }

    // Function to start local music
    function startLocalMusic() {
        console.log("Starting local music...");
        
        if (!hasUserInteracted) {
            console.log("Cannot start music without user interaction");
            updateMusicStatus('Klik untuk mendengarkan musik 🎵💕');
            return;
        }

        // Resume audio context if suspended
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                console.log("Audio context resumed");
            }).catch(e => {
                console.error("Failed to resume audio context:", e);
            });
        }
        
        // Try local MP3 file
        if (backgroundMusic) {
            try {
                backgroundMusic.currentTime = 0; // Start from beginning
                const playPromise = backgroundMusic.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log("Local music started successfully");
                        isMusicPlaying = true;
                        updateMusicStatus('🎵 Musik sedang diputar... 💕');
                        updateMusicButton('⏸️', 'Pause');
                        if (musicInfo) musicInfo.style.display = 'none';
                    }).catch(e => {
                        console.error("Failed to start local music:", e);
                        updateMusicStatus('🎵 Error memulai musik 😔');
                    });
                }
            } catch (e) {
                console.error("Error playing local music:", e);
                updateMusicStatus('🎵 Error memulai musik 😔');
            }
        } else {
            console.error("Local music player not ready");
            updateMusicStatus('🎵 Musik player belum siap 😔');
        }
    }

    // Setup music retry mechanism
    function setupMusicRetry() {
        let retryCount = 0;
        const maxRetries = 3;
        
        const retryMusic = () => {
            if (!isMusicPlaying && hasUserInteracted && retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying music start, attempt ${retryCount}`);
                setTimeout(attemptMusicStart, 1000 * retryCount);
            }
        };
        
        // Set up periodic retry
        setInterval(() => {
            if (hasUserInteracted && !isMusicPlaying && !musicInitialized) {
                retryMusic();
            }
        }, 5000);
    }

    // Prepare automatic music with aggressive auto-play
    function prepareAutoMusic() {
        // Immediate attempt when DOM is ready
        setTimeout(() => {
            if (!musicInitialized) {
                console.log("Initial music preparation attempt");
                attemptMusicStart();
                musicInitialized = true;
            }
        }, 1000);

        // Try again on any user interaction
        const startMusicOnInteraction = () => {
            if (hasUserInteracted && !isMusicPlaying) {
                console.log("User interacted, attempting to start music...");
                setTimeout(attemptMusicStart, 200);
            }
        };

        // Watch for user interaction with multiple attempts
        const checkInterval = setInterval(() => {
            if (hasUserInteracted && !isMusicPlaying) {
                startMusicOnInteraction();
            }
        }, 500);

        // Clear interval after 30 seconds
        setTimeout(() => clearInterval(checkInterval), 30000);
        
        // Also try on window focus
        window.addEventListener('focus', () => {
            if (hasUserInteracted && !isMusicPlaying) {
                setTimeout(attemptMusicStart, 500);
            }
        });
    }

    // Setup music toggle button
    function setupMusicToggle() {
        if (musicToggleBtn) {
            musicToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                hasUserInteracted = true;
                toggleMusic();
                
                // Add click animation
                musicToggleBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    musicToggleBtn.style.transform = '';
                }, 150);
            });
        }
    }

    // Initialize interactive elements with enhanced animations
    function initializeInteractiveElements() {
        // Enhanced button hover effects
        const buttons = document.querySelectorAll('.magical-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
                button.style.boxShadow = '0 8px 25px rgba(232, 160, 191, 0.4)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
                button.style.boxShadow = '';
            });
        });

        // Enhanced gift interaction
        if (giftIcon) {
            giftIcon.addEventListener('mouseenter', () => {
                giftIcon.style.transform = 'scale(1.1) rotate(5deg)';
                giftIcon.style.filter = 'brightness(1.2)';
            });
            
            giftIcon.addEventListener('mouseleave', () => {
                giftIcon.style.transform = '';
                giftIcon.style.filter = '';
            });
        }
        
        // Initialize enhanced interactive elements
        enhancePhotoGallery();
        enhanceWishItems();
        enhanceButtonEffects();
    }

    // Enhanced photo gallery interactions
    function enhancePhotoGallery() {
        const photoCards = document.querySelectorAll('.photo-card');
        photoCards.forEach((card, index) => {
            // Add 3D tilt effect on mouse move
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const rotateX = (mouseY / rect.height) * 10;
                const rotateY = (mouseX / rect.width) * -10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
            
            // Add click ripple effect
            card.addEventListener('click', (e) => {
                const ripple = document.createElement('div');
                ripple.className = 'photo-ripple';
                
                const rect = card.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                card.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 1000);
            });
        });
    }

    // Enhanced wish items animations
    function enhanceWishItems() {
        const wishItems = document.querySelectorAll('.wish-item');
        wishItems.forEach((item, index) => {
            // Add floating animation
            item.style.setProperty('--float-delay', `${index * 0.5}s`);
            item.classList.add('floating-wish');
            
            // Add interactive glow on hover
            item.addEventListener('mouseenter', () => {
                item.style.boxShadow = '0 10px 30px rgba(232, 160, 191, 0.3)';
                item.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.boxShadow = '';
                item.style.transform = '';
            });
            
            // Add heart trail on click
            item.addEventListener('click', () => {
                createHeartTrail(item);
            });
        });
    }

    // Create heart trail effect
    function createHeartTrail(element) {
        const hearts = ['💕', '💖', '💗', '💓', '💞'];
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.className = 'trail-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'fixed';
            heart.style.left = (rect.left + Math.random() * rect.width) + 'px';
            heart.style.top = (rect.top + rect.height / 2) + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            heart.style.fontSize = '1.2em';
            
            document.body.appendChild(heart);
            
            // Animate heart trail
            heart.animate([
                { transform: 'translateY(0) scale(0)', opacity: 0 },
                { transform: 'translateY(-50px) scale(1)', opacity: 1 },
                { transform: 'translateY(-100px) scale(0)', opacity: 0 }
            ], {
                duration: 2000,
                delay: i * 100,
                easing: 'ease-out'
            }).onfinish = () => heart.remove();
        }
    }

    // Enhanced button ripple effects
    function enhanceButtonEffects() {
        const buttons = document.querySelectorAll('.magical-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('div');
                ripple.className = 'btn-ripple-effect';
                
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height) * 2;
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // Attempt to start NIKI music ONLY (no fallback audio)
    function attemptMusicStart() {
        console.log("Attempting to start NIKI - You'll Be In My Heart...");
        
        if (!hasUserInteracted) {
            console.log("No user interaction yet, waiting...");
            updateMusicStatus('🎵 Klik untuk mendengarkan NIKI - You\'ll Be In My Heart 💕');
            return;
        }

        // Resume audio context if suspended
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().catch(e => console.warn("AudioContext resume failed:", e));
        }
        
        // Try NIKI MP3 file
        if (backgroundMusic) {
            backgroundMusic.currentTime = 0;
            backgroundMusic.volume = 0.7;
            backgroundMusic.play().then(() => {
                isMusicPlaying = true;
                updateMusicStatus('🎵 NIKI - You\'ll Be In My Heart 💕');
                updateMusicButton('🔇', 'Matikan');
                console.log("NIKI MP3 started successfully");
            }).catch(e => {
                console.error("NIKI MP3 failed:", e);
                updateMusicStatus('🎵 Error: File NIKI tidak ditemukan 😔');
            });
        }
            try {
                player.setVolume(75);
                player.seekTo(0);
                player.playVideo();
                isMusicPlaying = true;
                updateMusicStatus('🎵 NIKI - You\'ll Be In My Heart 💕');
                updateMusicButton('🔇', 'Matikan');
                console.log("NIKI music started successfully");
                return;
            } catch (e) {
                console.error("NIKI player failed:", e);
                updateMusicStatus('🎵 YouTube NIKI sedang loading... 💕');
            }
        } else {
            console.log("NIKI player not ready yet...");
            updateMusicStatus('🎵 Menunggu NIKI player siap... �');
        }
    }

    // Toggle music function with better state management
    // Toggle music function with local music support
    function toggleMusic() {
        hasUserInteracted = true;
        
        if (isMusicPlaying) {
            stopLocalMusic();
        } else {
            startLocalMusic();
        }
    }

    // Start local music function
    function startMusic() {
        startLocalMusic();
    }

    // Stop local music function
    function stopLocalMusic() {
        console.log("Stopping local music...");
        
        // Stop HTML5 audio
        if (backgroundMusic) {
            backgroundMusic.pause();
        }
        
        isMusicPlaying = false;
        updateMusicStatus('🎵 Musik dijeda 💕');
        updateMusicButton('🎵', 'Play');
        if (musicInfo) musicInfo.style.display = 'block';
    }

    // Enhanced start NIKI music ONLY
    function startMusic() {
        console.log("Starting NIKI - You'll Be In My Heart...");
        
        if (!hasUserInteracted) {
            console.log("Cannot start NIKI without user interaction");
            updateMusicStatus('Klik untuk mendengarkan NIKI - You\'ll Be In My Heart 🎵💕');
            return;
        }

        // ONLY try YouTube player for NIKI (no fallback)
        if (player && isPlayerActuallyReady && typeof player.playVideo === 'function') {
            try {
                player.setVolume(75);
                player.seekTo(0); // Start from beginning
                player.playVideo();
                console.log("NIKI music started successfully");
                return;
            } catch (e) {
                console.error("Failed to start NIKI music:", e);
                updateMusicStatus('🎵 Error memulai NIKI. Coba refresh halaman 😔');
            }
        } else {
            console.log("NIKI player not ready");
            updateMusicStatus('🎵 NIKI player belum siap. Tunggu sebentar... 💕');
            
            // Retry after a short delay
            setTimeout(() => {
                if (isPlayerActuallyReady) {
                    startMusic();
                }
            }, 2000);
        }
    }

    // REMOVED: createEmergencyAudio - No fallback audio to prevent cling sounds

    // REMOVED: tryFallbackAudio - No fallback audio to prevent cling sounds

    // Enhanced stop music function
    function stopMusic() {
        console.log("Stopping all music sources...");
        
        // Stop YouTube player
        if (player && typeof player.pauseVideo === 'function') {
            try {
                player.pauseVideo();
            } catch (e) {
                console.error("Failed to pause YouTube music:", e);
            }
        }
        
        // Stop HTML5 audio
        if (backgroundMusic) {
            backgroundMusic.pause();
        }
        
        // Stop emergency audio if it exists
        if (window.emergencyAudio) {
            window.emergencyAudio.pause();
        }
        
        isMusicPlaying = false;
        updateMusicStatus('🎵 NIKI - You\'ll Be In My Heart (Dijeda) 💕');
        updateMusicButton('🎵', 'Play NIKI');
        if (musicInfo) musicInfo.style.display = 'block';
    }

    // Update music status display with animations
    function updateMusicStatus(status) {
        if (musicInfo) {
            musicInfo.style.opacity = '0';
            setTimeout(() => {
                musicInfo.textContent = status;
                musicInfo.style.opacity = '1';
            }, 150);
        }
    }

    // Update music button display with animations
    function updateMusicButton(icon, text) {
        if (musicToggleBtn) {
            const iconEl = musicToggleBtn.querySelector('.music-icon');
            const textEl = musicToggleBtn.querySelector('.music-text');
            
            musicToggleBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (iconEl) iconEl.textContent = icon;
                if (textEl) textEl.textContent = text;
                musicToggleBtn.style.transform = '';
            }, 100);
        }
    }
    // Enhanced YouTube Player Setup with better error handling
    function loadYouTubeAPI() {
        // Check if API is already loaded
        if (typeof YT !== 'undefined' && YT.Player) {
            createYouTubePlayer();
            return;
        }

        // Check if script is already being loaded
        if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            console.log("YouTube API already loading...");
            return;
        }

        console.log("Loading YouTube API...");
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.onerror = () => {
            console.error("Failed to load YouTube API");
            updateMusicStatus("Gagal memuat API musik");
        };
        
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Set timeout for API loading
        setTimeout(() => {
            if (typeof YT === 'undefined' || !YT.Player) {
                console.warn("YouTube API loading timeout");
                updateMusicStatus("Koneksi musik lambat, gunakan tombol musik");
            }
        }, 10000);
    }

    // Global YouTube API ready callback
    window.onYouTubeIframeAPIReady = function() {
        console.log("YouTube API ready, creating player...");
        createYouTubePlayer();
    };

    // Create YouTube player with enhanced configuration
    function createYouTubePlayer() {
        if (player) {
            console.log("Player already exists");
            return;
        }

        const playerContainer = document.getElementById('youtube-player-container');
        if (!playerContainer) {
            console.error("YouTube player container not found");
            return;
        }

        try {
            // Alternative video IDs for NIKI - You'll Be In My Heart
            const nikiVideoIds = [
                'rDqlg_S30hU', // Primary - Official
                '5OeR5XBExUM', // Alternative 1
                'dQw4w9WgXcQ'  // Fallback
            ];
            
            let currentVideoId = nikiVideoIds[0];
            
            player = new YT.Player('youtube-player-container', {
                height: '1',
                width: '1',
                videoId: currentVideoId,
                playerVars: {
                    'autoplay': 0,
                    'controls': 0,
                    'loop': 1,
                    'playlist': currentVideoId,
                    'mute': 0,
                    'rel': 0,
                    'showinfo': 0,
                    'fs': 0,
                    'modestbranding': 1,
                    'playsinline': 1,
                    'enablejsapi': 1,
                    'origin': window.location.origin,
                    'start': 0,
                    'quality': 'medium'
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError': onPlayerError
                }
            });
            console.log("YouTube Player created successfully");
        } catch (e) {
            console.error("Failed to create YouTube Player:", e);
            updateMusicStatus("Gagal memuat pemutar musik");
        }
    }

    // Player ready event with enhanced setup
    function onPlayerReady(event) {
        console.log("YouTube Player ready with NIKI - You'll Be In My Heart!");
        isPlayerActuallyReady = true;
        updateMusicStatus("NIKI - You'll Be In My Heart siap diputar! 🎵💕");
        
        // Set volume and prepare for autoplay
        try {
            event.target.setVolume(75); // Slightly higher for NIKI's song
            
            // Attempt to start immediately if user has interacted
            if (hasUserInteracted && !isMusicPlaying) {
                console.log("User has interacted, starting NIKI immediately...");
                setTimeout(() => {
                    attemptMusicStart();
                }, 500);
            }
        } catch (e) {
            console.warn("Could not configure NIKI player:", e);
        }
    }

    // Player state change event with enhanced handling
    function onPlayerStateChange(event) {
        console.log("NIKI Player state changed:", event.data);
        
        if (event.data === YT.PlayerState.PLAYING) {
            isMusicPlaying = true;
            updateMusicStatus('🎵 NIKI - You\'ll Be In My Heart 💕');
            updateMusicButton('🔇', 'Matikan');
            
            // Show song info briefly then hide
            setTimeout(() => {
                if (musicInfo) {
                    musicInfo.style.display = 'none';
                }
            }, 3000);
        } else if (event.data === YT.PlayerState.PAUSED) {
            isMusicPlaying = false;
            updateMusicButton('🎵', 'Play NIKI');
            if (musicInfo) {
                musicInfo.style.display = 'block';
                updateMusicStatus('🎵 NIKI - You\'ll Be In My Heart (Paused)');
            }
        } else if (event.data === YT.PlayerState.ENDED) {
            // Handle loop manually for NIKI's song
            console.log("NIKI song ended, restarting...");
            if (player && typeof player.playVideo === 'function') {
                setTimeout(() => {
                    try {
                        player.seekTo(0);
                        player.playVideo();
                        console.log("NIKI song restarted successfully");
                    } catch (e) {
                        console.error("Failed to restart NIKI song:", e);
                    }
                }, 300);
            }
        } else if (event.data === YT.PlayerState.BUFFERING) {
            updateMusicStatus('🎵 Memuat NIKI - You\'ll Be In My Heart... 💕');
        }
    }

    // Player error event
    function onPlayerError(event) {
        console.error("YouTube Player error:", event.data);
        isPlayerActuallyReady = false;
        
        const errorMessages = {
            2: "Parameter permintaan tidak valid",
            5: "HTML5 player error",
            100: "Video tidak ditemukan",
            101: "Video tidak dapat diputar",
            150: "Video tidak dapat diputar"
        };
        
        const errorMsg = errorMessages[event.data] || `Error code: ${event.data}`;
        updateMusicStatus(`🎵 Error NIKI: ${errorMsg} 😔`);
    }

    // Enhanced typewriter effect with better timing
    const messageToType = 'haloo ayyy,\n\nDi hari yang spesial buat kamu ini, aku cuma mau bilang makasiii yaaa udah bareng bareng sama arris. Udah sabar ngadepin berbagai sifat dan pelupanya arris wkwkwkwk, seneng bisa kenal kamuu, trus kakak sama uci juga baik bangettt responnyaa huhuhuhu.\n\nAku harap di tahun tahun selanjutnya masih terus bareng bareng yaa ayyy, gapai mimpi dan cita cita barengg.\n\nsemogaa di di tahun selanjutnya kamu main jadi pribadi yang dewasa ya ayy, pribadi yang rendah hati dan semakin penyabar, pribadi yang strong girl wwkkwkwkw biar jadi independen woman ceunah.\n\nLove you always,\nArris ❤';
    let charIndex = 0;
    let isTyping = false;

    function typeMessage() {
        if (!typedMessageElement || isTyping) return;
        
        isTyping = true;
        charIndex = 0;
        typedMessageElement.textContent = '';
        
        function typeChar() {
            if (charIndex < messageToType.length) {
                const char = messageToType.charAt(charIndex);
                typedMessageElement.textContent += char;
                
                // Add typing sound effect (visual)
                if (char !== ' ' && char !== '\n') {
                    addTypingEffect();
                }
                
                charIndex++;
                const delay = char === '.' || char === '!' || char === '?' ? 300 : 
                             char === ',' ? 200 : 
                             char === '\n' ? 500 : 50;
                             
                setTimeout(typeChar, delay);
            } else {
                isTyping = false;
                addTypingCompleteEffect();
            }
        }
        
        typeChar();
    }

    // Add visual typing effect
    function addTypingEffect() {
        if (typedMessageElement) {
            typedMessageElement.style.borderRight = '2px solid var(--primary-accent)';
            setTimeout(() => {
                if (typedMessageElement) {
                    typedMessageElement.style.borderRight = '2px solid transparent';
                }
            }, 100);
        }
    }

    // Add completion effect for typing
    function addTypingCompleteEffect() {
        if (typedMessageElement) {
            typedMessageElement.style.boxShadow = '0 0 20px rgba(232, 160, 191, 0.3)';
            setTimeout(() => {
                if (typedMessageElement) {
                    typedMessageElement.style.boxShadow = '';
                }
            }, 2000);
        }
    }

    // Enhanced section transition with better animations
    function showSection(sectionIdToShow) {
        console.log(`Transitioning to section: ${sectionIdToShow}`);
        
        // Add page transition effect
        document.body.style.overflow = 'hidden';
        
        if (sections[currentSectionId]) {
            // Fade out current section
            sections[currentSectionId].style.transform = 'translateY(-20px)';
            sections[currentSectionId].style.opacity = '0';
            sections[currentSectionId].classList.remove('active');
            
            setTimeout(() => {
                if (sections[currentSectionId] && !sections[currentSectionId].classList.contains('active')) {
                    sections[currentSectionId].classList.add('hidden');
                    sections[currentSectionId].style.transform = '';
                    sections[currentSectionId].style.opacity = '';
                }
            }, 600);
        }

        if (sections[sectionIdToShow]) {
            // Prepare new section
            sections[sectionIdToShow].classList.remove('hidden');
            sections[sectionIdToShow].style.transform = 'translateY(20px)';
            sections[sectionIdToShow].style.opacity = '0';
            
            setTimeout(() => {
                sections[sectionIdToShow].style.transform = '';
                sections[sectionIdToShow].style.opacity = '';
                sections[sectionIdToShow].classList.add('active');
                currentSectionId = sectionIdToShow;
                
                // Re-enable scrolling
                document.body.style.overflow = '';
                
                // Handle special section behaviors
                handleSectionSpecialEffects(sectionIdToShow);
                
                console.log(`Section ${sectionIdToShow} is now active.`);
            }, 100);
        } else {
            console.error(`Section with ID '${sectionIdToShow}' not found.`);
        }
    }

    // Handle special effects for each section
    function handleSectionSpecialEffects(sectionId) {
        switch(sectionId) {
            case 'specialNote':
                if (typedMessageElement) {
                    setTimeout(typeMessage, 500);
                }
                break;
                
            case 'closing':
                if (heartsContainer) {
                    setTimeout(generateFloatingHearts, 300);
                }
                setTimeout(triggerFireworks, 800);
                break;
                
            case 'wishes':
                animateWishItems();
                break;
                
            case 'memories':
                animatePhotoGallery();
                break;
        }
    }

    // Animate wish items
    function animateWishItems() {
        const wishItems = document.querySelectorAll('.wish-item');
        wishItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(0) scale(1)';
                item.style.opacity = '1';
            }, index * 200);
        });
    }

    // Animate photo gallery
    function animatePhotoGallery() {
        const photoCards = document.querySelectorAll('.photo-card');
        photoCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0) rotateY(0)';
                card.style.opacity = '1';
            }, index * 150);
        });
    }

    // Trigger fireworks animation
    function triggerFireworks() {
        const fireworks = document.querySelectorAll('.firework');
        fireworks.forEach((firework, index) => {
            setTimeout(() => {
                firework.style.animation = `firework-burst 2s ease-out`;
            }, index * 300);
        });
    }

    // Enhanced start button with local music integration
    if (startButton) {
        startButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("'Yuk, Gasss!' button clicked - Starting local music!");
            
            // Mark user interaction
            hasUserInteracted = true;
            
            // Add button animation
            startButton.style.transform = 'scale(0.95)';
            startButton.style.opacity = '0.8';
            
            setTimeout(() => {
                startButton.style.transform = '';
                startButton.style.opacity = '';
            }, 150);

            // Start local music
            startLocalMusic();

            // Always proceed to next section
            setTimeout(() => {
                showSection('wishes');
            }, 300);
        });
    } else {
        console.error("Start button not found!");
    }

    // Enhanced next button handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            const parentSection = e.target.closest('.message-box');
            console.log(`Next button clicked in section: ${parentSection ? parentSection.id : 'Unknown'}`);
            
            setTimeout(() => {
                if (currentSectionId === 'wishes') showSection('memories');
                else if (currentSectionId === 'memories') showSection('specialNote');
                else if (currentSectionId === 'specialNote') showSection('closing');
            }, 200);
        });
    });

    // Enhanced gift interaction
    if (giftIcon) {
        giftIcon.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Gift icon clicked.");
            
            // Add gift opening animation
            giftIcon.style.transform = 'scale(1.2) rotate(360deg)';
            giftIcon.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            
            setTimeout(() => {
                giftIcon.style.transform = '';
                
                if (giftMessage) {
                    giftMessage.style.display = 'block';
                    giftMessage.style.opacity = '0';
                    giftMessage.style.transform = 'translateY(20px) scale(0.8)';
                    
                    setTimeout(() => {
                        giftMessage.style.opacity = '1';
                        giftMessage.style.transform = 'translateY(0) scale(1)';
                        giftMessage.style.transition = 'all 0.5s ease';
                        
                        // Add sparkle effect
                        createSparkleEffect(giftMessage);
                    }, 100);
                }
            }, 600);
        });
    }

    // Create sparkle effect around element
    function createSparkleEffect(element) {
        const sparkles = ['✨', '💫', '⭐', '🌟'];
        
        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'gift-sparkle';
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.position = 'absolute';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.fontSize = '1.2em';
            sparkle.style.zIndex = '1000';
            
            const rect = element.getBoundingClientRect();
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(sparkle);
            
            // Animate sparkle
            sparkle.animate([
                { transform: 'translateY(0) scale(0)', opacity: 0 },
                { transform: 'translateY(-30px) scale(1)', opacity: 1 },
                { transform: 'translateY(-60px) scale(0)', opacity: 0 }
            ], {
                duration: 1500,
                easing: 'ease-out'
            }).onfinish = () => sparkle.remove();
        }
    }

    // Enhanced floating hearts generation
    function generateFloatingHearts() {
        if (!heartsContainer) return;
        
        heartsContainer.innerHTML = '';
        const heartEmojis = ['❤️', '💖', '💕', '💓', '💞', '💗', '🤍', '💘'];
        const heartCount = 12;
        
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart', 'enhanced-heart');
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            
            // Random positioning and styling
            heart.style.left = `${Math.random() * 90 + 5}%`;
            heart.style.fontSize = `${Math.random() * 1.5 + 1}em`;
            heart.style.setProperty('--delay', `${Math.random() * 2}s`);
            heart.style.setProperty('--duration', `${Math.random() * 3 + 4}s`);
            heart.style.opacity = '0';
            
            // Add click interaction
            heart.addEventListener('click', () => {
                heart.style.transform = 'scale(2) rotate(360deg)';
                heart.style.transition = 'transform 0.5s ease';
                setTimeout(() => {
                    heart.style.transform = '';
                    heart.style.transition = '';
                }, 500);
            });
            
            heartsContainer.appendChild(heart);
            
            // Animate appearance
            setTimeout(() => {
                heart.style.opacity = '1';
                heart.style.animation = `floatHeart ${heart.style.getPropertyValue('--duration')} ${heart.style.getPropertyValue('--delay')} infinite ease-in-out`;
            }, i * 200);
        }
        
        console.log("Enhanced floating hearts generated.");
    }

    // Initialize display and final setup
    if (sections.opening) {
        console.log("Initializing: Making 'opening' section visible.");
        sections.opening.classList.remove('hidden');
        
        // Add entrance animation
        setTimeout(() => {
            sections.opening.style.opacity = '1';
            sections.opening.style.transform = 'scale(1)';
        }, 100);
    } else {
        console.error("Initialization ERROR: Section 'opening' not found!");
    }

    // Setup global error handling
    window.addEventListener('error', (e) => {
        console.error('Global error caught:', e.error);
    });

    // Setup visibility change handling for music with auto-resume
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isMusicPlaying) {
            // Pause music when tab is hidden
            if (player && typeof player.pauseVideo === 'function') {
                try {
                    player.pauseVideo();
                } catch (e) {
                    console.warn("Could not pause on visibility change:", e);
                }
            }
        } else if (!document.hidden && hasUserInteracted) {
            // Resume music when tab becomes visible again
            setTimeout(() => {
                if (!isMusicPlaying) {
                    attemptMusicStart();
                }
            }, 500);
        }
    });

    // Add immediate NIKI music attempt on page load
    setTimeout(() => {
        // Try to start NIKI even without explicit user interaction
        if (!isMusicPlaying) {
            console.log("Attempting NIKI autoplay on page load...");
            
            // First try YouTube if ready
            if (player && isPlayerActuallyReady) {
                try {
                    player.setVolume(0.1); // Very low volume initially
                    player.playVideo();
                    setTimeout(() => {
                        if (isMusicPlaying) {
                            player.setVolume(75); // Restore normal volume
                            console.log("NIKI autoplay successful on page load");
                        }
                    }, 1000);
                } catch (e) {
                    console.log("NIKI YouTube autoplay blocked");
                }
            }
            
            // NO HTML5 audio backup to prevent cling sounds - NIKI YouTube only
            console.log("NIKI YouTube only mode - no HTML5 audio fallback");
        }
    }, 2000);

    console.log("Enhanced script initialization complete!");
});