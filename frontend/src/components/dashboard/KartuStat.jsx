import { TrendingUp } from 'lucide-react';

export default function KartuStat({ ikon, judul, nilai, warna }) {
  const warnaMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  };
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-2xl p-5 hover:shadow-lg hover:border-utama/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${warnaMap[warna]}`}>
          {ikon}
        </div>
      </div>
      <p className="text-2xl font-extrabold text-gelap dark:text-terang">{nilai}</p>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{judul}</p>
    </div>
  );
}
