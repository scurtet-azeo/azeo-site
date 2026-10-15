// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';

// Date de dernière modification de chaque page, pour le plan du site (<lastmod>).
// Actualités : la date « maj » (ou « date ») de leur fichier. Autres pages : la date du
// dernier commit Git qui a touché leurs fichiers sources. Sans historique Git complet,
// pas de date (plutôt qu'une date fausse).
const SOURCES = {
  '/': ['src/pages/index.astro', 'src/components/sections', 'src/data/clients.ts'],
  '/etemptation/': ['src/pages/etemptation.astro'],
  '/badgeuses/': ['src/pages/badgeuses.astro'],
  '/actualites/': ['src/pages/actualites', 'src/content/actualites'],
  '/nous-rejoindre/': ['src/pages/nous-rejoindre', 'src/data/offres.ts'],
  '/mentions-legales/': ['src/pages/mentions-legales.astro'],
  '/confidentialite/': ['src/pages/confidentialite.astro'],
};

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', timeout: 60_000 }).trim();

// Cloudflare Pages ne récupère que le dernier commit : toutes les pages auraient alors
// la même date. On tente de récupérer l'historique complet ; en cas d'échec, pas de date.
function historiqueComplet() {
  try {
    if (git('rev-parse', '--is-shallow-repository') === 'false') return true;
    git('fetch', '--unshallow', '--quiet');
    return git('rev-parse', '--is-shallow-repository') === 'false';
  } catch {
    return false;
  }
}

const gitFiable = historiqueComplet();
console.log(`[plan du site] historique Git complet : ${gitFiable ? 'oui, dates des pages activées' : 'non, dates des pages désactivées'}`);

function dateGit(chemins) {
  if (!gitFiable) return undefined;
  try {
    return git('log', '-1', '--format=%cI', '--', ...chemins) || undefined;
  } catch {
    return undefined;
  }
}

function datesActualites() {
  const dates = {};
  const dossier = 'src/content/actualites';
  for (const f of readdirSync(dossier)) {
    if (!f.endsWith('.md') || f.startsWith('_')) continue;
    const entete = readFileSync(`${dossier}/${f}`, 'utf8').split('---')[1] ?? '';
    const lire = (cle) => entete.match(new RegExp(`^${cle}:\\s*(\\S+)`, 'm'))?.[1];
    const d = lire('maj') ?? lire('date');
    if (d) dates[`/actualites/${f.replace(/\.md$/, '')}/`] = new Date(d).toISOString();
  }
  return dates;
}

const actus = datesActualites();

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
      serialize(item) {
        const chemin = new URL(item.url).pathname;
        const sources = SOURCES[chemin] ?? (chemin.startsWith('/nous-rejoindre/') ? SOURCES['/nous-rejoindre/'] : undefined);
        const lastmod = actus[chemin] ?? (sources && dateGit(sources));
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
