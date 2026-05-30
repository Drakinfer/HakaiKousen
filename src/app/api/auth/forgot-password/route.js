import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { generateResetToken } from '@/lib/resetToken';
import { sendResetEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { email } = await req.json();

    const ok = NextResponse.json(
      { message: 'Si cet email existe, un lien a été envoyé.' },
      { status: 200 },
    );

    if (!email || typeof email !== 'string') return ok;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) return ok;

    const { token, tokenHash } = generateResetToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    const resetUrl = `${
      process.env.APP_URL
    }/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await sendResetEmail(email, resetUrl);

    return ok;
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la demande de reset' },
      { status: 500 },
    );
  }
}
