import { cleanText, getPool, jsonResponse, parseJsonBody } from './db.js';
import { randomToken, sha256, siteUrl } from './admin-auth.js';
import { sendMagicLinkEmail } from './mail.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { email } = parseJsonBody(event);
    const loginEmail = cleanText(email).toLowerCase();

    if (!loginEmail) {
      return jsonResponse(400, { error: 'Email obligatoire.' });
    }

    const adminResult = await getPool().query(
      `
        SELECT id, login_email
        FROM patrick_pitot.admin_user
        WHERE lower(login_email) = $1
          AND is_active IS TRUE
        LIMIT 1
      `,
      [loginEmail],
    );

    const admin = adminResult.rows[0];
    let devMagicLink = null;

    if (admin) {
      const token = randomToken();
      const magicLink = `${siteUrl(event)}/admin/verify?token=${encodeURIComponent(token)}`;
      devMagicLink = magicLink;

      await getPool().query(
        `
          INSERT INTO patrick_pitot.admin_magic_link (
            admin_user_id,
            token_hash,
            requested_email,
            expires_at
          )
          VALUES ($1, $2, $3, now() + interval '15 minutes')
        `,
        [admin.id, sha256(token), loginEmail],
      );

      const emailResult = await sendMagicLinkEmail({ to: admin.login_email, magicLink });

      await getPool().query(
        `
          INSERT INTO patrick_pitot.admin_audit_log (admin_user_id, action, entity_type, meta)
          VALUES ($1, 'admin_magic_link_requested', 'admin_magic_link', $2::jsonb)
        `,
        [admin.id, JSON.stringify({ email_sent: emailResult.sent })],
      );
    }

    return jsonResponse(202, {
      ok: true,
      message:
        'Si cet email est autorisé, un lien magique vient d’être envoyé pour accéder à l’administration.',
      devMagicLink: process.env.RESEND_API_KEY ? undefined : devMagicLink,
    });
  } catch (error) {
    console.error('admin magic link request error', error);
    return jsonResponse(500, { error: 'Impossible de préparer le lien magique.' });
  }
}
