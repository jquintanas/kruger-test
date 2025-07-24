'use client'
import AddTask from "@/core/components/forms/addTask";
import ModalWrapper from "@/core/components/Modal";
import { useLoading } from "@/core/hooks/useLoading";
import { useNotification } from "@/core/hooks/useNotification";
import { Task, TaskDto } from "@/core/interfaces/Task.inteface";
import { parseErrorAxios } from "@/core/services/axios";
import { getTaskByProject } from "@/core/services/task.services";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { notFound, useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

export default function Projects() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { showLoading, hideLoading } = useLoading();
  const [tareas, setStateTareas] = useState<TaskDto[]>([]);
  const [taskColumns, setStateTaskColumns] = useState<(keyof TaskDto)[]>([]);
  const [modalNew, setStateModalNew] = useState(false);
  const projectIdRef = useRef<number>(0);

  // Paginación
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const params = useParams();

  if (!params.id || isNaN(Number(params.id))) {
    notFound();
  }



  const getTasksByProject = useCallback(async (idProyecto: number) => {
    showLoading();
    await getTaskByProject(idProyecto)
      .then((resp) => {
        if (resp.data.length === 0) {
          showNotification("warn", "Información", "No hay tareas para este proyecto");
          router.push("/dashboard");
          return;
        }
        const tareasDto = resp.data.map((task: Task) => {
          const dt: TaskDto = {
            id: task.id,
            idProyecto: task.projectId,
            titulo: task.title,
            Usuario: task.assignedTo,
            descripcion: task.description,
            creacion: (new Date(task.createdAt)).toLocaleDateString(),
            estado: task.status,
          }
          return dt;
        })
        setStateTareas(tareasDto);
        setStateTaskColumns(Object.keys(tareasDto[0]) as (keyof TaskDto)[]);
        hideLoading();
      })
      .catch((err) => {
        const parsedError = parseErrorAxios(err);
        showNotification("error", "Error", parsedError);
        hideLoading();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, showNotification]);

  const addNewTask = useCallback(() => {
    getTasksByProject(projectIdRef.current);
    setStateModalNew(false);
  }, [getTasksByProject]);

  useEffect(() => {
    const projectId = params.id as string;
    projectIdRef.current = Number(projectId);
    getTasksByProject(Number(projectId));
  }, [getTasksByProject, params.id]);

  const handleAddTask = () => {
    console.log("Agregar nueva tarea");
    setStateModalNew(true);
  };

  const handleEdit = (task: TaskDto) => {
    console.log("Editar tarea:", task);
  };

  const handleDelete = (task: TaskDto) => {
    console.log("Eliminar tarea:", task);
  };

  // Paginación de tareas
  const paginatedTasks = useMemo(() => {
    const start = pageIndex * pageSize;
    return tareas.slice(start, start + pageSize);
  }, [tareas, pageIndex, pageSize]);

  const pageCount = Math.ceil(tareas.length / pageSize);

  // Columnas para TanStack Table
  const columns = useMemo<ColumnDef<TaskDto>[]>(() => {
    const baseCols: ColumnDef<TaskDto>[] = taskColumns.map((col) => ({
      accessorKey: col,
      header: col.charAt(0).toUpperCase() + col.slice(1),
      cell: (info) => String(info.getValue()),
    }));

    baseCols.push({
      id: "actions",
      header: "Acción",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-600 hover:text-blue-800"
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
    });

    return baseCols;
  }, [taskColumns]);

  const table = useReactTable({
    data: paginatedTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  return (
    <>
      <div className="p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="flex justify-end mb-6">
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
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left font-semibold text-gray-700 dark:text-gray-200"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
                    No hay tareas para mostrar.
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
        isOpen={modalNew}
        onClose={() => setStateModalNew(false)}
        title="Creación de tareas"
      >
        <AddTask closeModal={addNewTask} projectId={projectIdRef.current} />
      </ModalWrapper>

    </>
  );
}