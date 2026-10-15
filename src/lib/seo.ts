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

// Service proposé par Azéo Conseil, à La Réunion et à Mayotte.
export function service(s: { nom: string; type: string; description: string; chemin: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.nom,
    serviceType: s.type,
    description: s.description,
    url: new URL(s.chemin, site.url).href,
    provider: { '@id': organisationId },
    areaServed: zones,
  };
}
