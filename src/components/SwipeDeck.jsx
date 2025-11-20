import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function SwipeDeck({ userId, onMatched }) {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/discover?user_id=${userId}`)
      const data = await res.json()
      setCards(data.results || [])
    } catch (e) {
      setMessage('Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const doSwipe = async (target_id, direction) => {
    try {
      const res = await fetch(`${API}/swipe?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_id, direction })
      })
      const data = await res.json()
      setCards(prev => prev.filter(c => c.user_id !== target_id))
      if (data.match) onMatched && onMatched()
      if (cards.length < 3) load()
    } catch (e) {
      setMessage('Swipe failed')
    }
  }

  if (loading) return <p className="text-blue-200">Loading...</p>
  if (!cards.length) return <p className="text-blue-200">No more cards right now.</p>

  const top = cards[0]

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
      <div className="relative">
        <img src={top.photos?.[0]?.url} alt="" className="w-full h-72 object-cover rounded-xl" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl">
          <div className="text-white text-xl font-semibold">{top.first_name} {top.age ? `• ${top.age}` : ''}</div>
          <div className="text-blue-200 text-sm line-clamp-2">{top.bio}</div>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <button onClick={() => doSwipe(top.user_id, 'left')} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded">Pass</button>
        <button onClick={() => doSwipe(top.user_id, 'right')} className="flex-1 bg-pink-600 hover:bg-pink-500 text-white py-2 rounded">Like</button>
      </div>
      {message && <p className="text-blue-200 text-sm mt-2">{message}</p>}
    </div>
  )
}
