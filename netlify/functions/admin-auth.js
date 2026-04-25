import crypto from 'node:crypto';

import { getPool, jsonResponse } from './db.js';

const SESSION_COOKIE = 'patrick_admin_session';
const SESSION_DAYS = 7;

export function randomToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function siteUrl(event) {
  return (
    process.env.SITE_URL ||
    process.env.URL ||
    `${event.headers['x-forwarded-proto'] || 'http'}://${event.headers.host}`
  );
}

function isLocalHost(event) {
  const host = event.headers.host || '';
  return host.includes('localhost') || host.includes('127.0.0.1');
}

export function sessionCookie(token, event) {
  const secure = isLocalHost(event) ? '' : '; Secure';
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearSessionCookie(event) {
  const secure = isLocalHost(event) ? '' : '; Secure';
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`;
}

export function cookieValue(event, name) {
  const cookie = event.headers.cookie || '';
  const parts = cookie.split(';').map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : '';
}

export async function requireAdmin(event) {
  const token = cookieValue(event, SESSION_COOKIE);
  if (!token) {
    return { error: jsonResponse(401, { error: 'Session admin requise.' }) };
  }

  const result = await getPool().query(
    `
      SELECT
        s.id AS session_id,
        u.id AS admin_user_id,
        u.display_name,
        u.login_email,
        u.role
      FROM patrick_pitot.admin_session s
      JOIN patrick_pitot.admin_user u ON u.id = s.admin_user_id
      WHERE s.session_hash = $1
        AND s.revoked_at IS NULL
        AND s.expires_at > now()
        AND u.is_active IS TRUE
      LIMIT 1
    `,
    [sha256(token)],
  );

  const admin = result.rows[0];
  if (!admin) {
    return { error: jsonResponse(401, { error: 'Session admin invalide ou expirée.' }) };
  }

  await getPool().query('UPDATE patrick_pitot.admin_session SET last_seen_at = now() WHERE id = $1', [
    admin.session_id,
  ]);

  return { admin };
}

export function adminJsonResponse(statusCode, body, headers = {}) {
  return {
    ...jsonResponse(statusCode, body),
    headers: {
      ...jsonResponse(statusCode, body).headers,
      ...headers,
    },
  };
}
