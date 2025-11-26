/**
 * ============================================================
 * PROJECT LOADER - Dynamic Project Card Renderer
 * ============================================================
 * 
 * File ini menangani:
 * - Memuat data project dari JSON
 * - Merender kartu project secara dinamis
 * - Filter dan pencarian project
 * - Animasi dan interaksi
 * 
 * @author Arris Ahmad Fadillah
 * @version 2.0.0
 * @license MIT
 * ============================================================
 */

// ============================================================
// CONFIGURATION
// ============================================================

const ProjectConfig = {
    // Peta warna untuk kategori (predefined untuk Tailwind)
    colorClasses: {
        teal: {
            badge: 'bg-teal-500',
            badgeLight: 'bg-teal-100 dark:bg-teal-900',
            text: 'text-teal-800 dark:text-teal-200',
            textHover: 'hover:text-teal-600 dark:hover:text-teal-400',
            link: 'text-teal-500 hover:text-teal-600',
            border: 'hover:border-teal-300 dark:hover:border-teal-600',
            dot: 'bg-teal-500',
            icon: 'text-teal-600 dark:text-teal-400',
            iconBg: 'bg-teal-100 dark:bg-teal-900',
            gradient: 'from-teal-500/20 to-blue-500/20'
        },
        blue: {
            badge: 'bg-blue-500',
            badgeLight: 'bg-blue-100 dark:bg-blue-900',
            text: 'text-blue-800 dark:text-blue-200',
            textHover: 'hover:text-blue-600 dark:hover:text-blue-400',
            link: 'text-blue-500 hover:text-blue-600',
            border: 'hover:border-blue-300 dark:hover:border-blue-600',
            dot: 'bg-blue-500',
            icon: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-100 dark:bg-blue-900',
            gradient: 'from-blue-500/20 to-indigo-500/20'
        },
        purple: {
            badge: 'bg-purple-500',
            badgeLight: 'bg-purple-100 dark:bg-purple-900',
            text: 'text-purple-800 dark:text-purple-200',
            textHover: 'hover:text-purple-600 dark:hover:text-purple-400',
            link: 'text-purple-500 hover:text-purple-600',
            border: 'hover:border-purple-300 dark:hover:border-purple-600',
            dot: 'bg-purple-500',
            icon: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-purple-100 dark:bg-purple-900',
            gradient: 'from-purple-500/20 to-pink-500/20'
        },
        green: {
            badge: 'bg-green-500',
            badgeLight: 'bg-green-100 dark:bg-green-900',
            text: 'text-green-800 dark:text-green-200',
            textHover: 'hover:text-green-600 dark:hover:text-green-400',
            link: 'text-green-500 hover:text-green-600',
            border: 'hover:border-green-300 dark:hover:border-green-600',
            dot: 'bg-green-500',
            icon: 'text-green-600 dark:text-green-400',
            iconBg: 'bg-green-100 dark:bg-green-900',
            gradient: 'from-green-500/20 to-teal-500/20'
        },
        sky: {
            badge: 'bg-sky-500',
            badgeLight: 'bg-sky-100 dark:bg-sky-900',
            text: 'text-sky-800 dark:text-sky-200',
            textHover: 'hover:text-sky-600 dark:hover:text-sky-400',
            link: 'text-sky-500 hover:text-sky-600',
            border: 'hover:border-sky-300 dark:hover:border-sky-600',
            dot: 'bg-sky-500',
            icon: 'text-sky-600 dark:text-sky-400',
            iconBg: 'bg-sky-100 dark:bg-sky-900',
            gradient: 'from-sky-500/20 to-cyan-500/20'
        },
        pink: {
            badge: 'bg-pink-500',
            badgeLight: 'bg-pink-100 dark:bg-pink-900',
            text: 'text-pink-800 dark:text-pink-200',
            textHover: 'hover:text-pink-600 dark:hover:text-pink-400',
            link: 'text-pink-500 hover:text-pink-600',
            border: 'hover:border-pink-300 dark:hover:border-pink-600',
            dot: 'bg-pink-500',
            icon: 'text-pink-600 dark:text-pink-400',
            iconBg: 'bg-pink-100 dark:bg-pink-900',
            gradient: 'from-pink-500/20 to-rose-500/20'
        },
        indigo: {
            badge: 'bg-indigo-500',
            badgeLight: 'bg-indigo-100 dark:bg-indigo-900',
            text: 'text-indigo-800 dark:text-indigo-200',
            textHover: 'hover:text-indigo-600 dark:hover:text-indigo-400',
            link: 'text-indigo-500 hover:text-indigo-600',
            border: 'hover:border-indigo-300 dark:hover:border-indigo-600',
            dot: 'bg-indigo-500',
            icon: 'text-indigo-600 dark:text-indigo-400',
            iconBg: 'bg-indigo-100 dark:bg-indigo-900',
            gradient: 'from-indigo-500/20 to-purple-500/20'
        },
        orange: {
            badge: 'bg-orange-500',
            badgeLight: 'bg-orange-100 dark:bg-orange-900',
            text: 'text-orange-800 dark:text-orange-200',
            textHover: 'hover:text-orange-600 dark:hover:text-orange-400',
            link: 'text-orange-500 hover:text-orange-600',
            border: 'hover:border-orange-300 dark:hover:border-orange-600',
            dot: 'bg-orange-500',
            icon: 'text-orange-600 dark:text-orange-400',
            iconBg: 'bg-orange-100 dark:bg-orange-900',
            gradient: 'from-orange-500/20 to-amber-500/20'
        }
    },
    
    // Status badge colors
    statusClasses: {
        completed: { 
            bg: 'bg-green-100 dark:bg-green-900/50', 
            text: 'text-green-800 dark:text-green-300', 
            dot: 'bg-green-500' 
        },
        ongoing: { 
            bg: 'bg-yellow-100 dark:bg-yellow-900/50', 
            text: 'text-yellow-800 dark:text-yellow-300', 
            dot: 'bg-yellow-500' 
        },
        planned: { 
            bg: 'bg-gray-100 dark:bg-gray-700/50', 
            text: 'text-gray-700 dark:text-gray-300', 
            dot: 'bg-gray-500' 
        }
    },
    
    // Animation delay increment (ms)
    animationDelay: 100
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Mendapatkan path JSON berdasarkan lokasi halaman
 * @returns {string} Path ke file projects.json
 */
function getJsonPath() {
    const pathname = window.location.pathname;
    return pathname.includes('/projects/') 
        ? '../assets/data/projects.json' 
        : 'assets/data/projects.json';
}

/**
 * Mendapatkan path gambar berdasarkan lokasi halaman
 * @param {string} imagePath - Path gambar dari JSON
 * @returns {string} Path gambar yang disesuaikan
 */
function getImagePath(imagePath) {
    if (!imagePath || imagePath.startsWith('http')) return imagePath;
    
    const pathname = window.location.pathname;
    if (pathname.includes('/projects/') && !imagePath.startsWith('../')) {
        return '../' + imagePath;
    }
    return imagePath;
}

/**
 * Format tanggal ke format readable
 * @param {string} dateString - Tanggal format YYYY-MM-DD
 * @returns {string} Tanggal yang diformat
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });
}

/**
 * Mendapatkan color classes berdasarkan nama warna
 * @param {string} colorName - Nama warna
 * @returns {Object} Object berisi Tailwind classes
 */
function getColorClasses(colorName) {
    return ProjectConfig.colorClasses[colorName] || ProjectConfig.colorClasses.teal;
}

/**
 * Mendapatkan status classes
 * @param {string} status - Status project
 * @returns {Object} Object berisi Tailwind classes
 */
function getStatusClasses(status) {
    return ProjectConfig.statusClasses[status] || ProjectConfig.statusClasses.completed;
}

// ============================================================
// TEMPLATE GENERATORS
// ============================================================

/**
 * Generate HTML untuk tags
 * @param {Array} tags - Array of tags
 * @param {Object} colors - Color classes object
 * @returns {string} HTML string
 */
function generateTags(tags, colors) {
    return tags.map(tag => `
        <span class="project-tag ${colors.badgeLight} ${colors.text} 
                     px-2 py-1 text-xs rounded-full transition-all duration-300 
                     hover:scale-105 cursor-pointer">
            ${tag}
        </span>
    `).join('');
}

/**
 * Generate HTML untuk action buttons
 * @param {Object} project - Project data
 * @param {Object} colors - Color classes object
 * @returns {string} HTML string
 */
function generateActions(project, colors) {
    let html = `
        <a href="${project.link}" 
           class="${colors.link} inline-flex items-center font-medium text-sm 
                  transition-colors duration-300 group/link">
            <span>${project.linkText}</span>
            <svg class="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
        </a>
        <div class="flex items-center gap-3">
    `;
    
    if (project.github) {
        html += `
            <a href="${project.github}" target="_blank" rel="noopener noreferrer"
               class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                      transition-colors duration-300" title="View on GitHub">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>
        `;
    }
    
    if (project.demo) {
        html += `
            <a href="${project.demo}" target="_blank" rel="noopener noreferrer"
               class="text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 
                      transition-colors duration-300" title="View Demo">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
            </a>
        `;
    }
    
    html += '</div>';
    return html;
}

/**
 * Generate HTML untuk satu kartu project
 * @param {Object} project - Data project
 * @param {number} index - Index untuk animation delay
 * @returns {string} HTML string
 */
function generateProjectCard(project, index) {
    const colors = getColorClasses(project.categoryColor);
    const status = getStatusClasses(project.status);
    const imagePath = getImagePath(project.image);
    const delay = (index + 1) * ProjectConfig.animationDelay;
    
    const tagsHTML = generateTags(project.tags, colors);
    const actionsHTML = generateActions(project, colors);
    const statusLabel = project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Completed';
    
    return `
        <article class="project-card group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
                        border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out
                        hover:shadow-xl hover:-translate-y-2 ${colors.border}"
                 data-aos="fade-up" 
                 data-aos-delay="${delay}"
                 data-project-id="${project.id}"
                 data-category="${project.category.toLowerCase()} ${project.tags.join(' ').toLowerCase()}"
                 data-status="${project.status || 'completed'}"
                 data-featured="${project.featured || false}">
            
            <!-- Image Container -->
            <div class="relative h-48 sm:h-52 overflow-hidden">
                <img src="${imagePath}" 
                     alt="${project.title}" 
                     class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300/1f2937/9ca3af?text=${encodeURIComponent(project.title)}'">
                
                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
                            opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                <!-- Category Badge (Top Left) -->
                <div class="absolute top-4 left-4 z-10">
                    <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold 
                                 ${colors.badge} text-white shadow-lg">
                        <i data-lucide="${project.icon || 'folder'}" class="w-3.5 h-3.5 mr-1.5"></i>
                        ${project.category}
                    </span>
                </div>
                
                <!-- Status Badge (Top Right) -->
                <div class="absolute top-4 right-4 z-10">
                    <span class="${status.bg} ${status.text} px-2.5 py-1 rounded-full text-xs font-medium 
                                 inline-flex items-center shadow-sm backdrop-blur-sm">
                        <span class="w-1.5 h-1.5 ${status.dot} rounded-full mr-1.5 animate-pulse"></span>
                        ${statusLabel}
                    </span>
                </div>
                
                <!-- Date (Bottom Right - Hidden on Mobile) -->
                ${project.date ? `
                <div class="absolute bottom-4 right-4 z-10 hidden sm:block">
                    <span class="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                        ${formatDate(project.date)}
                    </span>
                </div>
                ` : ''}
            </div>
            
            <!-- Content -->
            <div class="p-5 sm:p-6">
                <!-- Title -->
                <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 
                           ${colors.textHover.replace('hover:', 'group-hover:')} 
                           transition-colors duration-300 line-clamp-2">
                    ${project.title}
                </h3>
                
                <!-- Description -->
                <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    ${project.description}
                </p>
                
                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mb-4">
                    ${tagsHTML}
                </div>
                
                <!-- Duration (Optional) -->
                ${project.duration ? `
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Durasi: ${project.duration}</span>
                </div>
                ` : ''}
                
                <!-- Actions -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    ${actionsHTML}
                </div>
            </div>
        </article>
    `;
}

/**
 * Generate loading state HTML
 * @returns {string} HTML string
 */
function generateLoadingState() {
    return `
        <div class="col-span-full flex flex-col items-center justify-center py-16">
            <div class="relative">
                <div class="w-12 h-12 border-4 border-teal-200 dark:border-teal-800 rounded-full animate-spin"></div>
                <div class="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-teal-500 rounded-full animate-spin"></div>
            </div>
            <p class="mt-4 text-gray-500 dark:text-gray-400 animate-pulse">Memuat projects...</p>
        </div>
    `;
}

/**
 * Generate empty state HTML
 * @param {string} message - Message to display
 * @returns {string} HTML string
 */
function generateEmptyState(message = 'Tidak ada project yang ditemukan') {
    return `
        <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-gray-500 dark:text-gray-400 text-lg">${message}</p>
            <button onclick="resetFilters()" 
                    class="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 
                           transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                Reset Filter
            </button>
        </div>
    `;
}

/**
 * Generate error state HTML
 * @param {string} message - Error message
 * @returns {string} HTML string
 */
function generateErrorState(message = 'Gagal memuat projects') {
    return `
        <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <svg class="w-16 h-16 text-red-400 dark:text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <p class="text-red-500 dark:text-red-400 text-lg font-medium">${message}</p>
            <button onclick="loadProjects()" 
                    class="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 
                           transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                Coba Lagi
            </button>
        </div>
    `;
}

// ============================================================
// GLOBAL STATE
// ============================================================

let allProjects = [];
let projectCategories = [];
let currentFilter = 'all';
let currentSearchQuery = '';

// ============================================================
// MAIN FUNCTIONS
// ============================================================

/**
 * Memuat dan merender projects dari JSON
 * @param {Object} options - Configuration options
 */
async function loadProjects(options = {}) {
    const { 
        containerId = 'projects-grid',
        featuredOnly = false,
        limit = null,
        sortBy = 'date',
        sortOrder = 'desc'
    } = options;

    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('Project container not found:', containerId);
        return;
    }

    // Show loading state
    container.innerHTML = generateLoadingState();

    try {
        const response = await fetch(getJsonPath());
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Store data globally
        allProjects = data.projects || [];
        projectCategories = data.categories || [];
        
        // Filter and sort
        let projectsToRender = [...allProjects];
        
        // Filter featured only
        if (featuredOnly) {
            projectsToRender = projectsToRender.filter(p => p.featured);
        }
        
        // Sort
        projectsToRender.sort((a, b) => {
            if (sortBy === 'date') {
                const dateA = new Date(a.date || 0);
                const dateB = new Date(b.date || 0);
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            }
            return 0;
        });
        
        // Apply limit
        if (limit && limit > 0) {
            projectsToRender = projectsToRender.slice(0, limit);
        }

        // Render
        renderProjects(projectsToRender, container);
        
        // Initialize UI
        initializeIcons();
        refreshAOS();
        initializeFilters();
        updateProjectCount(projectsToRender.length);

    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = generateErrorState('Gagal memuat projects. Silakan coba lagi.');
    }
}

/**
 * Render projects to container
 * @param {Array} projects - Projects to render
 * @param {HTMLElement} container - Container element
 */
function renderProjects(projects, container) {
    if (projects.length === 0) {
        container.innerHTML = generateEmptyState();
        return;
    }
    
    container.innerHTML = projects.map((project, index) => 
        generateProjectCard(project, index)
    ).join('');
}

/**
 * Filter projects by category
 * @param {string} category - Category to filter
 */
function filterByCategory(category) {
    currentFilter = category;
    const container = document.getElementById('projects-grid');
    if (!container) return;
    
    let filtered = [...allProjects];
    
    if (category !== 'all') {
        filtered = allProjects.filter(project => {
            const searchable = `${project.category} ${project.tags.join(' ')}`.toLowerCase();
            return searchable.includes(category.toLowerCase());
        });
    }
    
    // Also apply search if active
    if (currentSearchQuery) {
        filtered = applySearch(filtered, currentSearchQuery);
    }
    
    renderProjects(filtered, container);
    initializeIcons();
    refreshAOS();
    updateProjectCount(filtered.length);
}

/**
 * Apply search filter to projects
 * @param {Array} projects - Projects to filter
 * @param {string} query - Search query
 * @returns {Array} Filtered projects
 */
function applySearch(projects, query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return projects;
    
    return projects.filter(project => {
        const searchable = `${project.title} ${project.description} ${project.category} ${project.tags.join(' ')}`.toLowerCase();
        return searchable.includes(searchTerm);
    });
}

/**
 * Search projects
 * @param {string} query - Search query
 */
function searchProjects(query) {
    currentSearchQuery = query;
    const container = document.getElementById('projects-grid');
    if (!container) return;
    
    // Start with all or filtered by category
    let filtered = currentFilter === 'all' ? [...allProjects] : 
        allProjects.filter(p => {
            const searchable = `${p.category} ${p.tags.join(' ')}`.toLowerCase();
            return searchable.includes(currentFilter.toLowerCase());
        });
    
    // Apply search
    filtered = applySearch(filtered, query);
    
    renderProjects(filtered, container);
    initializeIcons();
    refreshAOS();
    updateProjectCount(filtered.length);
    updateSearchResults(filtered.length, query);
}

/**
 * Reset all filters
 */
function resetFilters() {
    currentFilter = 'all';
    currentSearchQuery = '';
    
    // Reset search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    // Reset filter buttons
    const filterButtons = document.querySelectorAll('.category-filter');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === 'all') {
            btn.classList.add('active');
        }
    });
    
    // Re-render all projects
    const container = document.getElementById('projects-grid');
    if (container && allProjects.length > 0) {
        renderProjects(allProjects, container);
        initializeIcons();
        refreshAOS();
        updateProjectCount(allProjects.length);
    }
}

// ============================================================
// UI HELPERS
// ============================================================

/**
 * Initialize Lucide icons
 */
function initializeIcons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

/**
 * Refresh AOS animations
 */
function refreshAOS() {
    if (window.AOS) {
        AOS.refresh();
    }
}

/**
 * Update project count display
 * @param {number} count - Number of projects
 */
function updateProjectCount(count) {
    const countElement = document.getElementById('project-count');
    if (countElement) {
        countElement.textContent = count;
    }
    
    const resultsElement = document.getElementById('filter-results');
    if (resultsElement) {
        resultsElement.textContent = `${count} project${count !== 1 ? 's' : ''} ditemukan`;
        resultsElement.classList.remove('opacity-0');
        setTimeout(() => resultsElement.classList.add('opacity-0'), 2000);
    }
}

/**
 * Update search results display
 * @param {number} count - Number of results
 * @param {string} query - Search query
 */
function updateSearchResults(count, query) {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        if (query.trim()) {
            searchResults.textContent = `${count} hasil untuk "${query}"`;
            searchResults.classList.remove('hidden');
        } else {
            searchResults.classList.add('hidden');
        }
    }
}

/**
 * Initialize filter buttons and search
 */
function initializeFilters() {
    // Category filter buttons
    const filterButtons = document.querySelectorAll('.category-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterByCategory(this.dataset.category);
        });
    });
    
    // Search input with debounce
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => searchProjects(this.value), 300);
        });
        
        // Clear on Escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                searchProjects('');
            }
        });
    }
}

// ============================================================
// EXPORT FOR GLOBAL USE
// ============================================================

window.loadProjects = loadProjects;
window.filterByCategory = filterByCategory;
window.searchProjects = searchProjects;
window.resetFilters = resetFilters;
