// Theme switcher functionality
class ThemeSwitcher {
    constructor() {
        this.darkTheme = {
            '--bg-color': '#0a0a0a',
            '--secondary-color': '#1A1A1A',
            '--text-color': '#ffffff',
            '--card-bg': 'rgba(255, 255, 255, 0.05)',
            '--card-border': 'rgba(255, 255, 255, 0.1)',
            '--card-shadow': '0 10px 30px rgba(0, 0, 0, 0.2)',
            '--nav-bg': 'rgba(0, 0, 0, 0.8)',
            '--modal-bg': '#1A1A1A'
        };
        
        this.lightTheme = {
            '--bg-color': '#f5f5f5',
            '--secondary-color': '#e0e0e0',
            '--text-color': '#121212',
            '--card-bg': 'rgba(255, 255, 255, 0.9)',
            '--card-border': 'rgba(0, 0, 0, 0.1)',
            '--card-shadow': '0 10px 30px rgba(0, 0, 0, 0.1)',
            '--nav-bg': 'rgba(255, 255, 255, 0.8)',
            '--modal-bg': '#ffffff'
        };
        
        this.currentTheme = 'dark';
        this.themeToggle = null;
        this.init();
    }
    
    init() {
        // Create theme toggle button
        this.createToggleButton();
        
        // Check for saved theme preference
        this.loadSavedTheme();
        
        // Add event listener to toggle button
        this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    }
    
    createToggleButton() {
        // Create button container
        const container = document.createElement('div');
        container.classList.add('theme-toggle-container');
        
        // Create the toggle button
        this.themeToggle = document.createElement('button');
        this.themeToggle.classList.add('theme-toggle');
        this.themeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
        this.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        
        // Add button to container
        container.appendChild(this.themeToggle);
        
        // Add container to body
        document.body.appendChild(container);
    }
    
    loadSavedTheme() {
        // Check localStorage for saved theme
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
            this.applyTheme(savedTheme);
        }
    }
    
    toggleTheme() {
        // Toggle between dark and light
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply the new theme
        this.applyTheme(newTheme);
        
        // Save preference
        localStorage.setItem('theme', newTheme);
        
        // Update current theme
        this.currentTheme = newTheme;
    }
    
    applyTheme(theme) {
        const root = document.documentElement;
        
        // Apply theme variables
        if (theme === 'dark') {
            // Apply dark theme
            Object.entries(this.darkTheme).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
            
            // Update toggle icon
            this.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            
            // Remove light class
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            
            // Update hero section background
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)';
            }
        } else {
            // Apply light theme
            Object.entries(this.lightTheme).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
            
            // Update toggle icon
            this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            
            // Add light class
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            
            // Update hero section background
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.style.background = 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)';
            }
        }
        
        // Dispatch theme change event
        const event = new CustomEvent('themechange', { detail: { theme } });
        document.dispatchEvent(event);
    }
}

// Initialize theme switcher on page load
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = new ThemeSwitcher();
});
