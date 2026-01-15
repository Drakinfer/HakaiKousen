import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email, resetUrl) {
  const result = await resend.emails.send({
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p><a href="${resetUrl}">Cliquez ici pour choisir un nouveau mot de passe</a></p>
      <p>Ce lien est valable 30 minutes.</p>
      <p>Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p>
    `,
  });

  if (result.error) {
    console.error('RESEND ERROR:', result.error);
    throw new Error(result.error.message || 'Resend send failed');
  }

  console.log('RESEND OK');
  return result;
}
