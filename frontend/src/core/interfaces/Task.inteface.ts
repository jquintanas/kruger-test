import { TaskStatus } from "../enums/taskStatus.enum"

export interface Task {
  id: number
  title: string
  description: string
  status: string
  dueDate: string
  createdAt: string
  assignedTo: string
  projectId: number
}

export interface TaskDto {
  id: number,
  titulo: string,
  descripcion: string,
  creacion: Date | string,
  Usuario: string,
  idProyecto: number,
  estado: TaskStatus
}

export interface TaskCRUD {
  title: string
  description: string
  status: string
  assignedTo?: AssignedTo
  project?: Project
}

export interface AssignedTo {
  id: number
}

export interface Project {
  id: number
}
