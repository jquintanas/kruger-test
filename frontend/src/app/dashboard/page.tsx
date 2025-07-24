"use client";

import { ConfirmDialog } from "@/core/components/ConfirmModal";
import AddProject from "@/core/components/forms/addProject";

import EditProject from "@/core/components/forms/editProjects";
import ModalWrapper from "@/core/components/Modal";
import { useLoading } from "@/core/hooks/useLoading";
import { useNotification } from "@/core/hooks/useNotification";
import { Project } from "@/core/interfaces/projects.interface";
import { parseErrorAxios } from "@/core/services/axios";
import { deleteProject, getAllProject } from "@/core/services/projects.services";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter();
  const [confirmDelete, setStateConfirmDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEditModal, setStateOpenEditModal] = useState(false);
  const { showNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();
  const [allProjects, setStateallProjects] = useState<Project[]>([]);
  const currentProject = useRef<Project | null>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const paginatedProjects = useMemo(() => {
    const start = pageIndex * pageSize;
    return allProjects.slice(start, start + pageSize);
  }, [allProjects, pageIndex, pageSize]);

  const pageCount = Math.ceil(allProjects.length / pageSize);

  const gelAllProjectsCallBack = useCallback(async () => {
    showLoading();
    await getAllProject()
      .then((resp) => {
        const projects: Project[] = resp.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          creacion: new Date(item.createdAt),
          description: item.description || "",
        }));
        setStateallProjects(projects);
      })
      .catch((err) => {
        console.error("Error al obtener proyectos:", err);
        const parsedError = parseErrorAxios(err);
        showNotification("error", "Error al obtener proyectos", parsedError);
      });
    hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotification]);

  const handleAdd = () => {
    setOpen(true);
  };

  const handleEdit = (project: Project) => {
    currentProject.current = project;
    setStateOpenEditModal(true);
  };

  const handleDelete = useCallback(async (project: Project) => {
    currentProject.current = project;
    setStateConfirmDelete(true);
  }, []);

  const handleDeleteCallback = useCallback(async () => {
    showLoading();
    await deleteProject(currentProject.current?.id.toString() ?? "1").then(
      () => {
        hideLoading();
        showNotification("ok", "Información", "Proyecto eliminado con éxito");
        setStateConfirmDelete(false);
        gelAllProjectsCallBack();

      }
    ).catch(
      err => {
        console.error(err);
        showNotification("error", "Error al eliminar proyecto", parseErrorAxios(err));
        hideLoading();
      }
    );
  }, [gelAllProjectsCallBack, hideLoading, showLoading, showNotification])

  const handleView = useCallback((project: Project) => {
    console.log("Ver proyecto:", project);
    router.push(`/projects/${project.id}`);
  }, [router]);


  useEffect(() => {
    gelAllProjectsCallBack();
  }, [gelAllProjectsCallBack]);

  const addProjectCallback = useCallback(() => {
    gelAllProjectsCallBack();
    setOpen(false);
  }, [gelAllProjectsCallBack]);

  const editProjectCallback = useCallback(() => {
    gelAllProjectsCallBack();
    setStateOpenEditModal(false);
  }, [gelAllProjectsCallBack]);

  // Definición de columnas para TanStack Table
  const columns = useMemo<ColumnDef<Project>[]>(() => {
    return [
      {
        accessorKey: "id",
        header: "Id",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "name",
        header: "Nombre",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Descripción",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "creacion",
        header: "Creación",
        cell: (info) =>
          info.getValue() instanceof Date
            ? (info.getValue() as Date).toLocaleDateString()
            : String(info.getValue()),
      },
      {
        id: "actions",
        header: "Acción",
        cell: ({ row }) => (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleView(row.original)}
              className="text-green-600 hover:text-green-800"
              title="Ver"
            >
              <FaEye />
            </button>
            <button
              onClick={() => handleEdit(row.original)}
              className="text-blue-600 hover:text-blue-800 mx-2"
              title="Editar"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="text-red-600 hover:text-red-800"
              title="Eliminar"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ]
  }, [handleDelete, handleView])

  const table = useReactTable({
    data: paginatedProjects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  return (
    <>
      <div className="p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Proyectos
          </h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-colors"
          >
            <FaPlus />
            Agregar
          </button>
        </div>
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left font-semibold text-gray-700 dark:text-gray-200"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    No hay proyectos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
            disabled={pageIndex === 0}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-gray-700 dark:text-gray-200">
            Página {pageIndex + 1} de {pageCount || 1}
          </span>
          <button
            onClick={() => setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))}
            disabled={pageIndex >= pageCount - 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      <ModalWrapper
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Creación de proyecto"
      >
        <AddProject closeModal={addProjectCallback} />
      </ModalWrapper>

      <ModalWrapper
        isOpen={openEditModal}
        onClose={() => setStateOpenEditModal(false)}
        title="Edición de proyecto"
      >
        <EditProject project={currentProject.current} closeModal={editProjectCallback} />
      </ModalWrapper>

      <ConfirmDialog
        message="Seguro desea eliminar el proyecto"
        showModal={confirmDelete}
        onCancel={() => setStateConfirmDelete(false)}
        onConfirm={handleDeleteCallback}

      />
    </>
  );
}