//basadress URL backend-servern
const API_URL = 'http://localhost:5250/api/JobApplications'

//Gemensam URL för JobApplications-endpointen
const BASE_URL = 'http://localhost:5250' 

// Hämtar alla jobbansökningar från API:t
export async function getApplications() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Kunde inte hämta jobbansökningar.')
  }

  return response.json()
}
// Skapar en ny jobbansökan
export async function createApplication(application) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(application)
  })

  if (!response.ok) {
    throw new Error('Kunde inte skapa jobbansökan.')
  }

  return response.json()
}

// Uppdaterar en befintlig jobbansökan
export async function updateApplication(id, application) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(application)
  })

  if (!response.ok) {
    throw new Error('Kunde inte uppdatera jobbansökan.')
  }

  return response.json()
}


// Tar bort en jobbansökan
export async function deleteApplication(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Kunde inte ta bort jobbansökan.')
  }
}

// Laddar upp en bild för en jobbansökan
export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Kunde inte ladda upp bilden.')
  }

  const data = await response.json()


  // Backend returnerar t.ex. /uploads/bild.jpg.
  // BASE_URL läggs till så att React får hela bildadressen.
  return `${BASE_URL}${data.imageUrl}`
}