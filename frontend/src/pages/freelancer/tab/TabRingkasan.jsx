import { Link } from 'react-router-dom';
import {
  CheckCircle, Clock, XCircle, Send, Star, Eye,
  TrendingUp, ArrowUpRight, CalendarDays, ClipboardList,
  ChevronRight, Loader2
} from 'lucide-react';
import KartuStat from '../../../components/dashboard/KartuStat';
import GrafikBar from '../../../components/dashboard/GrafikBar';
import CincinProgres from '../../../components/dashboard/CincinProgres';

export default function TabRingkasan({
  statistik, dataGrafik, daftarLamaran, memuatLamaran,
  setTabAktif, warnaStatus, ikonStatus
}) {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">

      {memuatLamaran ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-utama" size={40} />
        </div>
      ) : (
        <>
          {/* Stat Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KartuStat
              ikon={<Send size={18} />}
              judul="Total Lamaran"
              nilai={statistik.total}
              warna="blue"
            />
            <KartuStat
              ikon={<CheckCircle size={18} />}
              judul="Diterima"
              nilai={statistik.diterima}
              warna="green"
            />
            <KartuStat
              ikon={<Clock size={18} />}
              judul="Menunggu"
              nilai={statistik.menunggu}
              warna="amber"
            />
            <KartuStat
              ikon={<XCircle size={18} />}
              judul="Ditolak"
              nilai={statistik.ditolak}
              warna="red"
            />
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-4">

            {/* Bar Chart */}
            <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-gelap dark:text-terang">Aktivitas Lamaran</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">6 bulan terakhir</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                  <CalendarDays size={14} />
                  <span>{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <GrafikBar data={dataGrafik} />
            </div>

            {/* Success Rate Ring */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
              <h3 className="text-base font-bold text-gelap dark:text-terang">Tingkat Keberhasilan</h3>
              <CincinProgres
                persen={statistik.tingkatSukses}
                label="Acceptance Rate"
                warna="#045a8c"
              />
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{statistik.diterima} Diterima</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{statistik.ditolak} Ditolak</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Quick Stats + Recent Applications */}
          <div className="grid lg:grid-cols-3 gap-4">

            {/* Quick Insights */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-gelap dark:text-terang mb-1">Insight Cepat</h3>

              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Star size={14} className="text-amber-400" /> Rata-rata Tawaran
                </span>
                <span className="text-sm font-bold text-gelap dark:text-terang">
                  Rp {new Intl.NumberFormat('id-ID').format(statistik.rataHarga)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Eye size={14} className="text-blue-400" /> Lamaran Aktif
                </span>
                <span className="text-sm font-bold text-gelap dark:text-terang">{statistik.menunggu}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-400" /> Tingkat Sukses
                </span>
                <span className="text-sm font-bold text-gelap dark:text-terang">{statistik.tingkatSukses}%</span>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gelap dark:text-terang">Lamaran Terbaru</h3>
                <button
                  onClick={() => setTabAktif('lamaran')}
                  className="text-xs font-semibold text-utama hover:underline flex items-center gap-1"
                >
                  Lihat Semua <ArrowUpRight size={12} />
                </button>
              </div>

              {daftarLamaran.length > 0 ? (
                <div className="space-y-3">
                  {daftarLamaran.slice(0, 4).map((lamaran) => (
                    <Link
                      key={lamaran.id}
                      to={`/projects/${lamaran.projectId}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-lg border ${warnaStatus(lamaran.status)}`}>
                          {ikonStatus(lamaran.status)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gelap dark:text-terang truncate">
                            {lamaran.project?.title || 'Proyek Tidak Diketahui'}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            Rp {new Intl.NumberFormat('id-ID').format(lamaran.offeredPrice)}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-utama transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClipboardList size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500">Belum ada lamaran</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
