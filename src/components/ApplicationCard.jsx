function ApplicationCard({ 
    company, 
    position, 
    location, 
    status,
    notes
}) {
    return (
        <div className="application-card">
            <h3>{company}</h3>

            <p>
                <strong>Tjänst:</strong>{position}
            </p>

            <p>
                <strong>Plats:</strong>{location}
            </p>

            <p>
                <strong>Status:</strong>{status}
            </p>
                {notes && (
                    <p>
                        <strong>Anteckningar:</strong>{notes}
                    </p>
                )}

        </div>
    )
}

export default ApplicationCard