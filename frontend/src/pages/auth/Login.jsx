import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';
import tarikData from '../../api/koneksi';
export default function Login() {
  const arahkan = useNavigate();
  const [dataForm, setDataForm] = useState({ email: '', password: '' });
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

  const tanganiInput = (e) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  };

  const tanganiKirim = async (e) => {
    e.preventDefault();
    setSedangMemuat(true);
    setPesanEror('');
    try {
      const respon = await tarikData.post('/login', dataForm);

      localStorage.setItem('tokenAkses', respon.data.token);

      await Swal.fire({
        title: 'Berhasil!',
        text: `Selamat datang, ${respon.data.name}!`,
        icon: 'success',
        confirmButtonColor: '#045a8c',
        timer: 2000,
        showConfirmButton: false
      });

      if (respon.data.role === 'client') {
        arahkan('/dashboard/client');
      } else {
        arahkan('/dashboard/freelancer');
      }
    } catch (eror) {
      setPesanEror(eror.response?.data?.error || 'Email atau sandi salah cuy.');
    } finally {
      setSedangMemuat(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-utama/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      <div className="w-full max-w-md bg-white/70 dark:bg-gelap/50 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-2xl shadow-utama/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gelap dark:text-terang mb-2">Selamat Datang!</h1>
          <p className="text-gray-500 dark:text-gray-400">Masuk untuk melanjutkan ke FreelanceHub</p>
        </div>

        {pesanEror && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm text-center">
            {pesanEror}
          </div>
        )}

        <form onSubmit={tanganiKirim} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Alamat Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email" name="email" required
                onChange={tanganiInput} value={dataForm.email}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama focus:border-utama transition-all outline-none text-gelap dark:text-terang"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password" name="password" required
                onChange={tanganiInput} value={dataForm.password}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama focus:border-utama transition-all outline-none text-gelap dark:text-terang"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit" disabled={sedangMemuat}
            className="w-full bg-utama text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-utama/30 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {sedangMemuat ? <Loader2 className="animate-spin" size={20} /> : 'Masuk Sekarang'}
            {!sedangMemuat && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
          Belum punya akun?{' '}
          <Link to="/register" className="text-utama font-bold hover:underline">Daftar Gratis</Link>
        </p>
      </div>
    </div>
  );
}