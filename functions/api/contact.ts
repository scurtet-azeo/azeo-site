/**
 * Formulaire de contact — Cloudflare Pages Function (POST /api/contact)
 *
 * Envoie la demande par e-mail via votre serveur SMTP (recommandé) ou, à défaut, via Resend.
 *
 * Variables à définir dans Cloudflare (Workers & Pages > azeo-site > Paramètres > Variables et secrets),
 * pour la Production ET l'Aperçu, puis redéployer :
 *
 *   Envoi par SMTP (votre messagerie) :
 *     SMTP_HOST       serveur d'envoi, ex. mail.gandi.net
 *     SMTP_PORT       465 (TLS direct, conseillé) ou 587 (STARTTLS). Le port 25 est bloqué par Cloudflare.
 *     SMTP_USER       identifiant de la boîte d'envoi, ex. site@azeoconseil.fr
 *     SMTP_PASSWORD   mot de passe de cette boîte (type Secret)
 *
 *   Commun :
 *     CONTACT_TO      adresse qui reçoit les demandes, ex. contact@azeoconseil.fr
 *     CONTACT_FROM    (facultatif) expéditeur affiché. Par défaut : SMTP_USER.
 *                     Avec SMTP, gardez la même adresse que SMTP_USER : la plupart des serveurs
 *                     refusent d'envoyer au nom d'une autre adresse.
 *
 *   Envoi par Resend (seulement si SMTP_HOST n'est pas défini) :
 *     RESEND_API_KEY, CONTACT_TO, CONTACT_FROM
 *
 * Sans JavaScript côté navigateur : le formulaire poste ici, puis on redirige
 * vers /merci/ (succès) ou /erreur-envoi/ (échec). Les erreurs sont visibles dans
 * le flux de journaux du déploiement (onglet Fonctions).
 */
import { WorkerMailer } from 'worker-mailer';

interface Env {
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

interface Context {
  request: Request;
  env: Env;
}

interface Message {
  subject: string;
  html: string;
  text: string;
  replyTo: string;
}

const redirect = (request: Request, path: string) =>
  Response.redirect(new URL(path, request.url).toString(), 303);

const clean = (value: FormDataEntryValue | null, max = 2000) =>
  String(value ?? '').trim().slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// Découpe « Nom <adresse@domaine> » en { name, email }.
const parseAddress = (value: string) => {
  const m = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { name: m[1] || undefined, email: m[2] } : { email: value.trim() };
};

async function sendViaSmtp(env: Env, msg: Message) {
  const port = Number(env.SMTP_PORT || 465);
  const from = parseAddress(env.CONTACT_FROM || `Site Azéo <${env.SMTP_USER}>`);
  await WorkerMailer.send(
    {
      host: env.SMTP_HOST!,
      port,
      secure: port === 465, // 465 : TLS direct ; 587 : STARTTLS
      startTls: port !== 465,
      credentials: { username: env.SMTP_USER!, password: env.SMTP_PASSWORD! },
      authType: ['plain', 'login'],
      responseTimeoutMs: 15000,
      socketTimeoutMs: 20000,
    },
    {
      from,
      to: parseAddress(env.CONTACT_TO!),
      reply: msg.replyTo,
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
    },
  );
}

async function sendViaResend(env: Env, msg: Message) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: msg.replyTo,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
    }),
  });
  if (!res.ok) throw new Error(`Resend a refusé l’envoi (${res.status}) : ${await res.text()}`);
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirect(request, '/erreur-envoi/');
  }

  // Piège à robots : un humain ne remplit jamais ce champ.
  if (clean(form.get('site_web'))) {
    console.warn('Formulaire de contact : champ piège rempli, message ignoré.');
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

  const useSmtp = Boolean(env.SMTP_HOST);
  const missing = useSmtp
    ? (['SMTP_USER', 'SMTP_PASSWORD', 'CONTACT_TO'] as const).filter((k) => !env[k])
    : (['RESEND_API_KEY', 'CONTACT_TO', 'CONTACT_FROM'] as const).filter((k) => !env[k]);
  if (missing.length) {
    console.error(`Formulaire de contact : variable(s) manquante(s) : ${missing.join(', ')}.`);
    return redirect(request, '/erreur-envoi/');
  }

  const rows: [string, string][] = [
    ['Nom', data.nom],
    ['Entreprise', data.entreprise],
    ['E-mail', data.email],
    ['Téléphone', data.telephone || '—'],
    ['Effectif', data.effectif || '—'],
  ];

  const msg: Message = {
    subject: `Demande de contact : ${data.entreprise}`,
    replyTo: data.email,
    html: `
      <h2>Nouvelle demande depuis le site</h2>
      <table cellpadding="6">${rows
        .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
        .join('')}</table>
      <p><strong>Besoin :</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`,
    text: `${rows.map(([k, v]) => `${k} : ${v}`).join('\n')}\n\nBesoin :\n${data.message}`,
  };

  try {
    if (useSmtp) await sendViaSmtp(env, msg);
    else await sendViaResend(env, msg);
  } catch (err) {
    console.error(`Formulaire de contact : échec de l’envoi par ${useSmtp ? 'SMTP' : 'Resend'}.`, err);
    return redirect(request, '/erreur-envoi/');
  }

  return redirect(request, '/merci/');
};
