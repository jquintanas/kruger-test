import { Task, TaskCRUD } from "../interfaces/Task.inteface";
import { axiosGeneral } from "./axios";

export const getTaskByProject = (id: number) => {
  return axiosGeneral.get<Task[]>(`${process.env.NEXT_PUBLIC_TASKS ?? ""}/project/${id}`);
}

export const addNewTaskService = (data: TaskCRUD) => {
  return axiosGeneral.post<Task>(`${process.env.NEXT_PUBLIC_TASKS ?? ""}`, data);
}

export const updateTaskService = (id: number, data: TaskCRUD) => {
  return axiosGeneral.put<Task>(`${process.env.NEXT_PUBLIC_TASKS ?? ""}/${id}`, data);
}

export const deleteTaskService = (id: number) => {
  return axiosGeneral.delete(`${process.env.NEXT_PUBLIC_TASKS ?? ""}/${id}`);
}
