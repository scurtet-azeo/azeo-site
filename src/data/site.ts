// Informations de l'entreprise, utilisées dans tout le site.
// Les champs vides sont à compléter : ils sont masqués tant qu'ils sont vides.
export const site = {
  name: 'Azéo Conseil',
  url: 'https://azeoconseil.com',
  description:
    "Intégrateur Horoquartz à La Réunion : gestion des temps, planification, badgeuses et Badgy. Accompagnement de proximité et cloud privé à La Réunion.",
  address: {
    street: '69 chemin Dubuisson',
    postalCode: '97436',
    city: 'Saint-Leu',
    region: 'La Réunion',
    country: 'RE',
  },
  phone: '', // ex. '+262 262 00 00 00'
  email: 'contact@azeoconseil.fr',
  linkedin: '', // URL de la page LinkedIn
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
];
