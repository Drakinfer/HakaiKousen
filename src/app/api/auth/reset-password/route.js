import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Payload invalide' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Mot de passe trop court (min 8)' },
        { status: 400 },
      );
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      !user.resetTokenHash ||
      !user.resetTokenExpiresAt ||
      user.resetTokenHash !== tokenHash ||
      user.resetTokenExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: 'Lien invalide ou expiré' },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
      },
    });

    return NextResponse.json(
      { message: 'Mot de passe mis à jour' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation' },
      { status: 500 },
    );
  }
}
