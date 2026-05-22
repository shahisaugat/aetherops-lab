import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";

const PRESETS = [
  { id: "list-users", label: "List all users", method: "GET", path: "/users", body: null },
  { id: "get-user", label: "Get user by ID", method: "GET", path: "/users/1", body: null },
  { id: "create-user", label: "Create user", method: "POST", path: "/users", body: JSON.stringify({ name: "Jane Doe", email: "jane@example.com" }, null, 2) },
  { id: "update-user", label: "Update user", method: "PUT", path: "/users/1", body: JSON.stringify({ name: "Jane Updated", email: "jane.updated@example.com" }, null, 2) },
  { id: "delete-user", label: "Delete user", method: "DELETE", path: "/users/1", body: null },
  { id: "health", label: "Health check", method: "GET", path: "/health", body: null },
  { id: "metrics", label: "Metrics", method: "GET", path: "/metrics", body: null },
];

export default function ApiPlayground({ baseUrl = "" }) {
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/users");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [statusText, setStatusText] = useState("");
  const [duration, setDuration] = useState(null);
  const [sending, setSending] = useState(false);
  const [activePreset, setActivePreset] = useState("list-users");
  const responseRef = useRef(null);

  const needsBody = method === "POST" || method === "PUT";

  useEffect(() => {
    if (responseRef.current && response) {
      Prism.highlightElement(responseRef.current);
    }
  }, [response]);

  const selectPreset = (p) => {
    setActivePreset(p.id);
    setMethod(p.method);
    setPath(p.path);
    setBody(p.body ?? "");
    setResponse(null);
    setStatusCode(null);
    setStatusText("");
    setDuration(null);
  };

  const send = async () => {
    setSending(true);
    setResponse(null);
    setStatusCode(null);
    setStatusText("");
    setDuration(null);

    const opts = { method, headers: { "Content-Type": "application/json" } };
    if (needsBody && body.trim()) opts.body = body;

    const t0 = performance.now();
    try {
      const res = await fetch(`${baseUrl}${path}`, opts);
      const ms = Math.round(performance.now() - t0);
      setDuration(ms);
      setStatusCode(res.status);
      setStatusText(res.statusText);
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        setResponse(JSON.stringify(await res.json(), null, 2));
      } else {
        setResponse(await res.text());
      }
    } catch (err) {
      setDuration(Math.round(performance.now() - t0));
      setStatusCode(0);
      setStatusText("Network Error");
      setResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setSending(false);
    }
  };

  const onKey = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); send(); }
  };

  const statusColour =
    statusCode === null ? "text-slate-400"
    : statusCode >= 200 && statusCode < 300 ? "text-emerald-600"
    : statusCode >= 400 ? "text-rose-600"
    : "text-amber-600";

  return (
    <div className="space-y-6">
      {/* Preset list — left-aligned flat tabs (outside of the card) */}
      <div className="border-b border-slate-200 bg-transparent px-1">
        <div className="flex gap-x-8 overflow-x-auto scrollbar-none">
          {PRESETS.map((p) => {
            const isActive = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPreset(p)}
                className={`relative -mb-px pb-3 pt-2 text-sm font-medium transition-all duration-200 whitespace-nowrap border-b-2 ${
                  isActive
                    ? "border-slate-900 font-semibold text-slate-900"
                    : "border-transparent text-slate-500 hover:border-slate-350 hover:text-slate-800"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Card Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Request bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
          {/* Static premium method badge */}
          <div className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-slate-50 px-3.5 font-mono text-[13px] font-semibold text-slate-800 ring-1 ring-inset ring-slate-200">
            {method}
          </div>

          {/* Static premium endpoint label */}
          <div className="flex h-9 min-w-0 flex-1 items-center rounded-md bg-slate-50 px-3.5 ring-1 ring-inset ring-slate-200">
            <span className="hidden font-mono text-[13px] text-slate-400 sm:inline shrink-0">
              {baseUrl || "https://aetherops.duckdns.org"}
            </span>
            <span className="font-mono text-[13px] font-semibold text-slate-800 sm:ml-0.5 truncate">
              {path}
            </span>
          </div>

          <button
            type="button"
            onClick={send}
            disabled={sending}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-slate-900 px-4 text-[13px] font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {sending && (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
              </svg>
            )}
            Send
          </button>
        </div>

        {/* Body editor */}
        {needsBody && (
          <div className="border-b border-slate-200">
            <div className="flex items-center justify-between bg-slate-50 px-5 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Request Body</span>
              <span className="font-mono text-[11px] text-slate-400">JSON</span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={onKey}
              spellCheck={false}
              rows={6}
              className="block w-full resize-y border-0 bg-white px-5 py-4 font-mono text-[13px] leading-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              placeholder='{ "key": "value" }'
            />
          </div>
        )}

        {/* Response */}
        <div>
          <div className="flex items-center justify-between bg-slate-50 px-5 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Response</span>
            {statusCode !== null && (
              <div className="flex items-center gap-3 text-[12px]">
                <span className={`font-semibold tabular-nums ${statusColour}`}>
                  {statusCode} {statusText}
                </span>
                {duration !== null && (
                  <span className="tabular-nums text-slate-400">{duration} ms</span>
                )}
              </div>
            )}
          </div>
          <div className="min-h-[180px] bg-white px-5 py-4">
            {sending ? (
              <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                </svg>
                Sending…
              </div>
            ) : response !== null ? (
              <pre className="!m-0 !bg-transparent !p-0 text-[13px] leading-6">
                <code ref={responseRef} className="language-json !bg-transparent !text-slate-900" style={{ color: "#0f172a" }}>
                  {response}
                </code>
              </pre>
            ) : (
              <p className="py-4 text-center text-[13px] text-slate-400">
                Hit <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">Send</kbd> or press <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">⌘ Enter</kbd>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
