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

import { useEffect, useRef, useState } from 'react'

function App() {
  const [applications, setApplications] = useState([])
  const [error, setError] = useState('')
  const [editingApplication, setEditingApplication] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Alla')
  const [isSaving, setIsSaving] = useState(false)
  const savingRef = useRef(false)
  const requestVersionRef = useRef(0)

  // Ladda alla jobbansökningar när komponenten mountas
  useEffect(() => {
    let active = true
    async function loadApplications() {
      if (savingRef.current) return
      const requestVersion = ++requestVersionRef.current
      try {
        const data = await getApplications()
        if (!active || requestVersion !== requestVersionRef.current) return
        setApplications(data)
        setError('')
      } catch {
        if (!active || requestVersion !== requestVersionRef.current) return
        setError('Kunde inte hämta jobbansökningar från servern.')
      }
    }

    loadApplications()
    window.addEventListener('focus', loadApplications)
    return () => {
      active = false
      window.removeEventListener('focus', loadApplications)
    }
  }, [])

  async function addApplication(application, selectedFile) {
    if (savingRef.current) return
    savingRef.current = true
    requestVersionRef.current++
    setIsSaving(true)
    setError('')
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
    } catch {
      setError('Kunde inte spara jobbansökan eller bilden.')
    } finally {
      savingRef.current = false
      setIsSaving(false)
    }
  }

  async function updateApplication(updatedApplication, selectedFile) {
    if (savingRef.current) return
    savingRef.current = true
    requestVersionRef.current++
    setIsSaving(true)
    setError('')
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
    } catch {
      setError('Kunde inte uppdatera jobbansökan eller bilden.')
    } finally {
      savingRef.current = false
      setIsSaving(false)
    }
  }

  async function deleteApplication(id) {
    if (savingRef.current) return
    const confirmed = window.confirm(
      'Är du säker på att du vill ta bort den här jobbansökan?'
    )

    if (!confirmed) {
      return
    }

    requestVersionRef.current++

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
    } catch {
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
            disabled={isSaving}
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
            key={editingApplication?.id ?? 'new-application'}
            onAdd={addApplication}
            onUpdate={updateApplication}
            editingApplication={editingApplication}
            isSaving={isSaving}
            onCancelEdit={() => {
              setEditingApplication(null)
              setShowForm(false)
            }}
          />
        )}

        {error && (
          <p className="error-message" role="alert">
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
          disabled={isSaving}
          onEdit={(application) => {
            if (savingRef.current) return
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
