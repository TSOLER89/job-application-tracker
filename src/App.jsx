import './App.css'
import Header from './components/Header'
import ApplicationList from './components/ApplicationList'
import ApplicationForm from './components/ApplicationForm'
import { useEffect,useState } from 'react'

function App() {
  const [applications, setApplications] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
  async function fetchApplications() {
    try {
      const response = await fetch(
        'http://localhost:5250/api/JobApplications'
      )

      if (!response.ok) {
        throw new Error('Kunde inte hämta jobbansökningar.')
      }

      const data = await response.json()
      setApplications(data)
      setError('')
    } catch (error) {
      setError('Kunde inte hämta jobbansökningar från servern.')
    }
  }

  fetchApplications()
}, [])

  const [editingApplication, setEditingApplication] = useState(null)

async function addApplication(application, selectedFile) {
  try {
    let imageUrl = ''

    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const uploadResponse = await fetch(
        'http://localhost:5250/api/JobApplications/upload',
        {
          method: 'POST',
          body: formData
        }
      )

      if (!uploadResponse.ok) {
        throw new Error('Kunde inte ladda upp bilden.')
      }

      const uploadData = await uploadResponse.json()

      imageUrl = `http://localhost:5250${uploadData.imageUrl}`
    }

    const response = await fetch(
      'http://localhost:5250/api/JobApplications',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...application,
          imageUrl,
          dateApplied: application.dateApplied || null
        })
      }
    )

    if (!response.ok) {
      throw new Error('Kunde inte skapa jobbansökan.')
    }

    const createdApplication = await response.json()

    setApplications((previousApplications) => [
      ...previousApplications,
      createdApplication
    ])

    setError('')
  } catch (error) {
    setError('Kunde inte spara jobbansökan eller bilden.')
  }
}

  
    async function updateApplication(updatedApplication) {
      try{
        const response = await fetch(
          `http://localhost:5250/api/JobApplications/${updatedApplication.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...updatedApplication,
              dateApplied: updatedApplication.dateApplied || null
            })
          }
        )

        if (!response.ok) {
          throw new Error('Kunde inte uppdatera jobbansökan.')
        }

        const savedApplication = await response.json()

        setApplications((previousApplications) =>
          previousApplications.map((application) =>
            application.id === savedApplication.id 
              ? savedApplication
              : application
          )
        )

        setEditingApplication(null)
        setError('')
      } catch (error) {
        setError('Kunde inte uppdatera jobbansökan på servern.')
      }
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

              {error && <p className="error-message">{error}</p>}

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