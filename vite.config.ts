import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    console.log("⚠️  FORGE CONFIG CHECK: GEMINI_API_KEY is", env.GEMINI_API_KEY ? "✅ DETECTED" : "❌ MISSING");

    return {
      publicDir: 'Public',
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          // Proxy Netlify Functions to local Netlify Dev server (if running)
          // If netlify dev is running on port 8888, this will work
          // Otherwise, use 'netlify dev' command instead of 'npm run dev'
          '/.netlify/functions': {
            target: 'http://localhost:8888',
            changeOrigin: true,
            secure: false,
          }
        }
      },
      plugins: [react()],
      define: {
        // 'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY), // REMOVED FOR SECURITY
        // 'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) // REMOVED FOR SECURITY
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
