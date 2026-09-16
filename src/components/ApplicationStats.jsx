function ApplicationStats({applications}) {
    const total = applications.length

    const interviews = applications.filter (
        application => application.status === 'Intervju'
    ).length

    const offers = applications.filter(
        application => application.status === 'Erbjudande'
    ).length

    const rejections = applications.filter(
        application => application.status === 'Avslag'
    ).length

 return (
    <section className="stats-grid">
      <div className="stat-card">
        <span className="stat-label">Totalt</span>
        <strong className="stat-number">{total}</strong>
        <span className="stat-description">Registrerade jobb</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Intervjuer</span>
        <strong className="stat-number">{interviews}</strong>
        <span className="stat-description">Pågående processer</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Erbjudanden</span>
        <strong className="stat-number">{offers}</strong>
        <span className="stat-description">jobberbjudanden</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Avslag</span>
        <strong className="stat-number">{rejections}</strong>
        <span className="stat-description">Avvisade jobb</span>
      </div>
    </section>
  )
}

export default ApplicationStats