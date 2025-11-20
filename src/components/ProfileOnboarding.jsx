import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ProfileOnboarding({ userId, onDone }) {
  const [firstName, setFirstName] = useState('')
  const [residenceId, setResidenceId] = useState('')
  const [allowAll, setAllowAll] = useState(false)
  const [bio, setBio] = useState('')
  const [age, setAge] = useState('')
  const [photos, setPhotos] = useState(['', '', ''])
  const [message, setMessage] = useState('')

  const save = async () => {
    setMessage('')
    try {
      const urls = photos.filter(Boolean)
      const res = await fetch(`${API}/profile?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          residence_id: residenceId || null,
          allow_all_residences: allowAll,
          bio,
          age: age ? Number(age) : null,
          photos: urls
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to save profile')
      onDone()
    } catch (e) {
      setMessage(e.message)
    }
  }

  const updatePhoto = (idx, value) => {
    const next = [...photos]
    next[idx] = value
    setPhotos(next)
  }

  const addPhoto = () => setPhotos(p => p.length < 8 ? [...p, ''] : p)

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6 space-y-4">
      <h2 className="text-white text-xl font-semibold">Set up your profile</h2>
      <div className="grid gap-3">
        <input className="px-3 py-2 rounded bg-slate-900 text-white border border-slate-700" placeholder="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} />
        <input className="px-3 py-2 rounded bg-slate-900 text-white border border-slate-700" placeholder="Residence (e.g., Dorm A)" value={residenceId} onChange={e=>setResidenceId(e.target.value)} />
        <label className="text-sm text-blue-200 flex items-center gap-2"><input type="checkbox" checked={allowAll} onChange={e=>setAllowAll(e.target.checked)} /> Allow discovery across all residences</label>
        <input className="px-3 py-2 rounded bg-slate-900 text-white border border-slate-700" placeholder="Age" value={age} onChange={e=>setAge(e.target.value)} />
        <textarea className="px-3 py-2 rounded bg-slate-900 text-white border border-slate-700" placeholder="Bio (no offensive content)" value={bio} onChange={e=>setBio(e.target.value)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium">Photos</h3>
          <button onClick={addPhoto} className="text-blue-300 text-sm">Add photo</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {photos.map((p, i) => (
            <input key={i} className="px-3 py-2 rounded bg-slate-900 text-white border border-slate-700" placeholder={`Photo URL #${i+1}`} value={p} onChange={e=>updatePhoto(i, e.target.value)} />
          ))}
        </div>
        <p className="text-xs text-blue-300 mt-2">Minimum 3, maximum 8 photos. Use direct image URLs for now.</p>
      </div>

      <button onClick={save} className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded">Save profile</button>
      {message && <p className="text-blue-200 text-sm">{message}</p>}
    </div>
  )
}
