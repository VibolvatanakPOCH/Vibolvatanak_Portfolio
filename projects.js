// Project Filtering and Modal

class Projects {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupProjectData();
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => this.handleFilterClick(button));
        });

        // Project cards (delegated for dynamic renders)
        const projectGrid = document.querySelector('.project-grid');
        if (projectGrid) {
            projectGrid.addEventListener('click', (e) => {
                const card = e.target.closest('.project-card');
                if (card) {
                    this.openProjectDetails(card);
                }
            });
        }

        // Modal close
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        // Outside click to close modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }

    setupProjectData() {
        this.projects = [
            {
                id: 1,
                title: "E-Commerce Platform",
                category: "web",
                image: "assets/media/project1.jpg",
                description: "A fully responsive e-commerce platform with user authentication, product filtering, and secure payment processing.",
                tags: ["React", "Node.js", "MongoDB", "Stripe API"],
                links: {
                    live: "#",
                    github: "#"
                },
                features: [
                    "User authentication and authorization",
                    "Product filtering and search",
                    "Secure payment processing",
                    "Responsive design",
                    "Real-time inventory updates"
                ]
            },
            {
                id: 2,
                title: "Travel App UI Design",
                category: "design",
                image: "assets/media/project2.jpg",
                description: "A modern travel application UI design with interactive maps, booking system, and personalized recommendations.",
                tags: ["Figma", "UI/UX", "Prototyping"],
                links: {
                    view: "#",
                    download: "#"
                },
                features: [
                    "Interactive map integration",
                    "Modern UI components",
                    "Responsive design",
                    "User-friendly interface",
                    "Custom animations"
                ]
            },
            {
                id: 3,
                title: "Mobile App",
                category: "mobile",
                image: "assets/media/project3.jpg",
                description: "A feature-rich mobile application built with React Native and Firebase.",
                tags: ["React Native", "Firebase", "Push Notifications"],
                links: {
                    store: "#",
                    github: "#"
                },
                features: [
                    "Push notification system",
                    "Offline functionality",
                    "Real-time updates",
                    "Cross-platform compatibility",
                    "Performance optimization"
                ]
            }
        ];
    }

    handleFilterClick(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');

        // Get filter type
        const filter = button.dataset.filter;

        // Filter projects
        document.querySelectorAll('.project-card').forEach(card => {
            const category = card.dataset.category;
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    openProjectDetails(card) {
        const modal = document.getElementById('projectDetailsModal');
        const projectId = parseInt(card.dataset.id, 10);
        const project = this.projects.find(p => p.id === projectId) || this.buildProjectFromCard(card);

        if (!project) return;

        // Update modal content
        document.getElementById('modalProjectImage').src = project.image;
        document.getElementById('modalProjectTitle').textContent = project.title;
        document.getElementById('modalProjectDescription').textContent = project.description;

        // Update tags
        const tagsContainer = document.getElementById('modalProjectTags');
        tagsContainer.innerHTML = (project.tags || []).map(tag => `
            <span class="tag">${tag}</span>
        `).join('');

        // Update links
        const linksContainer = document.getElementById('modalProjectLinks');
        const links = project.links || {};
        linksContainer.innerHTML = Object.entries(links).map(([action, url]) => `
            <a href="${url}" class="cta-button ${action === 'github' ? 'secondary' : 'primary'}" target="_blank">
                <i class="fas ${action === 'github' ? 'fa-github' : 'fa-external-link-alt'}"></i>
                ${action === 'github' ? 'GitHub' : action === 'store' ? 'App Store' : 'View'}
            </a>
        `).join('');

        // Update features
        const featuresContainer = document.getElementById('modalProjectFeatures');
        if (project.features && project.features.length) {
            featuresContainer.innerHTML = `
                <h3>Key Features</h3>
                <ul>
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            `;
        } else {
            featuresContainer.innerHTML = '';
        }

        // Show modal
        modal.style.display = 'block';
        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('projectDetailsModal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    buildProjectFromCard(card) {
        if (!card) return null;

        const title = card.querySelector('.project-title')?.textContent?.trim() || 'Project';
        const description = card.querySelector('.project-description')?.textContent?.trim() || '';
        const image = card.querySelector('img')?.getAttribute('src') || '';
        const tags = Array.from(card.querySelectorAll('.tag, .tech-tag'))
            .map(tag => tag.textContent.trim())
            .filter(Boolean);
        const links = Array.from(card.querySelectorAll('.project-links a')).reduce((acc, link) => {
            const label = link.textContent.toLowerCase();
            if (label.includes('github')) {
                acc.github = link.href;
            } else if (label.includes('app store')) {
                acc.store = link.href;
            } else {
                acc.view = link.href;
            }
            return acc;
        }, {});

        return {
            title,
            description,
            image,
            tags,
            links,
            features: []
        };
    }
}

// Initialize projects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Projects();
});
