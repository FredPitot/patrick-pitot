export async function sendMagicLinkEmail({ to, magicLink }) {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: 'RESEND_API_KEY not configured' };
  }

  const from = process.env.MAGIC_LINK_FROM || 'Patrick Pitot <onboarding@resend.dev>';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: 'Votre lien d’administration Patrick Pitot',
      html: `
        <p>Bonjour,</p>
        <p>Voici votre lien de connexion à l’administration Patrick Pitot :</p>
        <p><a href="${magicLink}">${magicLink}</a></p>
        <p>Ce lien expire dans 15 minutes et ne peut être utilisé qu’une seule fois.</p>
      `,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend email failed: ${details}`);
  }

  return { sent: true };
}
