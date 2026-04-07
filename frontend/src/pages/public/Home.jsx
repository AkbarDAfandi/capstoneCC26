import { useState, useEffect } from 'react';
import { ArrowRight, Code, PenTool, LayoutTemplate, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [sudahLogin, setSudahLogin] = useState(false);
  const [peran, setPeran] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('tokenAkses');
    if (token) {
      try {
        const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        setSudahLogin(true);
        setPeran(payload.role);
      } catch (e) {
        // jgn dihapus
      }
    }
  }, []);
  const daftarLayanan = [
    { ikon: <Code size={28} />, judul: 'Ngoding Bebas', spek: 'Ambil proyek Web Dev atau API.' },
    { ikon: <LayoutTemplate size={28} />, judul: 'Desain UI/UX', spek: 'Wujudkan ide lewat desain Figma.' },
    { ikon: <PenTool size={28} />, judul: 'Aset Grafis', spek: 'Desain logo dan banner profesional.' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-utama/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-100 h-100 bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-utama/10 dark:bg-utama/20 border border-utama/20 text-utama font-bold text-sm mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-utama opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-utama"></span>
              </span>
              Platform Freelance Khusus SMK
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
              Ubah <span className="text-transparent bg-clip-text bg-linear-to-br from-utama to-blue-400">Skill</span> Kamu <br />
              Jadi Cuan yang Nyata.
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Hubungkan bakat jurusanmu dengan klien UMKM. Mulai bangun portofolio profesionalmu sebelum lulus sekolah, tanpa potongan biaya yang ribet.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/projects" className="bg-utama text-white px-8 py-4 rounded-full font-bold hover:shadow-lg hover:shadow-utama/40 hover:-translate-y-1 transition-all flex items-center gap-2">
                Eksplorasi Proyek <ArrowRight size={20} />
              </Link>
              {sudahLogin ? (
                <Link to={peran === 'client' ? '/dashboard/client' : '/dashboard/freelancer'} className="bg-gray-100 dark:bg-gray-800 text-gelap dark:text-terang px-8 py-4 rounded-full font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
                  Ke Dashboard Saya
                </Link>
              ) : (
                <Link to="/register" className="bg-gray-100 dark:bg-gray-800 text-gelap dark:text-terang px-8 py-4 rounded-full font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
                  Jadi Freelancer
                </Link>
              )}
            </div>
          </div>

          <div className="relative hidden lg:block h-125">
            <div className="absolute inset-0 flex justify-center items-center animate-[bounce_15s_infinite]">
              <div className="relative w-80 h-80 bg-linear-to-tr from-utama to-blue-500 rounded-3xl rotate-12 shadow-2xl shadow-utama/40 opacity-90 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Layers size={100} className="text-white opacity-80 -rotate-12" />
              </div>

              <div className="absolute -bottom-10 -left-10 w-48 h-32 bg-terang dark:bg-gelap rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-700 -rotate-6 animate-[bounce_12s_infinite_reverse]">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full mb-2"></div>
                <div className="h-3 w-4/5 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
              </div>

              <div className="absolute -top-10 -right-10 w-32 h-32 bg-linear-to-bl from-amber-400 to-utama rounded-full shadow-lg shadow-utama/30 animate-[pulse_8s_infinite]"></div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {daftarLayanan.map((data, noUrut) => (
            <div key={noUrut} className="p-8 rounded-3xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-utama dark:hover:border-utama hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-utama/20 to-blue-500/20 flex items-center justify-center text-utama mb-6 group-hover:scale-110 transition-transform">
                {data.ikon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gelap dark:text-terang">{data.judul}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{data.spek}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}