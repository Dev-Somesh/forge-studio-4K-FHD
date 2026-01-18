# 🚀 Forge Studio Setup Guide

## 🔑 API Key Configuration

### For Local Development

1. **Copy the example file**:
```bash
cp .env.example .env
```

2. **Edit `.env` file** and replace the placeholder:
```bash
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_actual_api_key_here
```

3. **Environment File Strategy:**
   - **`.env.example`**: Committed template showing required variables
   - **`.env`**: Your local file with actual values (gitignored)
   - **Production**: Netlify dashboard environment variables

### For Netlify Production

1. Go to your Netlify dashboard
2. Navigate to: **Site Settings → Environment Variables**
3. Add: `GEMINI_API_KEY` = `your_actual_api_key_here`

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your actual API key
# Then start development server (includes Netlify functions)
npm run dev
```

**Important**: Use `npm run dev` (not `npm run dev:vite`) to test Netlify functions locally.

## 🔒 Security Notes

- ✅ API key is only used in serverless functions (backend)
- ✅ Frontend never exposes the API key
- ✅ `.env` file is gitignored
- ✅ `.env.example` shows required variables without secrets
- ❌ Never commit actual API keys to git

## 🐛 Troubleshooting

### "Server Error: 404" 
- **Cause**: Using `npm run dev:vite` instead of `npm run dev`
- **Fix**: Use `npm run dev` to start Netlify functions

### "API has been Exide" Error
- **Cause**: Missing GEMINI_API_KEY environment variable
- **Fix**: Copy `.env.example` to `.env` and add your API key

### "Failed to execute 'json' on 'Response'"
- **Cause**: Empty response from function (usually due to missing API key)
- **Fix**: Ensure API key is properly configured

## 📚 API Key Setup

1. Visit: https://aistudio.google.com/app/apikey
2. Create new API key
3. Copy the key
4. Run: `cp .env.example .env`
5. Edit `.env` and replace placeholder with your key
6. Add to Netlify environment variables for production