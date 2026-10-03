# Synthèse du projet : refonte du site Azéo Conseil

*Document de reprise, à jour au 2 octobre 2026. Il permet de reprendre le travail sans l'historique de la conversation.*

---

## 1. Objectif et contexte

### L'entreprise

- **Azéo Conseil**, entreprise individuelle (Anne Laure Balizon), créée en **2009**, basée au 69 chemin Dubuisson, 97436 **Saint-Leu**, La Réunion.
- **Métier** : conseil et intégration en **gestion des temps et planification**.
  - Intégrateur des solutions **Horoquartz** : logiciel **eTemptation** et application mobile **mTemptation**.
  - Badgeuses Horoquartz **eTSmile** et **Pulsi**.
  - **Badgy by Azéo** : leur propre application de badgeage sur tablette et smartphone, 100 % compatible eTemptation.
  - **Cloud privé** sur l'île de La Réunion : datacenter certifié HDS, infogéré par le partenaire **Exodata** (ISO 27001 et ISO 9001).
- **Clients** à La Réunion et à Mayotte (Maurice est citée dans l'offre d'emploi, mais pas ailleurs sur le site).
- **Coordonnées** :
  - téléphone **02 62 70 54 85** (format international +262 262 70 54 85) ;
  - contact@azeoconseil.fr ;
  - candidatures : **recrutement@azeoconseil.re** ;
  - LinkedIn : https://www.linkedin.com/company/azeo-conseil/
- **Interlocuteur** : Stéphane Curtet (scurtet@azeoconseil.fr), qui fait lui-même les manipulations Git, Cloudflare, Gandi et Google.

### L'objectif

Remplacer l'ancien site WordPress de 2017, hébergé chez o2switch sur azeoconseil.com, par un site moderne. **La V1 est en ligne sur https://azeoconseil.fr** depuis le 29 septembre 2026.

### La pile technique

| Élément | Choix |
|---|---|
| Générateur | **Astro 7** (site statique), TypeScript, sans framework JavaScript |
| Node | 22 ou plus récent (fichier `.nvmrc`, variable `NODE_VERSION=22` dans Cloudflare) |
| Hébergement | **Cloudflare Pages**, projet `azeo-site`, offre gratuite |
| Code | Dépôt **GitHub** `azeo-site`, branche `main` = production, déploiement automatique à chaque envoi |
| Polices | Hébergées sur le site (`@fontsource/outfit`, `@fontsource/instrument-sans`) : aucun appel à Google Fonts |
| Formulaire | Fonction Cloudflare `functions/api/contact.ts` : envoi **SMTP** via la bibliothèque `worker-mailer` (Resend en secours si pas de SMTP), anti-spam **Cloudflare Turnstile** et champ piège |
| Plan du site | `@astrojs/sitemap`, qui génère `sitemap-index.xml` et `sitemap-0.xml` |
| Actualités | Collection de contenu Astro (`src/content.config.ts`) |
| Typographie | Script `scripts/typo-fr.mjs`, lancé automatiquement après chaque build (`postbuild`), qui ajoute les espaces insécables avant `? ! : ;` |

### Les contraintes

- **RGPD** : aucun cookie publicitaire ni de mesure d'audience, et pas de contenu tiers qui suit les visiteurs. Il n'y a donc pas de bandeau cookies.
- **Accessibilité et mobile** : le site doit s'adapter à toutes les tailles d'écran, et les animations sont coupées pour les visiteurs qui les ont désactivées.
- **Typographie française** (espaces insécables, guillemets, apostrophes typographiques).
- **Coût d'hébergement nul** (offres gratuites de Cloudflare).

### Le mode de travail

1. L'assistant fournit une archive « maj » qui contient **uniquement les fichiers modifiés**, dans un dossier `azeo-site/`.
2. L'utilisateur fait d'abord `git checkout main` et `git pull`, puis copie **le contenu** du dossier `azeo-site/` de l'archive dans son dépôt, puis lance `git status` pour vérifier.
3. Il termine par `git add .`, `git commit -m "…"` et `git push`. Cloudflare redéploie en 1 à 2 minutes.
4. Pour tester avant la production : créer une branche (`git checkout -b nom`). Cloudflare publie alors une adresse de test `*.azeo-site.pages.dev`, protégée par **Cloudflare Access**.

**Pièges déjà rencontrés :**
- **Le sous-dossier en trop** : en copiant le dossier lui-même, on obtient `azeo-site/azeo-site/…`, et rien ne change sur le site. Le contrôle : `git show --stat HEAD`.
- **Un fichier non copié** : on envoie un commit vide. Le contrôle : `git status` avant chaque commit.
- **`src/data/site.ts` contient la clé Turnstile de l'utilisateur**, que l'assistant n'a pas. Il ne faut **jamais écraser ce fichier** : modifier la ligne voulue à la main, sur GitHub avec le crayon, ou en local après un `git pull`.
- **Le dépôt GitHub de l'utilisateur fait foi.** La copie de référence de l'assistant peut en différer, par exemple pour le visuel Badgy (voir la section 5).

**Recommandation pour la suite** : utiliser **Claude Code** directement dans le dépôt, ce qui évite les copies d'archives. Lui donner le `README.md` du projet comme point de départ.

### Les domaines et le DNS

| Domaine | Bureau d'enregistrement | DNS | Rôle |
|---|---|---|---|
| **azeoconseil.fr** | Gandi | Cloudflare | **Site principal** (sans www). `www` redirige vers l'adresse sans www par une règle Cloudflare. Messagerie Microsoft 365 (MX et TXT à ne jamais toucher). Sous-domaines clients. |
| **azeoconseil.com** | Gandi | Cloudflare (depuis le jour J) | Redirection 301 vers le .fr, en conservant le chemin. Ancien hébergement o2switch (IP 109.234.167.77). Plus aucune messagerie utilisée. |
| **azeoconseil.re** | Gandi | Cloudflare | Redirection 301 vers le .fr. MX vers la messagerie Gandi (utilisation à vérifier). |

- **Les sous-domaines clients** du .fr, par exemple `bali-etemptation.azeoconseil.fr`, pointent vers les serveurs frontaux de l'entreprise devant les instances SaaS des clients. Ils doivent rester en **DNS uniquement (nuage gris)**. Leur certificat SSL, acheté chez Gandi, est installé sur le serveur frontal. **Il ne faut jamais les proxifier.**
- **Pour le .com et le .re**, les enregistrements `@` et `www` sont des A vers `192.0.2.1`, proxifiés, avec une règle de redirection en URL générique : `*azeoconseil.com/*` (ou `.re`) vers `https://azeoconseil.fr/${2}`, en 301, chaîne de requête conservée.
- **Pour le .fr**, la règle www est : `https://www.azeoconseil.fr/*` vers `https://azeoconseil.fr/${1}`, en 301. Elle a été volontairement restreinte, pour ne jamais toucher aux sous-domaines.
- **Le .com est protégé contre l'usurpation** : MX nul (`.`, priorité 0), SPF `v=spf1 -all`, DMARC `v=DMARC1; p=reject;`. Les enregistrements hérités d'o2switch ont été supprimés.
- **Le mode opératoire de bascule** est un document Claude : https://claude.ai/code/artifact/51abf678-d3e9-4a88-9df1-e62690af3e2d

---

## 2. Ce qui a été réalisé

### Les pages

| Page | Contenu |
|---|---|
| `/` (accueil) | Haut de page « Votre gestion des temps, pilotée d'ici » avec le sur-titre « depuis 2009 » ; bandeau clients ; proximité ; bénéfices ; accompagnement en 5 étapes ; solutions (eTemptation, Badgy, badgeuses) ; section Badgy ; cloud privé ; contact |
| `/etemptation/` | Schéma des modules recréé en code, 8 cartes de modules (sans badges HQ), 5 avantages, mTemptation, options de déploiement |
| `/badgeuses/` | Sélecteur (Badgy, eTSmile, Pulsi), bandeau Badgy en premier, eTSmile (version IP65), Pulsi (libre-service RH par licence), engagements de service |
| `/actualites/` et `/actualites/<slug>/` | Liste et articles. Première news : « Nouveau client : Carrefour Market Kanopée… », datée du 29/09/2026 |
| `/nous-rejoindre/` et `/nous-rejoindre/<slug>/` | Offres d'emploi (une ouverte : Consultant(e) en gestion des temps, CDI, Saint-Leu) et message automatique quand aucun poste n'est ouvert |
| `/mentions-legales/`, `/confidentialite/` | Textes fournis par le client, corrigés |
| `/merci/`, `/erreur-envoi/`, 404 | Pages techniques, exclues du plan du site |

### Les fonctionnalités notables

- **Bandeau clients défilant** :
  - **39 logos en couleur**, dans un ordre aléatoire à chaque visite ;
  - défilement lent, pause au survol ;
  - chiffres de part et d'autre : « + de 40 clients accompagnés au quotidien » et « + 15 000 collaborateurs et agents gérés ».
- **Bandeau « Nouveau », façon flash info**, sous le menu :
  - il affiche la dernière actualité pendant **15 jours** ;
  - le calcul se fait dans le navigateur du visiteur, donc le bandeau disparaît sans republier le site ;
  - le titre défile s'il est trop long ;
  - le visiteur peut le fermer, et ce choix est mémorisé pour cette actualité.
- **Offres d'emploi** pilotées par `src/data/offres.ts` :
  - `ouverte: true` ou `false` ;
  - données structurées « JobPosting » pour Google pour l'emploi ;
  - boutons « Postuler par e-mail » et « Transférer l'offre » ;
  - message « Pas de poste ouvert… pour l'instant ! » avec une horloge animée.
- **Référencement** :
  - un titre et une description par page, avec La Réunion (974) et Mayotte (976) ;
  - données structurées : entreprise de services (zone desservie : La Réunion et Mayotte), fils d'Ariane, articles, offres d'emploi ;
  - plan du site, `robots.txt`, image de partage 1200 × 630 (`public/images/partage.jpg`) ;
  - favicon issu de l'anneau du logo ;
  - redirections des anciennes pages du .com (`public/_redirects`) ;
  - `noindex` sur les adresses `*.pages.dev`.
- **Sécurité** : en-têtes de sécurité (`public/_headers`) ; HSTS **sans** `includeSubDomains` ; champ piège et Turnstile sur le formulaire.

### Où modifier quoi

| Élément | Fichier |
|---|---|
| Coordonnées, LinkedIn, e-mail de recrutement, clé Turnstile publique, menu | `src/data/site.ts` |
| Logos clients et chiffres du bandeau | `src/data/clients.ts` et `public/images/clients/` |
| Offres d'emploi | `src/data/offres.ts` |
| Actualités | `src/content/actualites/` : copier `_modele.md` ; les fichiers qui commencent par `_` ne sont pas publiés ; `brouillon: true` pour préparer une news sans la publier |
| Textes de l'accueil | `src/components/sections/*.astro` |
| Couleurs et typographie | `src/styles/global.css` |
| Redirections | `public/_redirects` |
| En-têtes HTTP | `public/_headers` |
| Formulaire (envoi) | `functions/api/contact.ts` |

### Les variables Cloudflare Pages

À définir en **Production** et en **Aperçu**. Il faut **relancer un déploiement** après chaque modification.

- `SMTP_HOST`, `SMTP_PORT` (465 ou 587 ; le port 25 est bloqué), `SMTP_USER`, `SMTP_PASSWORD` (Secret), `CONTACT_TO` = contact@azeoconseil.fr. `CONTACT_FROM` est facultative : par défaut, c'est `SMTP_USER`.
- `TURNSTILE_SECRET_KEY` (Secret). Elle doit toujours aller **avec** la clé du site dans `site.ts` : une clé secrète sans case affichée sur le formulaire ferait refuser tous les messages.

---

## 3. Les décisions prises et leurs raisons

| Décision | Raison | Ce qui a été écarté |
|---|---|---|
| **Astro, Cloudflare Pages et GitHub** | Performances, sécurité, coût nul, adresses de test automatiques | WordPress (maintenance, sécurité), Wix et Squarespace (référencement limité, difficile d'en sortir) |
| **Pages plutôt que Workers** | Le plus simple pour un site statique avec une fonction | Workers, que Cloudflare met en avant, mais qui demandait des adaptations |
| **azeoconseil.fr comme adresse principale, sans www** | DNS déjà chez Cloudflare, messagerie Microsoft 365 en .fr, mentions légales en .fr | Rester sur le .com |
| **Redirections 301 Cloudflare pour le .com et le .re** | Transmettent le référencement et fonctionnent en HTTPS | Les redirections Gandi, notamment de type « Caché » : un cadre qui garde l'ancienne adresse, mauvais pour le référencement et incompatible avec HTTPS |
| **Protection par Cloudflare Access des adresses de test**, plus `noindex` | Le contenu n'était pas finalisé, et il faut éviter l'indexation de `pages.dev` | Une adresse de test publique |
| **Envoi du formulaire par SMTP** | Le client n'a pas de compte Resend et dispose de son propre serveur | Resend, gardé seulement en secours |
| **Turnstile et champ piège** | Du spam reçu via le formulaire ; solution gratuite, sans cookie publicitaire | reCAPTCHA (Google, cookies) |
| **Polices hébergées sur le site, pas de mesure d'audience** | RGPD : pas de bandeau cookies nécessaire | Google Fonts, Google Analytics |
| **Actualités en fichiers Markdown, saisies à la main** | Simple, éditable depuis GitHub, contenu choisi | L'API LinkedIn (réservée aux partenaires) et les publications LinkedIn intégrées (cookies de suivi) |
| **Fenêtre de 15 jours calculée dans le navigateur** | Site statique : un calcul au moment du build ne s'actualiserait pas | Une reconstruction quotidienne programmée |
| **Mise en avant des news par un bandeau sous le menu** | Choix du client | Une carte dans le haut de page, une section « Actualités » sur l'accueil |
| **Schéma des modules recréé en code** | Texte lisible sur mobile et par Google | L'image PowerPoint telle quelle |
| **Textes des éditeurs reformulés** | Éviter le contenu dupliqué (référencement) et rester dans les clous du droit d'auteur | Copier les textes d'Horoquartz |
| **Pas de photos trouvées sur le web** | Droits d'auteur | Les photos de presse ou de LinkedIn de l'ouverture Kanopée |
| **HSTS sans `includeSubDomains`** | Ne pas imposer le HTTPS aux sous-domaines clients | HSTS sur tous les sous-domaines |
| **`compressHTML: false`** dans `astro.config.mjs` | La compression supprimait l'espace entre un texte et un lien (« de laCNIL ») | Garder la compression |
| **Menu « hamburger » en dessous de 1 320 px** | Avec 7 entrées, le menu passait sur deux lignes | Réduire le nombre d'entrées |
| **Le .com sans messagerie et protégé contre l'usurpation** | Le .com n'est plus utilisé pour les e-mails | Garder le MX o2switch |
| **Page Badgeuses : « pointeuses » conservé dans le titre Google** | Mot-clé recherché | Le remplacer partout |
| **Pas de 3ᵉ chiffre dans le bandeau clients pour « depuis 2009 »** | Lisibilité, surtout sur mobile ; « 2009 » plutôt que « 17 ans », qui vieillirait | Mention en nombre d'années |

---

## 4. Conventions et règles métier

### Identité visuelle

- **Couleurs**, issues du logo :
  - pétrole `#046A6F` (couleur principale) ; pétrole foncé `#0B3B3E` ;
  - vert anis `#A6D903` (accent, surtout sur fond sombre) ;
  - orange `#EC8D21`, et `#A85708` pour les petits textes sur fond clair.
- **Typographies** : **Outfit** pour les titres, **Instrument Sans** pour le texte.
- **Logo** : version haute définition fournie par le client (`public/images/logo-azeo.png`).

### Règles de rédaction demandées par le client

- **Pas de point final** dans les titres.
- **Vocabulaire** :
  - « **badgeuses** », et non « terminaux » ;
  - « **badgeage** », et non « pointage » ;
  - « **badger** », et non « pointer » ;
  - « **Badgeuse** avec services RH intégrés » pour Pulsi, et non « Pointeuse ».
- **Horoquartz** : discret. Il est retiré des sur-titres (« Logiciel », « Matériel », « Nouveau »), du pied de page et du sur-titre de la page Badgeuses, et n'apparaît plus qu'au besoin. Le lien vers l'éditeur affiche **www.horoquartz.com**.
- **Cloud** : « cloud privé, sur l'île de La Réunion ». Jamais « souverain », ni « océan Indien » pour l'hébergement.
- **France hexagonale**, et non « métropole ».
- **Proximité** : « Ici, à La Réunion, comme vous ». Le support est « 100 % réunionnais, basé dans nos bureaux de Saint-Leu ». Mayotte est incluse : une heure d'écart, l'argument du fuseau horaire reste valable. **Pas de mention du « billet d'avion »**, car l'équipe intervient parfois à Mayotte.
- **Azéo ne pose pas les badgeuses** : ni visite, ni installation. Ses engagements : conseil et choix du matériel, paramétrage dans eTemptation, formation, supervision et support.
- **« eTemptation est installé »**, au masculin.
- **Logos clients en couleur** : le noir et blanc était jugé trop fade.
- **Offres d'emploi au tutoiement**, dans le ton des annonces LinkedIn du client.
- **« Depuis 2009 »** dans le sur-titre du haut de page.

### Chiffres et faits utilisables

- Plus de 40 clients ; plus de 15 000 collaborateurs et agents gérés.
- Horoquartz : leader du marché, plus de 5 000 clients et 4 millions de salariés gérés (chiffres de l'éditeur, cités dans l'offre d'emploi) ; eTemptation interfacé avec plus de 150 logiciels de paie.
- Badgy : mêmes badges que les badgeuses Horoquartz, tablette Android, multi-sites et sites éphémères, fonctionnement hors réseau avec synchronisation au retour, smartphone des chefs d'équipe, géolocalisation, identification NFC du lieu.

### Règles d'infrastructure

- Les enregistrements **MX et TXT de la messagerie Microsoft 365** sur le .fr ne doivent jamais être modifiés.
- Les **sous-domaines clients** restent en nuage gris.
- Les **variables Cloudflare** se définissent en Production **et** en Aperçu, puis on redéploie.
- **Ne jamais écraser `src/data/site.ts`**, à cause de la clé Turnstile.

---

## 5. Points en suspens et prochaines étapes

### Référencement (en cours, lancé le 29 septembre)

- [ ] **Search Console** : relancer le **changement d'adresse** du .com vers le .fr. L'échec venait du délai de Google, la configuration a été vérifiée.
- [ ] **Plan du site de l'ancien site** : pousser `public/sitemap-ancien-site.xml` (dernière archive), puis le déclarer dans la propriété **azeoconseil.com** à l'adresse `https://azeoconseil.fr/sitemap-ancien-site.xml`. À retirer dans quelques mois.
- [ ] Vérifier que le **plan du site du .fr** passe à « Opération effectuée », et que `/badgeuses/` est « sur Google » (Inspection de l'URL).
- [ ] **Sous-domaines clients indexés par Google** : ajouter l'en-tête `X-Robots-Tag: noindex, nofollow` sur le serveur frontal, puis les masquer dans **Suppressions** de Search Console. Ne **pas** les bloquer par `robots.txt`.
- [ ] Ajouter éventuellement une propriété Search Console **Préfixe d'URL** `https://azeoconseil.fr/`, pour suivre le site vitrine seul.
- [ ] **Google Business Profile** : une fiche existe avec l'ancien site en .com. La validation proposait un e-mail en .com, aujourd'hui sans messagerie. Pistes :
  - corriger le site de la fiche vers le .fr ;
  - choisir une autre méthode de validation (téléphone, vidéo, courrier) ;
  - en dernier recours, activer temporairement le routage des e-mails Cloudflare sur le .com, puis remettre le MX nul et le SPF `-all`.

  En attendant, « Proposer une modification » du site web sur Google Maps. Une fois la fiche validée : description (un texte a été préparé), photos, avis.
- [ ] **Bing** : Webmaster Tools est fait (plan du site en « Réussite », adresses soumises ; l'outil « Site Move » est indisponible, sans conséquence). Reste **Bing Places** : importer la fiche Google une fois validée. **Apple Business Connect** est facultatif.
- [ ] **Cloudflare Crawler Hints** : à activer dans la zone .fr.
- [ ] **Liens entrants** : demander à Horoquartz de référencer Azéo comme intégrateur, puis la CCI Réunion et les annuaires locaux.
- [ ] Juger les positions sur « badgeuse réunion 974 » d'ici 4 à 8 semaines, avec le rapport Performances de Search Console.
- [ ] Garder l'enregistrement TXT de vérification Google du .com pendant toute la durée du déménagement, environ 6 mois.

### Ménage après la bascule

- [ ] **Gandi** : supprimer les redirections web restantes (.fr vers .com, les deux « Caché » du .com, celle du .re).
- [ ] **o2switch** : récupérer une sauvegarde de l'ancien site, puis résilier l'hébergement.
- [ ] **.re** : vérifier si les adresses en .re sont utilisées (recrutement@azeoconseil.re l'est). Si le reste n'est pas utilisé, il ne faut **pas** appliquer la protection anti-usurpation tant que recrutement@ y est hébergé.
- [ ] Mettre à jour l'adresse du site dans les signatures d'e-mail et les documents commerciaux.

### Contenu et site

- [ ] **Offre d'emploi** : la relancer (`ouverte: true` et nouvelle date `publiee` dans `src/data/offres.ts`) et publier le post LinkedIn de relance (deux versions préparées).
- [ ] **News Kanopée** : remplacer l'image (`src/content/actualites/carrefour-market-kanopee.jpg`, aujourd'hui une composition Badgy) par une photo prise sur place, avec accord. Confirmer les faits de l'article (aucune date d'ouverture n'est indiquée).
- [ ] **Visuel Badgy** : la mise en situation avec la main a été refusée (branche `badgy-visuel` non fusionnée). Une version **sans main, avec un fond de bureau dessiné** a été produite (`badgy-mise-en-situation-v2.jpg`), ainsi qu'un PNG détouré sans la main. Le client doit valider avant intégration. Une photo réelle de leurs bureaux reste l'option préférée.
- [ ] **Logos en basse définition** : Doulux, Run Market et Keepway. À remplacer si de meilleures versions sont disponibles.
- [ ] **À valider par le client** :
  - les 4 arguments « Pourquoi nous rejoindre » ;
  - le directeur de la publication (Stéphane Curtet, alors que c'est en principe l'entrepreneur pour une EI) ;
  - la mention de Maurice ailleurs que dans l'offre d'emploi ;
  - la reformulation de la phrase répétitive de la page Badgeuses (« …en badgeuses, et les badgeuses eTSmile… »).
- [ ] **Pages à créer plus tard** : une page dédiée à **Badgy** (bon levier de référencement), et une page sur la **gestion des temps et des absences** (contenu promis par le client).
- [ ] **Contrôle de cohérence** : comparer le dépôt GitHub avec la copie de référence de l'assistant, qui peut différer. Le dépôt GitHub fait foi.
