export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-[18px] font-medium tracking-tight text-slate-950 leading-[1.25]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-[16px] leading-7 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
