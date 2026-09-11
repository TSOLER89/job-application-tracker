function ApplicationCard({ company, position, location, status }) {
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
            
        </div>
    )
}

export default ApplicationCard