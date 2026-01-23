import { tasks } from './mock';

import type { Task } from '../model/types'

const PAGE_SIZE = 20

export const fetchTasks = async (page: number): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 400))

  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  return tasks.slice(start, end)
}

export const fetchTaskById = async (id: number): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  return tasks.find(task => task.id === id)!
}
