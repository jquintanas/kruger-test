import { ProjectCRUD } from "../interfaces/projects.interface";
import { axiosGeneral } from "./axios";

export const getAllProject = () => {
  return axiosGeneral.get(process.env.NEXT_PUBLIC_PROJECTS ?? "");
}

export const addProject = (data: ProjectCRUD) => {
  return axiosGeneral.post(process.env.NEXT_PUBLIC_PROJECTS ?? "", data)
}

export const editProject = (data: ProjectCRUD, id: string) => {
  return axiosGeneral.put(`${process.env.NEXT_PUBLIC_PROJECTS ?? ""}/${id}`, data)
}

export const deleteProject = (id: string) => {
  return axiosGeneral.delete(`${process.env.NEXT_PUBLIC_PROJECTS ?? ""}/${id}`);
}