import { useState } from 'react'
import { upcomingEvents } from '../utils/upcomingEvents'

export default function UpcomingEvents({ applications, today, loading, unavailable, onOpen }) {
  const groups = upcomingEvents(applications, today)
  const [expanded, setExpanded] = useState({})
  const ready = !loading && !unavailable
  return <div className="events-grid">
    {[
      { key: 'attention', title: 'Behöver din uppmärksamhet', description: 'Idag och passerade datum, äldst först.', empty: 'Inga deadlines eller uppföljningar att ta hand om idag.' },
      { key: 'upcoming', title: 'Kommande händelser', description: 'Dina närmaste planerade datum.', empty: 'Inga kommande datum. Lägg till en deadline eller uppföljning på ett jobb.' }
    ].map(group => {
      const events = groups[group.key]
      const visible = expanded[group.key] ? events : events.slice(0, 3)
      return <section className="events-panel" key={group.key} aria-labelledby={`events-${group.key}`} aria-busy={loading && !unavailable}>
        <div className="events-heading"><h3 id={`events-${group.key}`}>{group.title}</h3><span aria-label="Antal händelser">{ready ? events.length : '—'}</span></div>
        <p className="events-description">{group.description}</p>
        {!ready ? <p className="events-empty">{unavailable ? 'Händelserna visas när ansökningarna har hämtats.' : 'Hämtar dina planerade händelser…'}</p>
          : events.length === 0 ? <p className="events-empty">{group.empty}</p>
          : <>
            <ul className="events-list">
              {visible.map(event => <li key={`${event.id}-${event.kind}`}>
                <a className={`event-link event-${event.tone}`} href={`/applications?application=${event.id}`} onClick={click => onOpen(click, event.id)}>
                  <span className="event-company">{event.company}</span>
                  <span className="event-position">{event.position}</span>
                  <span className="event-label">{event.label}</span>
                  <span className="event-date">{event.kind === 'deadline' ? 'Sista ansökningsdag' : 'Uppföljning'} · <time dateTime={event.date}>{event.date}</time></span>
                  <span className="event-open">Visa ansökan →</span>
                </a>
              </li>)}
            </ul>
            {events.length > 3 && <button className="secondary-button events-more" type="button" aria-expanded={!!expanded[group.key]} onClick={() => setExpanded(current => ({ ...current, [group.key]: !current[group.key] }))}>{expanded[group.key] ? 'Visa färre' : `Visa alla (${events.length})`}</button>}
          </>}
      </section>
    })}
  </div>
}
