import { useEffect, useState } from 'react'

const emptyForm = {
  company: '',
  position: '',
  location: '',
  status: 'Intresserad',
  notes: ''
}

function ApplicationForm({
  onAdd,
  onUpdate,
  editingApplication,
  onCancelEdit
}) {
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (editingApplication) {
      setFormData({
        company: editingApplication.company,
        position: editingApplication.position,
        location: editingApplication.location,
        status: editingApplication.status,
        notes: editingApplication.notes || ''
      })
    } else {
      setFormData(emptyForm)
    }
  }, [editingApplication])

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

    if (editingApplication) {
      onUpdate({
        ...editingApplication,
        ...formData
      })
    } else {
      onAdd(formData)
    }

    setFormData(emptyForm)
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <h2>
        {editingApplication
          ? 'Redigera jobbansökan'
          : 'Lägg till jobbansökan'}
      </h2>

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

      <div className="form-actions">
        <button type="submit">
          {editingApplication
            ? 'Uppdatera ansökan'
            : 'Spara ansökan'}
        </button>

        {editingApplication && (
          <button
            type="button"
            className="cancel-button"
            onClick={onCancelEdit}
          >
            Avbryt
          </button>
        )}
      </div>
    </form>
  )
}

export default ApplicationForm