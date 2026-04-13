import { NextResponse } from 'next/server';

const API_KEY = process.env.FINNHUB_API_KEY;

const SYMBOLS = [
  { ticker: 'SPIR', sector: 'Space' },
  { ticker: 'MRVL', sector: 'AI' },
  { ticker: 'ANET', sector: 'AI' },
  { ticker: 'PLTR', sector: 'AI' },
  { ticker: 'RKLB', sector: 'Space' },
  { ticker: 'AVAV', sector: 'Drones' }
];

function round(value: number) {
  return Math.round(value * 100) / 100;
}

export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'Missing FINNHUB_API_KEY' }, { status: 500 });
    }

    const results: any[] = [];

    for (const item of SYMBOLS) {
      const pt = await fetch(
        `https://finnhub.io/api/v1/stock/price-target?symbol=${item.ticker}&token=${API_KEY}`,
        { cache: 'no-store' }
      ).then((r) => r.json());

      const newPT = Number(pt?.targetMean ?? pt?.targetMedian ?? 0);
      if (!newPT || Number.isNaN(newPT)) continue;

      const oldPTRaw = Number(pt?.targetLow ?? 0);
      const oldPT = oldPTRaw && oldPTRaw < newPT ? oldPTRaw : round(newPT * 0.8);
      const raiseDollar = round(newPT - oldPT);
      const raisePct = oldPT > 0 ? round((raiseDollar / oldPT) * 100) : 0;

      results.push({
        id: item.ticker,
        date: new Date().toISOString().slice(0, 10),
        ticker: item.ticker,
        company: item.ticker,
        sector: item.sector,
        subSegment: 'Finnhub Consensus Snapshot',
        firm: 'Finnhub Consensus',
        action: 'Consensus PT Snapshot',
        oldPT,
        newPT: round(newPT),
        raiseDollar,
        raisePct,
      });
    }

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to load live upgrades',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
