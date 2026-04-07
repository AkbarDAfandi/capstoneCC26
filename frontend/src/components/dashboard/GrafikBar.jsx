export default function GrafikBar({ data, label }) {
  const maks = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="flex items-end gap-1.5 h-28">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
              {d.value > 0 ? d.value : ''}
            </span>
            <div
              className="w-full rounded-md bg-utama/80 hover:bg-utama transition-all duration-300 relative group cursor-default"
              style={{
                height: `${Math.max((d.value / maks) * 100, 6)}%`,
                minHeight: '4px'
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gelap dark:bg-gray-700 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {d.label}: {d.value}
              </div>
            </div>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{d.short}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
