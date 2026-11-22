import { useEffect, useState } from 'react'
import { getDepartments } from '../api/departmentApi'
import { getEmployees } from '../api/employeeApi'
import { getTasks } from '../api/taskApi'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'

/** Home page: simple counts fetched from the three list APIs. */
export default function DashboardPage() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({ employees: 0, departments: 0, tasks: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [employeesRes, departmentsRes, tasksRes] = await Promise.all([
          getEmployees({ page: 0, size: 1 }),
          getDepartments(),
          getTasks(),
        ])
        if (cancelled) return
        setCounts({
          // Page object from Spring: totalElements is the full count.
          employees: employeesRes.data.totalElements ?? employeesRes.data.content?.length ?? 0,
          departments: departmentsRes.data.length,
          tasks: tasksRes.data.length,
        })
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Could not load dashboard data.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <LoadingSpinner label="Loading dashboard..." />

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Welcome back, {user?.name || user?.email}. Role: {user?.role}
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Employees" value={counts.employees} />
        <StatCard label="Departments" value={counts.departments} />
        <StatCard label="Tasks" value={counts.tasks} />
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}
