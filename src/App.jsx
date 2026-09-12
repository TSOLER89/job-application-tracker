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
      status: 'Intervju',
      notes: ''
    },
    {
      id: 2,
      company: 'Sectra',
      position: 'Systemutvecklare',
      location: 'Linköping',
      status: 'Ansökt',
      notes: ''
    },
    {
      id: 3,
      company: 'Saab',
      position: 'Junior Software Developer',
      location: 'Linköping',
      status: 'Intresserad',
      notes: ''
    }
  ])

  const [editingApplication, setEditingApplication] = useState(null)

  function addApplication(application) {
    const newApplication = {
      id: Date.now(),
      ...application
    }

    setApplications([...applications, newApplication])
  }

  function updateApplication(updatedApplication) {
    setApplications(
      applications.map((application) =>
        application.id === updatedApplication.id
          ? updatedApplication
          : application
      )
    )

    setEditingApplication(null)
  }

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <ApplicationForm
          onAdd={addApplication}
          onUpdate={updateApplication}
          editingApplication={editingApplication}
          onCancelEdit={() => setEditingApplication(null)}
        />

        <h2>Mina jobbansökningar</h2>

        <ApplicationList
          applications={applications}
          onEdit={setEditingApplication}
        />
      </main>
    </div>
  )
}

export default App