// Informations de l'entreprise, utilisées dans tout le site.
// Les champs vides sont à compléter : ils sont masqués tant qu'ils sont vides.
export const site = {
  name: 'Azéo Conseil',
  url: 'https://azeoconseil.fr',
  description:
    "Intégrateur Horoquartz à La Réunion (974) et à Mayotte (976) : logiciel de gestion des temps, planification, badgeuses et Badgy. Accompagnement de proximité et cloud privé à La Réunion.",
  address: {
    street: '69 chemin Dubuisson',
    postalCode: '97436',
    city: 'Saint-Leu',
    region: 'La Réunion',
    country: 'RE',
  },
  phone: '02 62 70 54 85', // affichage
  phoneIntl: '+262 262 70 54 85', // format international (liens d’appel, Google)
  email: 'contact@azeoconseil.fr',
  recrutementEmail: 'recrutement@azeoconseil.re', // adresse qui reçoit les candidatures
  // Anti-spam du formulaire (Cloudflare Turnstile) : « clé du site », publique.
  // Vide = vérification désactivée. La clé secrète, elle, va dans les variables Cloudflare.
  turnstileSiteKey: '0x4AAAAAAFKw3iXSSiQXJc7R',
  linkedin: 'https://www.linkedin.com/company/azeo-conseil/',
  partners: {
    horoquartz: 'https://www.horoquartz.com',
  },
};

export const nav = [
  { href: '/#proximite', label: 'Notre proximité' },
  { href: '/#solutions', label: 'Solutions' },
  { href: '/#badgy', label: 'Badgy' },
  { href: '/#cloud', label: 'Cloud privé' },
  { href: '/#accompagnement', label: 'Accompagnement' },
  { href: '/actualites/', label: 'Actualités' },
  { href: '/nous-rejoindre/', label: 'Nous rejoindre' },
];
