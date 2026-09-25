// Typographie française : remplace l'espace avant ? ! : ; » (et après «) par une
// espace insécable dans les pages générées, pour éviter qu'un « ? » se retrouve
// seul en début de ligne. Exécuté automatiquement après `npm run build`.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const NBSP = '\u00a0';

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

const fixText = (text) =>
  text.replace(/ ([?!:;»])/g, `${NBSP}$1`).replace(/« /g, `«${NBSP}`);

let count = 0;
for await (const file of htmlFiles('dist')) {
  const html = await readFile(file, 'utf8');
  // On ne touche qu'au texte visible : ni les balises, ni les scripts, ni les styles.
  const out = html.replace(
    /(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)|([^<]+)/g,
    (_, tag, text) => tag ?? fixText(text),
  );
  if (out !== html) {
    await writeFile(file, out);
    count++;
  }
}
console.log(`typo-fr : ${count} page(s) corrigée(s)`);
