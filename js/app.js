// Theme configuration
const themes = {
    green: {
        primary: '#39FF14',
        name: 'Neon Green'
    },
    purple: {
        primary: '#FF00FF',
        name: 'Neon Purple'
    },
    blue: {
        primary: '#00F7FF',
        name: 'Neon Blue'
    },
    white: {
        primary: '#FFFFFF',
        name: 'White'
    },
    orange: {
        primary: '#FF6B08',
        name: 'Neon Orange'
    },
    pink: {
        primary: '#FF69B4',
        name: 'Neon Pink'
    }
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchInput = document.querySelector('input[placeholder="Search songs..."]');
    const sortSelect = document.querySelector('select:nth-of-type(1)');
    const languageSelect = document.querySelector('select:nth-of-type(2)');
    const tagBoxes = document.querySelectorAll('.tag-box');
    const themeButtons = document.querySelectorAll('.fixed.bottom-4 button');

    // Theme Switching
    function applyTheme(themeColor) {
    document.documentElement.style.setProperty('--neon-green', themes[themeColor].primary);
    
    // Update all elements with neon effects
    document.querySelectorAll('[class*="border-[var(--neon-green)]"]').forEach(el => {
        el.style.borderColor = themes[themeColor].primary;
    });
    
    document.querySelectorAll('[class*="text-[var(--neon-green)]"]').forEach(el => {
        el.style.color = themes[themeColor].primary;
    });
    
    // Update box shadows
    document.querySelectorAll('.search-container, .tag-box, .recent-updates, .song-card').forEach(el => {
        el.style.boxShadow = `0 0 10px ${themes[themeColor].primary}`;
    });
    
    // Store theme preference
    localStorage.setItem('selectedTheme', themeColor);
}

    // Initialize theme from localStorage or default to green
    const savedTheme = localStorage.getItem('selectedTheme') || 'green';
    applyTheme(savedTheme);

    // Theme button click handlers
    themeButtons.forEach((button, index) => {
        const themeColor = Object.keys(themes)[index];
        button.addEventListener('click', () => applyTheme(themeColor));
    });

    // Search functionality
    function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const performSearch = debounce((searchTerm) => {
    // In a real application, this would make an API call
    console.log('Searching for:', searchTerm);
    // Simulate API call and update UI
    filterSongs(searchTerm);
}, 300);

    if (searchInput) {
        searchInput.addEventListener('input', (e) => performSearch(e.target.value));
    }

// Filter songs based on search, sort, and language
function filterSongs(searchTerm = '', sortOrder = 'az', language = '') {
    const songCards = document.querySelectorAll('.song-card');
    
    songCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const cardLanguage = card.querySelector('.text-xs').textContent.toLowerCase();
        
        const matchesSearch = !searchTerm || title.includes(searchTerm.toLowerCase());
        const matchesLanguage = !language || cardLanguage === language.toLowerCase();
        
        card.style.display = (matchesSearch && matchesLanguage) ? 'block' : 'none';
    });
    
    // Sort visible cards
    const songGrid = document.querySelector('.grid');
    const visibleCards = Array.from(songCards).filter(card => card.style.display !== 'none');
    
    visibleCards.sort((a, b) => {
        const titleA = a.querySelector('h3').textContent;
        const titleB = b.querySelector('h3').textContent;
        return sortOrder === 'az' ? 
            titleA.localeCompare(titleB) : 
            titleB.localeCompare(titleA);
    });
    
    visibleCards.forEach(card => songGrid.appendChild(card));
}

    // Sort and language filter handlers
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            filterSongs(searchInput.value, e.target.value, languageSelect.value);
        });
    }

    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            filterSongs(searchInput.value, sortSelect.value, e.target.value);
        });
    }

    // Tag box click handlers
    if (tagBoxes.length > 0) {
        tagBoxes.forEach(box => {
            box.addEventListener('click', () => {
                const tag = box.querySelector('p').textContent;
                // Toggle active state
                box.classList.toggle('border-2');
                // Filter songs by tag
                filterSongsByTag(tag);
            });
        });
    }

function filterSongsByTag(tag) {
    const songCards = document.querySelectorAll('.song-card');
    
    songCards.forEach(card => {
        const tags = Array.from(card.querySelectorAll('.text-xs')).map(span => span.textContent);
        card.style.display = tags.includes(tag) ? 'block' : 'none';
    });
}

    // Animation for song cards
    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

    const songCards = document.querySelectorAll('.song-card');
    if (songCards.length > 0) {
        songCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            observer.observe(card);
        });
    }
});

// Simulate real-time updates for Recently Uploaded section
function addNewSong(song) {
    const recentContainer = document.querySelector('.recent-updates .grid');
    const newSongElement = document.createElement('div');
    newSongElement.className = 'p-4 bg-white/5 rounded-lg';
    newSongElement.innerHTML = `
        <h3 class="font-semibold">${song.title}</h3>
        <p class="text-sm text-gray-400">Composer: ${song.composer}</p>
        <p class="text-xs text-[var(--neon-green)]">Added just now</p>
    `;
    
    // Add with fade-in animation
    newSongElement.style.opacity = '0';
    recentContainer.insertBefore(newSongElement, recentContainer.firstChild);
    requestAnimationFrame(() => {
        newSongElement.style.transition = 'opacity 0.5s ease';
        newSongElement.style.opacity = '1';
    });
    
    // Remove oldest song if more than 3
    if (recentContainer.children.length > 3) {
        recentContainer.removeChild(recentContainer.lastChild);
    }
}

// Simulate periodic updates (for demo purposes)
setInterval(() => {
    const demoSongs = [
        { title: 'Holy, Holy, Holy', composer: 'John Bacchus Dykes' },
        { title: 'It Is Well', composer: 'Horatio Spafford' },
        { title: 'Great Is Thy Faithfulness', composer: 'Thomas Chisholm' }
    ];
    const randomSong = demoSongs[Math.floor(Math.random() * demoSongs.length)];
    addNewSong(randomSong);
}, 30000); // Add new song every 30 seconds