// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: false,
    mirror: true
});

// Music Player
const musicPlayer = {
    songs: [
        {
            title: "Bangarang",
            artist: "Skrillex ft. Sirah",
            url: "assets/media/SKRILLEX - Bangarang feat. Sirah [Official Music Video].mp3",
            art: "assets/media/album-art/bangarang.jpg",
            theme: "dark"
        },
        {
            title: "Scary Monsters And Nice Sprites",
            artist: "Skrillex",
            url: "assets/media/Skrillex - Scary Monsters And Nice Sprites (Official Audio).mp3",
            art: "assets/media/album-art/scary-monsters.jpg",
            theme: "light"
        },
        {
            title: "Badders",
            artist: "Skrillex, PEEKABOO, Flowdan & G-Rex",
            url: "assets/media/Skrillex, PEEKABOO, Flowdan, & G-Rex - Badders (Official Audio).mp3",
            art: "assets/media/album-art/badders.jpg",
            theme: "dynamic"
        },
        {
            title: "Big Dawgs",
            artist: "Hanumankind ft. Kalmi",
            url: "assets/media/Hanumankind  Big Dawgs  Ft. Kalmi (Official Music Video)  Def Jam India.mp3",
            art: "assets/media/album-art/big-dawgs.jpg",
            theme: "dark"
        },
        {
            title: "lalala",
            artist: "bbno$ & y2k",
            url: "assets/media/bbno$, y2k - lalala (Lyrics)  did I really just forget that melody_.mp3",
            art: "assets/media/album-art/lalala.jpg",
            theme: "light"
        },
        {
            title: "Chess Type Beat",
            artist: "Dancing Rat",
            url: "assets/media/𝐂𝐡𝐞𝐬𝐬 𝐓𝐲𝐩𝐞 𝐁𝐞𝐚𝐭 (𝐒𝐥𝐨𝐰𝐞𝐝𝐓𝐢𝐤𝐭𝐨𝐤 𝐕𝐞𝐫𝐬𝐢𝐨𝐧) 𝐱 𝐃𝐚𝐧𝐜𝐢𝐧𝐠 𝐑𝐚𝐭 - 𝐉𝐞𝐬𝐮𝐬 𝐌𝐮𝐬𝐜.mp3",
            art: "assets/media/album-art/chess-type-beat.jpg",
            theme: "glass"
        },
        {
            title: "Tip Toe",
            artist: "HYBS",
            url: "assets/media/HYBS - Tip Toe (Official Video).mp3",
            art: "assets/media/album-art/white@2x.png",
            theme: "dark"
        },
        {
            title: "Round and Round",
            artist: "Mingle Game Song",
            url: "assets/media/Mingle Game Song Round and Round Lyric Video  Squid Game_ Season 2  Netflix.mp3",
            art: "assets/media/album-art/round-and-round.jpg",
            theme: "glass"
        }
    ],
    currentSong: 0,
    audio: null,
    isPlaying: false,
    lastVolume: null,

    updateTheme() {
        const player = document.querySelector('.music-player');
        
        // Get background color behind the player
        const bgColor = this.getBackgroundColor(player);
        
        // Remove all theme classes
        player.classList.remove('theme-default', 'theme-dark', 'theme-light', 'theme-glass');
        
        // Get the element behind the player
        const rect = player.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const elements = document.elementsFromPoint(x, y);
        
        // Check if we're over an image background
        const isOverImage = elements.some(el => {
            const style = window.getComputedStyle(el);
            return style.backgroundImage && style.backgroundImage !== 'none';
        });
        
        if (isOverImage) {
            // Use glass theme for image backgrounds
            player.classList.add('theme-glass');
            document.querySelector('.album-art').src = 'assets/media/album-art/white@2x.png';
        } else {
            // Determine theme based on background brightness
            const brightness = (bgColor.r * 299 + bgColor.g * 587 + bgColor.b * 114) / 1000;
            
            if (brightness > 128) { // Light background
                player.classList.add('theme-dark');
                document.querySelector('.album-art').src = 'assets/media/album-art/white@2x.png';
            } else { // Dark background
                player.classList.add('theme-light');
                document.querySelector('.album-art').src = 'assets/media/album-art/black@2x.png';
            }
        }
        
        console.log('Theme updated:', {
            brightness: (bgColor.r * 299 + bgColor.g * 587 + bgColor.b * 114) / 1000,
            bgColor,
            isOverImage,
            theme: player.classList.contains('theme-glass') ? 'glass' : 
                   player.classList.contains('theme-dark') ? 'dark' : 'light'
        });
    },
    
    getBackgroundColor(element) {
        // Get all elements at the player's position
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Get all elements at this point
        const elements = document.elementsFromPoint(x, y);
        
        // Find the first element with a background color
        for (const el of elements) {
            if (el === element) continue; // Skip the player itself
            
            const bgColor = window.getComputedStyle(el).backgroundColor;
            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                const rgb = bgColor.match(/\d+/g);
                if (rgb) {
                    return {
                        r: parseInt(rgb[0]),
                        g: parseInt(rgb[1]),
                        b: parseInt(rgb[2])
                    };
                }
            }
        }
        
        // Default to black if no background color found
        return { r: 0, g: 0, b: 0 };
    },
    
    calculateDynamicTheme() {
        const img = document.querySelector('.album-art');
        if (!img.complete) {
            img.addEventListener('load', () => this.extractColorFromImage(img));
        } else {
            this.extractColorFromImage(img);
        }
    },
    
    extractColorFromImage(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0;
        
        // Calculate average color
        for (let i = 0; i < imageData.length; i += 4) {
            r += imageData[i];
            g += imageData[i + 1];
            b += imageData[i + 2];
        }
        
        const pixels = imageData.length / 4;
        r = Math.round(r / pixels);
        g = Math.round(g / pixels);
        b = Math.round(b / pixels);
        
        const player = document.querySelector('.music-player');
        player.style.setProperty('--dynamic-bg', `rgba(${r},${g},${b},0.75)`);
        player.style.setProperty('--dynamic-border', `rgba(${r},${g},${b},0.3)`);
        
        // Set text color based on background brightness
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness > 128) {
            player.style.setProperty('--dynamic-text', '#1a1a1a');
            player.style.setProperty('--dynamic-subtext', 'rgba(0,0,0,0.6)');
        } else {
            player.style.setProperty('--dynamic-text', '#ffffff');
            player.style.setProperty('--dynamic-subtext', 'rgba(255,255,255,0.6)');
        }
    },

    updateSongInfo() {
        const songTitle = document.querySelector('.song-title');
        const songArtist = document.querySelector('.song-artist');
        
        songTitle.textContent = this.songs[this.currentSong].title;
        songArtist.textContent = this.songs[this.currentSong].artist;
        
        // Theme will update the album art
        this.updateTheme();
    },

    init() {
        // Create audio element
        this.audio = new Audio();
        this.audio.src = this.songs[this.currentSong].url;
        this.audio.volume = 0.5;
        
        // Initialize volume control
        const volumeSlider = document.getElementById('volume-slider');
        const volumeIcon = document.getElementById('volume-icon');
        
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.audio.volume = volume;
            this.updateVolumeIcon(volume);
        });
        
        volumeIcon.addEventListener('click', () => {
            if (this.audio.volume > 0) {
                this.lastVolume = this.audio.volume;
                this.audio.volume = 0;
                volumeSlider.value = 0;
                volumeIcon.className = 'fas fa-volume-mute';
            } else {
                this.audio.volume = this.lastVolume || 0.5;
                volumeSlider.value = (this.lastVolume || 0.5) * 100;
                this.updateVolumeIcon(this.audio.volume);
            }
        });

        // Set initial volume
        this.updateSongInfo();
        this.setupEventListeners();

        // Add error handling
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            document.querySelector('.song-title').textContent = 'Error loading audio';
        });

        // Update info when song loads
        this.audio.addEventListener('loadeddata', () => {
            this.updateSongInfo();
        });

        // Handle song end
        this.audio.addEventListener('ended', () => {
            this.nextSong();
        });

        // Adjust player width based on content
        this.adjustPlayerWidth();
        
        // Listen for scroll events to update theme
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => this.updateTheme());
        });
    },

    adjustPlayerWidth() {
        const player = document.querySelector('.music-player');
        const songInfo = document.querySelector('.song-info');
        const playbackControls = document.querySelector('.playback-controls');
        const minBtn = document.querySelector('.music-minimize-btn');
        
        // Let CSS handle the width with fit-content
        player.style.width = '';
        
        // Ensure the player doesn't exceed viewport width
        const maxWidth = window.innerWidth - 32;
        if (player.offsetWidth > maxWidth) {
            player.style.width = `${maxWidth}px`;
        }
    },

    togglePlay() {
        if (!this.audio) return;
        
        const playBtn = document.getElementById('play-btn');
        const player = document.querySelector('.music-player');
        
        if (this.isPlaying) {
            this.audio.pause();
            playBtn.classList.replace('fa-pause', 'fa-play');
            player.classList.remove('playing');
        } else {
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playBtn.classList.replace('fa-play', 'fa-pause');
                    player.classList.add('playing');
                }).catch(error => {
                    console.error('Error playing audio:', error);
                });
            }
        }
        this.isPlaying = !this.isPlaying;
    },

    toggleMinimize() {
        const player = document.querySelector('.music-player');
        const minimizeBtn = document.querySelector('.music-minimize-btn i');
        
        player.classList.toggle('minimized');
        if (player.classList.contains('minimized')) {
            minimizeBtn.classList.replace('fa-minus', 'fa-plus');
        } else {
            minimizeBtn.classList.replace('fa-plus', 'fa-minus');
        }
    },

    nextSong() {
        this.currentSong = (this.currentSong + 1) % this.songs.length;
        this.audio.src = this.songs[this.currentSong].url;
        this.updateSongInfo();
        if (this.isPlaying) {
            this.audio.play().catch(error => {
                console.error('Error playing next song:', error);
            });
        }
    },

    prevSong() {
        this.currentSong = (this.currentSong - 1 + this.songs.length) % this.songs.length;
        this.audio.src = this.songs[this.currentSong].url;
        this.updateSongInfo();
        if (this.isPlaying) {
            this.audio.play().catch(error => {
                console.error('Error playing previous song:', error);
            });
        }
    },

    setupEventListeners() {
        // Player controls
        document.querySelector('.music-toggle-btn').addEventListener('click', () => this.togglePlay());
        document.querySelector('.music-minimize-btn').addEventListener('click', () => this.toggleMinimize());
        document.getElementById('prev').addEventListener('click', () => this.prevSong());
        document.getElementById('next').addEventListener('click', () => this.nextSong());

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent page scroll
                this.togglePlay();
            } else if (e.code === 'ArrowLeft') {
                this.prevSong();
            } else if (e.code === 'ArrowRight') {
                this.nextSong();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => this.adjustPlayerWidth());
    },

    updateVolumeIcon(volume) {
        const volumeIcon = document.getElementById('volume-icon');
        if (volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-low';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }
};

// UI Switcher
function toggleUI() {
    const body = document.body;
    const professionalNavbar = document.querySelector('.navbar');
    const teleportNavbar = document.querySelector('.navbar-alt');
    
    if (body.classList.contains('professional-ui')) {
        // Switch to Teleport UI
        body.classList.remove('professional-ui');
        body.classList.add('teleport-ui');
        professionalNavbar.classList.add('hidden');
        teleportNavbar.classList.remove('hidden');
        
        // Update page theme
        body.style.background = 'linear-gradient(45deg, #000000, #1a1a1a)';
        
        // Store UI preference
        localStorage.setItem('uiPreference', 'teleport');
    } else {
        // Switch to Professional UI
        body.classList.remove('teleport-ui');
        body.classList.add('professional-ui');
        teleportNavbar.classList.add('hidden');
        professionalNavbar.classList.remove('hidden');
        
        // Restore original theme
        body.style.background = '';
        
        // Store UI preference
        localStorage.setItem('uiPreference', 'professional');
    }
}

// Load saved UI preference
document.addEventListener('DOMContentLoaded', () => {
    const savedUI = localStorage.getItem('uiPreference');
    if (savedUI === 'teleport') {
        document.body.classList.remove('professional-ui');
        document.body.classList.add('teleport-ui');
        document.querySelector('.navbar').classList.add('hidden');
        document.querySelector('.navbar-alt').classList.remove('hidden');
    }

    // Initialize music player
    musicPlayer.init();
    
    // Initialize ProjectManager
    ProjectManager.init();
    
    // Initialize typing animation
    const roles = ['DEVELOPER', 'DESIGNER', 'INNOVATOR'];
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let pauseEnd = 2000;
    let pauseStart = 1000;

    function typeRole() {
        const roleText = document.querySelector('.role-text');
        const currentRole = roles[currentRoleIndex];
        
        if (!roleText) return;
        
        if (isDeleting) {
            // Removing characters
            roleText.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 50; // Faster when deleting
        } else {
            // Adding characters
            roleText.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100; // Original typing speed
        }
        
        if (!isDeleting && currentCharIndex === currentRole.length) {
            // Finished typing current role
            isDeleting = true;
            typingSpeed = pauseEnd; // Pause at the end
        } else if (isDeleting && currentCharIndex === 0) {
            // Finished deleting current role
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typingSpeed = pauseStart; // Pause before starting next word
        }
        
        setTimeout(typeRole, typingSpeed);
    }

    // Start typing animation immediately
    typeRole();
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: false,
        mirror: true
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Glitch Text Effect
const glitchText = document.querySelector('.glitch-text');
let glitchInterval;

function startGlitchEffect() {
    const originalText = glitchText.textContent;
    const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    
    let iterations = 0;
    clearInterval(glitchInterval);
    
    glitchInterval = setInterval(() => {
        glitchText.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iterations || char === ' ') return char;
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join('');
        
        iterations += 1/3;
        
        if (iterations >= originalText.length) {
            clearInterval(glitchInterval);
            glitchText.textContent = originalText;
            setTimeout(startGlitchEffect, 3000);
        }
    }, 30);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Project Cards Animation
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.02)';
        card.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    startGlitchEffect();
    
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    setTimeout(() => {
        heroContent.style.transition = 'opacity 1s ease';
        heroContent.style.opacity = '1';
    }, 500);
});

// Skill items hover effect
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px)';
        item.style.borderColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color').trim();
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
        item.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
});

// Navigation Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Particles.js Configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ffffff'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        }
    },
    retina_detect: true
});

// Logo Particles Animation
const logoParticles = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const logoContainer = document.querySelector('.logo-particles');
    
    canvas.width = logoContainer.offsetWidth;
    canvas.height = logoContainer.offsetHeight;
    logoContainer.appendChild(canvas);

    const particles = [];
    const particleCount = 30;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * 2 - 1;
            this.radius = Math.random() * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#0ff';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
};

// Initialize logo particles
logoParticles();

// Form Submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here
    alert('Message sent successfully!');
    contactForm.reset();
});

// Intersection Observer for Fade-in Animation
const observerOptions = {
    threshold: 0.25
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});

// Project Management
const ProjectManager = {
    projects: [],
    isAdmin: false,

    init() {
        // Check if admin
        const adminPassword = localStorage.getItem('adminPassword');
        this.isAdmin = adminPassword === 'your_secure_password'; // You'll set this later

        // Load projects from localStorage
        this.loadProjects();
        
        // Initialize UI elements
        this.initializeUI();
        
        // Render projects in both the management modal and the main page
        this.renderProjects();
        this.renderProjectsGrid();

        // Show/Hide admin features
        const manageProjectsBtn = document.getElementById('manageProjectsBtn');
        if (manageProjectsBtn) {
            manageProjectsBtn.style.display = this.isAdmin ? 'flex' : 'none';
        }

        // Initialize modal
        const modal = document.getElementById('projectModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    authenticate() {
        const password = prompt('Enter admin password:');
        if (password === 'your_secure_password') { // You'll change this later
            localStorage.setItem('adminPassword', password);
            this.isAdmin = true;
            const manageProjectsBtn = document.getElementById('manageProjectsBtn');
            if (manageProjectsBtn) {
                manageProjectsBtn.style.display = 'flex';
            }
            return true;
        }
        alert('Invalid password');
        return false;
    },

    showModal() {
        const modal = document.getElementById('projectModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
        }
    },

    hideModal() {
        const modal = document.getElementById('projectModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
        }
    },

    initializeUI() {
        // Modal elements
        const modal = document.getElementById('projectModal');
        const manageProjectsBtn = document.getElementById('manageProjectsBtn');
        const closeModalBtn = document.querySelector('.close-modal');
        const addProjectBtn = document.getElementById('addProjectBtn');
        const projectForm = document.getElementById('projectForm');
        const cancelProjectBtn = document.getElementById('cancelProjectBtn');

        // Event listeners
        if (manageProjectsBtn) {
            manageProjectsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!this.isAdmin && !this.authenticate()) {
                    return;
                }
                this.showModal();
            });
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.hideModal();
                this.resetForm();
            });
        }

        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => {
                if (projectForm) {
                    projectForm.classList.remove('hidden');
                    addProjectBtn.classList.add('hidden');
                }
            });
        }

        if (cancelProjectBtn) {
            cancelProjectBtn.addEventListener('click', () => {
                this.resetForm();
            });
        }

        if (projectForm) {
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProject();
                this.hideModal();
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
                this.resetForm();
            }
        });
    },

    loadProjects() {
        const savedProjects = localStorage.getItem('projects');
        this.projects = savedProjects ? JSON.parse(savedProjects) : [];
    },

    saveProjects() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    },

    renderProjects() {
        const projectsList = document.getElementById('projectsList');
        if (!projectsList) return;

        projectsList.innerHTML = this.projects.map((project, index) => `
            <div class="project-item">
                <span class="project-item-title">${project.title}</span>
                <div class="project-item-actions">
                    <button onclick="ProjectManager.editProject(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="ProjectManager.deleteProject(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    renderProjectsGrid() {
        const projectGrid = document.querySelector('.project-grid');
        if (!projectGrid) return;

        projectGrid.innerHTML = this.projects.map(project => `
            <div class="project-card" data-aos="fade-up">
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-overlay">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-technologies">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.liveLink ? `
                            <a href="${project.liveLink}" class="cta-button primary" target="_blank">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                        ` : ''}
                        ${project.github ? `
                            <a href="${project.github}" class="cta-button secondary" target="_blank">
                                <i class="fab fa-github"></i> GitHub
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    },

    saveProject() {
        const form = document.getElementById('projectForm');
        const projectId = document.getElementById('projectId').value;
        
        const project = {
            title: document.getElementById('projectTitle').value,
            description: document.getElementById('projectDescription').value,
            image: document.getElementById('projectImage').value,
            liveLink: document.getElementById('projectLiveLink').value,
            github: document.getElementById('projectGithub').value,
            technologies: document.getElementById('projectTechnologies').value
                .split(',')
                .map(tech => tech.trim())
                .filter(tech => tech)
        };

        if (projectId === '') {
            // Add new project
            this.projects.push(project);
        } else {
            // Update existing project
            this.projects[parseInt(projectId)] = project;
        }

        this.saveProjects();
        this.renderProjects();
        this.renderProjectsGrid();
        this.resetForm();
    },

    editProject(index) {
        const project = this.projects[index];
        const form = document.getElementById('projectForm');
        const addProjectBtn = document.getElementById('addProjectBtn');

        document.getElementById('projectId').value = index;
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectImage').value = project.image;
        document.getElementById('projectLiveLink').value = project.liveLink || '';
        document.getElementById('projectGithub').value = project.github || '';
        document.getElementById('projectTechnologies').value = project.technologies.join(', ');

        form.classList.remove('hidden');
        addProjectBtn.classList.add('hidden');
    },

    deleteProject(index) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.projects.splice(index, 1);
            this.saveProjects();
            this.renderProjects();
            this.renderProjectsGrid();
        }
    },

    resetForm() {
        const form = document.getElementById('projectForm');
        const addProjectBtn = document.getElementById('addProjectBtn');

        form.reset();
        document.getElementById('projectId').value = '';
        form.classList.add('hidden');
        addProjectBtn.classList.remove('hidden');
    }
};

// Initialize ProjectManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ProjectManager.init();
});
