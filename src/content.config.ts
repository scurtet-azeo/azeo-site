// Collections de contenu du site.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Actualités : un fichier .md par news dans src/content/actualites/.
// Le nom du fichier devient l'adresse de la page : 2026-10-02-lancement-badgy.md
// -> /actualites/2026-10-02-lancement-badgy/
const actualites = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/actualites' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      date: z.coerce.date(),
      resume: z.string(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      linkedin: z.string().url().optional(),
      brouillon: z.boolean().default(false), // true = non publiée
    }),
});

export const collections = { actualites };
