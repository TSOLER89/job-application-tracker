function ApplicationForm() {
  return (
    <form className="application-form">
      <h2>Lägg till jobbansökan</h2>

      <label>
        Företag
        <input
          type="text"
          placeholder="t.ex. IT Företag"
        />
      </label>

      <label>
        Tjänst
        <input
          type="text"
          placeholder="t.ex. Junior .NET-utvecklare"
        />
      </label>

      <label>
        Plats
        <input
          type="text"
          placeholder="t.ex. Linköping"
        />
      </label>

      <label>
        Status
        <select>
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
          placeholder="Skriv en anteckning..."
          rows="4"
        />
      </label>

      <button type="submit">
        Spara Ansökan
      </button>
    </form>
  )
}

export default ApplicationForm