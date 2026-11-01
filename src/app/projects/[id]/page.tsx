"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, type Project } from "@/lib/db";
import { ArrowLeft } from "lucide-react";

export default function ProjectDetailPage() {
const params = useParams<{ id: string }>();
const router = useRouter();

const [project, setProject] = useState<Project | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
async function loadProject() {
try {
const data = await db.projects.get(params.id);
setProject(data ?? null);
} catch (error) {
console.error("Failed to load project:", error);
} finally {
setLoading(false);
}
}

loadProject();

}, [params.id]);

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
          <p className="text-sm text-indigo-400">Project Workspace</p>
          <h1 className="mt-2 text-3xl font-bold">
            {project.name}
          </h1>
        </div>

        <span className="rounded-lg bg-indigo-500/10 px-3 py-2 text-sm text-indigo-400">
          {project.status}
        </span>
      </div>

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
        <h2 className="text-sm font-semibold">Project Information</h2>

        <p className="mt-3 text-xs text-zinc-500">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </p>

        <p className="mt-2 text-xs text-zinc-500">
          Last updated: {new Date(project.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  </div>
</main>

);
}
