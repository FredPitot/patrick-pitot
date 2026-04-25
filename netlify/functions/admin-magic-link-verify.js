import { getPool, jsonResponse } from './db.js';
import { randomToken, sessionCookie, sha256 } from './admin-auth.js';

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const token = event.queryStringParameters?.token || '';
  if (!token) {
    return jsonResponse(400, { error: 'Token manquant.' });
  }

  const client = await getPool().connect();

  try {
    await client.query('BEGIN');

    const linkResult = await client.query(
      `
        SELECT
          l.id,
          l.admin_user_id,
          u.display_name,
          u.login_email,
          u.role
        FROM patrick_pitot.admin_magic_link l
        JOIN patrick_pitot.admin_user u ON u.id = l.admin_user_id
        WHERE l.token_hash = $1
          AND l.used_at IS NULL
          AND l.expires_at > now()
          AND u.is_active IS TRUE
        FOR UPDATE
      `,
      [sha256(token)],
    );

    const link = linkResult.rows[0];
    if (!link) {
      await client.query('ROLLBACK');
      return jsonResponse(401, { error: 'Lien magique invalide ou expiré.' });
    }

    await client.query('UPDATE patrick_pitot.admin_magic_link SET used_at = now() WHERE id = $1', [
      link.id,
    ]);

    const sessionToken = randomToken();
    await client.query(
      `
        INSERT INTO patrick_pitot.admin_session (
          admin_user_id,
          session_hash,
          expires_at,
          last_seen_at
        )
        VALUES ($1, $2, now() + interval '7 days', now())
      `,
      [link.admin_user_id, sha256(sessionToken)],
    );

    await client.query(
      `
        UPDATE patrick_pitot.admin_user
        SET last_login_at = now()
        WHERE id = $1
      `,
      [link.admin_user_id],
    );

    await client.query(
      `
        INSERT INTO patrick_pitot.admin_audit_log (admin_user_id, action, entity_type, meta)
        VALUES ($1, 'admin_magic_link_verified', 'admin_session', '{}'::jsonb)
      `,
      [link.admin_user_id],
    );

    await client.query('COMMIT');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': sessionCookie(sessionToken, event),
      },
      body: JSON.stringify({
        admin: {
          displayName: link.display_name,
          email: link.login_email,
          role: link.role,
        },
      }),
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('admin magic link verify error', error);
    return jsonResponse(500, { error: 'Impossible de vérifier le lien magique.' });
  } finally {
    client.release();
  }
}
