export interface Project {
  id: number;
  name: string;
  description: string;
  creacion: Date;
}

export interface ProjectCRUD {
  name: string
  description: string
  owner?: Owner
}

export interface Owner {
  id: number
}
