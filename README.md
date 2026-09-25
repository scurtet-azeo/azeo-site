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
| Logos clients (bandeau masqué tant que vide) | `src/data/clients.ts` + images dans `public/images/clients/` |
| Témoignages (section masquée tant que vide) | `src/data/temoignages.ts` |
| Textes de la page d'accueil | `src/components/sections/*.astro` (un fichier par section) |
| Couleurs, typographie, espacements | `src/styles/global.css` (variables en haut du fichier) |
| Mentions légales, confidentialité | `src/pages/mentions-legales.astro`, `src/pages/confidentialite.astro` |
| Redirections de l'ancien site | `public/_redirects` |

Les éléments entre crochets `[…]` sont des contenus à fournir.

## Formulaire de contact

Le formulaire envoie les demandes par e-mail via [Resend](https://resend.com), grâce à la fonction `functions/api/contact.ts`.
Variables à créer dans Cloudflare Pages (Paramètres > Variables et secrets) :

- `RESEND_API_KEY` : clé API Resend (en secret)
- `CONTACT_TO` : adresse qui reçoit les demandes
- `CONTACT_FROM` : expéditeur vérifié chez Resend, par exemple `Site Azéo <site@azeoconseil.com>`

Tant que ces variables ne sont pas définies, l'envoi renvoie vers la page « Message non envoyé ».

## Déploiement

- Branche `main` : site de production (azeoconseil.com).
- Toute autre branche : site de test automatique sur une adresse `*.pages.dev`, protégé par Cloudflare Access.

Réglages Cloudflare Pages : commande de build `npm run build`, dossier de sortie `dist`, variable `NODE_VERSION` = `22`.

## Reste à faire

- [ ] Logo en version vectorielle (SVG) pour remplacer `public/images/logo-azeo.png`
- [ ] Coordonnées (téléphone, e-mail) dans `src/data/site.ts`
- [ ] Nouvelle gamme de badgeuses : nom, description, photo
- [ ] Captures eTemptation et Badgy
- [ ] Pages détaillées : eTemptation, Badgy, gestion des absences
- [ ] Informations légales (SIRET, RCS, directeur de publication)
- [ ] Liste complète des anciennes adresses dans `public/_redirects`
- [ ] Logos clients et témoignages
