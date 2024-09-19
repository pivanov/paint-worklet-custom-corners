import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

// Resolve the directory name in ESM style
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    // No need for lib mode, we're just building a single JS file
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        worklet: path.resolve(__dirname, 'src/worklet.ts'),
      },
      output: {
        // Ensure the output is in a format suitable for browser usage
        format: 'es', // ES module format
        entryFileNames: '[name].js', // Use simple file naming
      },
    },
  },
});
