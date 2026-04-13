import { NextResponse } from 'next/server';

const API_KEY = process.env.FINNHUB_API_KEY;
const SYMBOLS = ['SPIR','MRVL','ANET','PLTR','RKLB','AVAV'];

function extract(text: string) {
  const m = text.match(/from \$?(\d+\.?\d*) to \$?(\d+\.?\d*)/i);
  if (!m) return null;
  const oldPT = Number(m[1]);
  const newPT = Number(m[2]);
  if (newPT <= oldPT) return null;
  return { oldPT, newPT, raisePct: ((newPT-oldPT)/oldPT*100).toFixed(1) };
}

export async function GET() {
  const results:any[] = [];

  for (const s of SYMBOLS) {
    const news = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${s}&from=2026-04-01&to=2026-04-13&token=${API_KEY}`).then(r=>r.json());

    for (const item of news) {
      const text = (item.headline||'') + ' ' + (item.summary||'');
      const u = extract(text);
      if (!u) continue;

      results.push({
        id: s + item.id,
        date: new Date(item.datetime*1000).toISOString().slice(0,10),
        ticker: s,
        oldPT: u.oldPT,
        newPT: u.newPT,
        raisePct: u.raisePct
      });
    }
  }

  return NextResponse.json(results);
}
