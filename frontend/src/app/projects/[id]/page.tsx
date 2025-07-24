'use client'
import { ConfirmDialog } from "@/core/components/ConfirmModal";
import AddTask from "@/core/components/forms/addTask";
import EditTask from "@/core/components/forms/editTask";
import ModalWrapper from "@/core/components/Modal";
import { TaskStatus } from "@/core/enums/taskStatus.enum";
import { useLoading } from "@/core/hooks/useLoading";
import { useNotification } from "@/core/hooks/useNotification";
import { Task, TaskDto } from "@/core/interfaces/Task.inteface";
import { parseErrorAxios } from "@/core/services/axios";
import { deleteTaskService, getTaskByProject } from "@/core/services/task.services";
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
  const [modalEdit, setStateModalEdit] = useState(false);
  const projectIdRef = useRef<number>(0);
  const selectedTask = useRef<TaskDto | null>(null);
  const [confirmDelete, setStateConfirmDelete] = useState(false);

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
            estado: task.status as TaskStatus,
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

  const editTask = useCallback(() => {
    getTasksByProject(projectIdRef.current);
    setStateModalEdit(false);
  }, [getTasksByProject]);

  const handleDeleteCallback = useCallback(async () => {
    showLoading();
    await deleteTaskService(selectedTask.current?.id ?? 1).then(
      () => {
        setStateConfirmDelete(false);
        getTasksByProject(projectIdRef.current);
        hideLoading();
      }
    ).catch(
      err => {
        console.error("Error al eliminar la tarea:", err);
        const parsedError = parseErrorAxios(err);
        showNotification("error", "Error", parsedError);
        hideLoading();
      }
    )

  }, [getTasksByProject, hideLoading, showLoading, showNotification])

  useEffect(() => {
    const projectId = params.id as string;
    projectIdRef.current = Number(projectId);
    getTasksByProject(Number(projectId));
  }, [getTasksByProject, params.id]);

  const handleAddTask = () => {
    setStateModalNew(true);
  };

  const handleEdit = (task: TaskDto) => {
    selectedTask.current = task;
    setStateModalEdit(true);
  };

  const handleDelete = (task: TaskDto) => {
    selectedTask.current = task;
    setStateConfirmDelete(true);
  };

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");

  const filteredTasks = useMemo(() => {
    return tareas.filter((task) => {
      const statusMatch = filterStatus ? task.estado === filterStatus : true;
      return statusMatch;
    });
  }, [tareas, filterStatus]);

  const filterTasksEstado = useCallback((estado: string) => {
    setFilterStatus(estado);
  }, [])

  const paginatedTasks = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, pageIndex, pageSize]);

  const pageCount = Math.ceil(filteredTasks.length / pageSize);

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
        <div className="flex gap-4 mb-0 items-center">
          <div className="flex justify-between items-end mb-2 w-full gap-4 flex-wrap">
            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Estado
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => filterTasksEstado(e.target.value)}
                  className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  <option value="">Todos</option>
                  {Object.values(TaskStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Fecha de creación
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => {
                      setFilterDate(e.target.value)
                    }}
                    className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  />

                </div>
              </div>
            </div>

            <button
              onClick={handleAddTask}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-colors"
            >
              <FaPlus />
              Agregar tarea
            </button>
          </div>



        </div>
        {/* Tabla */}
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

      <ModalWrapper
        isOpen={modalEdit}
        onClose={() => setStateModalEdit(false)}
        title="Edición de tareas"
      >
        <EditTask closeModal={editTask} task={selectedTask.current} />
      </ModalWrapper>

      <ConfirmDialog
        message="Seguro desea eliminar la tarea"
        showModal={confirmDelete}
        onCancel={() => setStateConfirmDelete(false)}
        onConfirm={handleDeleteCallback}

      />

    </>
  );
}