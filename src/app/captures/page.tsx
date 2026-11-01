import Link from "next/link";
import { ArrowLeft, Archive } from "lucide-react";
import CaptureHistory from "@/components/capture-history";
import QuickCapture from "@/components/quick-capture";

export default function CapturesPage() {
  return (
    <main className="min-h-screen bg-[#09090b] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-indigo-400">
              <Archive size={18} />
              <span className="text-xs font-medium uppercase tracking-wider">
                Your memory
              </span>
            </div>

            <h1 className="text-3xl font-semibold">
              Capture History
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              All your saved ideas, bugs, notes, and next steps.
            </p>
          </div>

          <QuickCapture />
        </div>

        <CaptureHistory />
      </div>
    </main>
  );
}
