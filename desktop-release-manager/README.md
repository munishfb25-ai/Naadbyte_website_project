# NaadByte Desktop Release Manager (Standalone App)

This is a **100% separate desktop application** designed to run locally on your PC. It has **no connection or dependency** on your public website, ensuring absolute security and independence.

---

### Key Features
1. **Local Database (`catalog-db.json`)**: All your songs, albums, Google Cloud Storage MP3 URLs, artwork URLs, and DistroKid HyperFollow links are stored securely on your local PC.
2. **Exact Website Schema**: Matches all fields used across your website (Title, Slug, Genre, Release Date, GCS Audio URL, GCS Artwork URL, DistroKid streaming links, lyrics, and descriptions).
3. **Google Cloud Storage Export**: With one click, generate and download your `catalog.json` ready to upload to your Google Cloud Storage bucket.

---

### How to Install & Run on Your PC

1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed on your PC.
2. **Open Terminal / Command Prompt** in the `desktop-release-manager` folder.
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Start the Desktop App**:
   ```bash
   npm start
   ```
5. **Open in Browser**:
   Open your web browser and go to:
   **`http://localhost:4000`**

---

### Workflow for New Releases

1. Open the Desktop Manager at `http://localhost:4000`.
2. Fill in your release details:
   - Song Title & Slug
   - Genre & Release Date
   - **Google Cloud Storage MP3 URL** (e.g. `https://storage.googleapis.com/your-bucket/audio/song.mp3`)
   - **Google Cloud Storage Artwork URL** (e.g. `https://storage.googleapis.com/your-bucket/artwork/cover.jpg`)
   - **DistroKid HyperFollow Link** (e.g. `https://distrokid.com/hyperfollow/...`)
   - Lyrics & Description
3. Click **Save Song & Release**.
4. Click **☁️ Export catalog.json for GCS**.
5. Upload the downloaded `catalog.json` file to your Google Cloud Storage bucket. Your website will instantly reflect the new release worldwide!
