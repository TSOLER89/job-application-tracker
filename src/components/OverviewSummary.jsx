import { applicationStatistics } from '../utils/applicationStatistics'
import AppIcon from './AppIcon'

export default function OverviewSummary({ applications, loading, unavailable }) {
  const stats = applicationStatistics(applications)
  const ready = !loading && !unavailable
  const cards = [['Totalt', stats.total, 'overview'], ['Ansökta', stats.counts['Ansökt'], 'applications'], ['Intervjuer', stats.counts.Intervju, 'statistics'], ['Erbjudanden', stats.counts.Erbjudande, 'offers']]
  return <dl className="overview-summary" aria-label="Snabböversikt" aria-busy={loading && !unavailable}>
    {cards.map(([label, value, icon]) => <div key={label}><dt><span>{label}</span><AppIcon name={icon} /></dt><dd>{ready ? value : '—'}</dd></div>)}
  </dl>
}
