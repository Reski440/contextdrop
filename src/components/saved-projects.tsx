"use client";

import { useCallback, useEffect, useState } from "react";
import { db, type Project } from "@/lib/db";
import { ArrowUpRight } from "lucide-react";

export default function SavedProjects() {
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState(true);

const loadProjects = useCallback(async () => {
try {
const data = await db.projects
.orderBy("updatedAt")
.reverse()
.toArray();

  setProjects(data);
} catch (error) {
  console.error("Failed to load projects:", error);
} finally {
  setLoading(false);
}

}, []);

useEffect(() => {
loadProjects();

window.addEventListener("projects-updated", loadProjects);

return () => {
  window.removeEventListener("projects-updated", loadProjects);
};

}, [loadProjects]);

if (loading) {
return <p className="text-sm text-zinc-500">Loading projects...</p>;
}

if (projects.length === 0) {
return (
<div className="rounded-xl border border-white/[0.07] p-6 text-center">
<p className="text-sm text-zinc-400">No projects yet.</p>
<p className="mt-1 text-xs text-zinc-500">
Create your first project to get started.
</p>
</div>
);
}

return (
<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
{projects.map((project) => (
<div
key={project.id}
className="rounded-xl border border-white/[0.07] bg-[#111114] p-5"
>
<div className="flex justify-between">
<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 font-semibold text-indigo-400">
{project.name.charAt(0).toUpperCase()}
</div>
<ArrowUpRight size={17} className="text-zinc-500" />
</div>

      <h3 className="mt-4 font-semibold">{project.name}</h3>

      <p className="mt-1 text-xs text-zinc-500">
        {project.description || "No description"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-white/[0.05] px-2 py-1 text-[10px] text-zinc-400"
          >
            {tech}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs text-indigo-400">
        {project.status}
      </p>
    </div>
  ))}
</div>

);
}
