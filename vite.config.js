import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/Nour-Academy-Espace-Enseignant/',
  plugins: [
    tailwindcss()
  ]
});
