# Site Azéo Conseil

Site vitrine d'Azéo Conseil, construit avec [Astro](https://astro.build) et hébergé sur Cloudflare Pages.

## Travailler en local

Prérequis : Node.js 22.12 ou plus récent.

```bash
npm install      # une seule fois
npm run dev      # site de développement sur http://localhost:4321
npm run build    # génère le site final dans dist/
npm run preview  # affiche le site généré
```

## Où modifier quoi

| Je veux changer… | Fichier |
|---|---|
| Téléphone, e-mail, adresse, LinkedIn | `src/data/site.ts` |
| Menu principal | `src/data/site.ts` (liste `nav`) |
| Logos clients (bandeau défilant, ordre aléatoire) | `src/data/clients.ts` + images dans `public/images/clients/` |
| Témoignages (section masquée tant que vide) | `src/data/temoignages.ts` |
| Textes de la page d'accueil | `src/components/sections/*.astro` (un fichier par section) |
| Couleurs, typographie, espacements | `src/styles/global.css` (variables en haut du fichier) |
| Mentions légales, confidentialité | `src/pages/mentions-legales.astro`, `src/pages/confidentialite.astro` |
| Redirections de l'ancien site | `public/_redirects` |

Les éléments entre crochets `[…]` sont des contenus à fournir.

## Typographie française

Après chaque build, `scripts/typo-fr.mjs` insère automatiquement une espace insécable avant `? ! : ;` dans les pages générées. Inutile de s'en soucier en rédigeant.

## Formulaire de contact

Le formulaire envoie les demandes par e-mail grâce à la fonction `functions/api/contact.ts`,
via **votre serveur SMTP** (ou, à défaut, via Resend).

Variables à créer dans Cloudflare Pages (Paramètres > Variables et secrets), en **Production et Aperçu**,
puis relancer un déploiement :

| Variable | Exemple | Type |
|---|---|---|
| `SMTP_HOST` | `mail.gandi.net` | Texte |
| `SMTP_PORT` | `465` (ou `587`) — le port 25 est bloqué par Cloudflare | Texte |
| `SMTP_USER` | `site@azeoconseil.fr` | Texte |
| `SMTP_PASSWORD` | mot de passe de cette boîte | **Secret** |
| `CONTACT_TO` | `contact@azeoconseil.fr` | Texte |
| `CONTACT_FROM` | facultatif, par défaut `SMTP_USER` | Texte |

Sans `SMTP_HOST`, la fonction utilise Resend (`RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`).
En cas d'échec, le visiteur arrive sur « Message non envoyé » et la cause est écrite dans le
flux de journaux du déploiement (onglet Fonctions).

## Déploiement

- Branche `main` : site de production (azeoconseil.fr, adresse principale ; .com et .re redirigent vers elle).
- Toute autre branche : site de test automatique sur une adresse `*.pages.dev`, protégé par Cloudflare Access.

Réglages Cloudflare Pages : commande de build `npm run build`, dossier de sortie `dist`, variable `NODE_VERSION` = `22`.

## Reste à faire

- [ ] Logo en version vectorielle (SVG) pour remplacer `public/images/logo-azeo.png`
- [ ] Téléphone dans `src/data/site.ts` (e-mail renseigné)
- [x] Nouvelle gamme de badgeuses : page /badgeuses/ (eTSmile, Pulsi)
- [x] Visuels eTemptation et Badgy
- [x] Page eTemptation
- [ ] Pages détaillées : Badgy, gestion des temps et des absences
- [x] Mentions légales et politique de confidentialité
- [x] Redirections des anciennes adresses du .com dans `public/_redirects`
- [ ] Logos clients (remplacer les emplacements « Client 1… » dans `src/data/clients.ts`) et témoignages
