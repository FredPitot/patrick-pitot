import { jsonResponse } from './db.js';
import { requireAdmin } from './admin-auth.js';

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { admin, error } = await requireAdmin(event);
    if (error) {
      return error;
    }

    return jsonResponse(200, {
      admin: {
        displayName: admin.display_name,
        email: admin.login_email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('admin session error', error);
    return jsonResponse(500, { error: 'Impossible de vérifier la session.' });
  }
}
