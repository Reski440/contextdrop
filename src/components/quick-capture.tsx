"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db, type Project } from "@/lib/db";
import { Plus, X, Zap, History } from "lucide-react";

interface QuickCaptureProps {
  defaultProjectId?: string;
}

export default function QuickCapture({
  defaultProjectId,
}: QuickCaptureProps) {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [content, setContent] = useState("");
  const [type, setType] = useState<
    "Idea" | "Bug" | "Note" | "Next Step"
  >("Note");
  const [projectId, setProjectId] = useState(
    defaultProjectId ?? ""
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      const data = await db.projects.toArray();
      setProjects(data);
    }

    loadProjects();
  }, []);

  async function handleSave() {
    if (!content.trim()) {
      alert("Isi catatan terlebih dahulu.");
      return;
    }

    setSaving(true);

    try {
      await db.captures.add({
        id: crypto.randomUUID(),
        projectId: projectId || null,
        content: content.trim(),
        type,
        createdAt: new Date(),
      });

      window.dispatchEvent(new Event("captures-updated"));

      setContent("");
      setType("Note");
      setProjectId(defaultProjectId ?? "");
      setOpen(false);

      alert("Capture berhasil disimpan!");
    } catch (error) {
      console.error("Failed to save capture:", error);
      alert("Gagal menyimpan capture.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          <Zap size={16} />
          Quick Capture
          <Plus size={15} />
        </button>

        <Link
          href="/captures"
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/5"
        >
          <History size={16} />
          View History
        </Link>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Quick Capture
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Save your thoughts before you forget.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <label className="mb-2 block text-sm text-zinc-400">
              What's on your mind?
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write an idea, bug, note, or next step..."
              rows={5}
              className="w-full resize-none rounded-xl border border-white/10 bg-[#09090b] p-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500"
            />

            <label className="mb-2 mt-5 block text-sm text-zinc-400">
              Capture Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as
                    | "Idea"
                    | "Bug"
                    | "Note"
                    | "Next Step"
                )
              }
              className="w-full rounded-lg border border-white/10 bg-[#09090b] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="Idea">💡 Idea</option>
              <option value="Bug">🐛 Bug</option>
              <option value="Note">📝 Note</option>
              <option value="Next Step">➡️ Next Step</option>
            </select>

            <label className="mb-2 mt-5 block text-sm text-zinc-400">
              Related Project
            </label>

            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#09090b] px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="">No project</option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Capture"}
              </button>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/10 px-4 py-3 text-sm text-zinc-400 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
