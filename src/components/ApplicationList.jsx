import ApplicationCard from './ApplicationCard'

function ApplicationList({ applications, onEdit }) {
  return ( /*.map()ta varje ansökan och rendera en ApplicationCard */
    <div className="application-list">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          company={application.company}
          position={application.position}
          location={application.location}
          status={application.status}
          notes={application.notes}
          onEdit={() => onEdit(application)}
        />
      ))}
    </div>
  )
}

export default ApplicationList