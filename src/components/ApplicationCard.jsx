import { getImageUrl } from '../utils/imageUrl'
import { planningNotices } from '../utils/planningNotices'

function ApplicationCard({
  company,
  position,
  location,
  dateApplied,
  applicationDeadline,
  followUpDate,
  today,
  status,
  notes,
  imageUrl,
  disabled,
  onEdit,
  onDelete
}) {
  const notices = planningNotices({ status, applicationDeadline, followUpDate }, today)
  return (
    <article className="application-card">
      <div className="card-header">
        <div>
          <h3 className="card-company">{company}</h3>
          <p className="card-position">{position}</p>
        </div>

        <span
          className={`status-badge status-${status.toLowerCase()}`}
        >
          {status}
        </span>
      </div>

      {notices.length > 0 && <ul className="planning-notices" aria-label="Planering">
        {notices.map(notice => <li key={notice.kind} className={`planning-notice planning-${notice.tone}`}>{notice.label}</li>)}
      </ul>}
      {imageUrl && (
        <img
          src={getImageUrl(imageUrl)}
          alt={`Bild för ${company}`}
          className="application-image"
        />
      )}

      <div className="card-details">
        {applicationDeadline && <div className="card-detail"><span className="detail-label">Sista ansökningsdag</span><span>{applicationDeadline}</span></div>}
        {followUpDate && <div className="card-detail"><span className="detail-label">Uppföljningsdatum</span><span>{followUpDate}</span></div>}
        <div className="card-detail">
          <span className="detail-label">Plats</span>
          <span>{location}</span>
        </div>

        {status !== 'Intresserad' && dateApplied && (
          <div className="card-detail">
            <span className="detail-label">Ansökt</span>
            <span>
              {new Date(
                `${dateApplied}T00:00:00`
              ).toLocaleDateString('sv-SE')}
            </span>
          </div>
        )}
      </div>

      {notes && (
        <div className="card-notes">
          <span className="detail-label">Anteckningar</span>
          <p>{notes}</p>
        </div>
      )}

      <div className="card-actions">
        <button
          type="button"
          className="edit-button"
          disabled={disabled}
          onClick={onEdit}
        >
          Redigera
        </button>

        <button
          type="button"
          className="delete-button"
          disabled={disabled}
          onClick={onDelete}
        >
          Ta bort
        </button>
      </div>
    </article>
  )
}

export default ApplicationCard
