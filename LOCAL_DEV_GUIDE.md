# Local Development Guide - Forge Studio

## Quick Start

### Option 1: Development with Netlify Functions (Recommended)
```bash
npm run dev:netlify
```
- ✅ Runs Vite dev server on port 3000
- ✅ Runs Netlify Functions locally on port 8888
- ✅ Automatically proxies `/.netlify/functions/*` requests
- ✅ Requires `netlify-cli` to be installed

**Install Netlify CLI if needed:**
```bash
npm install -g netlify-cli
```

### Option 2: Development without Functions (Frontend Only)
```bash
npm run dev
```
- ✅ Runs Vite dev server on port 3000
- ❌ Netlify Functions will return 404
- ⚠️ Use this only for UI development without API calls

## Environment Variables

### For Local Development
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_api_key_here
```

### For Netlify Production
Set environment variables in Netlify Dashboard:
1. Go to **Site settings → Environment variables**
2. Add `GEMINI_API_KEY` with your API key
3. Redeploy the site

## Build & Deploy

### Local Build
```bash
npm run build
```
- Builds the app to `dist/`
- Automatically copies `_headers` file
- Bundles all assets

### Preview Build
```bash
npm run preview
```
- Serves the production build locally
- Useful for testing before deployment

### Deploy to Netlify
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
- Netlify auto-deploys on push to `main`
- Check deployment status in Netlify dashboard

## Troubleshooting

### Issue: 404 on `/.netlify/functions/gemini`
**Solution**: Use `npm run dev:netlify` instead of `npm run dev`

### Issue: CORS errors
**Solution**: Ensure `_headers` file exists and is copied to `dist/`

### Issue: API key not found
**Solution**: 
- Local: Add `GEMINI_API_KEY` to `.env` file
- Production: Add to Netlify environment variables

### Issue: Build fails
**Solution**: 
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Project Structure

```
forge-studio-4K-FHD/
├── netlify/
│   └── functions/
│       └── gemini.js          # Netlify serverless function
├── Public/                     # Static assets (images, etc.)
├── dist/                       # Build output (generated)
├── App.tsx                     # Main React component
├── index.tsx                   # React entry point
├── constants.tsx               # Theme/pattern constants
├── types.ts                    # TypeScript types
├── vite.config.ts             # Vite configuration
├── netlify.toml               # Netlify configuration
├── _headers                   # CORS headers for Netlify
└── package.json               # Dependencies & scripts
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start Vite dev server (port 3000) |
| `dev:netlify` | `netlify dev` | Start Netlify Dev (Vite + Functions) |
| `build` | `vite build` | Build for production |
| `preview` | `vite preview` | Preview production build |

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (CDN)
- **Backend**: Netlify Functions (serverless)
- **AI**: Google Gemini API
- **Deployment**: Netlify

## API Endpoints

### POST `/.netlify/functions/gemini`
Generate wallpapers using Gemini AI

**Request:**
```json
{
  "prompt": "Create a wallpaper...",
  "model": "gemini-2.5-flash-image"
}
```

**Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "inlineData": {
              "data": "base64_image_data..."
            }
          }
        ]
      }
    }
  ]
}
```

## Quality Modes

### FHD Mode (Free Tier)
- **Model**: `gemini-2.5-flash-image`
- **Resolution**: 1920x1080 (landscape) or 1080x1920 (portrait)
- **Billing**: ❌ Not required
- **Daily Limit**: ~500 images/day

### 4K Mode (Requires Billing)
- **Model**: `gemini-3-flash-image`
- **Resolution**: 3840x2160 (landscape) or 2160x3840 (portrait)
- **Billing**: ✅ Required
- **Daily Limit**: Higher (depends on billing plan)

## Support

For issues or questions:
1. Check the [NETLIFY_FIX_SUMMARY.md](./NETLIFY_FIX_SUMMARY.md) for recent fixes
2. Review Netlify deployment logs
3. Check browser console for errors
4. Verify environment variables are set correctly

---

**Happy Forging! 🔥**
