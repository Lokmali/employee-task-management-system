import { useEffect, useState } from 'react'
import { getDepartments } from '../api/departmentApi'
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from '../api/employeeApi'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'

const PAGE_SIZE = 10

const emptyForm = {
  name: '',
  email: '',
  designation: '',
  departmentId: '',
}

/** Employees table: search, pagination, ADMIN CRUD modal. */
export default function EmployeesPage() {
  const { isAdmin } = useAuth()
  const [pageData, setPageData] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
  })
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadEmployees = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getEmployees({ name: query, page, size: PAGE_SIZE })
      setPageData(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load employees.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [page, query])

  useEffect(() => {
    // Departments are needed for the create/edit dropdown (ADMIN only, but cheap for all).
    getDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => setDepartments([]))
  }, [])

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (employee) => {
    setEditing(employee)
    setForm({
      name: employee.name,
      email: employee.email,
      designation: employee.designation,
      departmentId: String(employee.departmentId),
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    setPage(0)
    setQuery(search.trim())
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.designation.trim() || !form.departmentId) {
      setFormError('All fields are required.')
      return
    }
    setSaving(true)
    setFormError('')
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      designation: form.designation.trim(),
      departmentId: Number(form.departmentId),
    }
    try {
      if (editing) {
        await updateEmployee(editing.id, payload)
      } else {
        await createEmployee(payload)
      }
      setModalOpen(false)
      await loadEmployees()
    } catch (err) {
      const apiMessage = err.response?.data?.message
      const fieldErrors = err.response?.data?.fieldErrors
      if (fieldErrors) {
        setFormError(Object.values(fieldErrors).join(' '))
      } else {
        setFormError(apiMessage || 'Save failed.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return
    try {
      await deleteEmployee(id)
      await loadEmployees()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Employees</h1>
          <p className="mt-1 text-sm text-slate-500">Search by name. Page size: {PAGE_SIZE}.</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Add employee
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className="mt-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
        <button
          type="submit"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Search
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : pageData.content.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No employees found" hint="Try another search or add an employee." />
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Designation</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  {isAdmin && <th className="px-4 py-3 font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {pageData.content.map((employee) => (
                  <tr key={employee.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-800">{employee.name}</td>
                    <td className="px-4 py-3 text-slate-600">{employee.email}</td>
                    <td className="px-4 py-3 text-slate-600">{employee.designation}</td>
                    <td className="px-4 py-3 text-slate-600">{employee.departmentName}</td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(employee)}
                            className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(employee.id)}
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <p>
              Page {pageData.number + 1} of {Math.max(pageData.totalPages, 1)} ·{' '}
              {pageData.totalElements} total
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page + 1 >= pageData.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit employee' : 'Add employee'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-3">
            {formError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
            )}
            <label className="block text-sm font-medium text-slate-700">
              Name
              <input
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Designation
              <input
                value={form.designation}
                onChange={(e) => setField('designation', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Department
              <select
                value={form.departmentId}
                onChange={(e) => setField('departmentId', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-500"
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
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
