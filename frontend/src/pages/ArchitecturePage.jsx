import AppShell from "../components/AppShell.jsx";
import ArchitectureSectionCard from "../components/ArchitectureSectionCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import StatCard from "../components/StatCard.jsx";
import {
  architectureHeroStats,
  architectureSections,
} from "../data/architecture.js";

export default function ArchitecturePage() {
  return (
    <AppShell>
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
              <span>Architecture overview</span>
            </div>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.45em] text-sky-600/80">
                System architecture
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                The full platform map, split into the layers that actually
                matter.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                This page is dedicated to the operational flow, security
                posture, deployment pipeline, and runtime controls that support
                the AetherOps stack.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50/90 p-4 sm:grid-cols-3 xl:grid-cols-1">
            {architectureHeroStats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                detail={stat.detail}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
        <SectionHeading
          eyebrow="Layered design"
          title="Architecture layers"
          description="Each layer is separated into its own card so the full system can be scanned quickly without clutter."
        />

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          {architectureSections.map((section, index) => (
            <ArchitectureSectionCard
              key={section.title}
              section={section}
              index={index}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
