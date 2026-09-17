import { getImageUrl } from '../utils/imageUrl'

function ApplicationCard({
  company,
  position,
  location,
  dateApplied,
  status,
  notes,
  imageUrl,
  onEdit,
  onDelete
}) {
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

      {imageUrl && (
        <img
          src={getImageUrl(imageUrl)}
          alt={`Bild för ${company}`}
          className="application-image"
        />
      )}

      <div className="card-details">
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
          onClick={onEdit}
        >
          Redigera
        </button>

        <button
          type="button"
          className="delete-button"
          onClick={onDelete}
        >
          Ta bort
        </button>
      </div>
    </article>
  )
}

export default ApplicationCard