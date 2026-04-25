import { getPool, jsonResponse } from './db.js';
import { requireAdmin } from './admin-auth.js';

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { error } = await requireAdmin(event);
    if (error) {
      return error;
    }

    const [contacts, customOrders] = await Promise.all([
      getPool().query(
        `
          SELECT
            id,
            customer_name,
            customer_email,
            customer_phone,
            subject,
            message,
            status,
            created_at
          FROM patrick_pitot.contact_request
          ORDER BY created_at DESC
          LIMIT 100
        `,
      ),
      getPool().query(
        `
          SELECT
            r.id,
            r.customer_name,
            r.customer_email,
            r.customer_phone,
            r.intended_use,
            r.engraving_text,
            r.message,
            r.status,
            r.created_at,
            m.name AS material_name
          FROM patrick_pitot.custom_order_request r
          LEFT JOIN patrick_pitot.material m ON m.id = r.preferred_material_id
          ORDER BY r.created_at DESC
          LIMIT 100
        `,
      ),
    ]);

    return jsonResponse(200, {
      contacts: contacts.rows,
      customOrders: customOrders.rows,
    });
  } catch (error) {
    console.error('admin requests error', error);
    return jsonResponse(500, { error: 'Impossible de lire les demandes.' });
  }
}
