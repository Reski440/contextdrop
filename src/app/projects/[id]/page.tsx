"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, type Project } from "@/lib/db";
import {
  ArrowLeft,
  Trash2,
  Pencil,
  Save,
  X,
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [status, setStatus] = useState<Project["status"]>("Planning");

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await db.projects.get(params.id);

        setProject(data ?? null);

        if (data) {
          setName(data.name);
          setDescription(data.description);
          setTechStack(data.techStack.join(", "));
          setStatus(data.status);
        }
      } catch (error) {
        console.error("Failed to load project:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [params.id]);

  async function handleUpdate() {
    if (!name.trim()) {
      alert("Nama project tidak boleh kosong.");
      return;
    }

    setSaving(true);

    try {
      const updatedProject: Project = {
        ...project!,
        name: name.trim(),
        description: description.trim(),
        techStack: techStack
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
        status,
        updatedAt: new Date(),
      };

      await db.projects.put(updatedProject);

      setProject(updatedProject);
      setEditing(false);

      window.dispatchEvent(new Event("projects-updated"));
      alert("Project berhasil diperbarui!");
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Gagal memperbarui project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Yakin ingin menghapus project "${project?.name}"?`
    );

    if (!confirmed) return;

    try {
      await db.projects.delete(params.id);
      window.dispatchEvent(new Event("projects-updated"));
      router.push("/");
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Gagal menghapus project.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090b] p-8 text-zinc-400">
        Loading project...
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#09090b] p-8 text-white">
        <button onClick={() => router.push("/")}>
          <ArrowLeft size={16} className="inline mr-2" />
          Back to Dashboard
        </button>
        <p className="mt-8 text-zinc-400">Project not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] p-6 text-white md:p-10">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="rounded-xl border border-white/[0.08] bg-[#111114] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-indigo-400">
                Project Workspace
              </p>
              <h1 className="mt-2 text-3xl font-bold">
                {project.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-indigo-500/10 px-3 py-2 text-sm text-indigo-400">
                {project.status}
              </span>

              {!editing && (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {editing ? (
            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Project Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#09090b] px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-[#09090b] px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Tech Stack
                </label>
                <input
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="Next.js, TypeScript, Tailwind"
                  className="w-full rounded-lg border border-white/10 bg-[#09090b] px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Pisahkan setiap teknologi dengan koma.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as Project["status"])
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#09090b] px-4 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={() => {
                    setName(project.name);
                    setDescription(project.description);
                    setTechStack(project.techStack.join(", "));
                    setStatus(project.status);
                    setEditing(false);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-5 text-sm leading-7 text-zinc-400">
                {project.description || "No description provided."}
              </p>

              <div className="mt-8 border-t border-white/[0.08] pt-6">
                <h2 className="text-sm font-semibold">Tech Stack</h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.length > 0 ? (
                    project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-white/[0.06] px-3 py-2 text-xs text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-500">
                      No technologies added.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 border-t border-white/[0.08] pt-6">
                <h2 className="text-sm font-semibold">
                  Project Information
                </h2>

                <p className="mt-3 text-xs text-zinc-500">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </p>

                <p className="mt-2 text-xs text-zinc-500">
                  Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
