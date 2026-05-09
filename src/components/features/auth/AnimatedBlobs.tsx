export function AnimatedBlobs() {
  return (
    <>
      <style>{`
        @keyframes blob-1 {
          0%   { transform: translate(0, 0) scale(1); }
          20%  { transform: translate(25vw, 15vh) scale(1.15); }
          40%  { transform: translate(10vw, 40vh) scale(0.9); }
          60%  { transform: translate(-20vw, 25vh) scale(1.1); }
          80%  { transform: translate(-10vw, -10vh) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes blob-2 {
          0%   { transform: translate(0, 0) scale(1); }
          20%  { transform: translate(-20vw, -20vh) scale(0.88); }
          40%  { transform: translate(15vw, -10vh) scale(1.18); }
          60%  { transform: translate(25vw, 20vh) scale(0.92); }
          80%  { transform: translate(-10vw, 30vh) scale(1.12); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes blob-3 {
          0%   { transform: translate(-50%, -50%) scale(1); }
          16%  { transform: translate(calc(-50% + 20vw), calc(-50% - 25vh)) scale(1.2); }
          33%  { transform: translate(calc(-50% + 30vw), calc(-50% + 10vh)) scale(0.85); }
          50%  { transform: translate(calc(-50% - 5vw), calc(-50% + 30vh)) scale(1.1); }
          66%  { transform: translate(calc(-50% - 25vw), calc(-50% + 5vh)) scale(0.9); }
          83%  { transform: translate(calc(-50% - 15vw), calc(-50% - 20vh)) scale(1.15); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Blob 1: warm peach — starts top-right, wanders down-left */}
        <div
          className="absolute -top-10 -right-10 h-80 w-80 rounded-full"
          style={{
            background: '#f5c4b8',
            opacity: 0.7,
            filter: 'blur(70px)',
            animation: 'blob-1 18s ease-in-out infinite',
          }}
        />
        {/* Blob 2: deep rose — starts bottom-left, wanders up-right */}
        <div
          className="absolute -bottom-10 -left-10 h-72 w-72 rounded-full"
          style={{
            background: '#d4a49a',
            opacity: 0.6,
            filter: 'blur(70px)',
            animation: 'blob-2 20s ease-in-out infinite',
          }}
        />
        {/* Blob 3: soft rose — starts center, wanders in wide orbit */}
        <div
          className="absolute left-1/2 top-1/2 h-64 w-64 rounded-full"
          style={{
            background: '#c9a69e',
            opacity: 0.5,
            filter: 'blur(80px)',
            animation: 'blob-3 16s ease-in-out infinite',
          }}
        />
      </div>
    </>
  )
}
