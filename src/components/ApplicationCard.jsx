function ApplicationCard({ 
    company, 
    position, 
    location, 
    status,
    notes,
    onEdit
}) {
    return (
        <div className="application-card">
            <h3>{company}</h3>

            <p>
                <strong>Tjänst:</strong> {position}
            </p>

            <p>
                <strong>Plats:</strong> {location}
            </p>

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

            <button 
            type="button"
            className="edit-button"
            onClick={onEdit}
            >
             Redigera
            </button>
        </div>
    )
}

export default ApplicationCard