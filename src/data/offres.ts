// Offres d'emploi de la page « Nous rejoindre ».
//
// Publier une offre : ajoutez un bloc ci-dessous avec `ouverte: true`.
// Fermer une offre : passez `ouverte: false` (ou supprimez le bloc).
// Quand aucune offre n'est ouverte, la page affiche automatiquement un message
// invitant à envoyer une candidature spontanée.
//
// Chaque offre ouverte a sa propre page (/nous-rejoindre/<slug>/), repérable par
// Google pour l'emploi. Le `slug` : minuscules, sans accent ni espace (tirets).
// Les sections sont libres : un titre, puis un texte et/ou une liste à puces.

export type Section = { titre: string; texte?: string; liste?: string[] };

export type Offre = {
  slug: string;
  titre: string;
  contrat?: 'CDI' | 'CDD' | 'Alternance' | 'Stage' | 'Freelance';
  lieu: string;
  publiee: string; // date de publication, format AAAA-MM-JJ
  ouverte: boolean;
  resume: string; // 1 à 2 phrases, affichées dans la liste des offres
  intro?: string[]; // paragraphes d'introduction
  sections: Section[];
  conclusion?: string;
  linkedin?: string; // lien vers l'offre publiée sur LinkedIn (facultatif)
};

export const offres: Offre[] = [
  {
    slug: 'consultant-gestion-des-temps',
    titre: 'Consultant(e) en gestion des temps',
    contrat: 'CDI',
    lieu: 'Saint-Leu, La Réunion',
    publiee: '2026-09-29',
    ouverte: true,
    resume:
      'Tu paramètres eTemptation, accompagnes nos clients de la mise en place à la prise en main, et assures le support au quotidien, avec l’équipe.',
    intro: [
      'Chez Azéo Conseil, notre mission ? Accompagner les entreprises réunionnaises, mahoraises et mauriciennes dans l’optimisation de leur gestion des temps et de leurs plannings. Partenaire Horoquartz, leader du marché avec plus de 5 000 clients et 4 millions de salariés gérés au quotidien, nous déployons des solutions qui font vraiment la différence dans le quotidien des RH, côté public comme privé.',
      'On grandit, et on cherche un(e) consultant(e) en gestion des temps pour rejoindre l’équipe.',
    ],
    sections: [
      {
        titre: 'Ce que tu feras (avec l’équipe, pas tout seul dans ton coin)',
        liste: [
          'Analyser les besoins clients et paramétrer la solution eTemptation',
          'Accompagner les utilisateurs de la mise en place jusqu’à la prise en main',
          'Assurer le support et répondre aux demandes au quotidien',
          'Former les équipes côté client (managers, RH, paie…)',
          'Travailler main dans la main avec nos consultants et notre pôle technique',
        ],
      },
      {
        titre: 'Ton profil',
        texte:
          'Tu as déjà touché à l’intégration de progiciel (SIRH, ERP, GTA…) ou tu es issu(e) d’un cursus en informatique de gestion. Tu es du genre à comprendre vite un logiciel et à aimer le décortiquer. Tu as le contact facile, tu sais écouter un client et traduire son besoin en solution concrète. Si en plus tu as des notions en RH, planning ou droit du travail, c’est la cerise sur le gâteau.',
      },
      {
        titre: 'Ce que l’on valorise',
        liste: [
          'La curiosité et l’envie d’apprendre',
          'Le sens du service, pour de vrai',
          'L’autonomie sans jouer solo',
        ],
      },
    ],
    conclusion:
      'Poste basé à La Réunion (Saint-Leu) : candidatures locales bienvenues et encouragées.',
  },
];

export const offresOuvertes = offres.filter((o) => o.ouverte);
