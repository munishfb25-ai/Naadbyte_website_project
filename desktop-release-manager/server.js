const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const DB_FILE = path.join(__dirname, 'catalog-db.json');

app.use(cors());
app.use(express.json());

// Initialize default DB if not exists
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    songs: [
      {
        id: "song-mere-shyam-bajaye",
        slug: "mere-shyam-bajaye-baansuriya",
        title: "Mere Shyam Bajaye Baansuriya",
        artistIds: ["artist-naadbyte"],
        albumId: "album-mere-shyam-bajaye",
        genreIds: ["devotional"],
        language: "Hindi",
        durationSeconds: 240,
        releaseDate: "2026-08-10",
        cover: { 
          src: "https://lh3.googleusercontent.com/d/YOUR_DRIVE_FILE_ID", 
          alt: "Mere Shyam Bajaye Baansuriya cover" 
        },
        audioUrl: "https://drive.google.com/uc?export=download&id=YOUR_DRIVE_FILE_ID",
        mood: "Devotional & Melodic",
        description: "A soul-stirring devotional melody celebrating the divine flute of Lord Krishna.",
        lyrics: "Mere Shyam Bajaye Baansuriya...\nRadha ke man ko bhaye baansuriya.",
        streamingLinks: [
          { platform: "spotify", href: "https://distrokid.com/hyperfollow/naadbyte/-----mere-shyam-bajaye-baansuriya" },
          { platform: "appleMusic", href: "https://distrokid.com/hyperfollow/naadbyte/-----mere-shyam-bajaye-baansuriya" },
          { platform: "youtubeMusic", href: "https://distrokid.com/hyperfollow/naadbyte/-----mere-shyam-bajaye-baansuriya" },
          { platform: "amazonMusic", href: "https://distrokid.com/hyperfollow/naadbyte/-----mere-shyam-bajaye-baansuriya" },
          { platform: "youtube", href: "https://www.youtube.com/watch?v=dyWhd36GVSs" }
        ],
        tags: ["Devotional", "DistroKid Release", "HyperFollow"],
        isFeatured: true,
        status: "published"
      }
    ],
    albums: [
      {
        id: "album-mere-shyam-bajaye",
        slug: "mere-shyam-bajaye-baansuriya",
        title: "Mere Shyam Bajaye Baansuriya",
        genre: "Devotional",
        genreIds: ["devotional"],
        artistIds: ["artist-naadbyte"],
        year: "2026",
        releaseDate: "2026-08-10",
        cover: { 
          src: "https://lh3.googleusercontent.com/d/YOUR_DRIVE_FILE_ID", 
          alt: "Mere Shyam Bajaye Baansuriya cover" 
        },
        description: "Official DistroKid release distributed via HyperFollow to Spotify, Apple Music, YouTube Music, and Amazon Music.",
        songIds: ["song-mere-shyam-bajaye"],
        streamingLinks: [
          { platform: "spotify", href: "https://distrokid.com/hyperfollow/naadbyte/-----mere-shyam-bajaye-baansuriya" },
          { platform: "appleMusic", href: "https://distrokid.com/hyperfollow/naadbyte/-----mere-shyam-bajaye-baansuriya" },
          { platform: "youtubeMusic", href: "https://distrokid.com/hyperfollow/naadbyte/-----mere-shyam-bajaye-baansuriya" },
          { platform: "amazonMusic", href: "https://distrokid.com/hyperfollow/naadbyte/-----mere-shyam-bajaye-baansuriya" }
        ],
        isFeatured: true,
        status: "published"
      }
    ]
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// API Routes
app.get('/api/catalog', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  res.json(data);
});

app.post('/api/catalog', (req, res) => {
  const { songs, albums } = req.body;
  if (!songs || !albums) {
    return res.status(400).json({ error: 'Invalid catalog data structure' });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify({ songs, albums }, null, 2));
  res.json({ success: true, message: 'Catalog saved successfully on your PC!' });
});

app.get('/api/export-gcs', (req, res) => {
  const data = fs.readFileSync(DB_FILE, 'utf8');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=catalog.json');
  res.send(data);
});

// Serve Desktop UI HTML
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>NaadByte Desktop Release Manager - Google Drive Support</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      <div id="app" class="max-w-7xl mx-auto px-6 py-10">
        <header class="flex flex-col md:flex-row justify-between items-center pb-8 border-b border-zinc-800 gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight text-amber-400">NaadByte Desktop Release Studio</h1>
            <p class="text-zinc-400 text-sm mt-1">Manage your music catalog offline. Supports Google Drive & Cloud Storage links!</p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="saveCatalog()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-lg shadow-emerald-900/30 flex items-center gap-2">
              💾 Save Local Database
            </button>
            <a href="/api/export-gcs" class="bg-amber-600 hover:bg-amber-500 text-zinc-950 px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-amber-900/30 flex items-center gap-2">
              ☁️ Export catalog.json
            </a>
          </div>
        </header>

        <div id="statusBanner" class="my-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm hidden"></div>

        <!-- Google Drive Helper Banner -->
        <div class="my-6 p-5 rounded-2xl bg-blue-950/40 border border-blue-900/60 text-blue-200 text-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 class="font-bold text-blue-300 text-base flex items-center gap-2">📁 Using Google Drive for Audio & Artwork?</h3>
            <p class="mt-1 text-blue-200/80 text-xs leading-relaxed">
              1. Upload your MP3/Image to Google Drive and set sharing to <strong>"Anyone with the link can view"</strong>.<br>
              2. Paste your Google Drive sharing link below and click <strong>"Convert to Direct Stream URL"</strong> automatically!
            </p>
          </div>
          <div class="bg-blue-900/50 p-3 rounded-xl border border-blue-800 flex items-center gap-3 w-full md:w-auto">
            <input type="text" id="driveLinkInput" placeholder="Paste Google Drive share link here..." class="bg-zinc-950 border border-blue-800 text-xs px-3 py-2 rounded-lg text-zinc-100 w-64 focus:outline-none">
            <button onclick="convertDriveLink()" class="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-medium whitespace-nowrap transition">Convert Link</button>
          </div>
        </div>

        <main class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <!-- Form Section -->
          <div class="lg:col-span-1 bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <h2 id="formTitle" class="text-xl font-semibold mb-6 text-amber-300">Add New Song & Release</h2>
            <form id="releaseForm" onsubmit="handleSubmit(event)" class="space-y-4">
              <input type="hidden" id="songId">
              
              <div>
                <label class="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">Song / Release Title</label>
                <input type="text" id="title" required placeholder="e.g. Mere Shyam Bajaye Baansuriya" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">
              </div>

              <div>
                <label class="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">URL Slug</label>
                <input type="text" id="slug" required placeholder="e.g. mere-shyam-bajaye-baansuriya" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">Genre</label>
                  <input type="text" id="genre" value="Devotional" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">
                </div>
                <div>
                  <label class="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">Release Date</label>
                  <input type="date" id="releaseDate" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">
                </div>
              </div>

              <div>
                <label class="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">Audio URL (Google Drive / Direct MP3)</label>
                <input type="url" id="audioUrl" placeholder="https://drive.google.com/uc?export=download&id=..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">
              </div>

              <div>
                <label class="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">Artwork Image URL (Google Drive / Image Link)</label>
                <input type="url" id="coverUrl" placeholder="https://lh3.googleusercontent.com/d/..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">
              </div>

              <div>
                <label class="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">DistroKid HyperFollow / Streaming Link</label>
                <input type="url" id="hyperfollowUrl" placeholder="https://distrokid.com/hyperfollow/naadbyte/..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500">
              </div>

              <div>
                <label class="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">Description / Story</label>
                <textarea id="description" rows="2" placeholder="A soulful release..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"></textarea>
              </div>

              <div>
                <label class="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">Lyrics</label>
                <textarea id="lyrics" rows="3" placeholder="Song lyrics here..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"></textarea>
              </div>

              <div class="flex items-center gap-3 pt-2">
                <button type="submit" class="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-xl transition">
                  Save Song & Release
                </button>
                <button type="button" onclick="resetForm()" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-3 rounded-xl transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Catalog List Section -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl shadow-xl">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-amber-300">Your Local Catalog Database</h2>
                <span id="songCount" class="text-xs bg-zinc-800 px-3 py-1 rounded-full text-zinc-400">0 Songs</span>
              </div>
              <div id="songsList" class="space-y-4">
                <!-- Loaded dynamically -->
              </div>
            </div>
          </div>
        </main>
      </div>

      <script>
        let catalog = { songs: [], albums: [] };

        async function loadCatalog() {
          try {
            const res = await fetch('/api/catalog');
            catalog = await res.json();
            renderCatalog();
          } catch (e) {
            showStatus('Failed to load local database.', 'error');
          }
        }

        function extractDriveId(url) {
          if (!url) return '';
          const matchId = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
          return matchId ? matchId[1] : '';
        }

        function convertDriveLink() {
          const input = document.getElementById('driveLinkInput').value.trim();
          const fileId = extractDriveId(input);
          if (!fileId) {
            alert('Could not detect a valid Google Drive file ID from this URL. Make sure it is a sharing link like https://drive.google.com/file/d/FILE_ID/view');
            return;
          }

          const directAudio = 'https://drive.google.com/uc?export=download&id=' + fileId;
          const directCover = 'https://lh3.googleusercontent.com/d/' + fileId;

          // Ask user where to put it
          const type = prompt('Is this Google Drive link for an (a) Audio MP3 file or (c) Cover Image file? Type "a" or "c":', 'a');
          if (type && type.toLowerCase() === 'a') {
            document.getElementById('audioUrl').value = directAudio;
            showStatus('Google Drive audio link converted and applied successfully!', 'success');
          } else if (type && type.toLowerCase() === 'c') {
            document.getElementById('coverUrl').value = directCover;
            showStatus('Google Drive cover image link converted and applied successfully!', 'success');
          } else {
            // default to audio
            document.getElementById('audioUrl').value = directAudio;
            showStatus('Google Drive link applied to Audio URL!', 'success');
          }
        }

        function renderCatalog() {
          const listEl = document.getElementById('songsList');
          document.getElementById('songCount').innerText = catalog.songs.length + ' Songs';
          
          if (catalog.songs.length === 0) {
            listEl.innerHTML = '<p class="text-zinc-500 text-center py-8">No songs added yet. Use the form on the left to add your first release.</p>';
            return;
          }

          listEl.innerHTML = catalog.songs.map(song => {
            const album = catalog.albums.find(a => a.id === song.albumId) || {};
            const hyperLink = song.streamingLinks.find(l => l.platform === 'spotify')?.href || '#';
            return \`
              <div class="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <img src="\${song.cover?.src || 'https://via.placeholder.com/60'}" class="w-14 h-14 rounded-lg object-cover border border-zinc-800">
                  <div>
                    <h3 class="font-bold text-zinc-100">\${song.title}</h3>
                    <p class="text-xs text-zinc-400 mt-0.5">Genre: \${album.genre || 'Devotional'} • Released: \${song.releaseDate}</p>
                    <div class="flex items-center gap-2 mt-2">
                      \${song.audioUrl ? \`<a href="\${song.audioUrl}" target="_blank" class="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">🎵 Audio Linked</a>\` : \`<span class="text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-800">⚠️ No Audio URL</span>\`}
                      <a href="\${hyperLink}" target="_blank" class="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded hover:bg-zinc-750">DistroKid Link ↗</a>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button onclick="editSong('\${song.id}')" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-medium transition">Edit</button>
                  <button onclick="deleteSong('\${song.id}')" class="bg-rose-950/60 hover:bg-rose-900 text-rose-300 px-3 py-1.5 rounded-lg text-xs font-medium transition border border-rose-900">Delete</button>
                </div>
              </div>
            \`;
          }).join('');
        }

        async function handleSubmit(e) {
          e.preventDefault();
          const id = document.getElementById('songId').value || \`song-\${Date.now()}\`;
          const title = document.getElementById('title').value;
          const slug = document.getElementById('slug').value;
          const genre = document.getElementById('genre').value;
          const releaseDate = document.getElementById('releaseDate').value || new Date().toISOString().slice(0, 10);
          const audioUrl = document.getElementById('audioUrl').value;
          const coverUrl = document.getElementById('coverUrl').value || 'https://lh3.googleusercontent.com/d/default';
          const hyperfollowUrl = document.getElementById('hyperfollowUrl').value;
          const description = document.getElementById('description').value;
          const lyrics = document.getElementById('lyrics').value;

          const newSong = {
            id,
            slug,
            title,
            artistIds: ["artist-naadbyte"],
            albumId: \`album-\${id}\`,
            genreIds: [genre.toLowerCase()],
            language: "Hindi",
            durationSeconds: 240,
            releaseDate,
            cover: { src: coverUrl, alt: title + ' cover' },
            audioUrl,
            description,
            lyrics,
            streamingLinks: [
              { platform: "spotify", href: hyperfollowUrl },
              { platform: "appleMusic", href: hyperfollowUrl },
              { platform: "youtubeMusic", href: hyperfollowUrl },
              { platform: "amazonMusic", href: hyperfollowUrl }
            ],
            tags: [genre, "DistroKid Release"],
            isFeatured: true,
            status: "published"
          };

          const newAlbum = {
            id: \`album-\${id}\`,
            slug,
            title,
            genre,
            genreIds: [genre.toLowerCase()],
            artistIds: ["artist-naadbyte"],
            year: releaseDate.slice(0, 4) || '2026',
            releaseDate,
            cover: { src: coverUrl, alt: title + ' cover' },
            description: description || 'Official DistroKid release.',
            songIds: [id],
            streamingLinks: [
              { platform: "spotify", href: hyperfollowUrl },
              { platform: "appleMusic", href: hyperfollowUrl },
              { platform: "youtubeMusic", href: hyperfollowUrl },
              { platform: "amazonMusic", href: hyperfollowUrl }
            ],
            isFeatured: true,
            status: "published"
          };

          const songIdx = catalog.songs.findIndex(s => s.id === id);
          if (songIdx >= 0) {
            catalog.songs[songIdx] = newSong;
          } else {
            catalog.songs.unshift(newSong);
          }

          const albumIdx = catalog.albums.findIndex(a => a.id === newAlbum.id);
          if (albumIdx >= 0) {
            catalog.albums[albumIdx] = newAlbum;
          } else {
            catalog.albums.unshift(newAlbum);
          }

          await saveCatalogToServer();
          resetForm();
        }

        async function saveCatalogToServer() {
          try {
            const res = await fetch('/api/catalog', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(catalog)
            });
            const data = await res.json();
            showStatus(data.message, 'success');
            renderCatalog();
          } catch (e) {
            showStatus('Failed to save catalog.', 'error');
          }
        }

        async function saveCatalog() {
          await saveCatalogToServer();
          alert('Catalog saved successfully on your PC!');
        }

        function editSong(id) {
          const song = catalog.songs.find(s => s.id === id);
          const album = catalog.albums.find(a => a.id === song.albumId) || {};
          if (!song) return;

          document.getElementById('songId').value = song.id;
          document.getElementById('title').value = song.title;
          document.getElementById('slug').value = song.slug;
          document.getElementById('genre').value = album.genre || 'Devotional';
          document.getElementById('releaseDate').value = song.releaseDate;
          document.getElementById('audioUrl').value = song.audioUrl || '';
          document.getElementById('coverUrl').value = song.cover?.src || '';
          document.getElementById('hyperfollowUrl').value = song.streamingLinks?.[0]?.href || '';
          document.getElementById('description').value = song.description || '';
          document.getElementById('lyrics').value = song.lyrics || '';

          document.getElementById('formTitle').innerText = 'Edit Song & Release';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        async function deleteSong(id) {
          if (!confirm('Are you sure you want to delete this release from your local database?')) return;
          const song = catalog.songs.find(s => s.id === id);
          catalog.songs = catalog.songs.filter(s => s.id !== id);
          if (song && song.albumId) {
            catalog.albums = catalog.albums.filter(a => a.id !== song.albumId);
          }
          await saveCatalogToServer();
        }

        function resetForm() {
          document.getElementById('releaseForm').reset();
          document.getElementById('songId').value = '';
          document.getElementById('formTitle').innerText = 'Add New Song & Release';
        }

        function showStatus(msg, type) {
          const b = document.getElementById('statusBanner');
          b.innerText = msg;
          b.className = \`my-6 p-4 rounded-xl border text-sm \${type === 'error' ? 'bg-rose-950/50 border-rose-900 text-rose-300' : 'bg-emerald-950/50 border-emerald-900 text-emerald-300'}\`;
          b.classList.remove('hidden');
          setTimeout(() => b.classList.add('hidden'), 4000);
        }

        loadCatalog();
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('NaadByte Desktop Release Manager running at http://localhost:' + PORT);
});
