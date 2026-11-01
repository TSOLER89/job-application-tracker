import AppIcon from './AppIcon'

function Header({ email, onLogout, isLoggingOut, logoutDisabled }) {
  return (
    <header className="header">
      <div className="header-inner">
      <div className="header-brand">
      <span className="brand-mark"><AppIcon name="applications" size={24} /></span>
      <div>
      <h1>JobTrack</h1>
      <p>Dina ansökningar. Samlade på ett ställe.</p>
      </div>
      </div>
      <div className="header-account" aria-label="Ditt konto">
        <span className="account-avatar" aria-hidden="true">{email?.charAt(0).toUpperCase()}</span>
        <div className="header-identity"><span>Inloggad som</span><strong title={email}>{email}</strong></div>
        <button className="header-logout" type="button" onClick={onLogout} disabled={logoutDisabled || isLoggingOut}>{isLoggingOut ? 'Loggar ut…' : 'Logga ut'}</button>
      </div>
      </div>
    </header>
  )
}
    
export default Header
