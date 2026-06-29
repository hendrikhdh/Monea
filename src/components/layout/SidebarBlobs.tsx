/**
 * Animated background blobs for the desktop Sidebar — a contained variant of
 * the login screen's <AnimatedBlobs />. Uses the same warm palette but drifts
 * within the 260px sidebar (px-based, mostly vertical) instead of the viewport.
 * Sits behind the sidebar content via negative z-index; the opaque bg-sidebar
 * stays underneath, so text remains readable.
 */
export function SidebarBlobs() {
  return (
    <>
      <style>{`
        @keyframes sidebar-blob-1 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(28px, 70px) scale(1.12); }
          66%  { transform: translate(-18px, 130px) scale(0.92); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes sidebar-blob-2 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(-24px, -60px) scale(0.9); }
          66%  { transform: translate(22px, -120px) scale(1.14); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes sidebar-blob-3 {
          0%   { transform: translate(-50%, -50%) scale(1); }
          50%  { transform: translate(calc(-50% + 24px), calc(-50% + 40px)) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sidebar-blob { animation: none !important; }
        }
      `}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* warm peach — top-left */}
        <div
          className="sidebar-blob absolute -top-16 -left-12 h-56 w-56 rounded-full"
          style={{
            background: '#f5c4b8',
            opacity: 0.5,
            filter: 'blur(60px)',
            animation: 'sidebar-blob-1 19s ease-in-out infinite',
          }}
        />
        {/* deep rose — bottom-right */}
        <div
          className="sidebar-blob absolute -bottom-20 -right-10 h-52 w-52 rounded-full"
          style={{
            background: '#d4a49a',
            opacity: 0.45,
            filter: 'blur(60px)',
            animation: 'sidebar-blob-2 22s ease-in-out infinite',
          }}
        />
        {/* soft rose — center, gentle orbit */}
        <div
          className="sidebar-blob absolute left-1/2 top-1/2 h-44 w-44 rounded-full"
          style={{
            background: '#c9a69e',
            opacity: 0.38,
            filter: 'blur(65px)',
            animation: 'sidebar-blob-3 17s ease-in-out infinite',
          }}
        />
      </div>
    </>
  )
}
