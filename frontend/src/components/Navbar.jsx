import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100',
  ].join(' ')

/** Top navigation: page links + current user + logout. */
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-6">
          <p className="text-sm font-semibold tracking-wide text-teal-700">ETMS</p>
          <nav className="flex flex-wrap gap-1">
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/employees" className={linkClass}>
              Employees
            </NavLink>
            <NavLink to="/departments" className={linkClass}>
              Departments
            </NavLink>
            <NavLink to="/tasks" className={linkClass}>
              Tasks
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <p className="font-medium text-slate-800">{user?.name || user?.email}</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">{user?.role}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
