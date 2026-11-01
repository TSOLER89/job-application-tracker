import './App.css'
import Header from './components/Header'
import ApplicationList from './components/ApplicationList'
import ApplicationForm from './components/ApplicationForm'
import ApplicationStats from './components/ApplicationStats'
import UpcomingEvents from './components/UpcomingEvents'
import ApplicationFilters from './components/ApplicationFilters'
import { usePageNavigation } from './hooks/use-page-navigation'
import { useToday } from './hooks/use-today'

import {
  getApplications,
  createApplication,
  updateApplication as updateApplicationRequest,
  deleteApplication as deleteApplicationRequest,
  uploadImage
} from './services/applicationService'

import { useCallback, useEffect, useRef, useState } from 'react'

function App({ user, onLogout, isLoggingOut, logoutError }) {
  const { page, navigate, applicationId } = usePageNavigation()
  const today = useToday()
  const [applications, setApplications] = useState([])
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const [editingApplication, setEditingApplication] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Alla')
  const [isSaving, setIsSaving] = useState(false)
  const savingRef = useRef(false)
  const requestVersionRef = useRef(0)

  useEffect(() => {
    if (page === 'applications' && applicationId && hasLoaded) {
      const card = document.getElementById(`application-${applicationId}`)
      card?.scrollIntoView({ block: 'center' })
      card?.focus({ preventScroll: true })
    }
  }, [page, applicationId, hasLoaded])

  function openEvent(event, id) {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !isSaving) {
      setSearchTerm('')
      setStatusFilter('Alla')
    }
    navigate(event, `/applications?application=${id}`, isSaving)
  }

  const loadApplications = useCallback(() => {
    if (savingRef.current) return
    setIsLoading(true)
    setLoadError('')
    setReloadToken(value => value + 1)
  }, [])

  useEffect(() => {
    let active = true
    async function load() {
      const requestVersion = ++requestVersionRef.current
      try {
        const data = await getApplications()
        if (!active || requestVersion !== requestVersionRef.current) return
        setApplications(data)
        setHasLoaded(true)
      } catch {
        if (!active || requestVersion !== requestVersionRef.current) return
        setLoadError('Kunde inte hämta dina ansökningar. Kontrollera anslutningen och försök igen.')
      } finally {
        if (active && requestVersion === requestVersionRef.current) setIsLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [reloadToken])

  useEffect(() => {
    window.addEventListener('focus', loadApplications)
    return () => {
      window.removeEventListener('focus', loadApplications)
    }
  }, [loadApplications])

  async function addApplication(application, selectedFile) {
    if (savingRef.current) return
    savingRef.current = true
    requestVersionRef.current++
    setIsLoading(false)
    setIsSaving(true)
    setError('')
    setSuccess('')
    try {
      let imageUrl = ''

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile)
      }

      const createdApplication = await createApplication({
        ...application,
        imageUrl,
        dateApplied: application.dateApplied || null,
        applicationDeadline: application.applicationDeadline || null,
        followUpDate: application.followUpDate || null
      })

      setApplications((previousApplications) => [
        ...previousApplications,
        createdApplication
      ])

      setShowForm(false)
      setError('')
      setSuccess('Jobbansökan har lagts till.')
    } catch (error) {
      setError(error.message || 'Kunde inte spara jobbansökan eller bilden.')
    } finally {
      savingRef.current = false
      setIsSaving(false)
    }
  }

  async function updateApplication(updatedApplication, selectedFile) {
    if (savingRef.current) return
    savingRef.current = true
    requestVersionRef.current++
    setIsLoading(false)
    setIsSaving(true)
    setError('')
    setSuccess('')
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
          dateApplied: updatedApplication.dateApplied || null,
          applicationDeadline: updatedApplication.applicationDeadline || null,
          followUpDate: updatedApplication.followUpDate || null
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
      setSuccess('Ändringarna har sparats.')
    } catch (error) {
      setError(error.message || 'Kunde inte uppdatera jobbansökan eller bilden.')
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
    savingRef.current = true
    setIsLoading(false)
    setIsSaving(true)
    setError('')
    setSuccess('')

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
      setSuccess('Jobbansökan har tagits bort.')
    } catch {
      setError('Kunde inte ta bort jobbansökan.')
    } finally {
      savingRef.current = false
      setIsSaving(false)
    }
  }

  const filteredApplications = applications.filter((application) => {
    const search = searchTerm.trim().toLowerCase()

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
      <a className="skip-link" href="#main-content">Hoppa till innehållet</a>
      <Header />

      <main className="main-content" id="main-content" tabIndex={-1}>
        <div className="account-bar"><span>Inloggad som <strong>{user.email}</strong></span><button type="button" className="secondary-button" onClick={onLogout} disabled={isSaving || isLoggingOut}>{isLoggingOut ? 'Loggar ut…' : 'Logga ut'}</button></div>
        {logoutError && <p className="feedback feedback-error" role="alert">{logoutError}</p>}
        <nav className="page-navigation" aria-label="Huvudnavigation">
          <a href="/" aria-current={page === 'overview' ? 'page' : undefined} aria-disabled={isSaving || undefined} onClick={event => navigate(event, '/', isSaving)}>Översikt</a>
          <a href="/applications" aria-current={page === 'applications' ? 'page' : undefined} aria-disabled={isSaving || undefined} onClick={event => navigate(event, '/applications', isSaving)}>Jobbansökningar {hasLoaded && <span className="navigation-count">{applications.length}</span>}</a>
        </nav>

        <div aria-live="polite" aria-atomic="true">
          {success && (
            <div className="feedback feedback-success" role="status">
              <span>{success}</span>
              <button type="button" onClick={() => setSuccess('')} aria-label="Stäng bekräftelse">×</button>
            </div>
          )}
        </div>
        {loadError && (
          <div className="feedback feedback-error" role="alert">
            <span>{loadError}{hasLoaded && ' Senast hämtade uppgifter visas.'}</span>
            <button type="button" onClick={loadApplications} disabled={isLoading || isSaving}>Försök igen</button>
          </div>
        )}
        {error && <p className="feedback feedback-error" role="alert">{error} Dina övriga uppgifter finns kvar.</p>}

        {isLoading && <p className="loading-state" role="status"><span className="loading-dot" aria-hidden="true" />{hasLoaded ? 'Uppdaterar ansökningar…' : 'Laddar dina ansökningar…'}</p>}

        {page === 'overview' && <section aria-labelledby="overview-heading">
          <div className="overview-heading"><div><p className="section-eyebrow">VÄLKOMMEN TILLBAKA</p><h2 id="overview-heading">Översikt</h2><p>Följ ditt jobbsökande och se hur dina ansökningar utvecklas.</p></div>
            <a className="overview-applications-link" href="/applications" onClick={event => navigate(event, '/applications')}>Visa mina jobbansökningar →</a>
          </div>
          <ApplicationStats applications={applications} loading={!hasLoaded} unavailable={!!loadError && !hasLoaded}>
            <UpcomingEvents applications={applications} today={today} loading={!hasLoaded} unavailable={!!loadError && !hasLoaded} onOpen={openEvent} />
          </ApplicationStats>
        </section>}

        <section hidden={page !== 'applications'} aria-labelledby="applications-heading">
        <div className="applications-header">
          <div>
            <p className="section-eyebrow">DIN ÖVERSIKT</p>
            <h2 id="applications-heading">Mina jobbansökningar</h2>
          </div>

          <button
            type="button"
            className="add-application-button"
            disabled={isSaving || !hasLoaded}
            onClick={() => {
              setEditingApplication(null)
              setShowForm(true)
              setError('')
              setSuccess('')
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
              setError('')
            }}
          />
        )}

        <ApplicationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          disabled={!hasLoaded}
        />

        {hasLoaded && <p className="results-count" aria-live="polite">Visar {filteredApplications.length} av {applications.length} ansökningar</p>}
        {hasLoaded && (!loadError || applications.length > 0) && (
        <ApplicationList
          today={today}
          selectedId={applicationId}
          applications={filteredApplications}
          hasApplications={applications.length > 0}
          disabled={isSaving}
          onResetFilters={() => { setSearchTerm(''); setStatusFilter('Alla') }}
          onEdit={(application) => {
            if (savingRef.current) return
            setEditingApplication(application)
            setShowForm(true)
            setError('')
            setSuccess('')
          }}
          onDelete={deleteApplication}
        />
        )}
        </section>
      </main>
    </div>
  )
}

export default App
