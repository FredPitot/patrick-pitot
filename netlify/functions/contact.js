import { cleanText, getPool, jsonResponse, parseJsonBody } from './db.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const body = parseJsonBody(event);
    const customerName = cleanText(body.customerName);
    const customerEmail = cleanText(body.customerEmail);
    const customerPhone = cleanText(body.customerPhone);
    const subject = cleanText(body.subject) || 'Message depuis le site';
    const message = cleanText(body.message);

    if (!customerName || !message) {
      return jsonResponse(400, { error: 'Le nom et le message sont obligatoires.' });
    }

    const result = await getPool().query(
      `
        INSERT INTO patrick_pitot.contact_request (
          customer_name,
          customer_email,
          customer_phone,
          subject,
          message,
          source
        )
        VALUES ($1, NULLIF($2, ''), NULLIF($3, ''), $4, $5, 'website')
        RETURNING id, status, created_at
      `,
      [customerName, customerEmail, customerPhone, subject, message],
    );

    return jsonResponse(201, { contactRequest: result.rows[0] });
  } catch (error) {
    console.error('contact function error', error);
    return jsonResponse(error.statusCode || 500, {
      error: 'Impossible d’enregistrer le message pour le moment.',
    });
  }
}
