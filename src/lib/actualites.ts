import { getCollection } from 'astro:content';

// Actualités publiées, de la plus récente à la plus ancienne.
// Les brouillons et les fichiers commençant par « _ » (modèles) sont exclus.
export async function getActualites() {
  const toutes = await getCollection(
    'actualites',
    ({ id, data }) => !data.brouillon && !id.startsWith('_'),
  );
  return toutes.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Indian/Reunion' });
