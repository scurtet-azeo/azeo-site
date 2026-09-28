// Logos clients du bandeau défilant (sous le haut de page).
//
// Pour ajouter un client :
//   1. déposez son logo dans public/images/clients/ (PNG à fond transparent ou SVG)
//   2. ajoutez une ligne ci-dessous : { name: 'Nom du client', logo: '/images/clients/fichier.png' }
//
// `height` (facultatif, en pixels, 40 par défaut) permet d'équilibrer visuellement
// les logos carrés ou très détaillés par rapport aux logos longs.
// Les logos s'affichent dans un ordre aléatoire, différent à chaque visite.
export type Client = { name: string; logo?: string; height?: number };

export const clients: Client[] = [
  { name: 'Doulux', logo: '/images/clients/doulux.png', height: 48 },
  { name: 'GAA', logo: '/images/clients/gaa.png', height: 36 },
  { name: 'Fermes & Jardins', logo: '/images/clients/fermes-et-jardins.png', height: 50 },
  { name: 'Sicalait', logo: '/images/clients/sicalait.png', height: 42 },
  { name: 'E.Leclerc', logo: '/images/clients/e-leclerc.png', height: 36 },
  { name: 'Cirest', logo: '/images/clients/cirest.png', height: 58 },
  { name: 'Carrefour', logo: '/images/clients/carrefour.png', height: 34 },
];

// Chiffres clés affichés de part et d'autre du bandeau.
// \u00a0 = espace insécable : empêche « + 15 000 » d'être coupé en fin de ligne.
export const chiffres = {
  gauche: { valeur: '+\u00a0de\u00a040 clients', texte: 'accompagnés au quotidien' },
  droite: { valeur: '+\u00a015\u00a0000 collaborateurs', texte: 'et agents gérés' },
};
