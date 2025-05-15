// Advanced Portfolio Gallery with Filtering and Animations
class PortfolioGallery {
    constructor() {
        this.projects = [];
        this.filters = ['All'];
        this.activeFilter = 'All';
        this.animating = false;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        // Find portfolio container
        const container = document.querySelector('#portfolio-gallery');
        if (!container) {
            console.warn('Portfolio gallery container not found');
            return;
        }
        
        // Load projects from existing project cards or localStorage
        this.loadProjects();
        
        // Create filters based on project categories
        this.generateFilters();
        
        // Render gallery
        this.renderGallery(container);
        
        // Observe theme changes
        document.addEventListener('themechange', () => {
            this.updateGalleryStyles();
        });
    }
    
    loadProjects() {
        // First try to load from existing cards
        const existingCards = document.querySelectorAll('.project-card');
        
        if (existingCards.length > 0) {
            this.projects = Array.from(existingCards).map(card => {
                const image = card.querySelector('img').src;
                const title = card.querySelector('.project-title')?.textContent || 'Project';
                const description = card.querySelector('.project-description')?.textContent || '';
                
                // Extract technologies
                const techTags = card.querySelectorAll('.tech-tag');
                const technologies = Array.from(techTags).map(tag => tag.textContent);
                
                // Extract links
                const links = {};
                const linkElements = card.querySelectorAll('a');
                linkElements.forEach(link => {
                    if (link.textContent.includes('Live Demo')) {
                        links.live = link.href;
                    } else if (link.textContent.includes('GitHub')) {
                        links.github = link.href;
                    }
                });
                
                return {
                    id: this.generateId(),
                    title,
                    description,
                    image,
                    technologies,
                    category: this.getCategoryFromTechnologies(technologies),
                    links
                };
            });
        } else {
            // If no existing cards, load from localStorage or use defaults
            const savedProjects = localStorage.getItem('portfolioProjects');
            
            if (savedProjects) {
                this.projects = JSON.parse(savedProjects);
            } else {
                // Default projects
                this.projects = [
                    {
                        id: this.generateId(),
                        title: 'E-Commerce Platform',
                        description: 'A fully responsive e-commerce platform with user authentication, product filtering, and secure payment processing.',
                        image: 'assets/media/project1.jpg',
                        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
                        category: 'Web Development',
                        links: {
                            live: '#',
                            github: '#'
                        }
                    },
                    {
                        id: this.generateId(),
                        title: 'Travel App UI Design',
                        description: 'A modern travel application UI design with interactive maps, booking system, and personalized recommendations.',
                        image: 'assets/media/project2.jpg',
                        technologies: ['Figma', 'Adobe XD', 'UI/UX', 'Prototyping'],
                        category: 'UI/UX Design',
                        links: {
                            live: '#',
                            github: '#'
                        }
                    },
                    {
                        id: this.generateId(),
                        title: 'Task Management Dashboard',
                        description: 'A productivity dashboard for teams with task tracking, real-time updates, and performance analytics.',
                        image: 'assets/media/project3.jpg',
                        technologies: ['Vue.js', 'Firebase', 'Chart.js', 'Sass'],
                        category: 'Web Development',
                        links: {
                            live: '#',
                            github: '#'
                        }
                    },
                    {
                        id: this.generateId(),
                        title: 'Music Streaming App',
                        description: 'A feature-rich music streaming application with personalized playlists and social sharing capabilities.',
                        image: 'assets/media/project4.jpg',
                        technologies: ['React Native', 'Express', 'PostgreSQL', 'AWS'],
                        category: 'Mobile Development',
                        links: {
                            live: '#',
                            github: '#'
                        }
                    },
                    {
                        id: this.generateId(),
                        title: 'AI Image Generator',
                        description: 'An application that uses machine learning to generate unique artwork based on text descriptions.',
                        image: 'assets/media/project5.jpg',
                        technologies: ['Python', 'TensorFlow', 'Flask', 'React'],
                        category: 'AI & Machine Learning',
                        links: {
                            live: '#',
                            github: '#'
                        }
                    },
                    {
                        id: this.generateId(),
                        title: 'Crypto Dashboard',
                        description: 'Real-time cryptocurrency tracking dashboard with price alerts and portfolio management.',
                        image: 'assets/media/project6.jpg',
                        technologies: ['Angular', 'D3.js', 'Node.js', 'WebSockets'],
                        category: 'Web Development',
                        links: {
                            live: '#',
                            github: '#'
                        }
                    }
                ];
            }
        }
    }
    
    generateId() {
        return Math.random().toString(36).substring(2, 9);
    }
    
    getCategoryFromTechnologies(technologies) {
        const techCategories = {
            'React': 'Web Development',
            'Vue.js': 'Web Development',
            'Angular': 'Web Development',
            'Node.js': 'Web Development',
            'Express': 'Web Development',
            'MongoDB': 'Web Development',
            'Firebase': 'Web Development',
            'Figma': 'UI/UX Design',
            'Adobe XD': 'UI/UX Design',
            'UI/UX': 'UI/UX Design',
            'React Native': 'Mobile Development',
            'Flutter': 'Mobile Development',
            'Swift': 'Mobile Development',
            'Kotlin': 'Mobile Development',
            'Python': 'AI & Machine Learning',
            'TensorFlow': 'AI & Machine Learning',
            'Machine Learning': 'AI & Machine Learning',
            'Unity': 'Game Development',
            'Unreal Engine': 'Game Development',
            'Blockchain': 'Blockchain',
            'Smart Contract': 'Blockchain'
        };
        
        // Find the first matching category
        for (const tech of technologies) {
            if (techCategories[tech]) {
                return techCategories[tech];
            }
        }
        
        // Default category
        return 'Other';
    }
    
    generateFilters() {
        // Get unique categories
        const categories = [...new Set(this.projects.map(project => project.category))];
        
        // Combine with default 'All' filter
        this.filters = ['All', ...categories.sort()];
    }
    
    renderGallery(container) {
        // Clear container
        container.innerHTML = '';
        
        // Create filter controls
        const filterControls = document.createElement('div');
        filterControls.className = 'portfolio-filters';
        
        this.filters.forEach(filter => {
            const filterButton = document.createElement('button');
            filterButton.className = 'portfolio-filter';
            filterButton.textContent = filter;
            if (filter === this.activeFilter) {
                filterButton.classList.add('active');
            }
            
            filterButton.addEventListener('click', () => {
                if (this.animating || filter === this.activeFilter) return;
                this.animating = true;
                
                // Update active filter
                document.querySelectorAll('.portfolio-filter').forEach(btn => {
                    btn.classList.remove('active');
                });
                filterButton.classList.add('active');
                this.activeFilter = filter;
                
                // Animate out current projects
                const projectItems = document.querySelectorAll('.portfolio-item');
                let animationCount = projectItems.length;
                
                if (animationCount === 0) {
                    this.renderProjects();
                    this.animating = false;
                    return;
                }
                
                projectItems.forEach((item, index) => {
                    // Staggered animation out
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        
                        setTimeout(() => {
                            animationCount--;
                            if (animationCount === 0) {
                                // All items animated out, render new projects
                                this.renderProjects();
                                this.animating = false;
                            }
                        }, 300);
                    }, index * 50);
                });
            });
            
            filterControls.appendChild(filterButton);
        });
        
        // Create projects grid
        const projectsGrid = document.createElement('div');
        projectsGrid.className = 'portfolio-grid';
        projectsGrid.id = 'portfolio-items';
        
        // Add to container
        container.appendChild(filterControls);
        container.appendChild(projectsGrid);
        
        // Render initial projects
        this.renderProjects();
    }
    
    renderProjects() {
        const projectsGrid = document.getElementById('portfolio-items');
        if (!projectsGrid) return;
        
        // Clear grid
        projectsGrid.innerHTML = '';
        
        // Filter projects
        const filteredProjects = this.activeFilter === 'All' 
            ? this.projects 
            : this.projects.filter(project => project.category === this.activeFilter);
        
        if (filteredProjects.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-portfolio-message';
            emptyMessage.innerHTML = `
                <i class="fas fa-search"></i>
                <p>No projects found in the "${this.activeFilter}" category.</p>
            `;
            projectsGrid.appendChild(emptyMessage);
            return;
        }
        
        // Render each project
        filteredProjects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
        });
    }
    
    createProjectCard(project, index) {
        const { id, title, description, image, technologies, category, links } = project;
        
        // Create card element
        const card = document.createElement('div');
        card.className = 'portfolio-item';
        card.setAttribute('data-id', id);
        card.setAttribute('data-category', category);
        
        // Set initial animation state
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        
        // Create card content
        card.innerHTML = `
            <div class="portfolio-item-inner">
                <div class="portfolio-image">
                    <img src="${image}" alt="${title}" loading="lazy">
                    <div class="portfolio-overlay">
                        <div class="portfolio-category">${category}</div>
                        <div class="portfolio-actions">
                            ${links.live ? `<a href="${links.live}" class="portfolio-action" target="_blank" title="View Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                            ${links.github ? `<a href="${links.github}" class="portfolio-action" target="_blank" title="View Code"><i class="fab fa-github"></i></a>` : ''}
                            <button class="portfolio-action details-action" title="View Details"><i class="fas fa-info-circle"></i></button>
                        </div>
                    </div>
                </div>
                <div class="portfolio-content">
                    <h3 class="portfolio-title">${title}</h3>
                    <p class="portfolio-excerpt">${description.substring(0, 80)}${description.length > 80 ? '...' : ''}</p>
                    <div class="portfolio-technologies">
                        ${technologies.slice(0, 3).map(tech => `<span class="portfolio-tech">${tech}</span>`).join('')}
                        ${technologies.length > 3 ? `<span class="portfolio-tech-more">+${technologies.length - 3}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Add animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, index * 100);
        
        // Add details modal event
        const detailsButton = card.querySelector('.details-action');
        if (detailsButton) {
            detailsButton.addEventListener('click', () => {
                this.showProjectDetails(project);
            });
        }
        
        return card;
    }
    
    showProjectDetails(project) {
        const { title, description, image, technologies, category, links } = project;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'portfolio-modal';
        
        // Create modal content
        modal.innerHTML = `
            <div class="portfolio-modal-content">
                <button class="modal-close"><i class="fas fa-times"></i></button>
                <div class="modal-image">
                    <img src="${image}" alt="${title}">
                </div>
                <div class="modal-details">
                    <h2>${title}</h2>
                    <div class="modal-category">${category}</div>
                    <div class="modal-description">${description}</div>
                    <div class="modal-section">
                        <h3>Technologies</h3>
                        <div class="modal-technologies">
                            ${technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                        </div>
                    </div>
                    <div class="modal-actions">
                        ${links.live ? `<a href="${links.live}" class="cta-button primary" target="_blank"><i class="fas fa-external-link-alt"></i> View Live</a>` : ''}
                        ${links.github ? `<a href="${links.github}" class="cta-button secondary" target="_blank"><i class="fab fa-github"></i> View Code</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.appendChild(modal);
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Add animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Add close event
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = '';
                }, 300);
            });
        }
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeButton.click();
            }
        });
    }
    
    updateGalleryStyles() {
        // This method can be extended to update gallery styles based on theme
        const isDarkTheme = document.body.classList.contains('dark-theme') || 
                          !document.body.classList.contains('light-theme');
                          
        const galleryItems = document.querySelectorAll('.portfolio-item-inner');
        
        galleryItems.forEach(item => {
            item.style.backgroundColor = isDarkTheme ? 'var(--card-bg)' : 'var(--card-bg)';
            item.style.borderColor = isDarkTheme ? 'var(--card-border)' : 'var(--card-border)';
        });
    }
}

// Initialize portfolio gallery
const portfolioGallery = new PortfolioGallery();
