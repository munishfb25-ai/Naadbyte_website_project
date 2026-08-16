# NaadByte (naadbyte.com) — Hostinger Production Deployment Guide

This package contains the pre-compiled, production-ready TanStack Start / Nitro SSR application for **naadbyte.com**.

---

## 📦 Package Contents
- `.output/` — Compiled production build (Public static assets & SSR server bundle)
- `dist/` — Production build mirror
- `public/` — Static assets, media, `sitemap.xml`, and `robots.txt`
- `package.json` — Application definition & scripts
- `ecosystem.config.cjs` — PM2 configuration file for VPS deployments
- `.env.example` — Sample environment configuration

---

## 🌐 DNS Settings for naadbyte.com
Ensure your domain DNS records in Hostinger (or Cloudflare / your registrar) point to your server:
- **A Record**: `@` (or `naadbyte.com`) ➔ `YOUR_SERVER_IP`
- **CNAME Record**: `www` ➔ `naadbyte.com`

---

## 🚀 Deployment Instructions

### Method 1: Hostinger Web / Cloud Hosting (hPanel Node.js Manager)
1. **Upload & Extract**:
   - In Hostinger **hPanel**, go to **Websites** > click **Manage** on `naadbyte.com`.
   - Open **File Manager** (Files > File Manager).
   - Navigate to the domain root (e.g., `/home/username/public_html` or `/domains/naadbyte.com/public_html`).
   - Upload `naadbyte-production.zip` and extract its contents into the directory.

2. **Configure Node.js in hPanel**:
   - Go to **hPanel** > **Node.js** (under Advanced or Applications).
   - Click **Create Application** (or select `naadbyte.com`).
   - Configure the following:
     - **Node.js version**: `18.x`, `20.x`, or `22.x` (LTS recommended)
     - **Application root**: `/home/username/public_html` (the directory where files are extracted)
     - **Application startup file**: `.output/server/index.mjs`
     - **Application Mode**: `Production`
   - Add Environment Variables:
     - `NODE_ENV` = `production`
     - `NITRO_HOST` = `0.0.0.0`
     - `PORT` = `3000` (or leave default if managed automatically)

3. **Start Application**:
   - Click **Run NPM Install** (optional, as bundles are pre-packaged).
   - Click **Start Application** / **Restart**.
   - Make sure **SSL / HTTPS** is activated under **Security > SSL** in hPanel.

---

### Method 2: Hostinger VPS (Ubuntu / Debian + PM2 + Nginx)

1. **Connect to your Hostinger VPS**:
   ```bash
   ssh root@YOUR_VPS_IP
   ```

2. **Install Node.js 20, Nginx & PM2 (if not already installed)**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt-get update && apt-get install -y nodejs nginx unzip certbot python3-certbot-nginx
   npm install -g pm2
   ```

3. **Deploy the files**:
   ```bash
   mkdir -p /var/www/naadbyte
   cd /var/www/naadbyte
   # Upload naadbyte-production.zip to /var/www/naadbyte using SCP/SFTP or wget
   unzip naadbyte-production.zip
   ```

4. **Start the SSR Application with PM2**:
   ```bash
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx Reverse Proxy for naadbyte.com**:
   Create `/etc/nginx/sites-available/naadbyte.com`:
   ```nginx
   server {
       listen 80;
       listen [::]:80;
       server_name naadbyte.com www.naadbyte.com;

       # Max body size for any media/song requests
       client_max_body_size 50M;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site and test configuration:
   ```bash
   ln -s /etc/nginx/sites-available/naadbyte.com /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

6. **Issue Free SSL Certificate with Certbot**:
   ```bash
   certbot --nginx -d naadbyte.com -d www.naadbyte.com
   ```

---

## 🔍 Verification
Once deployed, verify:
- `https://naadbyte.com` loads the home page and music catalog.
- `https://naadbyte.com/music` and `https://naadbyte.com/videos` render correctly.
- `https://naadbyte.com/sitemap.xml` and `https://naadbyte.com/robots.txt` are accessible.
