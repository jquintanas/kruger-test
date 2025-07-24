"use client";
import { useLoading } from "@/core/hooks/useLoading";
import { useNotification } from "@/core/hooks/useNotification";
import { useUserData } from "@/core/hooks/useUserData";
import { parseErrorAxios } from "@/core/services/axios";
import { addNewTaskService } from "@/core/services/task.services";
import { useForm } from "react-hook-form";

type TaskForm = {
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
};

interface AddTaskProps {
  closeModal: () => void;
  projectId: number
}

export default function AddTask({ closeModal, projectId }: AddTaskProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TaskForm>({
    defaultValues: {
      status: "PENDING",
    },
  });

  const { user, isAuthenticated } = useUserData();
  const { showNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();

  const handleFormSubmit = async (data: TaskForm) => {
    if (!isAuthenticated) {
      showNotification("error", "Error al crear la tarea", "No hay un usuario en sesión.");
      return;
    }
    showLoading();
    await addNewTaskService(
      {
        title: data.title,
        status: data.status,
        description: data.description,
        assignedTo: { id: user?.id || 1 },
        project: { id: projectId },
      }
    ).then(
      () => {
        hideLoading();
        closeModal();
      }
    ).catch(
      err => {
        console.error(err);
        hideLoading();
        showNotification("error", "Error", parseErrorAxios(err));
      }
    )
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 w-full">
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          type="text"
          {...register("title", { required: "El título es obligatorio" })}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${errors.title ? "border-red-500" : "border-gray-300"
            }`}
          autoFocus
        />
        {errors.title && (
          <span className="text-red-600 text-xs">{errors.title.message}</span>
        )}
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          {...register("description", { required: "La descripción es obligatoria" })}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${errors.description ? "border-red-500" : "border-gray-300"
            }`}
          rows={3}
        />
        {errors.description && (
          <span className="text-red-600 text-xs">{errors.description.message}</span>
        )}
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1" htmlFor="status">
          Estado
        </label>
        <select
          id="status"
          {...register("status", { required: "El estado es obligatorio" })}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${errors.status ? "border-red-500" : "border-gray-300"
            }`}
        >
          <option value="PENDING">Pendiente</option>
          <option value="IN_PROGRESS">En progreso</option>
          <option value="DONE">Finalizada</option>
        </select>
        {errors.status && (
          <span className="text-red-600 text-xs">{errors.status.message}</span>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Crear tarea
        </button>
      </div>
    </form>
  );
}