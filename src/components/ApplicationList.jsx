import ApplicationCard from './ApplicationCard'

function ApplicationList({ 
  applications, 
  today,
  selectedId,
  onEdit,
  onDelete,
  hasApplications,
  disabled,
  onResetFilters
}) {
  if (applications.length === 0) {
      return (
      <div className="empty-state">
        {
          hasApplications ? (
            <>
            <h3>Inga träffar</h3>
            <p>Det finns inga jobbansökningar som matchar ditt filter.</p>
            <button type="button" className="secondary-button" onClick={onResetFilters}>Rensa filter</button>
            </>
          ) : (
            <>
            <h3>Inga jobbansökningar ännu</h3>
            <p>Lägg till din första jobbansökan ovan.</p>
            </>
          )}
        </div>
      )
    }

  // Rendera listan med jobbansökningar om det finns några.
  return ( 
    <div className="application-list">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          id={application.id}
          highlighted={application.id === selectedId}
          company={application.company}
          position={application.position}
          location={application.location}
          dateApplied={application.dateApplied}
          applicationDeadline={application.applicationDeadline}
          followUpDate={application.followUpDate}
          today={today}
          status={application.status}
          notes={application.notes}
          imageUrl={application.imageUrl}
          disabled={disabled}
          onEdit={() => onEdit(application)}
          onDelete={() => onDelete(application.id)}
        />
      ))}
    </div>
  )
}

export default ApplicationList
