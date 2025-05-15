// Interactive 3D background for hero section
class HeroBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.heroSection = document.querySelector('.hero');
        
        if (this.heroSection) {
            this.init();
        }
    }
    
    init() {
        // Create container
        this.container = document.createElement('div');
        this.container.classList.add('hero-3d-background');
        this.heroSection.appendChild(this.container);
        
        // Initialize Three.js scene
        this.initScene();
        
        // Add event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
        
        // Start animation
        this.animate();
    }
    
    initScene() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 1000;
        
        // Create particles
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const sizes = [];
        const colors = [];
        
        // Define particle colors based on theme
        const isDarkTheme = document.body.classList.contains('dark-theme') || 
                          !document.body.classList.contains('light-theme');
        
        const colorPalette = isDarkTheme ? 
            [0xff3d00, 0x00e5ff, 0x2979ff, 0xe73c7e] : // Dark theme colors
            [0xff3d00, 0x00e5ff, 0x2979ff, 0xe73c7e];  // Light theme colors
        
        // Create particles
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 2000 - 1000;
            const y = Math.random() * 2000 - 1000;
            const z = Math.random() * 2000 - 1000;
            
            vertices.push(x, y, z);
            
            // Random size between 5 and 15
            sizes.push(5 + Math.random() * 10);
            
            // Random color from palette
            const color = new THREE.Color(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
            colors.push(color.r, color.g, color.b);
        }
        
        // Add attributes to geometry
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        // Create shader material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTgtMDctMjlUMTc6Mzk6NDkrMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTA3LTI5VDE3OjQwOjIwKzAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE4LTA3LTI5VDE3OjQwOjIwKzAzOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmIzMzBlMWI0LTk5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') }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                void main() {
                    gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                    if (gl_FragColor.a < 0.3) discard;
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        
        // Create particle system
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        // Set renderer style
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '1';
        this.renderer.domElement.style.pointerEvents = 'none';
    }
    
    onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onDocumentMouseMove(event) {
        this.mouseX = (event.clientX - this.windowHalfX) * 0.05;
        this.mouseY = (event.clientY - this.windowHalfY) * 0.05;
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }
    
    render() {
        // Rotate particles
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        // Rotate particle system
        const time = Date.now() * 0.0001;
        this.particles.rotation.x = time * 0.25;
        this.particles.rotation.y = time * 0.5;
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize 3D background on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is available
    if (typeof THREE !== 'undefined') {
        const heroBackground = new HeroBackground();
    }
});
