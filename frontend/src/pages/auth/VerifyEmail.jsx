import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, ShieldCheck, ShieldX, ArrowRight } from 'lucide-react';
import tarikData from '../../api/koneksi';

export default function VerifyEmail() {
  const [paramURL] = useSearchParams();
  const token = paramURL.get('token');

  const [statusVerifikasi, setStatusVerifikasi] = useState('memuat');
  const [pesanError, setPesanError] = useState('');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatusVerifikasi('gagal');
      setPesanError('Token verifikasi tidak ditemukan di URL.');
      return;
    }

    if (!hasFetched.current) {
      hasFetched.current = true;
      verifikasiEmail();
    }
  }, [token]);

  const verifikasiEmail = async () => {
    setStatusVerifikasi('memuat');
    try {
      await tarikData.get(`/verify-email?token=${token}`);
      setStatusVerifikasi('berhasil');
    } catch (eror) {
      setStatusVerifikasi('gagal');
      const pesan = eror.response?.data?.error || 'Verifikasi gagal. Link mungkin sudah kadaluarsa.';
      setPesanError(pesan);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-utama/15 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-md bg-white/70 dark:bg-gelap/50 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-10 rounded-3xl shadow-2xl shadow-utama/10 text-center">

        {statusVerifikasi === 'memuat' && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Loader2 className="animate-spin text-utama" size={36} />
            </div>
            <h1 className="text-2xl font-extrabold text-gelap dark:text-terang mb-3">
              Memverifikasi Email
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Mohon tunggu sebentar, kami sedang memproses verifikasi akun kamu...
            </p>
          </div>
        )}

        {statusVerifikasi === 'berhasil' && (
          <div className="animate-[fadeIn_0.4s_ease-out]">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <ShieldCheck className="text-green-500" size={40} />
            </div>
            <h1 className="text-2xl font-extrabold text-gelap dark:text-terang mb-3">
              Verifikasi Berhasil!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
              Email kamu telah berhasil diverifikasi. Sekarang kamu bisa masuk ke FreelanceHub dan mulai menjelajahi proyek-proyek yang tersedia.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-utama text-white font-bold py-3.5 px-8 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-utama/30 transition-all"
            >
              Masuk Sekarang
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {statusVerifikasi === 'gagal' && (
          <div className="animate-[fadeIn_0.4s_ease-out]">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <ShieldX className="text-red-500" size={40} />
            </div>
            <h1 className="text-2xl font-extrabold text-gelap dark:text-terang mb-3">
              Verifikasi Gagal
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
              {pesanError}
            </p>
            <div className="bg-red-50 dark:bg-red-900/15 border border-red-100 dark:border-red-800 rounded-xl p-4 mb-8">
              <p className="text-red-600 dark:text-red-400 text-xs leading-relaxed">
                Jika link sudah kadaluarsa, silakan daftar ulang untuk mendapatkan link verifikasi yang baru.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-utama text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-utama/30 transition-all text-sm"
              >
                Daftar Ulang
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
              >
                Kembali ke Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
