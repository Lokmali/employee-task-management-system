import axiosClient from './axiosClient'

export function getTasks() {
  return axiosClient.get('/api/tasks')
}

export function createTask(payload) {
  return axiosClient.post('/api/tasks', payload)
}

export function updateTask(id, payload) {
  return axiosClient.put(`/api/tasks/${id}`, payload)
}

export function updateTaskStatus(id, status) {
  return axiosClient.patch(`/api/tasks/${id}/status`, { status })
}

export function deleteTask(id) {
  return axiosClient.delete(`/api/tasks/${id}`)
}
