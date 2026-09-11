import ApplicationCard from './ApplicationCard'

function ApplicationList({ applications }) {
  return ( /*.map()ta varje ansökan och rendera en ApplicationCard */
    <div className="application-list">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          company={application.company}
          position={application.position}
          location={application.location}
          status={application.status}
        />
      ))}
    </div>
  )
}

export default ApplicationList