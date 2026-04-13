export default async function Page() {
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/upgrades', { cache: 'no-store' });
  const data = await res.json();

  return (
    <main style={{padding:20, fontFamily:'sans-serif'}}>
      <h1>StreetSignals</h1>
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Date</th><th>Ticker</th><th>Firm</th><th>Old</th><th>New</th><th>%</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r:any)=> (
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