'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/upgrades').then(r => r.json()).then(setData);
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>StreetSignals</h1>
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Date</th><th>Ticker</th><th>Old</th><th>New</th><th>%</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.ticker}</td>
              <td>{r.oldPT}</td>
              <td>{r.newPT}</td>
              <td>{r.raisePct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
