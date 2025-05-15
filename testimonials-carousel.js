// Testimonials Carousel Component
class TestimonialsCarousel {
    constructor() {
        this.currentSlide = 0;
        this.testimonials = [
            {
                name: "Sarah Johnson",
                role: "Project Manager at TechCorp",
                image: "assets/media/testimonials/testimonial1.jpg",
                text: "Vibolvatanak's attention to detail and creative approach to problem-solving made our collaboration incredibly successful. The web application developed exceeded our expectations."
            },
            {
                name: "Michael Chen",
                role: "Founder, InnovateLabs",
                image: "assets/media/testimonials/testimonial2.jpg", 
                text: "Working with Vibolvatanak was a game-changer for our startup. The intuitive UI design and seamless functionality helped us gain traction with users quickly."
            },
            {
                name: "Jessica Williams",
                role: "Creative Director, DesignForward",
                image: "assets/media/testimonials/testimonial3.jpg",
                text: "I've rarely encountered a developer who understands design principles so well. Vibolvatanak translated our concepts into a beautiful, functional website that perfectly represents our brand."
            },
            {
                name: "David Rodriguez",
                role: "Senior Developer, CodeCraft",
                image: "assets/media/testimonials/testimonial4.jpg",
                text: "As a fellow developer, I was impressed by the clean, well-structured code. It made the handover process smooth and maintenance straightforward."
            }
        ];
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        const container = document.querySelector('#testimonials-container');
        if (!container) {
            console.warn('Testimonials container not found');
            return;
        }
        
        this.renderCarousel(container);
        this.setupEventListeners();
        this.startAutoplay();
    }
    
    renderCarousel(container) {
        // Clear container
        container.innerHTML = '';
        
        // Create carousel wrapper
        const carouselWrapper = document.createElement('div');
        carouselWrapper.className = 'testimonials-carousel';
        
        // Create carousel track
        const carouselTrack = document.createElement('div');
        carouselTrack.className = 'testimonials-track';
        
        // Add testimonial slides
        this.testimonials.forEach((testimonial, index) => {
            const slide = this.createSlide(testimonial, index);
            carouselTrack.appendChild(slide);
        });
        
        // Create navigation
        const prevButton = document.createElement('button');
        prevButton.className = 'testimonial-nav prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.setAttribute('aria-label', 'Previous testimonial');
        
        const nextButton = document.createElement('button');
        nextButton.className = 'testimonial-nav next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.setAttribute('aria-label', 'Next testimonial');
        
        // Create indicators
        const indicators = document.createElement('div');
        indicators.className = 'testimonial-indicators';
        
        this.testimonials.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'testimonial-indicator';
            indicator.setAttribute('data-index', index.toString());
            indicator.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            if (index === 0) indicator.classList.add('active');
            
            indicators.appendChild(indicator);
        });
        
        // Assemble carousel
        carouselWrapper.appendChild(prevButton);
        carouselWrapper.appendChild(carouselTrack);
        carouselWrapper.appendChild(nextButton);
        carouselWrapper.appendChild(indicators);
        
        // Add to container
        container.appendChild(carouselWrapper);
        
        // Store elements for later use
        this.carouselTrack = carouselTrack;
        this.indicators = indicators.querySelectorAll('.testimonial-indicator');
        
        // Set initial position
        this.goToSlide(0);
    }
    
    createSlide(testimonial, index) {
        const { name, role, image, text } = testimonial;
        
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.setAttribute('data-index', index.toString());
        
        // Create testimonial card with animation effect
        slide.innerHTML = `
            <div class="testimonial-card" data-aos="fade-up">
                <div class="testimonial-content">
                    <div class="quote-icon">
                        <i class="fas fa-quote-left"></i>
                    </div>
                    <p class="testimonial-text">${text}</p>
                    <div class="testimonial-author">
                        <div class="author-image">
                            <img src="${image}" alt="${name}" onerror="this.src='assets/media/album-art/white@2x.png'">
                        </div>
                        <div class="author-info">
                            <h4 class="author-name">${name}</h4>
                            <p class="author-role">${role}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return slide;
    }
    
    setupEventListeners() {
        // Get navigation buttons
        const prevButton = document.querySelector('.testimonial-nav.prev');
        const nextButton = document.querySelector('.testimonial-nav.next');
        
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoplay();
            });
            
            nextButton.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoplay();
            });
        }
        
        // Add indicators click events
        this.indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const index = parseInt(indicator.getAttribute('data-index'));
                this.goToSlide(index);
                this.resetAutoplay();
            });
        });
        
        // Add swipe support for mobile
        this.addSwipeSupport();
    }
    
    addSwipeSupport() {
        const carousel = document.querySelector('.testimonials-carousel');
        if (!carousel) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50; // Minimum swipe distance in pixels
        
        if (startX - endX > threshold) {
            // Swipe left, go to next
            this.nextSlide();
            this.resetAutoplay();
        }
        
        if (endX - startX > threshold) {
            // Swipe right, go to previous
            this.prevSlide();
            this.resetAutoplay();
        }
    }
    
    prevSlide() {
        let index = this.currentSlide - 1;
        if (index < 0) index = this.testimonials.length - 1;
        this.goToSlide(index);
    }
    
    nextSlide() {
        let index = this.currentSlide + 1;
        if (index >= this.testimonials.length) index = 0;
        this.goToSlide(index);
    }
    
    goToSlide(index) {
        // Update current slide
        this.currentSlide = index;
        
        // Update track position
        if (this.carouselTrack) {
            this.carouselTrack.style.transform = `translateX(-${index * 100}%)`;
        }
        
        // Update indicators
        this.indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    startAutoplay() {
        this.stopAutoplay(); // Clear any existing interval
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 6000); // Change slide every 6 seconds
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
    
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// Initialize testimonials carousel
const testimonialsCarousel = new TestimonialsCarousel();
