import { useRef, useState } from 'react'
import { authenticate } from '../services/authService'

export default function AuthScreen({ onAuthenticated, connectionError, onRetry }) {
  const [mode, setMode] = useState('welcome')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)
  const register = mode === 'register'

  function choose(next) {
    setMode(next)
    setPassword('')
    setConfirmation('')
    setError('')
  }

  async function submit(event) {
    event.preventDefault()
    if (busyRef.current) return
    if (register && password !== confirmation) { setError('Lösenorden stämmer inte överens.'); return }
    busyRef.current = true
    setBusy(true)
    setError('')
    try {
      const user = await authenticate(mode, email, password)
      setPassword('')
      setConfirmation('')
      onAuthenticated(user)
    } catch (error) {
      setError(error instanceof TypeError ? 'Kunde inte nå servern. Kontrollera anslutningen och försök igen.' : error.message)
    } finally { busyRef.current = false; setBusy(false) }
  }

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <span className="header-eyebrow">DIN KARRIÄR, ETT STEG I TAGET</span>
        <p className="auth-brand">JobTrack</p>
        <h1>Mer överblick.<br />Plats för nästa steg.</h1>
        <p>Samla dina jobbansökningar och följ vägen från första intresse till nästa möjlighet.</p>
        <ul><li>Alla dina ansökningar på ett ställe</li><li>Tydlig status, bilder och anteckningar</li><li>Din personliga översikt på webb och mobil</li></ul>
      </section>
      <section className="auth-card" aria-label="Ditt JobTrack-konto">
        {connectionError && <div className="feedback feedback-error" role="alert"><span>{connectionError}</span><button type="button" onClick={onRetry}>Försök igen</button></div>}
        {mode === 'welcome' ? <>
          <p className="section-eyebrow">VÄLKOMMEN TILL JOBTRACK</p>
          <h2>Gör jobbsökandet enklare.</h2>
          <p>Skapa ditt konto och börja samla ansökningar. Har du redan ett konto kan du logga in direkt.</p>
          <button className="auth-primary" type="button" onClick={() => choose('register')}>Skapa konto</button>
          <button className="secondary-button" type="button" onClick={() => choose('login')}>Logga in</button>
        </> : <form onSubmit={submit} aria-busy={busy}>
          <fieldset disabled={busy} className="form-fields">
            <p className="section-eyebrow">DITT PERSONLIGA JOBBSÖKANDE</p>
            <h2>{register ? 'Skapa ditt konto' : 'Välkommen tillbaka'}</h2>
            <p>{register ? 'Välj ett nytt lösenord för ditt JobTrack-konto.' : 'Logga in med ditt JobTrack-konto.'}</p>
            {error && <p className="feedback feedback-error" role="alert">{error}</p>}
            <label>Mejladress<input type="email" autoComplete="username" autoCapitalize="none" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} /></label>
            <label>Lösenord<input type="password" autoComplete={register ? 'new-password' : 'current-password'} required minLength={register ? 10 : undefined} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} aria-describedby={register ? 'password-hint' : undefined} /></label>
            {register && <>
              <p className="form-hint" id="password-hint">Minst 10 tecken, med stor och liten bokstav samt en siffra.</p>
              <label>Bekräfta lösenord<input type="password" autoComplete="new-password" required maxLength={128} value={confirmation} onChange={event => setConfirmation(event.target.value)} /></label>
            </>}
            <button className="auth-primary" type="submit">{busy ? 'Vänta…' : register ? 'Skapa konto' : 'Logga in'}</button>
            <button className="secondary-button" type="button" onClick={() => choose(register ? 'login' : 'register')}>{register ? 'Har du redan konto? Logga in' : 'Ny här? Skapa konto'}</button>
            <button className="auth-back" type="button" onClick={() => choose('welcome')}>Till startsidan</button>
          </fieldset>
        </form>}
      </section>
    </main>
  )
}
