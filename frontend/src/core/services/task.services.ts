import { Task, TaskInsert } from "../interfaces/Task.inteface";
import { axiosGeneral } from "./axios";

export const getTaskByProject = (id: number) => {
  return axiosGeneral.get<Task[]>(`${process.env.NEXT_PUBLIC_TASKS ?? ""}/project/${id}`);
}

export const addNewTaskService = (data: TaskInsert) => {
  return axiosGeneral.post<Task>(`${process.env.NEXT_PUBLIC_TASKS ?? ""}`, data);
}