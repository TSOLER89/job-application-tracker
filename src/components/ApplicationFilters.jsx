function ApplicationFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  disabled
}) {
  return (
    <div className="application-filters">
      <label className="filter-field filter-search">
      <span>Sök ansökningar</span>
      <input
        disabled={disabled}
        type="search"
        placeholder="Sök företag, tjänst eller plats..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        className="search-input"
      />
      </label>
      <label className="filter-field">
      <span>Status</span>
      <select
        disabled={disabled}
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
      </label>
    </div>
  )
}

export default ApplicationFilters
