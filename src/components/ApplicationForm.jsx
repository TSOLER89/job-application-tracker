import { useState } from 'react'

function ApplicationForm({ onAdd }) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    status: 'Intresserad',
    notes: ''
  })

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (
      !formData.company.trim() ||
      !formData.position.trim() ||
      !formData.location.trim()
    ) {
      return
    }

    onAdd(formData)

    setFormData({
      company: '',
      position: '',
      location: '',
      status: 'Intresserad',
      notes: ''
    })
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <h2>Lägg till jobbansökan</h2>

      <label>
        Företag
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Skriv företagsnamn"
          required
        />
      </label>

      <label>
        Tjänst
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Skriv tjänstens namn"
          required
        />
      </label>

      <label>
        Plats
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Skriv plats"
          required
        />
      </label>

      <label>
        Status
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Intresserad">Intresserad</option>
          <option value="Ansökt">Ansökt</option>
          <option value="Intervju">Intervju</option>
          <option value="Erbjudande">Erbjudande</option>
          <option value="Avslag">Avslag</option>
        </select>
      </label>

      <label>
        Anteckningar
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Skriv anteckningar om ansökan..."
          rows="4"
        />
      </label>

      <button type="submit">
        Spara ansökan
      </button>
    </form>
  )
}

export default ApplicationForm