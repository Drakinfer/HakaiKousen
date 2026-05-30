import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';
import { hash } from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanName = (name || '').trim() || null;
    if (!cleanEmail || !password || !cleanName) {
      return NextResponse.json(
        { error: 'Pseudo, Email et mot de passe requis.' },
        { status: 400 },
      );
    }
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Mot de passe trop court (≥ 8 caractères).' },
        { status: 400 },
      );
    }

    const exists = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (exists) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email.' },
        { status: 409 },
      );
    }

    const passwordHash = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        name: cleanName,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error('REGISTER_ERROR:', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
