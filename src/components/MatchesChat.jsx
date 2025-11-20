import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function MatchesChat({ userId }) {
  const [matches, setMatches] = useState([])
  const [active, setActive] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  const loadMatches = async () => {
    const res = await fetch(`${API}/matches?user_id=${userId}`)
    const data = await res.json()
    setMatches(data.results || [])
  }

  const openMatch = async (m) => {
    setActive(m)
    const res = await fetch(`${API}/messages?user_id=${userId}&match_id=${m.match_id}`)
    const data = await res.json()
    setMessages(data.results || [])
  }

  const send = async () => {
    if (!text.trim()) return
    const res = await fetch(`${API}/messages?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ match_id: active.match_id, text })
    })
    await res.json()
    setText('')
    openMatch(active)
  }

  useEffect(() => { loadMatches() }, [])

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4">
        <h3 className="text-white font-semibold mb-3">Matches</h3>
        <div className="space-y-2">
          {matches.map(m => (
            <button key={m.match_id} onClick={() => openMatch(m)} className={`w-full text-left px-3 py-2 rounded ${active?.match_id===m.match_id? 'bg-slate-700' : 'bg-slate-900'} text-white`}>{m.first_name || 'Match'}</button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2 bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4 flex flex-col">
        {active ? (
          <>
            <div className="flex-1 overflow-auto space-y-2">
              {messages.map((msg) => (
                <div key={msg._id} className={`max-w-[70%] px-3 py-2 rounded ${msg.sender_id===userId?'bg-blue-600 text-white ml-auto':'bg-slate-700 text-white'}`}>{msg.text}</div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 px-3 py-2 rounded bg-slate-900 text-white border border-slate-700" placeholder="Type a message" />
              <button onClick={send} className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded">Send</button>
            </div>
          </>
        ) : (
          <p className="text-blue-200">Select a match to chat.</p>
        )}
      </div>
    </div>
  )
}
