import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import path from 'path';

import prisma from '../../../../lib/prisma';
import PokemonSheet from '../../../../public/templates/PokemonSheet';

export const runtime = 'nodejs';
export const maxDuration = 60;

function safeFilename(name) {
  return String(name ?? 'pokemon').replace(/[^\w\-]+/g, '_');
}

async function getBrowserLaunchOptions() {
  const isVercel = !!process.env.VERCEL;

  if (isVercel) {
    const executablePath = await chromium.executablePath(
      path.join(process.cwd(), 'node_modules', '@sparticuz', 'chromium', 'bin'),
    );

    return {
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    };
  }

  const localPath = process.env.CHROME_EXECUTABLE_PATH;
  if (!localPath) {
    throw new Error(
      'Missing CHROME_EXECUTABLE_PATH in .env.local. Example: C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
    );
  }

  return {
    executablePath: localPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
}

function buildPokemonGenerationPayload(pg) {
  return {
    pokemonGeneration: {
      id: pg.id,
      pokemonId: pg.pokemonId,
      generationId: pg.generationId,
      height: pg.height,
      weight: pg.weight,
      breedRating: pg.breedRating,
      stats: {
        vita: pg.vita,
        dex: pg.dex,
        for: pg.for,
        conc: pg.conc,
        end: pg.end,
        vol: pg.vol,
      },
      types: {
        type1: pg.type1,
        type2: pg.type2,
      },
      attaques: {
        breeding: pg.attaquesBreeding,
        lvl: pg.attaquesLvl,
      },
      talentsLinks: pg.talentsLinks,
      pokemon: {
        id: pg.pokemon.id,
        name: pg.pokemon.name,
        category: pg.pokemon.category,
        dexNumber: pg.pokemon.dexNumber,
        mainPicture: pg.pokemon.mainPicture,
        miniPicture: pg.pokemon.miniPicture,
        competences: pg.pokemon.pokemonHasCompetences,
        locations: pg.pokemon.pokemonHasLocations,
      },
    },
  };
}

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { pgId, data } = body ?? {};

    if (pgId === undefined || pgId === null || pgId === '') {
      return NextResponse.json(
        { error: "L'identifiant du PokémonGeneration est requis (pgId)." },
        { status: 400 },
      );
    }

    const id = Number(pgId);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        {
          error: '"pgId" doit être un nombre (ou une string numérique) valide.',
        },
        { status: 400 },
      );
    }

    if (data === undefined) {
      return NextResponse.json(
        { error: 'Missing generated data (data).' },
        { status: 400 },
      );
    }

    const pg = await prisma.pokemonGeneration.findUnique({
      where: { id },
      include: {
        pokemon: {
          include: {
            pokemonHasCompetences: { include: { competence: true } },
          },
        },
        type1: true,
        type2: true,
        attaquesBreeding: { include: { attaque: true } },
        attaquesLvl: { include: { attaque: true } },
        talentsLinks: {
          include: { talent: { include: { talentGenerations: true } } },
        },
      },
    });

    if (!pg) {
      return NextResponse.json(
        { error: 'Aucun PokémonGeneration trouvé pour cet identifiant.' },
        { status: 404 },
      );
    }

    const payload = buildPokemonGenerationPayload(pg);

    const React = (await import('react')).default;
    const { renderToStaticMarkup } = await import('react-dom/server');

    const html = renderToStaticMarkup(
      React.createElement(PokemonSheet, {
        generated: data,
        pokemon: payload.pokemonGeneration,
      }),
    );

    const browser = await puppeteer.launch(await getBrowserLaunchOptions());

    const page = await browser.newPage();
    await page.setContent('<!doctype html>' + html, { waitUntil: 'load' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
    });

    await page.close();
    await browser.close();

    const filename = `fiche_pokemon_${safeFilename(
      payload?.pokemonGeneration?.pokemon?.name ?? 'pokemon',
    )}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Filename': filename,
      },
    });
  } catch (err) {
    console.error('[POST /api/pokemon-sheet] Error:', err);
    return NextResponse.json(
      { error: String(err?.message ?? err ?? 'Error generating PDF') },
      { status: 500 },
    );
  }
}
