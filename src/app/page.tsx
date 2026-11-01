"use client";

import { useCallback, useEffect, useState } from "react";
import QuickCapture from "@/components/quick-capture";
import SavedProjects from "@/components/saved-projects";
import NewProjectDialog from "@/components/new-project-dialog";
import { db, type Project } from "@/lib/db";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  Check,
  CircleDot,
  Clock3,
  FolderKanban,
  Layers3,
  LayoutDashboard,
  Settings2,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

function Sidebar() {
  const navigation = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Projects", icon: FolderKanban },
    { name: "Sessions", icon: Clock3 },
    { name: "Tasks", icon: CircleDot },
    { name: "Decisions", icon: Bookmark },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-screen w-[250px] flex-col border-r border-white/[0.07] bg-[#0d0d10]">
      <div className="flex h-[76px] items-center gap-3 px-6 border-b border-white/[0.07]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
          <Layers3 size={20} />
        </div>
        <span className="text-lg font-semibold tracking-tight">
          Context<span className="text-indigo-400">Drop</span>
        </span>
      </div>

      <div className="px-4 pt-7">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.name}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  index === 0
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="mt-9 px-4">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Your projects
        </p>
        <p className="px-3 text-xs text-zinc-600">
          Your saved projects appear on the dashboard.
        </p>
      </div>

      <div className="mt-auto p-4">
        <div className="mb-4 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06] p-4">
          <div className="mb-2 flex items-center gap-2 text-indigo-400">
            <Sparkles size={15} />
            <span className="text-xs font-semibold">Your workspace</span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            Your projects, decisions, and progress. All in one place.
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-white/[0.07] pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-zinc-300">
            Y
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-200">
              Your Workspace
            </p>
            <p className="text-xs text-zinc-500">Local workspace</p>
          </div>
          <Settings2 size={17} className="text-zinc-500" />
        </div>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-white/[0.07] px-4 sm:px-7 lg:px-9">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white lg:hidden">
          <Layers3 size={19} />
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-200">Overview</p>
          <p className="hidden text-xs text-zinc-500 sm:block">
            Your workspace at a glance
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]"
        >
          <span className="text-xs">⌕</span>
        </button>

        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]"
        >
          <Bell size={17} />
        </button>

        <div className="hidden h-8 w-px bg-white/[0.08] sm:block" />

        <div className="hidden items-center gap-2 text-xs text-zinc-400 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          All data stored locally
        </div>
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  active = false,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof FolderKanban;
  active?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#111114] p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        <Icon size={17} className="text-zinc-500" />
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <h3 className="text-2xl font-semibold tracking-tight text-zinc-100">
          {value}
        </h3>

        <div
          className={`mb-1 flex items-center gap-1 text-[11px] ${
            active ? "text-emerald-400" : "text-zinc-600"
          }`}
        >
          {active && <ArrowUpRight size={13} />}
          {detail}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  title,
  project,
  time,
  type,
}: {
  title: string;
  project: string;
  time: string;
  type: "update" | "complete" | "create";
}) {
  const icons = {
    update: <Activity size={14} />,
    complete: <Check size={14} />,
    create: <FolderKanban size={14} />,
  };

  return (
    <div className="flex gap-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
        {icons[type]}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-zinc-300">{title}</p>
        <p className="mt-1 text-[11px] text-zinc-500">{project}</p>
      </div>

      <span className="shrink-0 pt-1 text-[10px] text-zinc-600">
        {time}
      </span>
    </div>
  );
}

export default function Home() {
  const [totalProjects, setTotalProjects] = useState<number | null>(null);
  const [activeProjects, setActiveProjects] = useState(0);

  const loadStats = useCallback(async () => {
    try {
      const projects: Project[] = await db.projects.toArray();

      setTotalProjects(projects.length);
      setActiveProjects(
        projects.filter((project) => project.status === "In Progress").length
      );
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  }, []);

  useEffect(() => {
    loadStats();

    window.addEventListener("projects-updated", loadStats);

    return () => {
      window.removeEventListener("projects-updated", loadStats);
    };
  }, [loadStats]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <Sidebar />

      <main className="min-h-screen lg:ml-[250px]">
        <Header />

        <div className="container-app px-4 py-7 sm:px-7 sm:py-9 lg:px-9">
          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Workspace overview
                </span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Welcome back<span className="text-indigo-400">.</span>
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Here's what's happening across your projects.
              </p>
            </div>

            <NewProjectDialog />
          </section>

          <section className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard
              label="Total projects"
              value={
                totalProjects === null
                  ? "..."
                  : String(totalProjects).padStart(2, "0")
              }
              detail={
                totalProjects === null
                  ? "Loading"
                  : `${activeProjects} active`
              }
              icon={FolderKanban}
              active
            />

            <StatCard
              label="Active tasks"
              value="—"
              detail="Coming soon"
              icon={CircleDot}
            />

            <StatCard
              label="Coding sessions"
              value="—"
              detail="Coming soon"
              icon={Terminal}
            />

            <StatCard
              label="Decisions made"
              value="—"
              detail="Coming soon"
              icon={Bookmark}
            />
          </section>

          <section className="mb-8 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.10] to-[#111114] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-indigo-400">
                  <Zap size={15} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                    Quick capture
                  </span>
                </div>

                <h2 className="text-base font-semibold">
                  Got something to remember?
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Capture an idea, a bug, or your next move.
                </p>
              </div>

              <QuickCapture />
            </div>
          </section>

          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Your projects</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Pick up where you left off.
                </p>
              </div>
            </div>

            <SavedProjects />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-xl border border-white/[0.07] bg-[#111114] p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">
                    Recent activity
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Activity tracking is coming soon.
                  </p>
                </div>

                <Activity size={17} className="text-zinc-500" />
              </div>

              <div className="py-8 text-center text-xs text-zinc-600">
                No activity tracking yet.
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-[#111114] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Next up</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Your upcoming tasks.
                  </p>
                </div>
                <Clock3 size={17} className="text-zinc-500" />
              </div>

              <div className="py-8 text-center text-xs text-zinc-600">
                Task management is coming soon.
              </div>
            </div>
          </section>

          <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] pt-5 text-[10px] text-zinc-600 sm:flex-row">
            <p>
              ContextDrop — Your project's external memory.
            </p>
            <p>Built for developers, everywhere.</p>
          </footer>
        </div>
      </main>
    </div>
  );
    }
