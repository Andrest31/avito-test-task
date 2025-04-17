import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useBoards = () => {
  return useQuery({
    queryKey: ['boards'],
    queryFn: () => apiClient.get('/boards').then(res => res.data),
  });
};

export const useTasks = (boardId?: string) => {
  return useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => 
      boardId 
        ? apiClient.get(`/boards/${boardId}`).then(res => res.data)
        : apiClient.get('/tasks').then(res => res.data),
  });
};