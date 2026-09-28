// Logos clients du bandeau défilant (sous le haut de page).
//
// Pour ajouter un client :
//   1. déposez son logo dans public/images/clients/ (SVG ou PNG à fond transparent de préférence)
//   2. ajoutez une ligne ci-dessous : { name: 'Nom du client', logo: '/images/clients/fichier.svg' }
//
// Les logos s'affichent dans un ordre aléatoire, différent à chaque visite.
// Une entrée sans `logo` s'affiche comme un emplacement en pointillés : pratique pour
// visualiser le bandeau, mais à remplacer par de vrais logos avant la mise en ligne.
export type Client = { name: string; logo?: string };

export const clients: Client[] = [
  { name: 'Client 1' },
  { name: 'Client 2' },
  { name: 'Client 3' },
  { name: 'Client 4' },
  { name: 'Client 5' },
  { name: 'Client 6' },
  { name: 'Client 7' },
  { name: 'Client 8' },
];
