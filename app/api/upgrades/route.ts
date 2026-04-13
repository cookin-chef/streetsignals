export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

const API_KEY = process.env.FINNHUB_API_KEY;
const SYMBOLS = ['SPIR','MRVL','ANET','PLTR','RKLB','AVAV'];

function parseUpgrade(text: string) {
  const patterns = [
    /raised(?: .*?)? price target from \$?(\d+(?:\.\d+)?) to \$?(\d+(?:\.\d+)?)/i,
    /price target (?:raised|boosted|lifted|increased|hiked) to \$?(\d+(?:\.\d+)?) from \$?(\d+(?:\.\d+)?)/i,
    /target (?:raised|boosted|lifted|increased|hiked) to \$?(\d+(?:\.\d+)?) from \$?(\d+(?:\.\d+)?)/i,
    /upgraded .*? price target from \$?(\d+(?:\.\d+)?) to \$?(\d+(?:\.\d+)?)/i,
    /upgraded .*? target to \$?(\d+(?:\.\d+)?) from \$?(\d+(?:\.\d+)?)/i,
    /to \$?(\d+(?:\.\d+)?) from \$?(\d+(?:\.\d+)?)/i
  ];

  for (const re of patterns) {
    const m = text.match(re);
    if (!m) continue;

    let oldPT: number;
    let newPT: number;

    if (re.source.startsWith('raised') || re.source.includes('from \\$?')) {
      oldPT = Number(m[1]);
      newPT = Number(m[2]);
    } else {
      newPT = Number(m[1]);
      oldPT = Number(m[2]);
    }

    if (!oldPT || !newPT || newPT <= oldPT) continue;

    return {
      oldPT,
      newPT,
      raisePct: ((newPT - oldPT) / oldPT * 100).toFixed(1)
    };
  }

  return null;
}

function parseFirm(text: string) {
  const firms = [
    'Barclays','Citi','Citigroup','Morgan Stanley','Goldman Sachs','UBS','JPMorgan',
    'Canaccord Genuity','Cantor Fitzgerald','Rosenblatt','Mizuho','Wells Fargo',
    'Needham','Benchmark','Stifel','Jefferies','Baird','Daiwa','TD Cowen','Piper Sandler'
  ];
  const lower = text.toLowerCase();
  return firms.find(f => lower.includes(f.toLowerCase())) || 'Unknown';
}

export async function GET() {
  try {
    if (!API_KEY) return NextResponse.json([]);

    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - 15);

    const from = fromDate.toISOString().slice(0,10);
    const to = now.toISOString().slice(0,10);

    const results:any[] = [];

    for (const symbol of SYMBOLS) {
      const res = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${API_KEY}`, { cache: 'no-store' });
      const news = await res.json();

      if (!Array.isArray(news)) continue;

      for (const item of news) {
        const text = `${item?.headline || ''} ${item?.summary || ''}`.trim();
        const parsed = parseUpgrade(text);
        if (!parsed) continue;

        results.push({
          id: `${symbol}-${item?.id || Math.random()}`,
          date: new Date((item?.datetime || 0) * 1000).toISOString().slice(0,10),
          ticker: symbol,
          firm: parseFirm(text),
          oldPT: parsed.oldPT,
          newPT: parsed.newPT,
          raisePct: parsed.raisePct
        });
      }
    }

    const deduped = Array.from(new Map(results.map(r => [`${r.ticker}|${r.firm}|${r.date}|${r.oldPT}|${r.newPT}`, r])).values());
    return NextResponse.json(deduped);
  } catch {
    return NextResponse.json([]);
  }
}
