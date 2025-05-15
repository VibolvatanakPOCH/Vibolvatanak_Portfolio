// Interactive Timeline Component
class InteractiveTimeline {
    constructor() {
        this.isAnimating = false;
        this.observer = null;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        // Check if timeline exists
        const timeline = document.querySelector('.timeline');
        if (!timeline) {
            console.warn('Timeline not found');
            return;
        }
        
        // Enable interactive features
        this.setupTimelineItems();
        this.setupIntersectionObserver();
    }
    
    setupTimelineItems() {
        const items = document.querySelectorAll('.timeline-item');
        
        items.forEach((item, index) => {
            // Set initial state - staggered based on index
            item.style.opacity = '0';
            item.style.transform = 'translateY(50px)';
            item.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            
            // Add click event for expanding details
            item.addEventListener('click', (e) => {
                this.toggleTimelineItem(item, e);
            });
            
            // Add expand/collapse button
            const expandButton = document.createElement('button');
            expandButton.className = 'timeline-expand-btn';
            expandButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
            expandButton.setAttribute('aria-label', 'Expand timeline item');
            
            expandButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleTimelineItem(item, e);
            });
            
            const timelineContent = item.querySelector('.timeline-content');
            if (timelineContent) {
                timelineContent.appendChild(expandButton);
            }
        });
    }
    
    setupIntersectionObserver() {
        // Set up observer for revealing items as they come into view
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Unobserve after animation
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        });
        
        // Observe all timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            this.observer.observe(item);
        });
    }
    
    toggleTimelineItem(item, event) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const isExpanded = item.classList.contains('expanded');
        const content = item.querySelector('.timeline-content');
        const expandBtn = item.querySelector('.timeline-expand-btn i');
        const details = item.querySelector('.timeline-details');
        
        if (!content || !expandBtn || !details) {
            this.isAnimating = false;
            return;
        }
        
        if (isExpanded) {
            // Collapse
            expandBtn.className = 'fas fa-chevron-down';
            details.style.maxHeight = '0';
            details.style.opacity = '0';
            
            setTimeout(() => {
                item.classList.remove('expanded');
                this.isAnimating = false;
            }, 300);
        } else {
            // Expand
            item.classList.add('expanded');
            expandBtn.className = 'fas fa-chevron-up';
            details.style.maxHeight = details.scrollHeight + 'px';
            details.style.opacity = '1';
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 300);
        }
    }
}

// Initialize interactive timeline
const interactiveTimeline = new InteractiveTimeline();
