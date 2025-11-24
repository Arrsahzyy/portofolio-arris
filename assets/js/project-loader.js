/**
 * Project Loader Script
 * Handles fetching and rendering projects from JSON data
 */

async function loadProjects(options = {}) {
    const { 
        containerId = 'projects-grid', 
        filterContainerId = 'filter-container',
        featuredOnly = false,
        limit = null,
        basePath = '' // To handle relative paths if needed
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        // Adjust path based on where the script is called from
        // If called from root (index.html), path is assets/data/projects.json
        // If called from projects/projects.html, path is ../assets/data/projects.json
        const jsonPath = window.location.pathname.includes('/projects/') 
            ? '../assets/data/projects.json' 
            : 'assets/data/projects.json';

        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error('Failed to load projects');
        
        const allProjects = await response.json();
        
        // Filter projects
        let projectsToRender = allProjects;
        if (featuredOnly) {
            projectsToRender = allProjects.filter(p => p.featured);
        }
        
        if (limit) {
            projectsToRender = projectsToRender.slice(0, limit);
        }

        renderProjects(projectsToRender, container, basePath);
        
        // Initialize Lucide icons for the new elements
        if (window.lucide) {
            lucide.createIcons();
        }

        // Initialize AOS for new elements if available
        if (window.AOS) {
            AOS.refresh();
        }

    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = '<p class="text-center text-red-500">Failed to load projects. Please try again later.</p>';
    }
}

function renderProjects(projects, container, basePath) {
    container.innerHTML = projects.map((project, index) => {
        // Adjust image path if needed
        let imagePath = project.image;
        if (basePath && !imagePath.startsWith('http')) {
            // If we are in a subdirectory and image path is relative to root
            if (window.location.pathname.includes('/projects/') && !imagePath.startsWith('../')) {
                imagePath = '../' + imagePath;
            }
        }

        const delay = (index + 1) * 100; // Stagger animation
        
        // Map color names to Tailwind classes
        const colorMap = {
            teal: 'teal',
            blue: 'blue',
            purple: 'purple',
            green: 'green',
            sky: 'sky',
            pink: 'pink',
            indigo: 'indigo'
        };
        
        const color = colorMap[project.categoryColor] || 'teal';
        
        return `
            <div class="project-card group relative transition-all duration-300 ease-out" 
                 data-aos="fade-up" 
                 data-aos-delay="${delay}" 
                 data-category="${project.category.toLowerCase()} ${project.tags.join(' ').toLowerCase()}"
                 data-mobile-enhanced="true">
                
                <div class="relative rounded-t-lg overflow-hidden">
                    <img src="${imagePath}" alt="${project.title}" 
                         class="w-full h-48 object-cover project-img transition-all duration-500 group-hover:scale-105"
                         onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(project.title)}'">
                    <div class="absolute inset-0 bg-gradient-to-tr from-${color}-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div class="p-6 relative">
                    <div class="flex items-center justify-between mb-3">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-200">
                            <span class="w-2 h-2 bg-${color}-500 rounded-full mr-2 animate-pulse"></span>
                            ${project.category}
                        </span>
                        <div class="w-8 h-8 rounded-full bg-${color}-100 dark:bg-${color}-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <i data-lucide="${project.icon}" class="w-4 h-4 text-${color}-600 dark:text-${color}-400"></i>
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-bold mb-3 group-hover:text-${color}-600 dark:group-hover:text-${color}-400 transition-colors duration-300">
                        ${project.title}
                    </h3>
                    
                    <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                        ${project.description}
                    </p>
                    
                    <div class="mb-6 flex flex-wrap gap-2">
                        ${project.tags.map(tag => `
                            <span class="tech-tag bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-200 transition-all duration-300 hover:scale-105 cursor-pointer">
                                ${tag}
                            </span>
                        `).join('')}
                    </div>
                    
                    <a href="${project.link}" class="project-link text-${color}-500 inline-flex items-center relative overflow-hidden group/link hover:text-${color}-600 transition-colors duration-300">
                        <span class="link-text relative z-10">${project.linkText}</span>
                        <span class="ml-2 arrow transition-transform duration-300 group-hover/link:translate-x-1">&rarr;</span>
                    </a>
                </div>

                <!-- Enhanced Timeline node -->
                <div class="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-30">
                  <div class="timeline-node w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 bg-${color}-500 shadow-lg transition-all duration-300 opacity-60">
                    <div class="absolute inset-0 rounded-full bg-${color}-500 opacity-20"></div>
                  </div>
                </div>
            </div>
        `;
    }).join('');
}
