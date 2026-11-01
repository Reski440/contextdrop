"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
ArrowLeft,
Plus,
ListTodo,
Clock3,
CheckCircle2,
CircleDot,
Pencil,
Trash2,
X,
FolderKanban,
} from "lucide-react";
import { db, type Project, type Task } from "@/lib/db";

type TaskStatus = Task["status"];
type Filter = "All" | TaskStatus;

const statuses: TaskStatus[] = ["To Do", "In Progress", "Completed"];

const statusStyles: Record<TaskStatus, string> = {
"To Do": "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
"In Progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function TasksPage() {
const [tasks, setTasks] = useState<Task[]>([]);
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState(true);
const [filter, setFilter] = useState<Filter>("All");
const [showForm, setShowForm] = useState(false);
const [editingTask, setEditingTask] = useState<Task | null>(null);

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [projectId, setProjectId] = useState("");
const [status, setStatus] = useState<TaskStatus>("To Do");
const [saving, setSaving] = useState(false);

const loadData = useCallback(async () => {
try {
const [taskData, projectData] = await Promise.all([
db.tasks.toArray(),
db.projects.toArray(),
]);

  taskData.sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  setTasks(taskData);
  setProjects(projectData);
} catch (error) {
  console.error("Failed to load tasks:", error);
} finally {
  setLoading(false);
}

}, []);

useEffect(() => {
loadData();

const handleUpdate = () => loadData();
window.addEventListener("tasks-updated", handleUpdate);
window.addEventListener("projects-updated", handleUpdate);

return () => {
  window.removeEventListener("tasks-updated", handleUpdate);
  window.removeEventListener("projects-updated", handleUpdate);
};

}, [loadData]);

const counts = useMemo(
() => ({
All: tasks.length,
"To Do": tasks.filter((task) => task.status === "To Do").length,
"In Progress": tasks.filter((task) => task.status === "In Progress").length,
Completed: tasks.filter((task) => task.status === "Completed").length,
}),
[tasks]
);

const filteredTasks =
filter === "All"
? tasks
: tasks.filter((task) => task.status === filter);

const openNewForm = () => {
setEditingTask(null);
setTitle("");
setDescription("");
setProjectId(projects[0]?.id ?? "");
setStatus("To Do");
setShowForm(true);
};

const openEditForm = (task: Task) => {
setEditingTask(task);
setTitle(task.title);
setDescription(task.description);
setProjectId(task.projectId);
setStatus(task.status);
setShowForm(true);
};

const closeForm = () => {
setShowForm(false);
setEditingTask(null);
};

const saveTask = async (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();

if (!title.trim() || !projectId) return;

setSaving(true);

try {
  const now = new Date();

  if (editingTask) {
    await db.tasks.put({
      ...editingTask,
      title: title.trim(),
      description: description.trim(),
      projectId,
      status,
      updatedAt: now,
    });
  } else {
    await db.tasks.add({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      projectId,
      status,
      createdAt: now,
      updatedAt: now,
    });
  }

  window.dispatchEvent(new Event("tasks-updated"));
  await loadData();
  closeForm();
} catch (error) {
  console.error("Failed to save task:", error);
  alert("Task gagal disimpan. Coba lagi.");
} finally {
  setSaving(false);
}

};

const changeStatus = async (task: Task, newStatus: TaskStatus) => {
try {
await db.tasks.update(task.id, {
status: newStatus,
updatedAt: new Date(),
});

  window.dispatchEvent(new Event("tasks-updated"));
  await loadData();
} catch (error) {
  console.error("Failed to update task:", error);
  alert("Status task gagal diperbarui.");
}

};

const deleteTask = async (task: Task) => {
const confirmed = window.confirm(
"Hapus task "${task.title}"? Tindakan ini tidak bisa dibatalkan."
);

if (!confirmed) return;

try {
  await db.tasks.delete(task.id);
  window.dispatchEvent(new Event("tasks-updated"));
  await loadData();
} catch (error) {
  console.error("Failed to delete task:", error);
  alert("Task gagal dihapus.");
}

};

const getProjectName = (id: string) =>
projects.find((project) => project.id === id)?.name ?? "Project deleted";

return (
<main className="min-h-screen bg-[#09090b] text-zinc-100">
<div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
<Link
href="/"
className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
>
<ArrowLeft size={16} />
Back to Dashboard
</Link>

    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <div className="mb-2 flex items-center gap-2 text-blue-400">
          <ListTodo size={20} />
          <span className="text-sm font-medium">Workspace</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Task Management
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Keep track of what needs to get done.
        </p>
      </div>

      <button
        onClick={openNewForm}
        disabled={projects.length === 0}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={17} />
        New Task
      </button>
    </div>

    <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "All Tasks", value: counts.All, icon: ListTodo },
        { label: "To Do", value: counts["To Do"], icon: CircleDot },
        { label: "In Progress", value: counts["In Progress"], icon: Clock3 },
        { label: "Completed", value: counts.Completed, icon: CheckCircle2 },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
        >
          <item.icon size={18} className="mb-3 text-blue-400" />
          <p className="text-2xl font-semibold">{item.value}</p>
          <p className="mt-1 text-xs text-zinc-500">{item.label}</p>
        </div>
      ))}
    </div>

    <div className="mb-5 flex flex-wrap gap-2">
      {(["All", ...statuses] as Filter[]).map((item) => (
        <button
          key={item}
          onClick={() => setFilter(item)}
          className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
            filter === item
              ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
              : "border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]"
          }`}
        >
          {item} <span className="ml-1 opacity-70">{counts[item]}</span>
        </button>
      ))}
    </div>

    {loading ? (
      <div className="rounded-2xl border border-white/[0.08] p-10 text-center text-sm text-zinc-500">
        Loading tasks...
      </div>
    ) : projects.length === 0 ? (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-10 text-center">
        <FolderKanban className="mx-auto mb-4 text-zinc-500" size={32} />
        <h2 className="font-medium">No projects yet</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Create a project first before adding tasks.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
        >
          Go to Dashboard
        </Link>
      </div>
    ) : filteredTasks.length === 0 ? (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-10 text-center">
        <ListTodo className="mx-auto mb-4 text-zinc-500" size={32} />
        <h2 className="font-medium">No tasks found</h2>
        <p className="mt-2 text-sm text-zinc-500">
          {filter === "All"
            ? "Create your first task to get started."
            : `There are no tasks with status "${filter}".`}
        </p>
        {filter === "All" && (
          <button
            onClick={openNewForm}
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
          >
            Create Task
          </button>
        )}
      </div>
    ) : (
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <article
            key={task.id}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-white/[0.15] sm:p-5"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <h2
                  className={`font-medium ${
                    task.status === "Completed"
                      ? "text-zinc-500 line-through"
                      : "text-zinc-100"
                  }`}
                >
                  {task.title}
                </h2>

                {task.description && (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
                    {task.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <FolderKanban size={13} />
                    {getProjectName(task.projectId)}
                  </span>
                  <span>
                    Updated {new Date(task.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={task.status}
                  onChange={(event) =>
                    changeStatus(task, event.target.value as TaskStatus)
                  }
                  className={`rounded-lg border bg-[#111114] px-2.5 py-2 text-xs font-medium outline-none ${statusStyles[task.status]}`}
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => openEditForm(task)}
                  aria-label="Edit task"
                  className="rounded-lg border border-white/[0.08] p-2 text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <Pencil size={15} />
                </button>

                <button
                  onClick={() => deleteTask(task)}
                  aria-label="Delete task"
                  className="rounded-lg border border-white/[0.08] p-2 text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    )}
  </div>

  {showForm && (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#111114] p-5 shadow-2xl sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Add details to keep your work organized.
            </p>
          </div>
          <button
            onClick={closeForm}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/[0.08] hover:text-white"
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={saveTask} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Task Title
            </label>
            <input
              autoFocus
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs to be done?"
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-3 text-sm outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add more details (optional)"
              rows={3}
              className="w-full resize-none rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-3 text-sm outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Related Project
            </label>
            <select
              required
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              className="w-full rounded-xl border border-white/[0.1] bg-[#19191d] px-3 py-3 text-sm outline-none focus:border-blue-500"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Status
            </label>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as TaskStatus)
              }
              className="w-full rounded-xl border border-white/[0.1] bg-[#19191d] px-3 py-3 text-sm outline-none focus:border-blue-500"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeForm}
              className="flex-1 rounded-xl border border-white/[0.1] px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.05]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim() || !projectId}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium transition hover:bg-blue-500 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingTask
                ? "Save Changes"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</main>

);
                             }
