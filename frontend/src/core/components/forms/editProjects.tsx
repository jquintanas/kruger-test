"use client";
import { useLoading } from "@/core/hooks/useLoading";
import { useNotification } from "@/core/hooks/useNotification";
import { useUserData } from "@/core/hooks/useUserData";
import { Project } from "@/core/interfaces/projects.interface";
import { parseErrorAxios } from "@/core/services/axios";
import { editProject } from "@/core/services/projects.services";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

type EditProjectForm = {
  name: string;
  description: string;
};

interface EditProjectProps {
  closeModal: () => void;
  project: Project | null;
}

export default function EditProject({ closeModal, project }: EditProjectProps) {
  const { showNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();
  const { isAuthenticated } = useUserData();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProjectForm>({
    defaultValues: {
      name: project?.name,
      description: project?.description,
    },
  });

  const handleFormSubmit = useCallback(async (data: EditProjectForm) => {
    if (!isAuthenticated) {
      showNotification("error", "Error al editar el proyecto", "No hay un usuario en sesión.");
      return;
    }
    const { description, name } = data;
    showLoading();
    await editProject({ description, name }, project?.id.toString() ?? "1").then(
      () => {
        hideLoading();
        closeModal();
      }
    ).catch(
      err => {
        console.error(err);
        const parsedError = parseErrorAxios(err);
        showNotification("error", "Error al editar la información", parsedError);
        hideLoading();
      }
    )
  }, [closeModal, hideLoading, isAuthenticated, project?.id, showLoading, showNotification]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 w-full">
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1" htmlFor="name">
          Nombre del proyecto
        </label>
        <input
          id="name"
          type="text"
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
        <label className="block text-gray-700 dark:text-gray-200 mb-1" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          {...register("description", { required: "La descripción es obligatoria" })}
          className={`w-full max-w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${errors.description ? "border-red-500" : "border-gray-300"
            }`}
          rows={3}
        />
        {errors.description && (
          <span className="text-red-600 text-xs">{errors.description.message}</span>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          {"Guardar"}
        </button>
      </div>
    </form>
  );
}