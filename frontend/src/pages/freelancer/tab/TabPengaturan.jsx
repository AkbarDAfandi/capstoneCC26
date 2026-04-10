import { Loader2, Save, RefreshCw } from 'lucide-react';

export default function TabPengaturan({
  dataProfil, memuatProfil, menyimpanProfil,
  tanganiInputProfil, simpanProfil, denganKoma, apakahAdaPerubahan
}) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-2xl p-8 md:p-10 animate-[fadeIn_0.3s_ease-out]">

      <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-700 pb-5">
        <div>
          <h2 className="text-xl font-bold text-gelap dark:text-terang">Informasi Publik</h2>
          <p className="text-gray-500 text-sm mt-1">Data ini akan dilihat oleh klien saat kamu melamar proyek.</p>
        </div>
      </div>

      {memuatProfil ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-utama" size={40} />
        </div>
      ) : (
        <form onSubmit={simpanProfil} autoComplete="off" className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
              <input
                type="text" name="name" required
                value={dataProfil.name} onChange={tanganiInputProfil}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama text-gelap dark:text-terang outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Jurusan SMK</label>
              <input
                type="text" name="smkMajor"
                placeholder="Contoh: Rekayasa Perangkat Lunak"
                value={dataProfil.smkMajor} onChange={tanganiInputProfil}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama text-gelap dark:text-terang outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tarif Per-Jam (Rupiah)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-medium">Rp</div>
                <input
                  type="text" name="hourlyRate"
                  placeholder="25,000"
                  value={denganKoma(dataProfil.hourlyRate)} onChange={tanganiInputProfil}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama text-gelap dark:text-terang outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">URL Portofolio</label>
              <input
                type="text" name="portfolioUrl"
                placeholder="https://github.com/mynamedev"
                value={dataProfil.portfolioUrl} onChange={tanganiInputProfil}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama text-gelap dark:text-terang outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Kumpulan Skill (Pisahkan dengan Koma)</label>
            <input
              type="text" name="skills"
              placeholder="Contoh: ReactJS, Tailwind, NodeJS"
              value={dataProfil.skills} onChange={tanganiInputProfil}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama text-gelap dark:text-terang outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio / Tentang Saya</label>
            <textarea
              name="bio" rows="4"
              placeholder="Ceritakan sedikit tentang karya dan ketertarikanmu..."
              value={dataProfil.bio} onChange={tanganiInputProfil}
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama text-gelap dark:text-terang outline-none resize-none transition-all"
            ></textarea>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit" disabled={menyimpanProfil || !apakahAdaPerubahan}
              className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm ${
                !apakahAdaPerubahan
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-utama text-white hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              {menyimpanProfil ? <><RefreshCw className="animate-spin" size={18} /> Menyimpan...</> : <><Save size={18} /> Simpan Perubahan</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
