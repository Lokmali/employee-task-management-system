import axiosClient from './axiosClient'

export function getDepartments() {
  return axiosClient.get('/api/departments')
}

export function createDepartment(payload) {
  return axiosClient.post('/api/departments', payload)
}

export function updateDepartment(id, payload) {
  return axiosClient.put(`/api/departments/${id}`, payload)
}

export function deleteDepartment(id) {
  return axiosClient.delete(`/api/departments/${id}`)
}
