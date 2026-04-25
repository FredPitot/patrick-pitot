import { cleanText, getPool, jsonResponse, parseJsonBody } from './db.js';

const materialSlugsByName = {
  'bois naturel': 'bois-naturel',
  'bois stabilisé': 'bois-stabilise',
  'bois stabilise': 'bois-stabilise',
  micarta: 'micarta',
};

function splitContact(contact) {
  if (contact.includes('@')) {
    return { customerEmail: contact, customerPhone: '' };
  }

  return { customerEmail: '', customerPhone: contact };
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const pool = getPool();

  try {
    const body = parseJsonBody(event);
    const customerName = cleanText(body.customerName);
    const contact = cleanText(body.contact);
    const message = cleanText(body.message);
    const intendedUse = cleanText(body.intendedUse);
    const engravingText = cleanText(body.engravingText);
    const materialName = cleanText(body.material).toLowerCase();
    const materialSlug = materialSlugsByName[materialName] || '';

    if (!customerName || !contact || !message) {
      return jsonResponse(400, {
        error: 'Le nom, le contact et le message sont obligatoires.',
      });
    }

    const { customerEmail, customerPhone } = splitContact(contact);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const materialResult = materialSlug
        ? await client.query('SELECT id FROM patrick_pitot.material WHERE slug = $1', [
            materialSlug,
          ])
        : { rows: [] };
      const materialId = materialResult.rows[0]?.id || null;

      const customOrderResult = await client.query(
        `
          INSERT INTO patrick_pitot.custom_order_request (
            preferred_material_id,
            customer_name,
            customer_email,
            customer_phone,
            intended_use,
            engraving_text,
            message
          )
          VALUES ($1, $2, NULLIF($3, ''), NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''), $7)
          RETURNING id, status, created_at
        `,
        [
          materialId,
          customerName,
          customerEmail,
          customerPhone,
          intendedUse,
          engravingText,
          message,
        ],
      );

      await client.query(
        `
          INSERT INTO patrick_pitot.contact_request (
            customer_name,
            customer_email,
            customer_phone,
            subject,
            message,
            source
          )
          VALUES ($1, NULLIF($2, ''), NULLIF($3, ''), $4, $5, 'custom_order_form')
        `,
        [
          customerName,
          customerEmail,
          customerPhone,
          'Demande de couteau sur mesure',
          message,
        ],
      );

      await client.query('COMMIT');

      return jsonResponse(201, {
        customOrderRequest: customOrderResult.rows[0],
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('custom-order function error', error);
    return jsonResponse(error.statusCode || 500, {
      error: 'Impossible d’enregistrer la demande pour le moment.',
    });
  }
}
