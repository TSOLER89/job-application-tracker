function ApplicationFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange
}) {
  return (
    <div className="application-filters">
      <input
        type="search"
        placeholder="Sök företag, tjänst eller plats..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        className="search-input"
      />

      <select
        value={statusFilter}
        onChange={(event) => onStatusChange(event.target.value)}
        className="status-filter"
      >
        <option value="Alla">Alla statusar</option>
        <option value="Ansökt">Ansökt</option>
        <option value="Intresserad">Intresserad</option>
        <option value="Intervju">Intervju</option>
        <option value="Erbjudande">Erbjudande</option>
        <option value="Avslag">Avslag</option>
      </select>
    </div>
  )
}

export default ApplicationFilters