import { applicationStatistics } from '../utils/applicationStatistics'

export default function OverviewSummary({ applications, loading, unavailable }) {
  const stats = applicationStatistics(applications)
  const ready = !loading && !unavailable
  const cards = [['Totalt', stats.total], ['Ansökta', stats.counts['Ansökt']], ['Intervjuer', stats.counts.Intervju], ['Erbjudanden', stats.counts.Erbjudande]]
  return <dl className="overview-summary" aria-label="Snabböversikt" aria-busy={loading && !unavailable}>
    {cards.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{ready ? value : '—'}</dd></div>)}
  </dl>
}
