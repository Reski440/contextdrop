"use client";

import { useState } from "react";
import { db } from "@/lib/db";
import { Plus, X } from "lucide-react";

export default function NewProjectDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [status, setStatus] = useState<
    "Planning" | "In Progress" | "Completed"
  >("Planning");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return;

    setSaving(true);

    try {
      const now = new Date();

      await db.projects.add({
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim(),
        techStack: techStack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        status,
        createdAt: now,
        updatedAt: now,
      });

      setName("");
      setDescription("");
      setTechStack("");
      setStatus("Planning");
      setOpen(false);

      alert("Project berhasil dibuat!");
    } catch {
      alert("Gagal menyimpan project. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-500"
      >
        <Plus size={18} />
        New Project
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Create New Project
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Project Name *
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. My Portfolio"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What are you building?"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Tech Stack
                </label>
                <input
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="Next.js, TypeScript, Tailwind"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Separate technologies with commas.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as
                        | "Planning"
                        | "In Progress"
                        | "Completed"
                    )
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-indigo-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-zinc-700 py-3 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !name.trim()}
                  className="flex-1 rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
                  }
