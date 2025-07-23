"use client";
import { useLoading } from "@/core/hooks/useLoading";
import { useNotification } from "@/core/hooks/useNotification";
import { useUserData } from "@/core/hooks/useUserData";
import { ProjectCRUD } from "@/core/interfaces/projects.interface";
import { parseErrorAxios } from "@/core/services/axios";
import { addProject } from "@/core/services/projects.services";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

type AddProjectForm = {
  name: string;
  description: string;
};

interface AddProjectProps {
  closeModal: any;
}

export default function AddProject({ closeModal }: AddProjectProps) {
  const { showNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();
  const { user, isAuthenticated } = useUserData();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AddProjectForm>();

  const handleFormSubmit = useCallback(async (data: AddProjectForm & { description: string }) => {
    if (!isAuthenticated) {
      showNotification("error", "Error al crear el proyecto", "No hay un usuario en sesión.");
      return;
    }
    showLoading();
    const { name, description } = data;
    const dta: ProjectCRUD = {
      name: name,
      description: description,
      owner: {
        id: user?.id || 1,
      }
    }
    await addProject(dta).then(
      () => {
        hideLoading();
        closeModal();
      }
    ).catch(
      err => {
        console.error(err);
        const parsedError = parseErrorAxios(err);
        showNotification("error", "Error al crear el proyecto", parsedError);
        hideLoading();
      }
    )
  }, [closeModal, hideLoading, isAuthenticated, showLoading, showNotification, user?.id]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 w-full">
      <div>
        <input
          id="name"
          type="text"
          placeholder="Nombre del proyecto"
          {...register("name", { required: "El nombre es obligatorio" })}
          className={`w-full max-w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${errors.name ? "border-red-500" : "border-gray-300"
            }`}
          autoFocus
        />
        {errors.name && (
          <span className="text-red-600 text-xs">{errors.name.message}</span>
        )}
      </div>
      <div>
        <textarea
          id="description"
          placeholder="Descripción del proyecto"
          {...register("description", { required: "La descripción es obligatoria" })}
          className={`w-full max-w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${errors.description ? "border-red-500" : "border-gray-300"
            }`}
          rows={3}
        />
        {errors.description && (
          <span className="text-red-600 text-xs">{errors.description.message}</span>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Crear
        </button>
      </div>
    </form>
  );
}
