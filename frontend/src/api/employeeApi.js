import axiosClient from './axiosClient'

/**
 * GET /api/employees?name=&page=&size=
 * Spring returns a Page object: { content, totalElements, totalPages, number, ... }
 */
export function getEmployees({ name = '', page = 0, size = 10 } = {}) {
  return axiosClient.get('/api/employees', {
    params: { name: name || undefined, page, size, sort: 'id,asc' },
  })
}

export function createEmployee(payload) {
  return axiosClient.post('/api/employees', payload)
}

export function updateEmployee(id, payload) {
  return axiosClient.put(`/api/employees/${id}`, payload)
}

export function deleteEmployee(id) {
  return axiosClient.delete(`/api/employees/${id}`)
}
