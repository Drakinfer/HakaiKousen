import React from 'react';
import { toFr } from '@/lib/types'; 


function textOrEmpty(value) {
  if (value === undefined || value === null) return '';
  const s = String(value);
  return s;
}

function Line({ value }) {
  return (
    <div className="line">
      <span className="line__text">{textOrEmpty(value)}</span>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="field">
      <div className="field__label">{label}</div>
      <Line value={value} />
    </div>
  );
}

function SmallBox({ label, value }) {
  return (
    <div className="smallbox">
      <div className="smallbox__label">{label}</div>
      <div className="smallbox__value">{textOrEmpty(value)}</div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div className="section-title">{children}</div>;
}

function Table({ columns, rows, className = '' }) {
  return (
    <table className={`tbl ${className}`}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={c.style}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => (
          <tr key={idx}>
            {columns.map((c) => (
              <td key={c.key} style={c.style} className={c.tdClassName}>
                {r[c.key] ?? ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function clampArr(arr) {
  return Array.isArray(arr) ? arr : [];
}

function typeLabel(t) {
  if (!t) return '';
  return toFr(t.name);
}

export default function PokemonSheet({ generated, pokemon }) {
  const p = pokemon ?? {};
  const g = generated ?? {};

  const pokemonName = p?.pokemon?.name ?? g?.name ?? '';

  const t1 = p?.types?.type1 ?? null;
  const t2 = p?.types?.type2 ?? null;
  const typesText = [typeLabel(t1), typeLabel(t2)].filter(Boolean).join(' / ');

  const chosenTalent = pokemon.talentsLinks
  ?.find(t => t?.talent?.name === generated.talent)
  ?.talent;

  const chosenTalentDesc = chosenTalent?.desc ?? '';

  const sizeWeightText = [
    p?.height !== undefined && p?.height !== null ? `${p.height} m` : '',
    p?.weight !== undefined && p?.weight !== null ? `${p.weight} kg` : '',
  ]
    .filter(Boolean)
    .join(' / ');

  const stats = g?.stats ?? {};
  const base = stats.base ?? {};
  const iv = stats.ivs ?? {};
  const ev = stats.evs ?? {};

  const statOrder = [
    { key: 'DEX', label: 'DEX' },
    { key: 'FOR', label: 'FOR' },
    { key: 'CONC', label: 'CON' },
    { key: 'END', label: 'END' },
    { key: 'VOL', label: 'VOL' },
    { key: 'VITA', label: 'VITA' },
    { key: 'ENE', label: 'ENE' },
  ];

  const statRows = statOrder.map((s) => ({
    stat: <strong>{s.label}</strong>,
    base: base?.[s.key] ?? '',
    ev: ev?.[s.key] ?? '',
    iv: iv?.[s.key] ?? '',
    nature: '',
    total: '',
    temp: '',
    mega: '',
  }));

  const competences = clampArr(p?.pokemon.competences).slice(0, 7);
  const competenceRows = Array.from({ length: 7 }).map((_, i) => {
    const row = competences[i] ?? {};
    return {
      name: row?.competence?.name ?? '',
      lvl: row.points ?? '',
    };
  });

  const lvlAttacks = clampArr(p?.attaques?.lvl).slice(0, 10);
  const moveRows = Array.from({ length: 10 }).map((_, i) => {
    const a = lvlAttacks[i]?.attaque ?? null;
    return {
      lvl: lvlAttacks[i]?.learningWay ?? '',
      name: a?.name ?? '',
      ene: a?.energy ?? a?.ene ?? '',
      type: a?.type ?? '',
      classe: a?.category ?? '',
      portee: a?.range ?? '',
      precision: a?.precision ?? '',
      degats: a?.damage ?? '',
      effet: a?.effect ?? '',
    };
  });

  const sens = p?.sensitivities ?? p?.sensibilites ?? {};
  const typeGrid = [
    ['Acier', 'Combat', 'Dragon', 'Eau'],
    ['Électrik', 'Fée', 'Feu', 'Glace'],
    ['Insecte', 'Normal', 'Plante', 'Poison'],
    ['Psy', 'Roche', 'Sol', 'Spectre'],
    ['Ténèbres', 'Vol'],
  ];

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <style>{`
          :root{
            --accent-blue: #8faadc;
            --accent-blue-dark: #5b7dbb;
            --ink: #111;
          }
          @page { size: A4; margin: 10mm; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #111;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 0;
          }
          .page + .page {
            page-break-before: always;
          }

          .h1 {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: .5px;
            text-transform: uppercase;
            color: var(--accent-blue-dark)
          }
          .h2 {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: .6px;
          }

          .row { display: flex; gap: 10px; }
          .col { display: flex; flex-direction: column; gap: 8px; }
          .grow { flex: 1; }

          .box { border: 1.5px solid var(--accent-blue); }
          .box--tight { padding: 6px 8px; }

          .section { margin-top: 8px; }
          .section-title {
            margin: 6px 0 4px;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: .6px;
            color: var(--accent-blue-dark);
          }

          .field {
            display: grid;
            grid-template-columns: 70px 1fr;
            gap: 8px;
            align-items: center;
          }
          .field__label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .line {
            position: relative;
            display: flex;
            align-items: center;
            min-height: 14px;
          }
          .line__text {
            font-size: 11px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-right: 6px;
            min-width: 0;
          }
          .line__rule {
            flex: 1;
            border-bottom: 1px solid #000;
            transform: translateY(6px);
          }

          .smallbox {
            border: 1.5px solid  var(--accent-blue);
            border-radius: 10px;
            padding: 6px 8px;
            min-height: 32px;
          }
          .smallbox__label {
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            line-height: 1.1;
          }
          .smallbox__value {
            margin-top: 2px;
            font-size: 12px;
            font-weight: 800;
          }

          .top {
            display: grid;
            grid-template-columns: 1fr 58mm;
            gap: 10px;
            align-items: start;
          }
          .header-left .h1 { margin-bottom: 6px; }
          .header-right {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .header-right .smallbox { min-height: 42px; }

          .desc-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 6px 10px;
          }
          .desc-grid .field { grid-template-columns: 64px 1fr; }

          .mid {
            display: grid;
            grid-template-columns: 1fr 78mm;
            gap: 10px;
          }

          .tbl {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 10px;
          }
          .tbl th, .tbl td {
            border: 1px solid var(--accent-blue);
            padding: 4px 4px;
            vertical-align: middle;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .tbl th {
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: .4px;
            background: #fff;
          }
          .tbl--stats th, .tbl--stats td { text-align: center; }
          .tbl--stats th:first-child, .tbl--stats td:first-child {
            text-align: left;
            width: 18%;
          }

          .tbl--skills th:nth-child(1) { width: 80%; }
          .tbl--skills th:nth-child(2) { width: 20%; text-align:center; }
          .tbl--skills td:nth-child(2) { text-align:center; }

          .sens-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
          }
          .sens-grid--two { grid-template-columns: repeat(2, 1fr); }
          .sens-item {
            padding: 4px 6px;
            border-radius: 6px;
              border-width: 2px;
  border-style: solid;
  background: transparent;
            display: flex;
            justify-content: space-between;
            gap: 6px;
            font-size: 10px;
          }
          .sens-name { font-weight: 800; text-transform: uppercase; }
          .sens-val { font-weight: 800; }

.sens-grid:nth-of-type(1) .sens-item:nth-child(1){ border-color:#7f8c8d; }
.sens-grid:nth-of-type(1) .sens-item:nth-child(2){ border-color:#a0522d; } 
.sens-grid:nth-of-type(1) .sens-item:nth-child(3){ border-color:#6d28d9; } 
.sens-grid:nth-of-type(1) .sens-item:nth-child(4){ border-color:#2563eb; } 

.sens-grid:nth-of-type(2) .sens-item:nth-child(1){ border-color:#f59e0b; }
.sens-grid:nth-of-type(2) .sens-item:nth-child(2){ border-color:#ec4899; } 
.sens-grid:nth-of-type(2) .sens-item:nth-child(3){ border-color:#ef4444; } 
.sens-grid:nth-of-type(2) .sens-item:nth-child(4){ border-color:#38bdf8; } 

.sens-grid:nth-of-type(3) .sens-item:nth-child(1){ border-color:#84cc16; } 
.sens-grid:nth-of-type(3) .sens-item:nth-child(2){ border-color:#9ca3af; } 
.sens-grid:nth-of-type(3) .sens-item:nth-child(3){ border-color:#22c55e; } 
.sens-grid:nth-of-type(3) .sens-item:nth-child(4){ border-color:#a855f7; }

.sens-grid:nth-of-type(4) .sens-item:nth-child(1){ border-color:#fb7185; }
.sens-grid:nth-of-type(4) .sens-item:nth-child(2){ border-color:#b45309; }
.sens-grid:nth-of-type(4) .sens-item:nth-child(3){ border-color:#d97706; }
.sens-grid:nth-of-type(4) .sens-item:nth-child(4){ border-color:#4f46e5; }

.sens-grid--two .sens-item:nth-child(1){ border-color:#111827; }
.sens-grid--two .sens-item:nth-child(2){ border-color:#60a5fa; }

          .tbl--moves th:nth-child(1) { width: 15%; }
          .tbl--moves th:nth-child(2) { width: 15%; text-align:center; }
          .tbl--moves th:nth-child(3) { width: 10%; text-align:center; }
          .tbl--moves th:nth-child(4) { width: 10%; text-align:center; }
          .tbl--moves th:nth-child(5) { width: 15%; text-align:center; }
          .tbl--moves th:nth-child(6) { width: 15%; text-align:center; }
          .tbl--moves th:nth-child(7) { width: 10%; text-align:center; }
          .tbl--moves th:nth-child(8) { width: 10%; }

          .bottom {
            display: grid;
            grid-template-columns: 1fr 70mm;
            gap: 10px;
            margin-top: 8px;
          }
        `}</style>
      </head>

      <body>
        <div className="page">
          <div className="top">
            <div className="header-left">
              <div className="h1">Fiche Pokémon</div>

              <div className="box">
                <div className="row">
                  <div className="grow">
                    <Field label="Joueur" value="" />
                  </div>
                  <div className="grow">
                    <Field label="Pokémon" value={pokemonName} />
                  </div>
                </div>
              </div>
            </div>

            <div className="header-right">
              <SmallBox label="Points d’Experience" value={g?.xp ?? ''} />
              <SmallBox label="Niveau" value={g?.lvl ?? ''} />
            </div>
          </div>

          <div className="section">
            <SectionTitle>Description</SectionTitle>
            <div className="box">
              <div className="desc-grid">
                <Field label="Surnom" value={g?.nickname ?? ''} />
                <Field label="Famille" value={p?.pokemon?.category ?? ''} />
                <Field label="Dresseur" value={g?.trainer ?? ''} />

                <Field label="Baie" value={g?.berry ?? ''} />
                <Field label="Provenance" value={g?.origin ?? ''} />
                <Field label="Nature" value={g?.nature + ' / ' + g?.subNature ?? ''} />

                <Field label="Type" value={typesText} />
                <Field label="Taille-Poids" value={sizeWeightText} />
                <Field label="Genre" value={g?.sex  ?? ''} />
              </div>

              <div style={{ height: 8 }} />

              <div className="row">
                <div className="grow">
                  <Field label="Objet tenu" value={g?.heldItem ?? ''} />
                </div>
                <div className="grow">
                  <Field label="Talent" value={g?.talent ?? ''} />
                </div>
              </div>
              <div style={{ height: 8 }} />
              <div className="row">
                <div className="grow">
                  <Field label="Description Talent" value={chosenTalentDesc} />
                </div>
                <div style={{ width: '56mm' }}>
                  <SmallBox label="Shiny" value={g?.shiny === true ? 'Oui' : g?.shiny === false ? 'Non' : ''} />
                  <SmallBox label="Baron" value={g?.baron === true ? 'Oui' : g?.baron === false ? 'Non' : ''} />
                </div>
            </div>
              </div>

              
          </div>

          <div className="section mid">
            <div>
              <SectionTitle>Stats</SectionTitle>
              <div className="box box--tight">
                <Table
                  className="tbl--stats"
                  columns={[
                    { key: 'stat', label: 'Stats' },
                    { key: 'base', label: 'Base' },
                    { key: 'iv', label: 'IV' },
                    { key: 'ev', label: 'EV' },
                    { key: 'evLevels', label: 'EV Level' },
                    { key: 'nature', label: 'Nature' },
                    { key: 'total', label: 'Total' },
                    { key: 'temp', label: 'Temp' },
                    { key: 'mega', label: 'Mega' },
                  ]}
                  rows={statRows}
                />
              </div>
            </div>

            <div>
              <SectionTitle>Compétences</SectionTitle>
              <div className="box box--tight">
                <Table
                  className="tbl--skills"
                  columns={[
                    { key: 'name', label: 'Compétence' },
                    { key: 'lvl', label: 'Points', style: { textAlign: 'center' } },
                  ]}
                  rows={competenceRows}
                />
              </div>
            </div>
          </div>

          <div className="bottom">
            <div>
              <SectionTitle>Sensibilités</SectionTitle>
                <div className="col" style={{ gap: 6 }}>
                  {typeGrid.slice(0, 4).map((row, idx) => (
                    <div className="sens-grid" key={idx}>
                      {row.map((t) => (
                        <div className="sens-item" key={t}>
                          <span className="sens-name">{t}</span>
                          <span className="sens-val">{sens?.[t] ?? ''}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="sens-grid sens-grid--two">
                    {typeGrid[4].map((t) => (
                      <div className="sens-item" key={t}>
                        <span className="sens-name">{t}</span>
                        <span className="sens-val">{sens?.[t] ?? ''}</span>
                      </div>
                    ))}
                  </div>
                </div>

              <div style={{ height: 8 }} />

              <SectionTitle>Capacités connues</SectionTitle>
              <div className="box box--tight">
                <Table
                  className="tbl--moves"
                  columns={[
                    { key: 'name', label: 'Nom' },
                    { key: 'lvl', label: 'Niveau' },
                    { key: 'ene', label: 'ENE', style: { textAlign: 'center' } },
                    { key: 'type', label: 'Type', style: { textAlign: 'center' } },
                    { key: 'classe', label: 'Catégorie', style: { textAlign: 'center' } },
                    { key: 'portee', label: 'Portée', style: { textAlign: 'center' } },
                    { key: 'precision', label: 'Précision', style: { textAlign: 'center' } },
                    { key: 'degats', label: 'Dégâts', style: { textAlign: 'center' } },
                    { key: 'effet', label: 'Effet' },
                  ]}
                  rows={moveRows}
                />
              </div>
            </div>

            <div>
              <SectionTitle>Goûts</SectionTitle>
              <div className="box">
                <Field label="Favori" value={g?.favoriteTaste ?? ''} />
                <div style={{ height: 8 }} />
                <Field label="Hait" value={g?.hatedTaste ?? ''} />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
