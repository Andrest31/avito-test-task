import { apiClient } from './client'

export const fetchBoards = async () => {
  const response = await apiClient.get('/boards')
  return response.data
}