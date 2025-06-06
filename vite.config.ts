import { defineConfig } from 'vite';

export default defineConfig({
  // Optional: define a root if your scripts are in a subdirectory like 'src'
  root: '.', // Or 'src' if you want URLs like /my-injectable-script.ts
  server: {
    port: 5173, // Choose an available port
    cors: true, // Enable CORS - This is crucial!
    hmr: true, // Hot Module Replacement might not be relevant for injected scripts
  },
  build: {
    // Not strictly needed for this dev server approach, but good practice
    minify: false,
  },
});
