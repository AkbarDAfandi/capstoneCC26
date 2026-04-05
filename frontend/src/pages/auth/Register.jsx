import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import tarikData from '../../api/koneksi';

const JURUSAN_SMK = ['RPL', 'Multimedia', 'TKJ', 'Akuntansi', 'Pemasaran', 'Adm. Perkantoran', 'Lainnya'];

export default function Register() {
  const arahkan = useNavigate();
  const [peranAktif, setPeranAktif] = useState('freelancer');
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanEror, setPesanEror] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('tokenAkses');
    if (token) {
      try {
        const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        arahkan(payload.role === 'client' ? '/dashboard/client' : '/dashboard/freelancer');
      } catch (e) {
        // Abaikan
      }
    }
  }, [arahkan]);

  const [dataForm, setDataForm] = useState({
    name: '', email: '', password: '', bio: '',
    smkMajor: '', skills: '', hourlyRate: '', portfolioUrl: ''
  });

  const tanganiInput = (e) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  };

  const tanganiKirim = async (e) => {
    e.preventDefault();
    setSedangMemuat(true); setPesanEror('');

    try {
      const payload = { ...dataForm, role: peranAktif };
      if (peranAktif === 'client') {
        delete payload.skills; delete payload.hourlyRate;
        delete payload.portfolioUrl; delete payload.smkMajor;
      }

      const respon = await tarikData.post('/register', payload);
      alert('Pendaftaran Berhasil! Silakan masuk.');
      arahkan('/login');
    } catch (eror) {
      setPesanEror(eror.response?.data?.error || 'Gagal daftar cuy, cek lagi datanya.');
    } finally {
      setSedangMemuat(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 py-12">
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-2xl bg-white/80 dark:bg-gelap/60 backdrop-blur-2xl border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gelap dark:text-terang mb-2">Mulai Perjalananmu</h1>
          <p className="text-gray-500 dark:text-gray-400">Pilih peranmu dan bergabung bersama kami</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl mb-8">
          <button
            type="button" onClick={() => setPeranAktif('freelancer')}
            className={`grow py-3 text-sm font-bold rounded-xl transition-all ${peranAktif === 'freelancer' ? 'bg-white dark:bg-gelap text-utama shadow-md' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Saya Freelancer SMK
          </button>
          <button
            type="button" onClick={() => setPeranAktif('client')}
            className={`grow py-3 text-sm font-bold rounded-xl transition-all ${peranAktif === 'client' ? 'bg-white dark:bg-gelap text-utama shadow-md' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Saya Klien / UMKM
          </button>
        </div>

        {pesanEror && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm text-center">
            {pesanEror}
          </div>
        )}

        <form onSubmit={tanganiKirim} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute top-3.5 left-4 text-gray-400" size={18} />
              <input type="text" name="name" required onChange={tanganiInput} value={dataForm.name} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama outline-none text-gelap dark:text-terang" placeholder="John Doe" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute top-3.5 left-4 text-gray-400" size={18} />
              <input type="email" name="email" required onChange={tanganiInput} value={dataForm.email} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama outline-none text-gelap dark:text-terang" placeholder="nama@email.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute top-3.5 left-4 text-gray-400" size={18} />
              <input type="password" name="password" required minLength={8} onChange={tanganiInput} value={dataForm.password} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama outline-none text-gelap dark:text-terang" placeholder="Minimal 8 Karakter" />
            </div>
          </div>

          {peranAktif === 'freelancer' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-2">Jurusan SMK</label>
                <div className="relative">
                  <GraduationCap className="absolute top-3.5 left-4 text-gray-400" size={18} />
                  <select name="smkMajor" onChange={tanganiInput} value={dataForm.smkMajor} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama outline-none text-gelap dark:text-terang appearance-none">
                    <option value="">-- Pilih Jurusan --</option>
                    {JURUSAN_SMK.map(jrs => <option key={jrs} value={jrs}>{jrs}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Keahlian (Koma)</label>
                <div className="relative">
                  <Briefcase className="absolute top-3.5 left-4 text-gray-400" size={18} />
                  <input type="text" name="skills" onChange={tanganiInput} value={dataForm.skills} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama outline-none text-gelap dark:text-terang" placeholder="React, Figma..." />
                </div>
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">Bio Singkat</label>
            <textarea name="bio" rows="2" onChange={tanganiInput} value={dataForm.bio} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama outline-none text-gelap dark:text-terang resize-none" placeholder="Ceritakan sedikit tentang dirimu..."></textarea>
          </div>

          <div className="md:col-span-2 mt-4">
            <button type="submit" disabled={sedangMemuat} className="w-full bg-utama text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-utama/30 transition-all flex items-center justify-center gap-2">
              {sedangMemuat ? <Loader2 className="animate-spin" size={20} /> : 'Buat Akun Sekarang'}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-utama font-bold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}