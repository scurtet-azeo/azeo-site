/**
 * Formulaire de contact — Cloudflare Pages Function (POST /api/contact)
 *
 * Envoie la demande par e-mail via l'API Resend (https://resend.com).
 * Variables à définir dans Cloudflare (Paramètres > Variables et secrets) :
 *   RESEND_API_KEY  clé API Resend (secret)
 *   CONTACT_TO      adresse qui reçoit les demandes, ex. contact@azeoconseil.com
 *   CONTACT_FROM    expéditeur vérifié chez Resend, ex. "Site Azéo <site@azeoconseil.com>"
 *
 * Sans JavaScript côté navigateur : le formulaire poste ici, puis on redirige
 * vers /merci/ (succès) ou /erreur-envoi/ (échec).
 */

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

interface Context {
  request: Request;
  env: Env;
}

const redirect = (request: Request, path: string) =>
  Response.redirect(new URL(path, request.url).toString(), 303);

const clean = (value: FormDataEntryValue | null, max = 2000) =>
  String(value ?? '').trim().slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirect(request, '/erreur-envoi/');
  }

  // Piège à robots : un humain ne remplit jamais ce champ.
  if (clean(form.get('site_web'))) {
    return redirect(request, '/merci/');
  }

  const data = {
    nom: clean(form.get('nom'), 200),
    entreprise: clean(form.get('entreprise'), 200),
    email: clean(form.get('email'), 200),
    telephone: clean(form.get('telephone'), 50),
    effectif: clean(form.get('effectif'), 100),
    message: clean(form.get('message'), 5000),
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if (!data.nom || !data.entreprise || !emailValid || !data.message) {
    return redirect(request, '/erreur-envoi/');
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    console.error('Formulaire de contact : variables RESEND_API_KEY, CONTACT_TO ou CONTACT_FROM manquantes.');
    return redirect(request, '/erreur-envoi/');
  }

  const rows = [
    ['Nom', data.nom],
    ['Entreprise', data.entreprise],
    ['E-mail', data.email],
    ['Téléphone', data.telephone || '—'],
    ['Effectif', data.effectif || '—'],
  ];

  const html = `
    <h2>Nouvelle demande depuis le site</h2>
    <table cellpadding="6">${rows
      .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
      .join('')}</table>
    <p><strong>Besoin :</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: data.email,
      subject: `Demande de contact : ${data.entreprise}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error('Resend a refusé l’envoi', res.status, await res.text());
    return redirect(request, '/erreur-envoi/');
  }

  return redirect(request, '/merci/');
};
