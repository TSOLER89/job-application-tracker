function Header({ email, onLogout, isLoggingOut, logoutDisabled }) {
  return (
    <header className="header">
      <div className="header-inner">
      <div className="header-brand">
      <span className="header-eyebrow">DIN KARRIÄR, ETT STEG I TAGET</span>
      <h1>JobTrack</h1>
      <p>Dina ansökningar. Samlade på ett ställe.</p>
      </div>
      <div className="header-account" aria-label="Ditt konto">
        <div className="header-identity"><span>Inloggad som</span><strong>{email}</strong></div>
        <button className="header-logout" type="button" onClick={onLogout} disabled={logoutDisabled || isLoggingOut}>{isLoggingOut ? 'Loggar ut…' : 'Logga ut'}</button>
      </div>
      </div>
    </header>
  )
}
    
export default Header
