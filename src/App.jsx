import './App.css'
import Header from './components/Header'
import ApplicationList from './components/ApplicationList'


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
        <ApplicationList applications={applications} />
      </main>
    </div>
  )
}

export default App