import { useEffect, useRef, useState } from 'react'
import { getImageUrl } from '../utils/imageUrl'

const emptyForm = {
  company: '',
  position: '',
  location: '',
  dateApplied: '',
  status: 'Ansökt',
  notes: '',
  imageUrl: ''
}

function ApplicationForm({
  onAdd,
  onUpdate,
  editingApplication,
  onCancelEdit
}) {
  const [formData, setFormData] = useState(emptyForm)
  const [selectedFile, setSelectedFile] = useState(null)

  const fileInputRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    if (editingApplication) {
      setFormData({
        company: editingApplication.company,
        position: editingApplication.position,
        location: editingApplication.location,
        dateApplied: editingApplication.dateApplied || '',
        status: editingApplication.status,
        notes: editingApplication.notes || '',
        imageUrl: editingApplication.imageUrl || ''
      })

      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    } else {
      setFormData(emptyForm)
    }
    setSelectedFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [editingApplication])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => {
      const updatedData = {
        ...previousData,
        [name]: value
      }

      if (name === 'status' && value === 'Intresserad') {
        updatedData.dateApplied = ''
      }

      return updatedData
    })
  }

  function handleImageChange(event) {
    const file = event.target.files[0]

    setSelectedFile(file)

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setFormData((previousData) => ({
        ...previousData,
        imageUrl: reader.result
      }))
    }

    reader.readAsDataURL(file)
  }

  function removeImage() {
    setSelectedFile(null)

    setFormData((previousData) => ({
      ...previousData,
      imageUrl: ''
    }))

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
      },
    selectedFile
  )
    } else {
      onAdd(formData, selectedFile)
    }

    setFormData(emptyForm)
    setSelectedFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form
      ref={formRef}
      className="application-form"
      onSubmit={handleSubmit}
    >
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
        Ansökningsdatum
        <input
          type="date"
          name="dateApplied"
          value={formData.dateApplied}
          onChange={handleChange}
          disabled={formData.status === 'Intresserad'}
        />
      </label>

      <label>
        Status
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Ansökt">Ansökt</option>
          <option value="Intresserad">Intresserad</option>
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

      <label>
        Bild
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>

      {formData.imageUrl && (
        <div className="image-preview-container">
          <p>Förhandsvisning</p>

          <div className="image-preview-wrapper">
            <img
              src={getImageUrl(formData.imageUrl)}
              alt="Förhandsvisning"
              className="image-preview"
            />

            <button
              type="button"
              className="remove-image-button"
              onClick={removeImage}
              aria-label="Ta bort bild"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="submit">
          {editingApplication
            ? 'Uppdatera ansökan'
            : 'Spara ansökan'}
        </button>

    
          <button
            type="button"
            className="cancel-button"
            onClick={onCancelEdit}
          >
            Avbryt
          </button>

      </div>
    </form>
  )
}

export default ApplicationForm