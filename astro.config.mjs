// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Adresse définitive du site : utilisée pour les balises canoniques et le sitemap.
  site: 'https://azeoconseil.fr',
  trailingSlash: 'always',
  // Conserve les espaces entre un texte et un lien (sinon « de la CNIL » devient « de laCNIL »).
  compressHTML: false,
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Les pages techniques n'ont rien à faire dans Google.
      filter: (page) => !/\/(merci|erreur-envoi)\/$/.test(page),
    }),
  ],
});
