// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Adresse définitive du site : utilisée pour les balises canoniques et le sitemap.
  site: 'https://azeoconseil.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Les pages techniques n'ont rien à faire dans Google.
      filter: (page) => !/\/(merci|erreur-envoi)\/$/.test(page),
    }),
  ],
});
