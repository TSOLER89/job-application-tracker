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

function getInitialFormData(editingApplication) {
  if (!editingApplication) {
    return emptyForm
  }

  return {
    company: editingApplication.company,
    position: editingApplication.position,
    location: editingApplication.location,
    dateApplied: editingApplication.dateApplied || '',
    status: editingApplication.status,
    notes: editingApplication.notes || '',
    imageUrl: editingApplication.imageUrl || ''
  }
}

function ApplicationForm({
  onAdd,
  onUpdate,
  editingApplication,
  isSaving,
  onCancelEdit
}) {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(editingApplication)
  )
  const [selectedFile, setSelectedFile] = useState(null)
  const [formError, setFormError] = useState('')

  const fileInputRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    if (editingApplication) {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [editingApplication])

  function handleChange(event) {
    setFormError('')
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

    if (!file) {
      return
    }

    if (file.size > 5 * 1024 * 1024 || !/\.(jpe?g|png|webp)$/i.test(file.name)) {
      setFormError('Välj en JPEG-, PNG- eller WebP-bild på högst 5 MiB.')
      event.target.value = ''
      return
    }
    setFormError('')
    setSelectedFile(file)

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

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSaving) return

    if (
      !formData.company.trim() ||
      !formData.position.trim() ||
      !formData.location.trim()
    ) {
      setFormError('Fyll i företag, tjänst och plats. Fälten får inte bara innehålla mellanslag.')
      return
    }

    if (editingApplication) {
      await onUpdate(
        { ...editingApplication, ...formData },
        selectedFile
      )
    } else {
      await onAdd(formData, selectedFile)
    }
  }

  return (
    <form
      ref={formRef}
      className="application-form"
      onSubmit={handleSubmit}
      aria-busy={isSaving}
    >
      <fieldset disabled={isSaving} className="form-fields">
        <h2>
          {editingApplication
            ? 'Redigera jobbansökan'
            : 'Lägg till jobbansökan'}
        </h2>
        <p className="form-hint">Företag, tjänst och plats är obligatoriska. Övriga uppgifter är valfria.</p>
        {formError && <p className="feedback feedback-error" role="alert">{formError}</p>}

        <label>
          Företag
          <input
            type="text"
            name="company"
            maxLength={200}
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
            maxLength={200}
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
            maxLength={200}
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
            maxLength={5000}
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
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            aria-describedby="image-hint"
            onChange={handleImageChange}
          />
          <small id="image-hint">JPEG, PNG eller WebP, högst 5 MiB.</small>
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
            {isSaving ? 'Sparar...' : editingApplication
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
      </fieldset>
    </form>
  )
}

export default ApplicationForm
