// Custom cursor effect
class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursorDot = document.createElement('div');
        this.links = document.querySelectorAll('a, button');
        this.isActive = false;
        this.init();
    }

    init() {
        // Create main cursor element
        this.cursor.classList.add('custom-cursor');
        document.body.appendChild(this.cursor);

        // Create cursor dot
        this.cursorDot.classList.add('cursor-dot');
        document.body.appendChild(this.cursorDot);

        // Add event listeners
        document.addEventListener('mousemove', this.moveCursor.bind(this));
        document.addEventListener('mousedown', this.clickCursor.bind(this));
        document.addEventListener('mouseup', this.resetCursor.bind(this));
        document.addEventListener('mouseenter', this.showCursor.bind(this));
        document.addEventListener('mouseleave', this.hideCursor.bind(this));

        // Add hover effect for links and buttons
        this.links.forEach(link => {
            link.addEventListener('mouseenter', this.growCursor.bind(this));
            link.addEventListener('mouseleave', this.shrinkCursor.bind(this));
        });

        // Check if device is touch-enabled
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            this.disableCursor();
        } else {
            this.enableCursor();
        }
    }

    enableCursor() {
        this.isActive = true;
        document.body.classList.add('custom-cursor-active');
        this.cursor.style.display = 'block';
        this.cursorDot.style.display = 'block';
    }

    disableCursor() {
        this.isActive = false;
        document.body.classList.remove('custom-cursor-active');
        this.cursor.style.display = 'none';
        this.cursorDot.style.display = 'none';
    }

    moveCursor(e) {
        if (!this.isActive) return;
        
        const posX = e.clientX;
        const posY = e.clientY;

        // Move the main cursor with slight delay for trailing effect
        this.cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
        
        // Move the dot cursor immediately
        this.cursorDot.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    }

    clickCursor() {
        if (!this.isActive) return;
        this.cursor.classList.add('cursor-click');
        setTimeout(() => {
            this.cursor.classList.remove('cursor-click');
        }, 300);
    }

    resetCursor() {
        if (!this.isActive) return;
        this.cursor.classList.remove('cursor-click');
    }

    growCursor() {
        if (!this.isActive) return;
        this.cursor.classList.add('cursor-grow');
    }

    shrinkCursor() {
        if (!this.isActive) return;
        this.cursor.classList.remove('cursor-grow');
    }

    showCursor() {
        if (!this.isActive) return;
        this.cursor.style.opacity = 1;
        this.cursorDot.style.opacity = 1;
    }

    hideCursor() {
        if (!this.isActive) return;
        this.cursor.style.opacity = 0;
        this.cursorDot.style.opacity = 0;
    }
}

// Initialize cursor effect on page load
document.addEventListener('DOMContentLoaded', () => {
    const cursor = new CustomCursor();
});
