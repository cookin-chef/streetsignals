import { NextResponse } from 'next/server';

const API_KEY = process.env.FINNHUB_API_KEY;

export async function GET() {
  if (!API_KEY) return NextResponse.json({error:'Missing key'});

  const symbols = ['SPIR','MRVL','ANET'];
  const results:any[] = [];

  for (const s of symbols) {
    const pt = await fetch(`https://finnhub.io/api/v1/stock/price-target?symbol=${s}&token=${API_KEY}`).then(r=>r.json());

    if (pt.targetMean) {
      results.push({
        id: s,
        date: new Date().toISOString().slice(0,10),
        ticker: s,
        firm: 'Finnhub Consensus',
        oldPT: pt.targetLow,
        newPT: pt.targetMean,
        raisePct: (((pt.targetMean - pt.targetLow)/pt.targetLow)*100).toFixed(1)
      });
    }
  }

  return NextResponse.json(results);
}