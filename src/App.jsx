import { useEffect, useState } from 'react'
import AuthFlow from './components/AuthFlow'
import ProfileOnboarding from './components/ProfileOnboarding'
import SwipeDeck from './components/SwipeDeck'
import MatchesChat from './components/MatchesChat'

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('user_id'))
  const [phase, setPhase] = useState('auth')

  useEffect(() => {
    if (userId) setPhase('onboarding')
  }, [userId])

  const goSwipe = () => setPhase('swipe')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative min-h-screen p-6 max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="" className="w-10 h-10" />
            <h1 className="text-white text-2xl font-bold">Residence Dating</h1>
          </div>
          {userId && <button onClick={()=>{localStorage.removeItem('user_id'); setUserId(null); setPhase('auth')}} className="text-blue-300 text-sm">Log out</button>}
        </header>

        {!userId && (
          <AuthFlow onVerified={setUserId} />
        )}

        {userId && phase === 'onboarding' && (
          <div className="grid md:grid-cols-2 gap-6">
            <ProfileOnboarding userId={userId} onDone={goSwipe} />
            <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-2">How it works</h3>
              <ol className="list-decimal list-inside text-blue-200 space-y-1">
                <li>Sign in with your student email (polito/unito).</li>
                <li>Add at least 3 photos and your basics.</li>
                <li>Swipe to like or pass. Mutual likes become matches.</li>
                <li>Chat with your matches.</li>
              </ol>
            </div>
          </div>
        )}

        {userId && phase === 'swipe' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2"><SwipeDeck userId={userId} onMatched={()=>setPhase('chat')} /></div>
            <div><MatchesChat userId={userId} /></div>
          </div>
        )}

        {userId && phase !== 'swipe' && phase !== 'onboarding' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2"><SwipeDeck userId={userId} onMatched={()=>setPhase('chat')} /></div>
            <div><MatchesChat userId={userId} /></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
