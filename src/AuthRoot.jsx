import { useCallback, useEffect, useRef, useState } from 'react'
import App from './App'
import AuthScreen from './components/AuthScreen'
import { getSession, logout } from './services/authService'
import './App.css'

export default function AuthRoot() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const revisionRef = useRef(0)

  const restore = useCallback(async () => {
    const revision = ++revisionRef.current
    try { const account = await getSession(); if (revision === revisionRef.current) { setUser(account); setError('') } }
    catch { if (revision === revisionRef.current) setError('Kunde inte kontrollera inloggningen. Kontrollera att servern är igång och försök igen.') }
    finally { if (revision === revisionRef.current) setLoading(false) }
  }, [])

  useEffect(() => {
    let active = true
    const revision = ++revisionRef.current
    getSession().then(account => {
      if (active && revision === revisionRef.current) { setUser(account); setError('') }
    }).catch(() => {
      if (active && revision === revisionRef.current) setError('Kunde inte kontrollera inloggningen. Kontrollera att servern är igång och försök igen.')
    }).finally(() => { if (active && revision === revisionRef.current) setLoading(false) })
    function expired() { revisionRef.current++; setUser(null); setError('Din session har gått ut. Logga in igen för att fortsätta.') }
    window.addEventListener('jobtrack-session-expired', expired)
    window.addEventListener('focus', restore)
    return () => { active = false; window.removeEventListener('jobtrack-session-expired', expired); window.removeEventListener('focus', restore) }
  }, [restore])

  async function signOut() {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    revisionRef.current++
    try { await logout(); setUser(null); setError('') }
    catch (error) { setError(error instanceof TypeError ? 'Kunde inte nå servern för att logga ut. Försök igen.' : error.message) }
    finally { setIsLoggingOut(false) }
  }

  if (loading) return <main className="auth-loading"><p className="loading-state" role="status">Kontrollerar inloggningen…</p></main>
  if (!user) return <AuthScreen connectionError={error} onRetry={restore} onAuthenticated={account => { revisionRef.current++; setUser(account); setError('') }} />
  return <App key={user.id} user={user} onLogout={signOut} isLoggingOut={isLoggingOut} logoutError={error} />
}
