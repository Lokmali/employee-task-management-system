import { useEffect, useState } from 'react'

/**
 * Stage 1 landing page.
 * It calls GET /api/health so you can see backend + frontend talking together.
 */
function App() {
  // health holds the JSON from the backend, or null before the call finishes.
  const [health, setHealth] = useState(null)
  // error holds a human-readable message if the backend is down.
  const [error, setError] = useState('')

  // useEffect with [] runs once after the first render (like componentDidMount).
  useEffect(() => {
    fetch('/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Health check failed')
        }
        return response.json()
      })
      .then((data) => {
        setHealth(data)
        setError('')
      })
      .catch(() => {
        setHealth(null)
        setError('Backend is not running. In backend/, run: mvnw.cmd spring-boot:run')
      })
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="max-w-xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="text-sm uppercase tracking-wide text-indigo-400">Stage 1</p>
        <h1 className="mt-2 text-3xl font-semibold">Employee Task Management</h1>
        <p className="mt-3 text-slate-400">
          Full-stack starter: Spring Boot API on port 8080, React + Tailwind on port 5173.
        </p>

        <div className="mt-6 rounded-xl bg-slate-950 p-4 border border-slate-800">
          <h2 className="text-sm font-medium text-slate-300">Backend health</h2>
          {health && (
            <p className="mt-2 text-emerald-400">
              {health.status}: {health.message}
            </p>
          )}
          {error && <p className="mt-2 text-amber-400">{error}</p>}
          {!health && !error && <p className="mt-2 text-slate-500">Checking...</p>}
        </div>
      </section>
    </main>
  )
}

export default App
