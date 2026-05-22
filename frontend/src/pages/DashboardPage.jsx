import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import AppShell from "../components/AppShell.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import StatCard from "../components/StatCard.jsx";
import UserModal from "../components/UserModal.jsx";
import UsersTable from "../components/UsersTable.jsx";
import { API_BASE, fetchJson, getApiModeLabel } from "../lib/api.js";

const emptyForm = { name: "", email: "" };

export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [modal, setModal] = useState({
    open: false,
    mode: "create",
    userId: null,
  });
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [health, setHealth] = useState({
    state: "warning",
    label: "Checking API...",
  });

  const editingUser = useMemo(
    () => users.find((user) => user.id === modal.userId) ?? null,
    [modal.userId, users],
  );

  const loadUsers = async () => {
    setLoadingUsers(true);
    setError("");

    try {
      const payload = await fetchJson("/users");
      setUsers(payload.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const refreshHealth = async () => {
    try {
      const payload = await fetchJson("/health");
      setHealth({
        state: "healthy",
        label: `API healthy${payload.status ? ` · ${payload.status}` : ""}`,
      });
    } catch {
      setHealth({ state: "error", label: "API unreachable" });
    }
  };

  useEffect(() => {
    loadUsers();
    refreshHealth();

    const interval = setInterval(refreshHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!editingUser) return;
    setForm({ name: editingUser.name ?? "", email: editingUser.email ?? "" });
  }, [editingUser]);

  const openCreateModal = () => {
    setForm(emptyForm);
    setModal({ open: true, mode: "create", userId: null });
    setError("");
  };

  const openEditModal = (user) => {
    setForm({ name: user.name ?? "", email: user.email ?? "" });
    setModal({ open: true, mode: "edit", userId: user.id });
    setError("");
  };

  const closeModal = () => {
    setModal({ open: false, mode: "create", userId: null });
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");

    try {
      if (modal.mode === "edit") {
        await fetchJson(`/users/${modal.userId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setNotice("User updated successfully.");
      } else {
        await fetchJson("/users", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setNotice("User created successfully.");
      }

      closeModal();
      await loadUsers();
      await refreshHealth();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId) => {
    const user = users.find((entry) => entry.id === userId);
    if (!window.confirm(`Delete ${user?.name ?? "this user"}?`)) return;

    setSaving(true);
    setNotice("");
    setError("");

    try {
      await fetchJson(`/users/${userId}`, { method: "DELETE" });
      if (modal.userId === userId) closeModal();
      setNotice("User deleted successfully.");
      await loadUsers();
      await refreshHealth();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    {
      label: "Users",
      value: users.length,
      detail: "Loaded live from the backend API",
    },
    {
      label: "Mode",
      value: getApiModeLabel(),
      detail: API_BASE
        ? "Using a configured API host"
        : "Using the Vite dev proxy",
    },
    {
      label: "Health",
      value: health.label,
      detail: "Auto-refreshes every 30 seconds",
    },
  ];

  return (
    <AppShell>
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full ${health.state === "healthy" ? "bg-emerald-500" : health.state === "error" ? "bg-rose-500" : "bg-amber-500"}`}
              />
              <span>{health.label}</span>
            </div>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.45em] text-sky-600/80">
                Dashboard
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                A calmer place to manage users and keep the system visible.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                The page is broken into reusable components, with create and
                edit actions handled in a modal so the table stays clean and
                readable.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3.5 font-medium text-white transition hover:bg-slate-800"
              >
                Create user
              </button>
              <Link
                to="/architecture"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 font-medium text-slate-700 transition hover:bg-slate-50"
              >
                View architecture
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50/90 p-4 sm:grid-cols-3 xl:grid-cols-1">
            {stats.map((stat) => (
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

      {notice || error ? (
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {notice ? (
            <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
              {notice}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
              {error}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="mt-8 rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
        <SectionHeading
          eyebrow="Live records"
          title="Users from the API"
          description="Edit and delete actions are handled through a modal and a reusable table, keeping the page from feeling crowded."
          action={
            <p className="text-sm text-slate-500">
              {loadingUsers
                ? "Loading users..."
                : `${users.length} record${users.length === 1 ? "" : "s"} available`}
            </p>
          }
        />

        <div className="mt-6">
          <UsersTable
            users={users}
            loading={loadingUsers}
            saving={saving}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </section>

      <UserModal
        open={modal.open}
        mode={modal.mode}
        form={form}
        saving={saving}
        error={error}
        onClose={closeModal}
        onFieldChange={(field, value) => {
          setForm((current) => ({ ...current, [field]: value }));
        }}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
}
