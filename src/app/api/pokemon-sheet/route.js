import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const raw = url.searchParams.get('data');

    let pokemon = JSON.parse(raw);
    console.log(pokemon);

    if (typeof pokemon === 'string') {
      try {
        pokemon = JSON.parse(pokemon);
      } catch (e) {
        console.error('Error parsing pokemon JSON string:', e);
      }
    }

    if (!pokemon) {
      return NextResponse.json(
        { error: 'Missing pokemon data' },
        { status: 400 },
      );
    }

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const fontPath = path.join(
      process.cwd(),
      'public',
      'fonts',
      'DejaVuSans.ttf',
    );
    const fontBytes = fs.readFileSync(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    const drawText = (text, x, y, size = 12, options = {}) => {
      page.drawText(String(text), {
        x,
        y,
        size,
        font,
        color: options.color ?? rgb(0, 0, 0),
      });
    };

    let cursorY = height - 60;

    drawText(`Fiche Pokémon : ${pokemon.name ?? 'Inconnu'}`, 50, cursorY, 22);
    cursorY -= 30;

    drawText(`Niveau : ${pokemon.lvl ?? '?'}`, 50, cursorY);
    cursorY -= 16;
    drawText(`Sexe : ${pokemon.sex ?? '—'}`, 50, cursorY);
    cursorY -= 16;
    drawText(`Nature : ${pokemon.nature ?? '—'}`, 50, cursorY);
    cursorY -= 16;
    drawText(`Sous-nature : ${pokemon.subNature ?? '—'}`, 50, cursorY);
    cursorY -= 16;
    drawText(`Talent : ${pokemon.talent ?? '—'}`, 50, cursorY);
    cursorY -= 16;
    drawText(`Shiny : ${pokemon.shiny ? 'Oui ✨' : 'Non'}`, 50, cursorY);
    cursorY -= 16;
    drawText(`Baron : ${pokemon.baron ? 'Oui 🟥' : 'Non'}`, 50, cursorY);
    cursorY -= 28;

    const stats = pokemon.stats ?? {};
    const base = stats.base ?? {};
    const ivs = stats.ivs ?? {};
    const evs = stats.evs ?? {};
    const evsLevel = stats.evsLevel ?? {};

    const STAT_KEYS = ['VITA', 'DEX', 'FOR', 'CONC', 'END', 'VOL'];

    drawText('Stats', 50, cursorY, 16);
    cursorY -= 20;

    drawText('Stat', 50, cursorY);
    drawText('Base', 120, cursorY);
    drawText('IVs', 180, cursorY);
    drawText('EVs', 240, cursorY);
    drawText('EVs lvl', 300, cursorY);
    cursorY -= 14;

    STAT_KEYS.forEach((key) => {
      if (cursorY < 60) {
        cursorY = height - 60;
      }

      drawText(key, 50, cursorY);
      drawText(base[key] ?? 0, 120, cursorY);
      drawText(ivs[key] ?? 0, 180, cursorY);
      drawText(evs[key] ?? 0, 240, cursorY);
      drawText(evsLevel[key] ?? 0, 300, cursorY);
      cursorY -= 14;
    });

    const pdfBytes = await pdfDoc.save();

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-') // évite les caractères non valides dans les noms de fichiers
      .replace('T', '_')
      .replace('Z', '');

    const filename = `fiche_pokemon_${pokemon.name}_${timestamp}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('Error generating PDF:', err);
    return NextResponse.json(
      { error: 'Error generating PDF' },
      { status: 500 },
    );
  }
}
