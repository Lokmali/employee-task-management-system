import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Public register form. Creates a user and logs them in immediately. */
export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    employeeId: '',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.password) next.password = 'Password is required'
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters'
    if (!form.role) next.role = 'Role is required'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!validate()) return

    setLoading(true)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        employeeId: form.employeeId ? Number(form.employeeId) : null,
      })
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">ETMS</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">
          EMPLOYEE users can pass an existing employee id to link their tasks.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <label className="mt-6 block text-sm font-medium text-slate-700">
          Name
          <input
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
          />
          {fieldErrors.name && (
            <span className="mt-1 block text-xs text-red-600">{fieldErrors.name}</span>
          )}
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
          />
          {fieldErrors.email && (
            <span className="mt-1 block text-xs text-red-600">{fieldErrors.email}</span>
          )}
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
          />
          {fieldErrors.password && (
            <span className="mt-1 block text-xs text-red-600">{fieldErrors.password}</span>
          )}
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Role
          <select
            value={form.role}
            onChange={(e) => setField('role', e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
          >
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Employee ID (optional)
          <input
            type="number"
            value={form.employeeId}
            onChange={(e) => setField('employeeId', e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
            placeholder="Link to existing employee row"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Register'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-teal-700 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
