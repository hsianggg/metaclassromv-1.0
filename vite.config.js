import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': '/src',
      'path': 'path-browserify'
    }
  },
  server: {
    host: '',
    port: 3000,
  }, 
  define: {
    'process.env': {}
  }
});
