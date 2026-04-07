export default function CincinProgres({ persen, label, warna = '#045a8c' }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (persen / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="6"
            className="text-gray-100 dark:text-gray-700" />
          <circle cx="40" cy="40" r={radius} fill="none" stroke={warna} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-700 ease-out" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-gelap dark:text-terang">
          {persen}%
        </span>
      </div>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}
