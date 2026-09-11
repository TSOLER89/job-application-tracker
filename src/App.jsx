import './App.css'
import Header from './components/Header'
import ApplicationCard from './components/ApplicationCard'

function App() {
  const applications = [
    {
      id: 1,
      company: 'Consid',
      position: 'Junior .NET-utvecklare',
      location: 'Linköping',
      status: 'Intervju'
    },
    {
      id: 2,
      company: 'Sectra',
      position: 'Systemutvecklare',
      location: 'Linköping',
      status: 'Ansökt'
    },
    {
      id: 3,
      company: 'Saab',
      position: 'Junior Software Developer',
      location: 'Linköping',
      status: 'Intresserad'
    }
  ]

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <h2>Mina jobbansökningar</h2>

        <div /*.map()ta varje ansökan och rendera en ApplicationCard */className="application-list">
          {applications.map ((application) => (
            <ApplicationCard
              key={application.id}
              company={application.company}
              position={application.position}
              location={application.location}
              status={application.status}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default App