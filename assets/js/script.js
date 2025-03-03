// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navButtons = document.querySelector('.nav-buttons');
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const mainNav = document.querySelector('.main-nav');
const audioPlayer = document.querySelector('.audio-player');

// Theme Colors
const SPOTIFY_GREEN = '#1db954';
const DARK_BG = '#121212';

// Mobile Menu Handling
function initializeMobileMenu() {
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navButtons.classList.toggle('show');
        
        // Add slide animation
        if (!isExpanded) {
            navButtons.style.animation = 'slideDown 0.3s ease forwards';
        } else {
            navButtons.style.animation = 'slideUp 0.3s ease forwards';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navButtons.contains(event.target) && !menuToggle.contains(event.target)) {
            navButtons.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Search Functionality
function initializeSearch() {
    let searchTimeout;
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

    searchInput.addEventListener('focus', () => {
        searchInput.parentElement.classList.add('focused');
        showRecentSearches();
    });

    searchInput.addEventListener('blur', (e) => {
        // Delay removing focus to allow clicking on suggestions
        setTimeout(() => {
            if (!searchSuggestions.contains(document.activeElement)) {
                searchInput.parentElement.classList.remove('focused');
                searchSuggestions.style.display = 'none';
            }
        }, 200);
    });

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                searchSongs(query);
            }
        }, 300);
    });

    function showRecentSearches() {
        if (recentSearches.length > 0) {
            const html = `
                <div class="search-section">
                    <h3>Recent Searches</h3>
                    ${recentSearches.map(search => `
                        <div class="search-item">
                            <i class="fas fa-history"></i>
                            <span>${search}</span>
                            <button class="remove-search" data-query="${search}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
            searchSuggestions.innerHTML = html;
            searchSuggestions.style.display = 'block';
        }
    }
}

// Navigation Handling
function initializeNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Smooth scroll with easing
                smoothScrollTo(target.offsetTop - 80, 800);
                
                // Update active state
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Smooth scroll function with easing
    function smoothScrollTo(targetY, duration) {
        const startY = window.scrollY;
        const difference = targetY - startY;
        const startTime = performance.now();

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        function step() {
            const currentTime = performance.now();
            const elapsed = (currentTime - startTime) / duration;

            if (elapsed > 1) {
                window.scrollTo(0, targetY);
                return;
            }

            window.scrollTo(0, startY + difference * easeInOutQuad(elapsed));
            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }
}

// Active Section Tracking
function initializeScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.main-nav a');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    });

    function updateActiveSection() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const id = section.id;
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
}

// Card Hover Effects
function initializeCardEffects() {
    const cards = document.querySelectorAll('.artist-card, .album-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.transform = 'scale(1.05)';
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

// Artist Cards Scroll Functionality
function initializeArtistScroll() {
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    const artistsGrid = document.querySelector('.artists-grid');
    const scrollAmount = 400; // Adjust this value based on your needs

    // Show/hide scroll buttons based on scroll position
    function updateScrollButtons() {
        scrollLeftBtn.style.display = artistsGrid.scrollLeft > 0 ? 'flex' : 'none';
        scrollRightBtn.style.display = 
            artistsGrid.scrollLeft < (artistsGrid.scrollWidth - artistsGrid.clientWidth) 
            ? 'flex' 
            : 'none';
    }

    // Initial button state
    updateScrollButtons();

    // Scroll left button click
    scrollLeftBtn.addEventListener('click', () => {
        artistsGrid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    // Scroll right button click
    scrollRightBtn.addEventListener('click', () => {
        artistsGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Update button visibility on scroll
    artistsGrid.addEventListener('scroll', updateScrollButtons);
}

// Album Cards Scroll Functionality
function initializeAlbumScroll() {
    const scrollLeftBtn = document.querySelector('#popular-albums .scroll-left');
    const scrollRightBtn = document.querySelector('#popular-albums .scroll-right');
    const albumsGrid = document.querySelector('.albums-grid');
    const scrollAmount = 400; // Adjust this value based on your needs

    // Show/hide scroll buttons based on scroll position
    function updateScrollButtons() {
        scrollLeftBtn.style.display = albumsGrid.scrollLeft > 0 ? 'flex' : 'none';
        scrollRightBtn.style.display = 
            albumsGrid.scrollLeft < (albumsGrid.scrollWidth - albumsGrid.clientWidth) 
            ? 'flex' 
            : 'none';
    }

    // Initial button state
    updateScrollButtons();

    // Scroll left button click
    scrollLeftBtn.addEventListener('click', () => {
        albumsGrid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    // Scroll right button click
    scrollRightBtn.addEventListener('click', () => {
        albumsGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Update button visibility on scroll
    albumsGrid.addEventListener('scroll', updateScrollButtons);
}

// Automatic Artist Cards Slideshow
function initializeArtistSlideshow() {
    const artistsGrid = document.querySelector('.artists-grid');
    const scrollAmount = 400; // Same as manual scroll amount
    let slideshowInterval;

    function startSlideshow() {
        slideshowInterval = setInterval(() => {
            const maxScroll = artistsGrid.scrollWidth - artistsGrid.clientWidth;
            const newScrollPosition = artistsGrid.scrollLeft + scrollAmount;

            if (newScrollPosition >= maxScroll) {
                // If we reach the end, scroll back to start
                artistsGrid.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                // Scroll to next set of cards
                artistsGrid.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 5000); // Change slides every 5 seconds
    }

    function stopSlideshow() {
        clearInterval(slideshowInterval);
    }

    // Start slideshow when page loads
    startSlideshow();

    // Pause slideshow when user interacts with the cards
    artistsGrid.addEventListener('mouseenter', stopSlideshow);
    artistsGrid.addEventListener('touchstart', stopSlideshow);

    // Resume slideshow when user stops interacting
    artistsGrid.addEventListener('mouseleave', startSlideshow);
    artistsGrid.addEventListener('touchend', startSlideshow);
}

// Automatic Album Cards Slideshow
function initializeAlbumSlideshow() {
    const albumsGrid = document.querySelector('.albums-grid');
    const scrollAmount = 400; // Same as manual scroll amount
    let slideshowInterval;

    function startSlideshow() {
        slideshowInterval = setInterval(() => {
            const maxScroll = albumsGrid.scrollWidth - albumsGrid.clientWidth;
            const newScrollPosition = albumsGrid.scrollLeft + scrollAmount;

            if (newScrollPosition >= maxScroll) {
                // If we reach the end, scroll back to start
                albumsGrid.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                // Scroll to next set of cards
                albumsGrid.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 5000); // Change slides every 5 seconds
    }

    function stopSlideshow() {
        clearInterval(slideshowInterval);
    }

    // Start slideshow when page loads
    startSlideshow();

    // Pause slideshow when user interacts with the cards
    albumsGrid.addEventListener('mouseenter', stopSlideshow);
    albumsGrid.addEventListener('touchstart', stopSlideshow);

    // Resume slideshow when user stops interacting
    albumsGrid.addEventListener('mouseleave', startSlideshow);
    albumsGrid.addEventListener('touchend', startSlideshow);
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    // Remove loading state
    document.body.classList.remove('loading');
    
    // Initialize all components
    initializeMobileMenu();
    initializeSearch();
    initializeNavigation();
    initializeScrollSpy();
    initializeCardEffects();
    initializeArtistScroll();
    initializeAlbumScroll();
    initializeArtistSlideshow();
    initializeAlbumSlideshow();
});
