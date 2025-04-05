// Admin Dashboard JavaScript

// Global state
let currentSongs = [];
let currentTags = [
    'Christmas', 'Good Friday', 'Easter Sunday', 
    'Sunday School Day', 'New Year'
];

// DOM Elements
const uploadForm = document.getElementById('uploadForm');
const songTable = document.querySelector('#manage table tbody');
const tagContainer = document.querySelector('#tags .flex-wrap');
const addTagForm = document.querySelector('#tags form');
const customizeForm = document.querySelector('#customize form');

// Song Management
function addSong(song) {
    currentSongs.push(song);
    updateSongTable();
    // In a real app, this would make an API call
    console.log('Song added:', song);
}

function deleteSong(index) {
    if (confirm('Are you sure you want to delete this song?')) {
        currentSongs.splice(index, 1);
        updateSongTable();
        // In a real app, this would make an API call
        console.log('Song deleted at index:', index);
    }
}

function editSong(index) {
    const song = currentSongs[index];
    // Populate the upload form with song data
    const form = document.getElementById('uploadForm');
    form.querySelector('input[name="songName"]').value = song.name;
    form.querySelector('input[name="composer"]').value = song.composer;
    form.querySelector('textarea').value = song.lyrics;
    form.querySelector('select[name="language"]').value = song.language;
    
    // Scroll to upload form
    document.getElementById('upload').scrollIntoView({ behavior: 'smooth' });
}

function updateSongTable() {
    songTable.innerHTML = currentSongs.map((song, index) => `
        <tr class="border-b border-[var(--neon-green)]/10">
            <td class="py-3">${song.name}</td>
            <td>${song.composer}</td>
            <td>${song.language}</td>
            <td>${song.uploadDate}</td>
            <td>
                <button onclick="editSong(${index})" class="text-[var(--neon-green)] mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteSong(${index})" class="text-red-500">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Tag Management
function addTag(tagName) {
    if (!currentTags.includes(tagName)) {
        currentTags.push(tagName);
        updateTagContainer();
        // In a real app, this would make an API call
        console.log('Tag added:', tagName);
    }
}

function deleteTag(index) {
    if (confirm('Are you sure you want to delete this tag?')) {
        currentTags.splice(index, 1);
        updateTagContainer();
        // In a real app, this would make an API call
        console.log('Tag deleted at index:', index);
    }
}

function updateTagContainer() {
    tagContainer.innerHTML = currentTags.map((tag, index) => `
        <div class="tag-item p-3 rounded-lg flex items-center">
            <span>${tag}</span>
            <button onclick="deleteTag(${index})" class="ml-2 text-red-500">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    // Update tag options in song upload form
    const tagSelect = uploadForm.querySelector('select[multiple]');
    tagSelect.innerHTML = currentTags.map(tag => `
        <option value="${tag.toLowerCase().replace(/\s+/g, '-')}">${tag}</option>
    `).join('');
}

// Form Handlers
uploadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const song = {
        name: formData.get('songName'),
        composer: formData.get('composer'),
        lyrics: formData.get('lyrics'),
        language: formData.get('language'),
        tags: Array.from(formData.getAll('tags')),
        uploadDate: new Date().toISOString().split('T')[0]
    };
    
    addSong(song);
    this.reset();
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg';
    successMsg.textContent = 'Song published successfully!';
    document.body.appendChild(successMsg);
    
    setTimeout(() => successMsg.remove(), 3000);
});

addTagForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = this.querySelector('input');
    const tagName = input.value.trim();
    
    if (tagName) {
        addTag(tagName);
        input.value = '';
    }
});

// Rich Text Editor
const boldBtn = document.querySelector('button i.fa-bold').parentElement;
const italicBtn = document.querySelector('button i.fa-italic').parentElement;
const lyricsTextarea = document.querySelector('textarea');

boldBtn.addEventListener('click', () => {
    const selection = window.getSelection();
    const text = lyricsTextarea.value;
    const start = lyricsTextarea.selectionStart;
    const end = lyricsTextarea.selectionEnd;
    
    const beforeText = text.substring(0, start);
    const selectedText = text.substring(start, end);
    const afterText = text.substring(end);
    
    lyricsTextarea.value = `${beforeText}**${selectedText}**${afterText}`;
});

italicBtn.addEventListener('click', () => {
    const selection = window.getSelection();
    const text = lyricsTextarea.value;
    const start = lyricsTextarea.selectionStart;
    const end = lyricsTextarea.selectionEnd;
    
    const beforeText = text.substring(0, start);
    const selectedText = text.substring(start, end);
    const afterText = text.substring(end);
    
    lyricsTextarea.value = `${beforeText}_${selectedText}_${afterText}`;
});

// Theme Customization
const themeButtons = document.querySelectorAll('#customize .flex button');
themeButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const colors = ['#39FF14', '#FF00FF', '#00F7FF', '#FFFFFF'];
        document.documentElement.style.setProperty('--neon-green', colors[index]);
        
        // Update active state
        themeButtons.forEach(btn => btn.style.border = 'none');
        button.style.border = '2px solid white';
    });
});

// File Upload Preview
const logoInput = document.querySelector('#customize input[type="file"]');
logoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // In a real app, this would update the logo
            console.log('New logo loaded:', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Initialize
updateTagContainer();
updateSongTable();

// Add some sample songs for demo
addSong({
    name: 'Amazing Grace',
    composer: 'John Newton',
    lyrics: 'Amazing grace, how sweet the sound...',
    language: 'english',
    tags: ['sunday-school'],
    uploadDate: '2024-01-20'
});

addSong({
    name: 'Holy, Holy, Holy',
    composer: 'Reginald Heber',
    lyrics: 'Holy, holy, holy! Lord God Almighty...',
    language: 'english',
    tags: ['sunday-school'],
    uploadDate: '2024-01-19'
});
