import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Loader2, Calendar, Wallet, CheckCircle, ArrowRight } from 'lucide-react';
import tarikData from '../../api/koneksi';

export default function Projects() {
  const [proyek, setProyek] = useState([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [pesanEror, setPesanEror] = useState('');

  const [kataKunci, setKataKunci] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');

  useEffect(() => {
    const ambilProyek = async () => {
      try {
        const respon = await tarikData.get('/projects');
        setProyek(respon.data);
      } catch (eror) {
        setPesanEror(eror.response?.data?.error || 'Gagal mengambil data proyek.');
      } finally {
        setSedangMemuat(false);
      }
    };

    ambilProyek();
  }, []);

  const proyekDifilter = proyek.filter((item) => {
    const cocokKataKunci = item.title.toLowerCase().includes(kataKunci.toLowerCase()) || item.description.toLowerCase().includes(kataKunci.toLowerCase());
    const cocokKategori = filterKategori === 'Semua' || item.category === filterKategori;
    return cocokKataKunci && cocokKategori;
  });

  const kategoriUnik = ['Semua', ...new Set(proyek.map(item => item.category))];

  return (
    <div className="min-h-[calc(100vh-80px)] p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-utama/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-10 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gelap dark:text-terang mb-4 tracking-tight">
            Eksplorasi Proyek
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Temukan kesempatan hebat untuk menunjukkan skill terbaikmu.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gelap/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 p-4 rounded-3xl shadow-lg shadow-utama/5 flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari nama proyek atau deskripsi..."
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-utama outline-none text-gelap dark:text-terang transition-all"
            />
          </div>
          <div className="relative md:w-1/3 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 pt-4 md:pt-0 md:pl-4 flex items-center">
            <div className="absolute left-4 md:left-8 flex items-center pointer-events-none text-gray-400">
              <Filter size={20} />
            </div>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-utama outline-none text-gelap dark:text-terang appearance-none cursor-pointer"
            >
              {kategoriUnik.map((kategori, index) => (
                <option key={index} value={kategori}>{kategori}</option>
              ))}
            </select>
          </div>
        </div>

        {sedangMemuat && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-utama mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Memuat daftar proyek...</p>
          </div>
        )}

        {!sedangMemuat && pesanEror && (
          <div className="p-6 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-3xl text-red-600 dark:text-red-400 text-center font-medium">
            {pesanEror}
          </div>
        )}

        {!sedangMemuat && !pesanEror && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proyekDifilter.length > 0 ? (
              proyekDifilter.map(item => (
                <div key={item.id} className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-6 rounded-3xl hover:shadow-xl hover:border-utama dark:hover:border-utama hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full">

                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-utama/10 dark:bg-utama/20 text-utama text-xs font-bold rounded-full">
                      {item.category}
                    </span>
                    {item.status === 'open' && (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
                        <CheckCircle size={14} /> Menerima Lamaran
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gelap dark:text-terang mb-2 line-clamp-2 group-hover:text-utama transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-3 grow">
                    {item.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Wallet size={16} className="text-gray-500 dark:text-gray-300" />
                      </div>
                      <span className="font-semibold text-gelap dark:text-terang">
                        Rp {new Intl.NumberFormat('id-ID').format(item.budgetMin)} - Rp {new Intl.NumberFormat('id-ID').format(item.budgetMax)}
                      </span>
                    </div>
                    {item.deadline && (
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <Calendar size={16} className="text-gray-500 dark:text-gray-300" />
                        </div>
                        <span className="font-medium">
                          Tenggat: {new Date(item.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/projects/${item.id}`}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gelap dark:text-terang font-bold py-3.5 rounded-xl hover:bg-utama hover:text-white transition-all flex items-center justify-center gap-2 mt-auto"
                  >
                    Lihat Detail <ArrowRight size={18} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Berdasarkan pencarian, tidak ada proyek yang cocok.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
