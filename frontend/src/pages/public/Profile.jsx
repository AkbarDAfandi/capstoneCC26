import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Briefcase, GraduationCap, Link as IconLink, Clock, Tag, User } from 'lucide-react';
import tarikData from '../../api/koneksi';

export default function Profile() {
  const { id } = useParams();
  const arahkan = useNavigate();
  const [pengguna, setPengguna] = useState(null);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [pesanEror, setPesanEror] = useState('');

  useEffect(() => {
    const ambilProfil = async () => {
      try {
        const respon = await tarikData.get(`/users/${id}`);
        setPengguna(respon.data);
      } catch (eror) {
        setPesanEror(eror.response?.data?.error || 'Gagal memuat profil pengguna.');
      } finally {
        setSedangMemuat(false);
      }
    };
    ambilProfil();
  }, [id]);

  if (sedangMemuat) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-utama mb-4" size={48} />
        <p className="text-gray-500 font-medium">Melacak jejak digital...</p>
      </div>
    );
  }

  if (pesanEror || !pengguna) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
        <div className="p-8 bg-red-100 border border-red-200 rounded-3xl text-red-600 text-center font-medium max-w-md w-full shadow-lg">
          {pesanEror || 'Profil tidak ditemukan.'}
          <button onClick={() => arahkan(-1)} className="block mx-auto mt-6 text-sm text-red-700 underline font-bold">
            Kembali ke Halaman Sebelumnya
          </button>
        </div>
      </div>
    );
  }

  const tagSkill = pengguna.skills ? pengguna.skills.split(',').map(s => s.trim()) : [];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-terang dark:bg-gelap relative overflow-hidden pb-20">
      <div className="absolute top-[-20%] right-[-10%] w-120 h-120 bg-utama/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="h-48 md:h-64 bg-linear-to-r from-utama/80 to-blue-500/80 w-full relative">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <button onClick={() => arahkan(-1)} className="absolute top-4 left-4 md:-left-8 text-white hover:scale-110 transition-transform bg-black/20 p-2 rounded-4xl backdrop-blur-md">
          <ArrowLeft size={20} />
        </button>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-[2.5rem] shadow-2xl p-8 mb-8 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-gelap dark:bg-terang rounded-4xl flex items-center justify-center -mt-16 md:-mt-24 shadow-xl border-4 border-white dark:border-gray-800 rotate-3">
            <User size={64} className="text-white dark:text-gelap" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gelap dark:text-terang mb-2 tracking-tight">
              {pengguna.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
              <span className={`px-4 py-1.5 font-bold rounded-full text-sm tracking-wide ${pengguna.role === 'freelancer' ? 'bg-utama/10 text-utama border border-utama/20' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                {pengguna.role === 'freelancer' ? 'Freelancer Ahli' : 'Klien Proyek'}
              </span>
              {pengguna.smkMajor && (
                <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm font-medium">
                  <GraduationCap size={16} /> Jurusan {pengguna.smkMajor}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-100 dark:border-gray-700 p-8 rounded-4xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gelap dark:text-terang">
                <Briefcase className="text-utama" size={24} /> Tentang Saya
              </h2>
              <div className="text-gray-600 dark:text-gray-400 leading-wider">
                {pengguna.bio ? (
                  pengguna.bio.split('\n').map((baris, i) => <p key={i} className="mb-2">{baris}</p>)
                ) : (
                  <p className="italic">Belum ada deskripsi profil.</p>
                )}
              </div>
            </div>

            {pengguna.role === 'freelancer' && (
              <div className="bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-100 dark:border-gray-700 p-8 rounded-4xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gelap dark:text-terang">
                  <Tag className="text-utama" size={24} /> Keahlian & Skill
                </h2>
                {tagSkill.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {tagSkill.map((skill, indeks) => (
                      <span key={indeks} className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gelap dark:text-terang px-4 py-2 rounded-xl font-medium text-sm hover:scale-105 transition-transform cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Data skill belum ditambahkan.</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {pengguna.role === 'freelancer' && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-4xl shadow-lg flex flex-col gap-6">
                
                {pengguna.hourlyRate && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <Clock size={16} /> Tarif Per Jam
                    </h3>
                    <p className="text-xl font-extrabold text-gelap dark:text-terang">
                      Rp {new Intl.NumberFormat('id-ID').format(pengguna.hourlyRate)}
                    </p>
                  </div>
                )}

                {pengguna.portfolioUrl && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <IconLink size={16} /> URL Portofolio
                    </h3>
                    <a 
                      href={pengguna.portfolioUrl.startsWith('http') ? pengguna.portfolioUrl : `https://${pengguna.portfolioUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-gray-100 dark:bg-gray-900 text-utama font-bold py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-utama hover:text-white dark:hover:text-white transition-all overflow-hidden text-ellipsis whitespace-nowrap px-4"
                    >
                      Kunjungi Portofolio
                    </a>
                  </div>
                )}

                {!pengguna.hourlyRate && !pengguna.portfolioUrl && (
                  <p className="text-gray-500 italic text-sm text-center">Menunggu informasi tarif dan karya.</p>
                )}
              </div>
            )}
            
            {pengguna.role === 'client' && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-4xl shadow-lg text-center">
                <div className="w-16 h-16 mx-auto bg-utama/10 text-utama flex items-center justify-center rounded-2xl mb-4">
                  <Briefcase size={32} />
                </div>
                <h3 className="font-bold text-gelap dark:text-terang mb-2">Partner UMKM</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Menyediakan berbagai lapangan pekerjaan proyek mandiri untuk siswa-siswi terampil.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
