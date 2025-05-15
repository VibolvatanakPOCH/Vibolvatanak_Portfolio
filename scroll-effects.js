// Scroll effects for the website
class ScrollEffects {
    constructor() {
        this.progressBar = null;
        this.parallaxElements = [];
        this.lastScrollPosition = 0;
        this.ticking = false;
        this.init();
    }

    init() {
        // Create scroll progress bar
        this.createProgressBar();
        
        // Setup parallax sections
        this.setupParallax();
        
        // Add scroll event listener
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Initial update
        this.updateScrollProgress();
        this.updateParallax();
    }

    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.classList.add('scroll-progress');
        document.body.appendChild(this.progressBar);
    }

    setupParallax() {
        // Convert sections to parallax
        const sections = document.querySelectorAll('.hero, #about, #projects');
        
        sections.forEach(section => {
            // Only apply to sections that don't already have parallax
            if (!section.classList.contains('parallax-section')) {
                section.classList.add('parallax-section');
                
                // Create parallax background if it doesn't exist
                if (!section.querySelector('.parallax-bg')) {
                    // Get background properties
                    const styles = window.getComputedStyle(section);
                    const bgImage = styles.backgroundImage;
                    const bgColor = styles.backgroundColor;
                    
                    // Only create parallax bg if there's an image or color
                    if (bgImage !== 'none' || bgColor !== 'rgba(0, 0, 0, 0)') {
                        // Create background element
                        const parallaxBg = document.createElement('div');
                        parallaxBg.classList.add('parallax-bg');
                        
                        // Apply original background
                        parallaxBg.style.backgroundImage = bgImage;
                        if (bgImage === 'none') {
                            parallaxBg.style.backgroundColor = bgColor;
                        }
                        
                        // Clear original background
                        section.style.background = 'transparent';
                        
                        // Insert at beginning of section
                        section.insertBefore(parallaxBg, section.firstChild);
                        
                        // Add to tracked elements
                        this.parallaxElements.push({
                            section: section,
                            background: parallaxBg
                        });
                    }
                }
            }
        });
    }

    handleScroll() {
        this.lastScrollPosition = window.scrollY;
        
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.updateScrollProgress();
                this.updateParallax();
                this.ticking = false;
            });
            
            this.ticking = true;
        }
    }

    updateScrollProgress() {
        if (!this.progressBar) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (this.lastScrollPosition / scrollHeight) * 100;
        
        this.progressBar.style.width = `${scrolled}%`;
    }

    updateParallax() {
        this.parallaxElements.forEach(item => {
            const section = item.section;
            const background = item.background;
            
            // Get section position
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Check if section is visible
            if (rect.bottom > 0 && rect.top < viewportHeight) {
                // Calculate parallax offset
                const scrollPercentage = (viewportHeight - rect.top) / (viewportHeight + rect.height);
                const parallaxOffset = (scrollPercentage * 30) - 15; // Move -15% to +15%
                
                // Apply transform
                background.style.transform = `translateY(${parallaxOffset}px)`;
            }
        });
    }
}

// Initialize scroll effects on page load
document.addEventListener('DOMContentLoaded', () => {
    const scrollEffects = new ScrollEffects();
});
