import { useEffect, useState } from 'react'
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from '../api/departmentApi'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'

/** Departments list with ADMIN-only add/edit/delete. */
export default function DepartmentsPage() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getDepartments()
      setItems(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load departments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setName('')
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (dept) => {
    setEditing(dept)
    setName(dept.name)
    setFormError('')
    setModalOpen(true)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!name.trim()) {
      setFormError('Name is required')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      if (editing) {
        await updateDepartment(editing.id, { name: name.trim() })
      } else {
        await createDepartment({ name: name.trim() })
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return
    try {
      await deleteDepartment(id)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Departments</h1>
          <p className="mt-1 text-sm text-slate-500">Organization units for employees.</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Add department
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No departments yet" hint={isAdmin ? 'Click Add department to create one.' : undefined} />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Name</th>
                {isAdmin && <th className="px-4 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((dept) => (
                <tr key={dept.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-slate-500">{dept.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{dept.name}</td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(dept)}
                          className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(dept.id)}
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
        <Modal title={editing ? 'Edit department' : 'Add department'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            {formError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
            )}
            <label className="block text-sm font-medium text-slate-700">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
              />
            </label>
            <div className="flex justify-end gap-2">
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
