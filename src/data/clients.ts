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
  { name: 'CRC – Caisses Réunionnaises Complémentaires', logo: '/images/clients/crc.png', height: 58 },
  { name: 'Ville de Saint-Denis', logo: '/images/clients/ville-saint-denis.png', height: 60 },
  { name: 'Sorelait', logo: '/images/clients/sorelait.png', height: 42 },
  { name: 'Territoire de l’Ouest', logo: '/images/clients/territoire-ouest.png', height: 44 },
  { name: 'SIDR', logo: '/images/clients/sidr.png', height: 54 },
  { name: 'Run Market', logo: '/images/clients/run-market.png', height: 34 },
  { name: 'Master’s Pneu', logo: '/images/clients/masters-pneu.png', height: 50 },
  { name: 'Vindemia', logo: '/images/clients/vindemia.png', height: 34 },
  { name: 'Decathlon', logo: '/images/clients/decathlon.png', height: 30 },
  { name: 'Yves Rocher', logo: '/images/clients/yves-rocher.png', height: 40 },
  { name: 'CDG 976 – Centre de gestion de la fonction publique territoriale de Mayotte', logo: '/images/clients/cdg976.png', height: 62 },
  { name: 'T.Tram', logo: '/images/clients/ttram.png', height: 40 },
  { name: 'Centre d’accueil permanent Jacques Tessier', logo: '/images/clients/cap-jacques-tessier.png', height: 62 },
  { name: 'CCAS de Saint-Pierre', logo: '/images/clients/ccas-saint-pierre.png', height: 50 },
  { name: 'CIAS – Centre intercommunal d’action sociale', logo: '/images/clients/cias.png', height: 50 },
  { name: 'ARAR Soins à domicile', logo: '/images/clients/arar.png', height: 58 },
  { name: 'Keepway', logo: '/images/clients/keepway.png', height: 44 },
  { name: 'Intermark', logo: '/images/clients/intermark.png', height: 42 },
  { name: 'Arma Sud Réunion', logo: '/images/clients/arma-sud.png', height: 48 },
  { name: 'Soretole', logo: '/images/clients/soretole.png', height: 52 },
  { name: 'Bamyrex', logo: '/images/clients/bamyrex.png', height: 40 },
  { name: 'Brioche Dorée', logo: '/images/clients/brioche-doree.png', height: 46 },
  { name: 'La Plaine-des-Palmistes', logo: '/images/clients/plaine-des-palmistes.png', height: 62 },
  { name: 'Mango', logo: '/images/clients/mango.png', height: 26 },
  { name: 'Kiabi', logo: '/images/clients/kiabi.png', height: 40 },
  { name: 'Promod', logo: '/images/clients/promod.png', height: 22 },
  { name: 'Pimkie', logo: '/images/clients/pimkie.png', height: 32 },
  { name: 'Morgan', logo: '/images/clients/morgan.png', height: 40 },
  { name: 'Cap Méchant', logo: '/images/clients/cap-mechant.png', height: 38 },
  { name: 'ASDR', logo: '/images/clients/asdr.png', height: 40 },
  { name: 'Estival', logo: '/images/clients/estival.png', height: 54 },
  { name: 'Carrefour Market Kanopée', logo: '/images/clients/carrefour-market-kanopee.png', height: 56 },
];

// Chiffres clés affichés de part et d'autre du bandeau.
// \u00a0 = espace insécable : empêche « + 15 000 » d'être coupé en fin de ligne.
export const chiffres = {
  gauche: { valeur: '+\u00a0de\u00a040 clients', texte: 'accompagnés au quotidien' },
  droite: { valeur: '+\u00a015\u00a0000 collaborateurs', texte: 'et agents gérés' },
};
