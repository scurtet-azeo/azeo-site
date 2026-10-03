# CLAUDE.md : site Azéo Conseil

Site vitrine d'Azéo Conseil (Saint-Leu, La Réunion), intégrateur des solutions de gestion des temps Horoquartz (eTemptation, mTemptation, badgeuses eTSmile et Pulsi) et éditeur de Badgy by Azéo. En ligne sur https://azeoconseil.fr depuis le 29 septembre 2026.

Le contexte complet (historique, décisions, points en suspens) est dans `docs/synthese.md`. Lis-le en début de session si la tâche dépasse une petite retouche.

## Langue

Échanger en français avec l'utilisateur (Stéphane Curtet). Tout le contenu du site est en français.

## Pile technique

- Astro 7 (site statique), TypeScript, sans framework JavaScript. Node 22 ou plus (`.nvmrc`).
- Hébergement Cloudflare Pages (projet `azeo-site`). La branche `main` correspond à la production : chaque push sur `main` est déployé en 1 à 2 minutes.
- Formulaire de contact : `functions/api/contact.ts` (SMTP via `worker-mailer`, Resend en secours, Cloudflare Turnstile et champ piège).
- Actualités : collection de contenu Astro (`src/content.config.ts`, fichiers dans `src/content/actualites/`).
- Plan du site : `@astrojs/sitemap`.
- `scripts/typo-fr.mjs` s'exécute en `postbuild` et ajoute les espaces insécables avant `? ! : ;`.
- `compressHTML: false` dans `astro.config.mjs` : ne pas réactiver, car la compression collait les textes aux liens.

## Commandes

```bash
npm install
npm run dev      # serveur local
npm run build    # build et typographie (postbuild)
npm run preview  # prévisualiser le build
```

Lancer `npm run build` après toute modification pour vérifier que le site compile.

## Règles de travail Git

- **Ne jamais faire `git push` sur `main` sans l'accord explicite de l'utilisateur** : c'est la production.
- Pour tout changement non trivial, travailler sur une branche (`git checkout -b nom`). Cloudflare publie alors une adresse de test `*.azeo-site.pages.dev`, protégée par Cloudflare Access.
- Commencer chaque session par `git pull`. Le dépôt GitHub fait foi.
- Montrer le résumé des changements (`git status`, `git diff --stat`) avant chaque commit.

## Interdits absolus

- **Ne jamais écraser ni réécrire `src/data/site.ts`.** Il contient la clé publique Turnstile de l'utilisateur. Seules des modifications ciblées, ligne par ligne, sont permises.
- Ne jamais ajouter de cookie publicitaire, d'outil de mesure d'audience, de Google Fonts, de reCAPTCHA ni de contenu tiers qui suit les visiteurs (RGPD : le site n'a pas de bandeau cookies et doit rester ainsi).
- Ne pas ajouter `includeSubDomains` au HSTS dans `public/_headers` : les sous-domaines clients ne doivent pas être forcés en HTTPS par le site.
- Ne pas utiliser de photos trouvées sur le web (droits d'auteur), ni copier les textes d'Horoquartz : reformuler.

## Règles de rédaction (demandées par le client)

- Pas de point final dans les titres.
- « badgeuses » (pas « terminaux »), « badgeage » (pas « pointage »), « badger » (pas « pointer »). Pulsi : « Badgeuse avec services RH intégrés ». Exception : « pointeuses » reste volontairement dans le titre Google de la page Badgeuses (mot-clé).
- Horoquartz reste discret : pas dans les sur-titres ni le pied de page. Le lien vers l'éditeur affiche www.horoquartz.com.
- Hébergement : « cloud privé, sur l'île de La Réunion ». Jamais « souverain », jamais « océan Indien ».
- « France hexagonale », pas « métropole ».
- Proximité : « Ici, à La Réunion, comme vous ». Support « 100 % réunionnais, basé dans nos bureaux de Saint-Leu ». Mayotte est incluse. Pas de mention de « billet d'avion ».
- Azéo ne pose pas les badgeuses (ni visite, ni installation). Engagements : conseil et choix du matériel, paramétrage dans eTemptation, formation, supervision et support.
- « eTemptation est installé » (masculin).
- Offres d'emploi au tutoiement.
- Typographie française : guillemets « », apostrophes typographiques ’, espaces insécables.
- Chiffres utilisables : plus de 40 clients, plus de 15 000 collaborateurs et agents gérés, présence depuis 2009 (écrire « depuis 2009 », pas un nombre d'années).

## Identité visuelle

- Couleurs : pétrole `#046A6F` (principale), pétrole foncé `#0B3B3E`, vert anis `#A6D903` (accent, surtout sur fond sombre), orange `#EC8D21`, et `#A85708` pour les petits textes orange sur fond clair.
- Polices hébergées sur le site : Outfit (titres), Instrument Sans (texte).
- Logos clients en couleur.
- Respecter `prefers-reduced-motion` pour toute animation, et vérifier le rendu mobile.

## Où modifier quoi

| Élément | Fichier |
|---|---|
| Coordonnées, LinkedIn, e-mail de recrutement, menu | `src/data/site.ts` (modifications ciblées uniquement) |
| Logos clients et chiffres du bandeau | `src/data/clients.ts`, `public/images/clients/` |
| Offres d'emploi | `src/data/offres.ts` (`ouverte`, `publiee`) |
| Actualités | `src/content/actualites/` : copier `_modele.md` ; les fichiers en `_` ne sont pas publiés ; `brouillon: true` pour préparer |
| Textes de l'accueil | `src/components/sections/*.astro` |
| Couleurs et typographie | `src/styles/global.css` |
| Redirections | `public/_redirects` |
| En-têtes HTTP | `public/_headers` |
| Envoi du formulaire | `functions/api/contact.ts` |

## Hors du dépôt (pour information, ne rien faire sans demande)

- DNS sur Cloudflare pour azeoconseil.fr, .com et .re. Les MX et TXT Microsoft 365 du .fr ne doivent jamais être modifiés. Les sous-domaines clients (ex. `bali-etemptation.azeoconseil.fr`) restent en DNS uniquement (nuage gris).
- Les variables Cloudflare Pages (`SMTP_*`, `CONTACT_TO`, `TURNSTILE_SECRET_KEY`) se définissent en Production **et** en Aperçu, puis on redéploie. La clé secrète Turnstile va toujours avec la clé publique de `site.ts`.
