// Interactive Skills Visualization
class SkillsChart {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.skills = [
            { name: "JavaScript", level: 90, color: "#f7df1e" },
            { name: "HTML/CSS", level: 95, color: "#e34c26" },
            { name: "React", level: 88, color: "#61dafb" },
            { name: "Node.js", level: 82, color: "#6cc24a" },
            { name: "UX/UI Design", level: 85, color: "#ff7eb6" },
            { name: "Three.js", level: 75, color: "#000000" },
            { name: "Python", level: 78, color: "#306998" },
            { name: "Figma", level: 86, color: "#f24e1e" }
        ];
        
        this.maxRadius = 0;
        this.centerX = 0;
        this.centerY = 0;
        this.animationFrame = null;
        this.rotation = 0;
        this.hoverIndex = -1;
        this.isInitialized = false;
        
        // Initialize when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        // Check if skill chart container exists
        const container = document.querySelector('#skills-chart-container');
        if (!container) {
            console.warn('Skills chart container not found');
            return;
        }
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        // Setup canvas dimensions and events
        this.setupCanvas();
        this.setupEvents();
        
        // Start animation
        this.animate();
        
        this.isInitialized = true;
    }
    
    setupCanvas() {
        // Set canvas dimensions
        this.canvas.width = this.canvas.offsetWidth || 600;
        this.canvas.height = this.canvas.offsetHeight || 600;
        
        // Calculate center and max radius
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.maxRadius = Math.min(this.centerX, this.centerY) * 0.8;
        
        // Set canvas styles
        this.canvas.style.display = 'block';
        this.canvas.style.margin = '0 auto';
    }
    
    setupEvents() {
        // Add mouse/touch events for interactivity
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('mouseleave', () => { this.hoverIndex = -1; });
        
        // Add resize event
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Listen for theme changes
        document.addEventListener('themechange', this.handleThemeChange.bind(this));
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.checkHover(x, y);
    }
    
    handleTouchMove(e) {
        if (e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            
            this.checkHover(x, y);
        }
    }
    
    handleResize() {
        // Clear any existing animation frame
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Setup canvas again and restart animation
        this.setupCanvas();
        this.animate();
    }
    
    handleThemeChange(e) {
        // Adjust colors based on theme
        const theme = e.detail.theme;
        
        // Continue animation
        if (!this.animationFrame) {
            this.animate();
        }
    }
    
    checkHover(x, y) {
        // Calculate distance from center
        const dx = x - this.centerX;
        const dy = y - this.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if inside chart
        if (distance <= this.maxRadius) {
            // Calculate angle
            let angle = Math.atan2(dy, dx);
            if (angle < 0) angle += Math.PI * 2;
            
            // Calculate segment
            const segmentAngle = (Math.PI * 2) / this.skills.length;
            let index = Math.floor(((angle + this.rotation) % (Math.PI * 2)) / segmentAngle);
            
            // Adjust index for array bounds
            index = (index + this.skills.length) % this.skills.length;
            
            this.hoverIndex = index;
        } else {
            this.hoverIndex = -1;
        }
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw chart
        this.drawChart();
        
        // Slowly rotate chart
        this.rotation += 0.002;
        
        // Request next frame
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }
    
    drawChart() {
        // Get theme-based colors
        const isDarkTheme = document.body.classList.contains('dark-theme') || 
                           !document.body.classList.contains('light-theme');
                           
        const labelColor = isDarkTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
        const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        // Draw circular grid lines
        this.drawGrid(gridColor);
        
        const segmentAngle = (Math.PI * 2) / this.skills.length;
        
        // Draw skill segments
        this.skills.forEach((skill, i) => {
            const startAngle = i * segmentAngle + this.rotation;
            const endAngle = startAngle + segmentAngle;
            
            const isHovered = this.hoverIndex === i;
            
            // Draw segment
            this.drawSegment(
                skill, 
                startAngle, 
                endAngle, 
                isHovered
            );
        });
        
        // Draw center label
        this.drawCenterLabel(labelColor);
    }
    
    drawGrid(color) {
        const gridLevels = 5;
        
        for (let i = 1; i <= gridLevels; i++) {
            const radius = (this.maxRadius / gridLevels) * i;
            
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }
    
    drawSegment(skill, startAngle, endAngle, isHovered) {
        const { name, level, color } = skill;
        
        // Calculate radius based on skill level
        const radius = (level / 100) * this.maxRadius;
        
        // Draw arc
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, radius, startAngle, endAngle);
        this.ctx.lineTo(this.centerX, this.centerY);
        this.ctx.closePath();
        
        // Fill segment
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, color + (isHovered ? '99' : '66'));
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Draw segment border
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = isHovered ? 3 : 1;
        this.ctx.stroke();
        
        // Draw label
        this.drawLabel(name, level, startAngle, endAngle, radius, isHovered);
    }
    
    drawLabel(name, level, startAngle, endAngle, radius, isHovered) {
        // Calculate midpoint angle
        const midAngle = (startAngle + endAngle) / 2;
        
        // Calculate label position
        const labelRadius = radius + (isHovered ? 20 : 10);
        const x = this.centerX + Math.cos(midAngle) * labelRadius;
        const y = this.centerY + Math.sin(midAngle) * labelRadius;
        
        // Draw label text
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // Rotate text to be tangent to the circle
        let textRotation = midAngle;
        if (textRotation > Math.PI / 2 && textRotation < Math.PI * 3 / 2) {
            textRotation += Math.PI;
        }
        this.ctx.rotate(textRotation);
        
        // Set text styles
        this.ctx.font = isHovered ? 'bold 14px var(--font-main)' : '12px var(--font-main)';
        this.ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Draw skill name and level
        if (isHovered) {
            this.ctx.fillText(name, 0, 0);
            this.ctx.fillText(`${level}%`, 0, 16);
        } else {
            this.ctx.fillText(name, 0, 0);
        }
        
        this.ctx.restore();
    }
    
    drawCenterLabel(color) {
        if (this.hoverIndex !== -1) {
            const skill = this.skills[this.hoverIndex];
            
            this.ctx.font = 'bold 16px var(--font-main)';
            this.ctx.fillStyle = color;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(skill.name, this.centerX, this.centerY - 12);
            
            this.ctx.font = 'bold 24px var(--font-main)';
            this.ctx.fillStyle = skill.color;
            this.ctx.fillText(`${skill.level}%`, this.centerX, this.centerY + 12);
        } else {
            this.ctx.font = 'bold 18px var(--font-main)';
            this.ctx.fillStyle = color;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('SKILLS', this.centerX, this.centerY);
        }
    }
}

// Initialize skills chart
const skillsChart = new SkillsChart();
