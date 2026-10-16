// Données structurées (JSON-LD) partagées : fil d'Ariane et services.
// Elles aident Google et les moteurs IA à comprendre qui fait quoi, et où.
import { site } from '../data/site';

// Identifiant de l'entreprise, déclarée dans Base.astro : les services y renvoient.
export const organisationId = `${site.url}/#organisation`;

const zones = [
  { '@type': 'Place', name: 'La Réunion' },
  { '@type': 'Place', name: 'Mayotte' },
];

// Fil d'Ariane : [['Accueil', '/'], ['Actualités', '/actualites/'], …]
export function filAriane(etapes: [nom: string, chemin: string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: etapes.map(([name, chemin], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: new URL(chemin, site.url).href,
    })),
  };
}

// Éditeur des solutions intégrées par Azéo Conseil.
export const horoquartz = { '@type': 'Organization', name: 'Horoquartz', url: site.partners.horoquartz };

// Service proposé par Azéo Conseil, à La Réunion et à Mayotte.
// `marque` : l'éditeur du produit concerné (Horoquartz pour eTemptation et les badgeuses).
export function service(s: { nom: string; type: string; description: string; chemin: string; marque?: object }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.nom,
    serviceType: s.type,
    description: s.description,
    url: new URL(s.chemin, site.url).href,
    provider: { '@id': organisationId },
    areaServed: zones,
    ...(s.marque && { brand: s.marque }),
  };
}
