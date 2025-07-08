document.addEventListener('DOMContentLoaded', () => {
    console.log("Script loaded and DOM ready");

    // DOM element selections
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
    let isMusicPlaying = false;
    let hasUserInteracted = false;

    console.log("All elements selected");

    // Debug: Check if all sections exist
    console.log("=== SECTION DEBUGGING ===");
    Object.keys(sections).forEach(key => {
        if (sections[key]) {
            console.log(`✓ Section "${key}" found:`, sections[key]);
        } else {
            console.error(`✗ Section "${key}" NOT found!`);
        }
    });
    
    // Debug: Check critical elements
    console.log("=== ELEMENT DEBUGGING ===");
    console.log("Start button:", startButton ? "✓ Found" : "✗ NOT FOUND");
    console.log("Background music:", backgroundMusic ? "✓ Found" : "✗ NOT FOUND");
    console.log("Next buttons count:", nextButtons.length);
    console.log("=========================");

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

    // Initialize letter animation for sparkle title
    function initializeLetterAnimation() {
        const letters = document.querySelectorAll('.letter');
        letters.forEach((letter, index) => {
            letter.style.setProperty('--i', index);
            letter.addEventListener('animationend', () => {
                if (Math.random() > 0.7) {
                    addSparkleEffect(letter);
                }
            });
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
                sparkle.parentNode.removeChild(sparkle);
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
            particle.className = 'enhanced-particle';
            particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Initialize music system - LOCAL ONLY
    function initializeMusicSystem() {
        console.log("Initializing local music system...");
        
        // Setup user interaction tracking
        setupUserInteractionTracking();
        
        // Initialize local music
        if (backgroundMusic) {
            backgroundMusic.volume = 0.7;
            backgroundMusic.loop = true;
            
            backgroundMusic.addEventListener('canplaythrough', () => {
                console.log("Music ready to play");
                updateMusicStatus('🎵 Musik siap diputar! 💕');
            });
            
            backgroundMusic.addEventListener('play', () => {
                console.log("Music started playing");
                isMusicPlaying = true;
                updateMusicStatus('🎵 Musik sedang diputar... 💕');
                updateMusicButton('⏸️', 'Pause');
                if (musicInfo) musicInfo.style.display = 'none';
            });
            
            backgroundMusic.addEventListener('pause', () => {
                console.log("Music paused");
                isMusicPlaying = false;
                updateMusicStatus('🎵 Musik dijeda 💕');
                updateMusicButton('🎵', 'Play');
                if (musicInfo) musicInfo.style.display = 'block';
            });
            
            backgroundMusic.addEventListener('error', (e) => {
                console.error("Music error:", e);
                updateMusicStatus('🎵 Error memuat musik 😔');
            });
        }
        
        // Setup music toggle button
        if (musicToggleBtn) {
            musicToggleBtn.addEventListener('click', toggleMusic);
        }
        
        console.log("Music system initialized");
    }

    // Setup user interaction tracking
    function setupUserInteractionTracking() {
        const events = ['click', 'touchstart', 'keydown'];
        const handleFirstInteraction = () => {
            hasUserInteracted = true;
            console.log("User interaction detected");
        };

        events.forEach(event => {
            document.addEventListener(event, handleFirstInteraction, { once: true });
        });
    }

    // Start local music - IMPROVED
    function startLocalMusic() {
        console.log("=== STARTING LOCAL MUSIC ===");
        
        if (!hasUserInteracted) {
            console.log("Cannot start music without user interaction");
            updateMusicStatus('🎵 Klik tombol untuk musik 💕');
            return false;
        }
        
        if (!backgroundMusic) {
            console.error("Background music element not found!");
            updateMusicStatus('🎵 Error: Musik tidak tersedia 😔');
            return false;
        }
        
        if (isMusicPlaying) {
            console.log("Music is already playing");
            return true;
        }
        
        try {
            // Reset music to beginning
            backgroundMusic.currentTime = 0;
            
            // Attempt to play
            console.log("Attempting to play music...");
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("✓ Music started successfully");
                    return true;
                }).catch(e => {
                    console.error("✗ Failed to start music:", e.name, e.message);
                    updateMusicStatus('🎵 Error memulai musik 😔');
                    return false;
                });
            }
        } catch (e) {
            console.error("✗ Error playing music:", e);
            updateMusicStatus('🎵 Error musik 😔');
            return false;
        }
        
        return true;
    }

    // Stop local music
    function stopLocalMusic() {
        console.log("Stopping music...");
        
        if (backgroundMusic) {
            backgroundMusic.pause();
        }
    }

    // Toggle music
    function toggleMusic() {
        hasUserInteracted = true;
        
        if (isMusicPlaying) {
            stopLocalMusic();
        } else {
            startLocalMusic();
        }
    }

    // Update music status display
    function updateMusicStatus(status) {
        if (musicInfo) {
            musicInfo.style.opacity = '0';
            setTimeout(() => {
                musicInfo.textContent = status;
                musicInfo.style.opacity = '1';
            }, 150);
        }
    }

    // Update music button display
    function updateMusicButton(icon, text) {
        if (musicToggleBtn) {
            const iconEl = musicToggleBtn.querySelector('.music-icon');
            const textEl = musicToggleBtn.querySelector('.music-text');
            
            if (iconEl) iconEl.textContent = icon;
            if (textEl) textEl.textContent = text;
        }
    }

    // Show section function - IMPROVED
    function showSection(sectionIdToShow) {
        console.log(`Transitioning from "${currentSectionId}" to "${sectionIdToShow}"`);
        
        // Check if target section exists
        if (!sections[sectionIdToShow]) {
            console.error(`Section "${sectionIdToShow}" not found!`);
            return;
        }

        // If we're already on the target section, do nothing
        if (currentSectionId === sectionIdToShow) {
            console.log(`Already on section "${sectionIdToShow}"`);
            return;
        }

        const currentSection = sections[currentSectionId];
        const targetSection = sections[sectionIdToShow];

        // Step 1: Hide current section immediately
        if (currentSection) {
            console.log(`Hiding current section: ${currentSectionId}`);
            currentSection.style.transition = 'all 0.3s ease';
            currentSection.style.transform = 'translateY(-30px)';
            currentSection.style.opacity = '0';
            currentSection.classList.remove('active');
        }

        // Step 2: Prepare and show new section
        setTimeout(() => {
            // Completely hide old section
            if (currentSection) {
                currentSection.classList.add('hidden');
                currentSection.style.transform = '';
                currentSection.style.opacity = '';
                currentSection.style.transition = '';
            }

            // Prepare new section
            console.log(`Showing new section: ${sectionIdToShow}`);
            targetSection.classList.remove('hidden');
            targetSection.style.transition = 'all 0.4s ease';
            targetSection.style.transform = 'translateY(30px)';
            targetSection.style.opacity = '0';
            
            // Force reflow
            targetSection.offsetHeight;
            
            // Animate in new section
            setTimeout(() => {
                targetSection.style.transform = 'translateY(0)';
                targetSection.style.opacity = '1';
                targetSection.classList.add('active');
                
                // Update current section ID
                currentSectionId = sectionIdToShow;
                console.log(`Successfully transitioned to: ${sectionIdToShow}`);
                
                // Clean up and handle special effects
                setTimeout(() => {
                    targetSection.style.transition = '';
                    handleSectionSpecialEffects(sectionIdToShow);
                }, 400);
            }, 50);
        }, 300);
    }

    // Handle special effects for each section
    function handleSectionSpecialEffects(sectionId) {
        switch(sectionId) {
            case 'wishes':
                animateWishItems();
                break;
            case 'memories':
                animatePhotoGallery();
                break;
            case 'specialNote':
                setTimeout(typeMessage, 500);
                break;
            case 'closing':
                generateFloatingHearts();
                triggerFireworks();
                break;
        }
    }

    // Initialize interactive elements
    function initializeInteractiveElements() {
        // Enhanced gift interaction
        if (giftIcon) {
            giftIcon.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Gift clicked!");
                
                // Add animation
                giftIcon.style.transform = 'scale(1.2) rotate(360deg)';
                setTimeout(() => {
                    giftIcon.style.transform = '';
                }, 600);
                
                // Show message
                if (giftMessage) {
                    giftMessage.classList.remove('hidden-message');
                    giftMessage.style.display = 'block';
                    giftMessage.style.opacity = '0';
                    giftMessage.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        giftMessage.style.opacity = '1';
                        giftMessage.style.transform = 'scale(1)';
                    }, 100);
                }
                
                // Create sparkle effect
                createSparkleEffect(giftIcon);
            });
        }
    }

    // Animate wish items
    function animateWishItems() {
        const wishItems = document.querySelectorAll('.wish-item');
        wishItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }

    // Animate photo gallery
    function animatePhotoGallery() {
        const photoCards = document.querySelectorAll('.photo-card');
        photoCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 300);
        });
    }

    // Create sparkle effect around element
    function createSparkleEffect(element) {
        const sparkles = ['✨', '💫', '⭐', '🌟'];
        
        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'gift-sparkle';
            sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 100 + 'px';
            sparkle.style.top = Math.random() * 100 + 'px';
            sparkle.style.fontSize = '1.5em';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            
            element.parentElement.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 2000);
        }
    }

    // Typewriter effect
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
                charIndex++;
                
                const delay = char === '.' || char === '!' || char === '?' ? 300 : 
                             char === ',' ? 200 : 
                             char === '\n' ? 500 : 50;
                             
                setTimeout(typeChar, delay);
            } else {
                isTyping = false;
                console.log("Typing complete");
            }
        }
        
        typeChar();
    }

    // Generate floating hearts
    function generateFloatingHearts() {
        if (!heartsContainer) return;
        
        heartsContainer.innerHTML = '';
        const heartEmojis = ['❤️', '💖', '💕', '💓', '💞', '💗', '🤍', '💘'];
        const heartCount = 12;
        
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart enhanced-heart';
            heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = Math.random() * 3 + 's';
            heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
            heartsContainer.appendChild(heart);
        }
        
        console.log("Floating hearts generated");
    }

    // Trigger fireworks animation
    function triggerFireworks() {
        const fireworks = document.querySelectorAll('.firework');
        fireworks.forEach((firework, index) => {
            setTimeout(() => {
                firework.style.animation = 'firework-burst 1s ease-out';
            }, index * 500);
        });
    }

    // Start button event listener - ROBUST VERSION
    if (startButton) {
        startButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("'Yuk, Gasss!' button clicked - Starting transition!");
            
            // Prevent multiple clicks
            if (startButton.disabled) {
                console.log("Button already clicked, ignoring...");
                return;
            }
            startButton.disabled = true;
            
            // Mark user interaction
            hasUserInteracted = true;
            
            // Add button animation
            startButton.style.transform = 'scale(0.95)';
            startButton.style.opacity = '0.7';
            startButton.textContent = 'Loading...';
            
            // Start music first (non-blocking)
            if (backgroundMusic && !isMusicPlaying) {
                console.log("Starting music...");
                startLocalMusic();
            }

            // Transition to next section with delay
            setTimeout(() => {
                console.log("Initiating section transition...");
                showSection('wishes');
                
                // Reset button after transition
                setTimeout(() => {
                    startButton.style.transform = '';
                    startButton.style.opacity = '';
                    startButton.disabled = false;
                    // Don't reset text content as user won't see this button again
                }, 500);
            }, 200);
        });
        console.log("Start button event listener added successfully");
        
        // Test button immediately
        setTimeout(() => {
            if (startButton) {
                console.log("✓ Start button still accessible after setup");
                console.log("✓ Button element:", startButton);
                console.log("✓ Button text:", startButton.textContent);
                console.log("✓ Button disabled:", startButton.disabled);
            }
        }, 100);
    } else {
        console.error("CRITICAL: Start button not found! Check HTML ID 'startButton'");
        // Try to find button by other means
        const allButtons = document.querySelectorAll('button');
        console.log("All buttons found:", allButtons.length);
        allButtons.forEach((btn, index) => {
            console.log(`Button ${index}:`, btn.id, btn.className, btn.textContent);
        });
    }

    // Next button handlers
    nextButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Next button ${index} clicked`);
            
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);

            // Determine next section
            let nextSection = '';
            switch(currentSectionId) {
                case 'wishes':
                    nextSection = 'memories';
                    break;
                case 'memories':
                    nextSection = 'specialNote';
                    break;
                case 'specialNote':
                    nextSection = 'closing';
                    break;
                default:
                    console.log("No next section defined");
                    return;
            }

            // Transition to next section
            setTimeout(() => {
                showSection(nextSection);
            }, 200);
        });
    });

    // Initialize display - IMPROVED
    console.log("=== INITIALIZING DISPLAY ===");
    if (sections.opening) {
        console.log("Setting up opening section...");
        
        // Hide all sections first and clear any existing animations
        Object.keys(sections).forEach(key => {
            if (sections[key] && key !== 'opening') {
                sections[key].classList.add('hidden');
                sections[key].classList.remove('active');
                // Clear any CSS animations that might interfere
                sections[key].style.animation = 'none';
                sections[key].style.transition = 'none';
                sections[key].style.transform = '';
                sections[key].style.opacity = '';
            }
        });
        
        // Show opening section with explicit styles
        sections.opening.classList.remove('hidden');
        sections.opening.classList.add('active');
        sections.opening.style.animation = 'none';
        sections.opening.style.transition = 'none';
        sections.opening.style.opacity = '1';
        sections.opening.style.transform = 'translateY(0)';
        sections.opening.style.display = 'block';
        
        console.log("✓ Opening section is now visible and active");
        console.log("✓ All other sections are hidden");
        console.log("✓ CSS animations cleared");
    } else {
        console.error("✗ CRITICAL ERROR: Opening section not found!");
        console.error("Available sections:", Object.keys(sections));
    }

    console.log("=== SCRIPT INITIALIZATION COMPLETE ===");
    console.log("Current section ID:", currentSectionId);
    console.log("User has interacted:", hasUserInteracted);
    console.log("Music is playing:", isMusicPlaying);
    console.log("=====================================");
});
