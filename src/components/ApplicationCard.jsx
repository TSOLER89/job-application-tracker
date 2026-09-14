function ApplicationCard({ 
    company, 
    position, 
    location, 
    dateApplied,
    status,
    notes,
    imageUrl,
    onEdit,
    onDelete,
}) {
    return (
        <div className="application-card">
            <h3>{company}</h3>
                    {imageUrl && (
            <img
                src={imageUrl}
                alt={`Bild för ${company}`}
                className="application-image"
            />
            )}
            <p>
                <strong>Tjänst:</strong> {position}
            </p>

            <p>
                <strong>Plats:</strong> {location}
            </p>

             {status !== 'Intresserad' && dateApplied && (
                <p>
                    <strong>Ansökningsdatum:</strong>{' '}
                    {new Date(dateApplied).toLocaleDateString('sv-SE')}
                </p>
                )}

            <p>
             <strong>Status:</strong>{' '}
            <span className={`status-badge status-${status.toLowerCase()}`}>
                {status}
            </span>
            </p>
                {notes && (
                    <p>
                        <strong>Anteckningar:</strong>{notes}
                    </p>
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
        </div>
    )
}

export default ApplicationCard