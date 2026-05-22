export default function StepRow({ stepNumber, title, children, codeBlock }) {
  return (
    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      {/* Step Number */}
      <div className="flex shrink-0 items-start lg:w-16 lg:pt-0.5">
        <div className="flex h-6 min-w-[2.25rem] items-center justify-center rounded border border-slate-200 bg-slate-50 font-mono text-[11px] font-semibold text-slate-500 px-1.5">
          {stepNumber}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col xl:flex-row gap-8">
        <div className="xl:w-1/2 space-y-3">
          <h3 className="text-[1.0625rem] font-semibold text-slate-900">{title}</h3>
          <div className="text-base leading-7 text-slate-600 space-y-3">
            {children}
          </div>
        </div>

        {/* Code Block Area */}
        {codeBlock && (
          <div className="xl:w-1/2">
            {codeBlock}
          </div>
        )}
      </div>
    </div>
  );
}
