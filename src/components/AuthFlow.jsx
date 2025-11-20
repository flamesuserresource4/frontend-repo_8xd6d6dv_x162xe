import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function AuthFlow({ onVerified }) {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [phase, setPhase] = useState('enter-email')
  const [message, setMessage] = useState('')

  const sendMagic = async () => {
    setMessage('')
    try {
      const res = await fetch(`${API}/auth/magic/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'login' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to send link')
      setPhase('verify')
      setToken(data.token) // for demo convenience
      setMessage('Magic link created. Token prefilled for demo.')
    } catch (e) {
      setMessage(e.message)
    }
  }

  const verify = async () => {
    setMessage('')
    try {
      const res = await fetch(`${API}/auth/magic/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Verify failed')
      localStorage.setItem('user_id', data.user_id)
      onVerified(data.user_id)
    } catch (e) {
      setMessage(e.message)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
      <h2 className="text-white text-xl font-semibold mb-4">Student Sign-in</h2>
      {phase === 'enter-email' && (
        <div className="space-y-3">
          <input className="w-full px-3 py-2 rounded bg-slate-900 text-white border border-slate-700" placeholder="your.name@studenti.polito.it or @unito.it" value={email} onChange={e=>setEmail(e.target.value)} />
          <button onClick={sendMagic} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded">Send Magic Link</button>
        </div>
      )}
      {phase === 'verify' && (
        <div className="space-y-3">
          <input className="w-full px-3 py-2 rounded bg-slate-900 text-white border border-slate-700" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full px-3 py-2 rounded bg-slate-900 text-white border border-slate-700" value={token} onChange={e=>setToken(e.target.value)} />
          <button onClick={verify} className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded">Verify</button>
        </div>
      )}
      {message && <p className="text-blue-200 mt-3 text-sm">{message}</p>}
    </div>
  )
}
