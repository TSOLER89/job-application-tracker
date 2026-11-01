import { applicationStatistics } from '../utils/applicationStatistics'

const metrics = [
  ['Intresserad', 'Intresserad', '#64748b'],
  ['Ansökta', 'Ansökt', '#2563eb'],
  ['Intervjuer', 'Intervju', '#d97706'],
  ['Erbjudanden', 'Erbjudande', '#16a34a'],
  ['Avslag', 'Avslag', '#dc2626']
]

export default function ApplicationStats({ applications, loading, unavailable }) {
  const stats = applicationStatistics(applications)
  const ready = !loading && !unavailable
  const difference = stats.thisMonth - stats.previousMonth
  const comparison = difference === 0 ? 'Lika många som förra månaden' : `${Math.abs(difference)} ${difference > 0 ? 'fler' : 'färre'} än förra månaden`
  const cards = [['Totalt', stats.total, '#172554'], ...metrics.map(([label, status, color]) => [label, stats.counts[status], color])]

  return (
    <section className="dashboard-statistics" aria-labelledby="statistics-heading" aria-busy={loading && !unavailable}>
      <div className="statistics-heading">
        <div><p className="section-eyebrow">DITT JOBBSÖKANDE I SIFFROR</p><h2 id="statistics-heading">Din statistik</h2></div>
        <p>Alla dina registrerade jobb. Status visar nuläget.</p>
      </div>
      {unavailable && <p className="statistics-note">Statistiken visas när ansökningarna har hämtats.</p>}
      <div className="stats-grid">
        {cards.map(([label, value, color]) => <div key={label} className="stat-card" style={{ borderTopColor: color }}>
          <span className="stat-label">{label}</span>
          <strong className="stat-number">{ready ? value : '—'}</strong>
          <span className="stat-description">{label === 'Totalt' ? 'Registrerade jobb' : 'Nuvarande status'}</span>
        </div>)}
      </div>
      <div className="activity-panel">
        <div className="activity-heading">
          <div><h3>Ansökningar över tid</h3><p>Ansökningsdatum · senaste sex månaderna</p></div>
          <div className="month-summary"><strong>{ready ? stats.thisMonth : '—'}</strong><span>den här månaden</span>{ready && <small>{comparison}</small>}</div>
        </div>
        {ready ? <>
          {stats.months.every(month => month.count === 0) && <p className="statistics-note">Inga daterade ansökningar under perioden ännu.</p>}
          <ul className="activity-chart" aria-label="Antal ansökningar per månad">
            {stats.months.map(month => <li key={month.key}>
              <span className="activity-month">{month.label}</span>
              <div className="activity-track" aria-hidden="true"><div className="activity-bar" style={{ width: `${month.count / stats.maximum * 100}%` }} /></div>
              <strong className="activity-count">{month.count}<span className="chart-unit"> ansökningar</span></strong>
            </li>)}
          </ul>
          <p className="statistics-note">Räknas efter ansökningsdatum, även om status ändrats. Intresserade jobb ingår inte.</p>
          {(stats.undated > 0 || stats.future > 0) && <p className="statistics-note">Utanför diagrammet: {stats.undated} utan giltigt ansökningsdatum och {stats.future} med framtida datum.</p>}
        </> : <p className="statistics-note">{unavailable ? 'Diagrammet är inte tillgängligt just nu.' : 'Hämtar din statistik…'}</p>}
      </div>
    </section>
  )
}
