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
      dateApplied: '2026-09-01',
      status: 'Intervju',
      notes: ''
    },
    {
      id: 2,
      company: 'Sectra',
      position: 'Systemutvecklare',
      location: 'Linköping',
      dateApplied: '2026-09-09',
      status: 'Ansökt',
      notes: ''
    },
    {
      id: 3,
      company: 'Saab',
      position: 'Junior Software Developer',
      location: 'Linköping',
      dateApplied: '',
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

  function deleteApplication(id) {
  const confirmed = window.confirm(
    'Är du säker på att du vill ta bort den här jobbansökan?'
  )

  if (!confirmed) {
    return
  }

  setApplications(
    applications.filter((application) => application.id !== id)
  )

  if (editingApplication?.id === id) {
    setEditingApplication(null)
  }
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
          onDelete={deleteApplication}
        />
      </main>
    </div>
  )
}

export default App