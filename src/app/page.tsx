import NewProjectDialog from "@/components/new-project-dialog";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  CircleDot,
  Clock3,
  Command,
  FolderKanban,
  Layers3,
  LayoutDashboard,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

const projects = [
  {
    name: "Personal Portfolio",
    description: "My personal developer portfolio website.",
    status: "In Progress",
    progress: 75,
    color: "bg-indigo-500",
    icon: "P",
    updated: "2 hours ago",
    tasks: "8 / 12 tasks",
  },
  {
    name: "ContextDrop",
    description: "An external memory for every project.",
    status: "In Progress",
    progress: 35,
    color: "bg-cyan-500",
    icon: "C",
    updated: "Just now",
    tasks: "4 / 11 tasks",
  },
  {
    name: "Weather Dashboard",
    description: "A minimal weather monitoring application.",
    status: "Planning",
    progress: 10,
    color: "bg-amber-500",
    icon: "W",
    updated: "Yesterday",
    tasks: "1 / 10 tasks",
  },
];

const activities = [
  {
    title: "Updated project structure",
    project: "ContextDrop",
    time: "Just now",
    type: "update",
  },
  {
    title: "Completed responsive navbar",
    project: "Personal Portfolio",
    time: "2 hours ago",
    type: "complete",
  },
  {
    title: "Created initial project plan",
    project: "Weather Dashboard",
    time: "Yesterday",
    type: "create",
  },
];

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

                {item.name === "Tasks" && (
                  <span className="ml-auto text-xs text-zinc-500">
                    12
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="mt-9 px-4">
        <div className="mb-3 flex items-center justify-between px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Your projects
          </p>
          <Plus size={15} className="text-zinc-500" />
        </div>

        <div className="space-y-1">
          {projects.map((project) => (
            <div
              key={project.name}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/[0.04]"
            >
              <span className={`h-2 w-2 rounded-full ${project.color}`} />
              <span className="truncate">{project.name}</span>
            </div>
          ))}
        </div>
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
          <Search size={17} />
        </button>

        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]"
        >
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-400" />
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
  trend,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof FolderKanban;
  trend: "up" | "down";
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
            trend === "up" ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight size={13} />
          ) : (
            <ArrowDownRight size={13} />
          )}
          {detail}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <div className="group rounded-xl border border-white/[0.07] bg-[#111114] p-4 transition hover:border-indigo-500/30 sm:p-5">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${project.color}/10 text-sm font-semibold text-white`}
        >
          {project.icon}
        </div>

        <button className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.05] hover:text-white">
          <ArrowUpRight size={17} />
        </button>
      </div>

      <h3 className="mt-4 font-semibold text-zinc-100">
        {project.name}
      </h3>

      <p className="mt-1 min-h-[36px] text-xs leading-relaxed text-zinc-500">
        {project.description}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span className={`h-1.5 w-1.5 rounded-full ${project.color}`} />
          {project.status}
        </span>
        <span className="text-[11px] text-zinc-500">
          {project.tasks}
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${project.color}`}
          style={{ width: `${project.progress}%` }}
        />
      </div>

      <div className="mt-3 text-[10px] text-zinc-600">
        Updated {project.updated}
      </div>
    </div>
  );
}

function ActivityItem({
  activity,
}: {
  activity: (typeof activities)[number];
}) {
  const icons = {
    update: <Activity size={14} />,
    complete: <Check size={14} />,
    create: <Plus size={14} />,
  };

  return (
    <div className="flex gap-3 py-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          activity.type === "complete"
            ? "bg-emerald-500/10 text-emerald-400"
            : activity.type === "create"
              ? "bg-amber-500/10 text-amber-400"
              : "bg-indigo-500/10 text-indigo-400"
        }`}
      >
        {icons[activity.type as keyof typeof icons]}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-zinc-300">
          {activity.title}
        </p>
        <p className="mt-1 text-[11px] text-zinc-500">
          {activity.project}
        </p>
      </div>

      <span className="shrink-0 pt-1 text-[10px] text-zinc-600">
        {activity.time}
      </span>
    </div>
  );
}

export default function Home() {
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
              value="03"
              detail="2 active"
              icon={FolderKanban}
              trend="up"
            />
            <StatCard
              label="Active tasks"
              value="12"
              detail="4 completed"
              icon={CircleDot}
              trend="up"
            />
            <StatCard
              label="Coding sessions"
              value="08"
              detail="This week"
              icon={Terminal}
              trend="up"
            />
            <StatCard
              label="Decisions made"
              value="06"
              detail="This month"
              icon={Bookmark}
              trend="up"
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

              <button className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/[0.10] bg-white/[0.05] px-4 text-xs font-medium text-zinc-200 transition hover:bg-white/[0.10]">
                <Plus size={15} />
                Capture something
                <Command size={12} className="ml-1 text-zinc-500" />
              </button>
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

              <button className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
                View all
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-xl border border-white/[0.07] bg-[#111114] p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">
                    Recent activity
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Your latest project updates.
                  </p>
                </div>

                <Activity size={17} className="text-zinc-500" />
              </div>

              <div className="divide-y divide-white/[0.05]">
                {activities.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-[#111114] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">
                    Next up
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Things waiting for you.
                  </p>
                </div>
                <Clock3 size={17} className="text-zinc-500" />
              </div>

              <div className="space-y-3">
                {[
                  ["Implement project filtering", "Personal Portfolio"],
                  ["Build session history", "ContextDrop"],
                  ["Research weather API", "Weather Dashboard"],
                ].map(([task, project]) => (
                  <div
                    key={task}
                    className="flex items-start gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3"
                  >
                    <CircleDot
                      size={15}
                      className="mt-0.5 shrink-0 text-zinc-500"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-300">
                        {task}
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-500">
                        {project}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.08] py-2.5 text-xs text-zinc-400 transition hover:bg-white/[0.04] hover:text-white">
                View task list
                <ArrowRight size={13} />
              </button>
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
