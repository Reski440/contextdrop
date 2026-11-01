"use client";

import { useCallback, useEffect, useState } from "react";
import { db, type Capture, type Project } from "@/lib/db";
import { Lightbulb, Bug, StickyNote, ArrowRight, Trash2, Clock3 } from "lucide-react";

type CaptureWithProject = Capture & {
  projectName: string;
};

const icons = {
  Idea: Lightbulb,
  Bug: Bug,
  Note: StickyNote,
  "Next Step": ArrowRight,
};

export default function CaptureHistory() {
  const [captures, setCaptures] = useState<CaptureWithProject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCaptures = useCallback(async () => {
    try {
      const [captureData, projects] = await Promise.all([
        db.captures.orderBy("createdAt").reverse().toArray(),
        db.projects.toArray(),
      ]);

      const projectMap = new Map(
        projects.map((project: Project) => [project.id, project.name])
      );

      setCaptures(
        captureData.map((capture) => ({
          ...capture,
          projectName: capture.projectId
            ? projectMap.get(capture.projectId) ?? "Project deleted"
            : "No project",
        }))
      );
    } catch (error) {
      console.error("Failed to load captures:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCaptures();

    window.addEventListener("captures-updated", loadCaptures);

    return () => {
      window.removeEventListener("captures-updated", loadCaptures);
    };
  }, [loadCaptures]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Hapus capture ini secara permanen?"
    );

    if (!confirmed) return;

    try {
      await db.captures.delete(id);
      await loadCaptures();
    } catch (error) {
      console.error("Failed to delete capture:", error);
      alert("Gagal menghapus capture.");
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-zinc-500">
        Loading captures...
      </p>
    );
  }

  if (captures.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.07] p-8 text-center">
        <StickyNote className="mx-auto text-zinc-600" size={28} />
        <p className="mt-3 text-sm font-medium text-zinc-300">
          No captures yet
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Use Quick Capture to save your first note.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {captures.map((capture) => {
        const Icon = icons[capture.type];

        return (
          <article
            key={capture.id}
            className="rounded-xl border border-white/[0.07] bg-[#111114] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                  <Icon size={16} />
                </div>

                <span className="text-xs font-medium text-indigo-400">
                  {capture.type}
                </span>
              </div>

              <button
                onClick={() => handleDelete(capture.id)}
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                aria-label="Delete capture"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-200">
              {capture.content}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
              <span className="rounded-md bg-white/[0.05] px-2 py-1">
                {capture.projectName}
              </span>

              <span className="flex items-center gap-1">
                <Clock3 size={12} />
                {new Date(capture.createdAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
            }
