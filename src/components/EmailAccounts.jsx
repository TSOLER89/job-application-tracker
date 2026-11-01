import { useEffect, useState } from 'react'
import { apiFetch, errorMessage } from '../services/authService'

const API = `${import.meta.env.VITE_API_BASE_URL}/api/email-connections`

export default function EmailAccounts() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [revision, setRevision] = useState(0)
  const result = new URLSearchParams(window.location.search).get('gmail')
  useEffect(() => {
    let active = true
    apiFetch(API).then(async response => {
      if (!response.ok) throw new Error(await errorMessage(response))
      const accounts = await response.json()
      if (active) setData(accounts)
    }).catch(error => { if (active) setError(error.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [revision])

  function reload() { setError(''); setLoading(true); setRevision(value => value + 1) }
  async function connect() {
    if (busy) return
    setBusy(true); setError('')
    try {
      const response = await apiFetch(API + '/gmail/connect', { method: 'POST' })
      if (!response.ok) throw new Error(await errorMessage(response))
      const { authorizationUrl } = await response.json()
      const url = new URL(authorizationUrl)
      if (url.origin !== new URL(API).origin || url.pathname !== '/api/email-connections/gmail/authorize') throw new Error('Servern skickade en ogiltig anslutningsadress.')
      window.location.assign(url.href)
    } catch (error) { setError(error.message); setBusy(false) }
  }
  async function disconnect(id) {
    if (busy) return
    setBusy(true); setError(''); setMessage('')
    try {
      const response = await apiFetch(API + '/' + id, { method: 'DELETE' })
      if (!response.ok) throw new Error(await errorMessage(response))
      const result = await response.json()
      setData(current => ({ ...current, accounts: current.accounts.filter(account => account.id !== id) }))
      setConfirmId(null)
      setMessage(result.providerRevoked ? 'Mejlkontot har kopplats från.' : 'Kopplingen är borttagen här. Kontrollera även JobTracks behörighet i ditt Google-konto.')
    } catch (error) { setError(error.message) }
    finally { setBusy(false) }
  }
  return <section aria-labelledby="email-accounts-heading">
    <div className="overview-heading"><div><h2 id="email-accounts-heading">Mejlkonton</h2><p>Anslut dina mejlkonton till din personliga JobTrack-översikt.</p></div></div>
    {error && <div className="feedback feedback-error" role="alert"><span>{error}</span><button type="button" onClick={reload} disabled={busy || loading}>Försök igen</button></div>}
    {message && <p className="feedback feedback-success" role="status">{message}</p>}
    {result === 'failed' && <p className="feedback feedback-error" role="alert">Gmail-anslutningen kunde inte slutföras. Kontrollera att du godkände behörigheten och försök igen.</p>}
    {result === 'connected' && data?.accounts.some(account => account.provider === 'gmail') && <p className="feedback feedback-success" role="status">Gmail är anslutet. Kontot visas nedan.</p>}
    {loading && <p className="loading-state" role="status">Hämtar anslutna mejlkonton…</p>}
    <div className="mail-provider-grid">
      <article className="mail-provider">
        <span className="section-eyebrow">GOOGLE</span><h3>Gmail</h3>
        <p>Anslut med Google och godkänn läsbehörighet till Gmail. Ditt Google-lösenord hanteras av Google.</p>
        {!loading && data && !data.gmailConfigured && <p className="mail-setup-note">Anslutningen behöver först konfigureras på servern. Följ Gmail-guiden i projektets README.</p>}
        <button type="button" className="auth-primary" disabled={!data?.gmailConfigured || loading || busy} onClick={connect}>{busy ? 'Vänta…' : 'Anslut Gmail'}</button>
      </article>
      <article className="mail-provider">
        <span className="section-eyebrow">MICROSOFT</span><h3>Outlook</h3><p>Skolmejlen får en egen anslutning i nästa etapp.</p><span className="mail-status">Kommer senare</span>
      </article>
    </div>
    <div className="mail-connected">
      <h3>Anslutna konton</h3>
      {data && data.accounts.length === 0 && <p className="statistics-note">Inga mejlkonton är anslutna ännu.</p>}
      {data?.accounts.map(account => <article className="mail-account" key={account.id}>
        <div><strong>{account.email}</strong><p>Gmail · Anslutet</p><small>Verifierat {new Date(account.verifiedAt).toLocaleString('sv-SE')}</small></div>
        {confirmId === account.id ? <div className="mail-actions"><p>Koppla från det här mejlkontot?</p><button className="delete-button" type="button" disabled={busy} onClick={() => disconnect(account.id)}>Bekräfta frånkoppling</button><button className="secondary-button" type="button" disabled={busy} onClick={() => setConfirmId(null)}>Avbryt</button></div>
          : <button className="secondary-button" type="button" disabled={busy} onClick={() => setConfirmId(account.id)}>Koppla från</button>}
      </article>)}
    </div>
    <p className="mail-stage-note">Första steget är att ansluta kontot. Import av ansökningsmejl och förslag att granska kommer i nästa steg.</p>
  </section>
}
