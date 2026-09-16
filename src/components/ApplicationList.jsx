import ApplicationCard from './ApplicationCard'

function ApplicationList({ 
  applications, 
  onEdit,
  onDelete,
  hasApplications
}) {
  if (applications.length === 0) {
      return (
      <div className="empty-state">
        {
          hasApplications ? (
            <>
            <h3>Inga träffar</h3>
            <p>Det finns inga jobbansökningar som matchar ditt filter.</p>
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


  return ( /*.map()ta varje ansökan och rendera en ApplicationCard */
    <div className="application-list">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          company={application.company}
          position={application.position}
          location={application.location}
          dateApplied={application.dateApplied}
          status={application.status}
          notes={application.notes}
          imageUrl={application.imageUrl}
          onEdit={() => onEdit(application)}
          onDelete={() => onDelete(application.id)}
        />
      ))}
    </div>
  )
}

export default ApplicationList