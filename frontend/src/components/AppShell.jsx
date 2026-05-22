export default function AppShell({ children }) {
  return (
    <div
      className="min-h-screen text-slate-900 font-sans"
      style={{
        backgroundColor: '#fafbfc',
        backgroundImage:
          'repeating-linear-gradient(-45deg, #f1f5f9 0px, #f1f5f9 1px, transparent 1px, transparent 10px)',
      }}
    >
      {children}
    </div>
  );
}
