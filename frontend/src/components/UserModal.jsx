import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function UserModal({
  open,
  mode,
  form,
  saving,
  error,
  onClose,
  onFieldChange,
  onSubmit,
}) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-none sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.28em] text-slate-500">
              USER RECORD
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {mode === "edit" ? "Edit user" : "Create user"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Update a user record without leaving the documentation page.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              placeholder="Ada Lovelace"
              value={form.name}
              onChange={(event) => onFieldChange("name", event.target.value)}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              placeholder="ada@aetherops.dev"
              value={form.email}
              onChange={(event) => onFieldChange("email", event.target.value)}
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-950 px-4 py-3.5 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Working..."
                : mode === "edit"
                  ? "Save user"
                  : "Create user"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
