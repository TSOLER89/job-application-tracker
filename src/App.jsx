import './App.css'
import Header from './components/Header'
import ApplicationList from './components/ApplicationList'
import ApplicationForm from './components/ApplicationForm'
import ApplicationStats from './components/ApplicationStats'
import ApplicationFilters from './components/ApplicationFilters'

import {
  getApplications,
  createApplication,
  updateApplication as updateApplicationRequest,
  deleteApplication as deleteApplicationRequest,
  uploadImage
} from './services/applicationService'

import { useEffect, useState } from 'react'

function App() {
  const [applications, setApplications] = useState([])
  const [error, setError] = useState('')
  const [editingApplication, setEditingApplication] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Alla')

  // Ladda alla jobbansökningar när komponenten mountas
  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getApplications()

        setApplications(data)
        setError('')
      } catch (error) {
        setError('Kunde inte hämta jobbansökningar från servern.')
      }
    }

    loadApplications()
  }, [])

  async function addApplication(application, selectedFile) {
    try {
      let imageUrl = ''

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile)
      }

      const createdApplication = await createApplication({
        ...application,
        imageUrl,
        dateApplied: application.dateApplied || null
      })

      setApplications((previousApplications) => [
        ...previousApplications,
        createdApplication
      ])

      setShowForm(false)
      setError('')
    } catch (error) {
      setError('Kunde inte spara jobbansökan eller bilden.')
    }
  }

  async function updateApplication(updatedApplication, selectedFile) {
    try {
      let imageUrl = updatedApplication.imageUrl

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile)
      }

      const savedApplication = await updateApplicationRequest(
        updatedApplication.id,
        {
          ...updatedApplication,
          imageUrl,
          dateApplied: updatedApplication.dateApplied || null
        }
      )

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.id === savedApplication.id
            ? savedApplication
            : application
        )
      )

      setEditingApplication(null)
      setShowForm(false)
      setError('')
    } catch (error) {
      setError('Kunde inte uppdatera jobbansökan eller bilden.')
    }
  }

  async function deleteApplication(id) {
    const confirmed = window.confirm(
      'Är du säker på att du vill ta bort den här jobbansökan?'
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteApplicationRequest(id)

      setApplications((previousApplications) =>
        previousApplications.filter(
          (application) => application.id !== id
        )
      )

      if (editingApplication?.id === id) {
        setEditingApplication(null)
        setShowForm(false)
      }

      setError('')
    } catch (error) {
      setError('Kunde inte ta bort jobbansökan.')
    }
  }

  const filteredApplications = applications.filter((application) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      application.company.toLowerCase().includes(search) ||
      application.position.toLowerCase().includes(search) ||
      application.location.toLowerCase().includes(search)

    const matchesStatus =
      statusFilter === 'Alla' ||
      application.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Ladda alla jobbansökningar när komponenten mountas
  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <ApplicationStats applications={applications} />

        <div className="applications-header">
          <h2>Mina jobbansökningar</h2>

          <button
            type="button"
            className="add-application-button"
            onClick={() => {
              setEditingApplication(null)
              setShowForm(true)
            }}
          >
            + Lägg till ansökan
          </button>
        </div>

        {showForm && (
          <ApplicationForm
            onAdd={addApplication}
            onUpdate={updateApplication}
            editingApplication={editingApplication}
            onCancelEdit={() => {
              setEditingApplication(null)
              setShowForm(false)
            }}
          />
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <ApplicationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <ApplicationList
          applications={filteredApplications}
          hasApplications={applications.length > 0}
          onEdit={(application) => {
            setEditingApplication(application)
            setShowForm(true)
          }}
          onDelete={deleteApplication}
        />
      </main>
    </div>
  )
}

export default App