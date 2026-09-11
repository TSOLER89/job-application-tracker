import './App.css'
import Header from './components/Header'
import ApplicationList from './components/ApplicationList'
import ApplicationForm from './components/ApplicationForm'
import { useState } from 'react'


function App() {
  const [applications, setApplications] = useState([
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
  ])

  function addApplication(application) {
  const newApplication = {
    id: Date.now(),
    ...application
  }

  setApplications([...applications, newApplication])
}

  return (
    <div className="app">
      <Header />

   <main className="main-content">
  <ApplicationForm onAdd={addApplication} />

  <h2>Mina jobbansökningar</h2>

  <ApplicationList applications={applications} />
</main>
    </div>
  )
}

export default App