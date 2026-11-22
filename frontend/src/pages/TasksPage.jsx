import { useEffect, useMemo, useState } from 'react'
import { getEmployees } from '../api/employeeApi'
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from '../api/taskApi'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']

const emptyForm = {
  title: '',
  description: '',
  status: 'TODO',
  dueDate: '',
  employeeId: '',
}

/** Tasks list with status filter. ADMIN can CRUD; everyone can change status (own tasks for EMPLOYEE). */
export default function TasksPage() {
  const { isAdmin } = useAuth()
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getTasks()
      setTasks(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    getEmployees({ page: 0, size: 100 })
      .then((res) => setEmployees(res.data.content || []))
      .catch(() => setEmployees([]))
  }, [isAdmin])

  const filtered = useMemo(() => {
    if (statusFilter === 'ALL') return tasks
    return tasks.filter((t) => t.status === statusFilter)
  }, [tasks, statusFilter])

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setEditing(task)
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      dueDate: task.dueDate || '',
      employeeId: String(task.employeeId),
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.status || !form.employeeId) {
      setFormError('Title, status and employee are required.')
      return
    }
    setSaving(true)
    setFormError('')
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      dueDate: form.dueDate || null,
      employeeId: Number(form.employeeId),
    }
    try {
      if (editing) {
        await updateTask(editing.id, payload)
      } else {
        await createTask(payload)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update status.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">
            Filter by status. EMPLOYEE users see their own tasks only.
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Add task
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {['ALL', ...STATUSES].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={[
              'rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide',
              statusFilter === status
                ? 'bg-teal-600 text-white'
                : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50',
            ].join(' ')}
          >
            {status}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No tasks to show" hint="Try another status filter." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {isAdmin && <th className="px-4 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <tr key={task.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{task.title}</p>
                    {task.description && (
                      <p className="mt-0.5 text-xs text-slate-500">{task.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{task.employeeName}</td>
                  <td className="px-4 py-3 text-slate-600">{task.dueDate || '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(task)}
                          className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(task.id)}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit task' : 'Add task'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-3">
            {formError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
            )}
            <label className="block text-sm font-medium text-slate-700">
              Title
              <input
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Description
              <textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Status
              <select
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Due date
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setField('dueDate', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Employee
              <select
                value={form.employeeId}
                onChange={(e) => setField('employeeId', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
              >
                <option value="">Select employee</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
