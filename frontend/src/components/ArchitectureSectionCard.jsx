const toneClasses = {
  sky: "bg-sky-50 text-sky-700",
  indigo: "bg-indigo-50 text-indigo-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-slate-50 text-slate-700",
  cyan: "bg-cyan-50 text-cyan-700",
};

export default function ArchitectureSectionCard({ section, index }) {
  const tone = toneClasses[section.accent] ?? toneClasses.slate;

  return (
    <article className="relative border-b border-slate-200 py-8 last:border-b-0">
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <div className="flex items-start gap-4 lg:block">
          <div
            className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${tone}`}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="lg:mt-4">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">
              {section.title}
            </h3>
            <p className="mt-2 text-base leading-7 text-slate-600">
              {section.summary}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-1 top-0 h-full w-px bg-slate-200" />
          <div className="space-y-4 pl-9">
            {section.items.map((item, itemIndex) => (
              <div key={item} className="relative">
                <span className="absolute -left-9 top-2.5 h-2 w-2 rounded-full bg-slate-400" />
                <p className="text-base leading-7 text-slate-700">{item}</p>
                {itemIndex < section.items.length - 1 ? (
                  <div className="mt-4 h-px bg-slate-100" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
