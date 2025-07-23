'use client'
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

// Definición de la interfaz de tarea
interface Task {
  id: number;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  dueDate: string;
}

// Datos de ejemplo
const tasks: Task[] = [
  {
    id: 1,
    title: "Diseñar UI",
    description: "Diseñar la interfaz de usuario para el módulo de login",
    status: "IN_PROGRESS",
    dueDate: "2024-08-01",
  },
  {
    id: 2,
    title: "Configurar backend",
    description: "Configurar endpoints para autenticación",
    status: "PENDING",
    dueDate: "2024-08-03",
  },
  {
    id: 3,
    title: "Pruebas unitarias",
    description: "Agregar pruebas unitarias al módulo de tareas",
    status: "DONE",
    dueDate: "2024-07-30",
  },
];

// Columnas dinámicas desde la interfaz
const taskColumns = Object.keys(tasks[0]) as (keyof Task)[];

export default function Projects() {

  const [projectId, setStateProjectId] = useState("");

  const params = useParams();

  if (!params.id || isNaN(Number(params.id))) {
    notFound();
  }

  useEffect(() => {
    setStateProjectId(params.id as string);
  }, [params.id])

  const handleAddTask = () => {
    console.log("Agregar nueva tarea");
  };

  const handleEdit = (task: Task) => {
    console.log("Editar tarea:", task);
  };

  const handleDelete = (task: Task) => {
    console.log("Eliminar tarea:", task);
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Proyecto con ID: {projectId}
        </h1>
        <button
          onClick={handleAddTask}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-colors"
        >
          <FaPlus />
          Agregar tarea
        </button>
      </div>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
          <thead>
            <tr>
              {taskColumns.map((col) => (
                <th
                  key={col as string}
                  className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left font-semibold text-gray-700 dark:text-gray-200"
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                </th>
              ))}
              <th className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left font-semibold text-gray-700 dark:text-gray-200">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {taskColumns.map((col) => (
                  <td
                    key={col as string}
                    className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                  >
                    {task[col]}
                  </td>
                ))}
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(task)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}