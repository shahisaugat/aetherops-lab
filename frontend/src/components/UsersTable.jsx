import { formatDate } from "../lib/api.js";

export default function UsersTable({
  users,
  loading,
  saving,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto bg-white">
      <table className="min-w-full border-collapse text-left">
        <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
          <tr>
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Email</th>
            <th className="px-5 py-3">Created</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {loading ? (
            <tr>
              <td className="px-5 py-16 text-center text-sm text-slate-500" colSpan="4">
                Loading users from the backend...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td className="px-5 py-16 text-center text-sm text-slate-500" colSpan="4">
                No users found. Use the Add user button to add the first record.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="px-5 py-4 align-top">
                  <div className="text-sm font-medium text-slate-950">
                    {user.name}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-400">
                    {user.id}
                  </div>
                </td>
                <td className="px-5 py-4 align-top text-sm text-slate-600">
                  {user.email}
                </td>
                <td className="px-5 py-4 align-top text-sm text-slate-500">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-5 py-4 align-top text-right">
                  <div className="flex items-center justify-end gap-3 text-[13px] font-medium">
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="text-slate-500 transition hover:text-slate-900"
                    >
                      Edit
                    </button>
                    <span className="text-slate-200">|</span>
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      disabled={saving}
                      className="text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
