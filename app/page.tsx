'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/upgrades').then(r => r.json()).then(setRows).catch(()=>setRows([]));
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>StreetSignals</h1>
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Ticker</th>
            <th>Firm</th>
            <th>Old</th>
            <th>New</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.ticker}</td>
              <td>{r.firm}</td>
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
