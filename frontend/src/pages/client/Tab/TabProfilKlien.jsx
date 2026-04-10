import { Save, Building, FileText, Loader2 } from 'lucide-react';

export default function TabProfilKlien({ dataProfil, memuatProfil, menyimpanProfil, tanganiInputProfil, simpanProfil, apakahAdaPerubahan }) {
  if (memuatProfil) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-utama w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gelap dark:text-terang">Pengaturan Profil Bisnis</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Perbarui informasi tentang perusahaan atau UMKM Anda agar menarik minat freelancer.</p>
      </div>

      <form onSubmit={simpanProfil} autoComplete="off" className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nama Bisnis / Instansi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Building size={18} />
              </div>
              <input
                type="text"
                name="name"
                value={dataProfil.name}
                onChange={tanganiInputProfil}
                placeholder="Contoh: Toko Kopi Sejahtera"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama focus:border-transparent transition-all text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Bio Perusahaan</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                <FileText size={18} />
              </div>
              <textarea
                name="bio"
                value={dataProfil.bio}
                onChange={tanganiInputProfil}
                placeholder="Ceritakan singkat tentang bisnis Anda..."
                rows="5"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama focus:border-transparent transition-all text-sm resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            disabled={!apakahAdaPerubahan || menyimpanProfil}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              apakahAdaPerubahan
                ? 'bg-utama text-white hover:bg-utama/90 hover:shadow-lg hover:-translate-y-0.5'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            {menyimpanProfil ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}