import { Link } from 'react-router-dom';
import { ClipboardList, ChevronRight, Loader2 } from 'lucide-react';

export default function TabLamaran({
  daftarLamaran, memuatLamaran, warnaStatus, ikonStatus, teksStatus
}) {
  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      {memuatLamaran ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-utama" size={40} />
        </div>
      ) : daftarLamaran.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-5">
          {daftarLamaran.map((lamaran) => (
            <div key={lamaran.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-2xl hover:shadow-lg hover:border-utama/30 transition-all flex flex-col">

              <div className="flex justify-between items-start mb-4 gap-4">
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide ${warnaStatus(lamaran.status)}`}>
                  {ikonStatus(lamaran.status)} {teksStatus(lamaran.status)}
                </div>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-lg">
                  Tawaran: Rp {new Intl.NumberFormat('id-ID').format(lamaran.offeredPrice)}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gelap dark:text-terang mb-2 line-clamp-1">
                {lamaran.project?.title || 'Proyek Tidak Diketahui'}
              </h3>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl mb-5 grow border border-gray-100 dark:border-gray-800 mt-1">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Proposal:</p>
                <p className="text-sm text-gelap dark:text-gray-300 italic line-clamp-2">"{lamaran.proposal}"</p>
              </div>

              <Link
                to={`/projects/${lamaran.projectId}`}
                className="w-full mt-auto py-3 bg-gray-100 dark:bg-gray-800/80 hover:bg-utama dark:hover:bg-utama hover:text-white dark:hover:text-white text-gelap dark:text-terang font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                Lihat Rincian Proyek <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center">
          <ClipboardList size={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-5" />
          <h2 className="text-xl font-bold text-gelap dark:text-terang mb-2">Belum Ada Lamaran</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">Tebarkan pesonamu! Mulai cari proyek yang sesuai dengan keahlianmu.</p>
          <Link to="/projects" className="inline-flex bg-utama text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
            Cari Proyek Sekarang
          </Link>
        </div>
      )}
    </div>
  );
}
