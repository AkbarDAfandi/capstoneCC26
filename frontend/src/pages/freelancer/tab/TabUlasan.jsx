import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Star, MessageSquare, Send, Loader2, User, ChevronDown, ChevronUp
} from 'lucide-react';
import tarikData from '../../../api/koneksi';

// ── Komponen Bintang ──
function BintangRating({ nilai, onChange, ukuran = 20, bisaDiklik = false }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((b) => (
        <button
          key={b}
          type="button"
          disabled={!bisaDiklik}
          onClick={() => onChange?.(b)}
          className={`transition-all duration-150 ${bisaDiklik ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star
            size={ukuran}
            className={b <= nilai
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-300 dark:text-gray-600'
            }
          />
        </button>
      ))}
    </div>
  );
}

// ── Distribusi Bintang Bar ──
function BarDistribusi({ bintang, jumlah, total }) {
  const persen = total > 0 ? (jumlah / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-4 text-right">{bintang}</span>
      <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${persen}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-400 dark:text-gray-500 w-5 text-right">{jumlah}</span>
    </div>
  );
}


export default function TabUlasan({ idPengguna }) {
  const [ulasanDiterima, setUlasanDiterima] = useState([]);
  const [ulasanDitulis, setUlasanDitulis] = useState([]);
  const [memuatUlasan, setMemuatUlasan] = useState(true);

  // Proyek yang bisa direview (lamaran diterima)
  const [proyekBisaReview, setProyekBisaReview] = useState([]);
  const [memuatProyek, setMemuatProyek] = useState(true);

  // Form state
  const [formBuka, setFormBuka] = useState(null); // projectId yang formnya dibuka
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [mengirim, setMengirim] = useState(false);

  useEffect(() => {
    if (idPengguna) {
      ambilSemuaUlasan();
      ambilProyekBisaReview();
    }
  }, [idPengguna]);

  const ambilSemuaUlasan = async () => {
    setMemuatUlasan(true);
    try {
      const respon = await tarikData.get('/reviews');
      const semua = respon.data;
      setUlasanDiterima(semua.filter(r => r.revieweeId === idPengguna));
      setUlasanDitulis(semua.filter(r => r.reviewerId === idPengguna));
    } catch (eror) {
      console.error('Gagal ambil ulasan:', eror);
    } finally {
      setMemuatUlasan(false);
    }
  };

  const ambilProyekBisaReview = async () => {
    setMemuatProyek(true);
    try {
      const respon = await tarikData.get('/applications');
      // Hanya lamaran yang diterima
      const diterima = respon.data.filter(l => l.status === 'accepted');
      setProyekBisaReview(diterima);
    } catch (eror) {
      console.error('Gagal ambil proyek:', eror);
    } finally {
      setMemuatProyek(false);
    }
  };

  const kirimUlasan = async (projectId, revieweeId) => {
    if (rating === 0) {
      Swal.fire({ title: 'Rating Kosong', text: 'Pilih rating bintang terlebih dahulu.', icon: 'warning' });
      return;
    }
    setMengirim(true);
    try {
      await tarikData.post('/reviews', {
        projectId,
        revieweeId,
        rating,
        comment: komentar
      });
      Swal.fire({ title: 'Ulasan Terkirim!', text: 'Terima kasih atas ulasanmu.', icon: 'success', timer: 2000, showConfirmButton: false });
      setFormBuka(null);
      setRating(0);
      setKomentar('');
      ambilSemuaUlasan(); // refresh
    } catch (eror) {
      const pesan = eror.response?.data?.error || 'Gagal mengirim ulasan.';
      Swal.fire({ title: 'Gagal', text: pesan, icon: 'error' });
    } finally {
      setMengirim(false);
    }
  };

  // ── Hitung statistik ──
  const rataRata = ulasanDiterima.length > 0
    ? (ulasanDiterima.reduce((s, r) => s + r.rating, 0) / ulasanDiterima.length).toFixed(1)
    : '0.0';

  const distribusi = [5, 4, 3, 2, 1].map(b => ({
    bintang: b,
    jumlah: ulasanDiterima.filter(r => r.rating === b).length
  }));

  // Proyek yang sudah direview oleh freelancer
  const idProyekSudahReview = ulasanDitulis.map(r => r.projectId);

  if (memuatUlasan || memuatProyek) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-utama" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">

      {/* ── Ringkasan Rating + Distribusi ── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Rating Besar */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
          <p className="text-5xl font-extrabold text-gelap dark:text-terang">{rataRata}</p>
          <BintangRating nilai={Math.round(parseFloat(rataRata))} ukuran={22} />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {ulasanDiterima.length} ulasan diterima
          </p>
        </div>

        {/* Distribusi Bintang */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
          <h3 className="text-base font-bold text-gelap dark:text-terang mb-4">Distribusi Rating</h3>
          <div className="space-y-2.5">
            {distribusi.map((d) => (
              <BarDistribusi key={d.bintang} bintang={d.bintang} jumlah={d.jumlah} total={ulasanDiterima.length} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Daftar Ulasan Diterima ── */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
        <h3 className="text-base font-bold text-gelap dark:text-terang mb-4 flex items-center gap-2">
          <MessageSquare size={18} className="text-utama" />
          Ulasan dari Klien
        </h3>

        {ulasanDiterima.length > 0 ? (
          <div className="space-y-4">
            {ulasanDiterima.map((ulasan) => (
              <div key={ulasan.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-linear-to-br from-utama to-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {ulasan.reviewer?.name ? ulasan.reviewer.name.charAt(0).toUpperCase() : <User size={14} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gelap dark:text-terang">
                        {ulasan.reviewer?.name || 'Anonim'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {ulasan.project?.title || 'Proyek'}
                      </p>
                    </div>
                  </div>
                  <BintangRating nilai={ulasan.rating} ukuran={14} />
                </div>
                {ulasan.comment && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 pl-12 italic">
                    "{ulasan.comment}"
                  </p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 pl-12">
                  {new Date(ulasan.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Star size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Belum ada ulasan dari klien.</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Ulasan akan muncul setelah kamu menyelesaikan proyek.</p>
          </div>
        )}
      </div>

      {/* ── Tulis Ulasan untuk Klien ── */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
        <h3 className="text-base font-bold text-gelap dark:text-terang mb-4 flex items-center gap-2">
          <Send size={18} className="text-utama" />
          Beri Ulasan untuk Klien
        </h3>

        {proyekBisaReview.length > 0 ? (
          <div className="space-y-3">
            {proyekBisaReview.map((lamaran) => {
              const sudahReview = idProyekSudahReview.includes(lamaran.projectId);
              const sedangBuka = formBuka === lamaran.projectId;

              return (
                <div key={lamaran.id} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                  {/* Header */}
                  <button
                    onClick={() => {
                      if (sudahReview) return;
                      setFormBuka(sedangBuka ? null : lamaran.projectId);
                      setRating(0);
                      setKomentar('');
                    }}
                    disabled={sudahReview}
                    className={`w-full flex items-center justify-between p-4 text-left transition-colors ${sudahReview
                        ? 'bg-green-50/50 dark:bg-green-900/10 cursor-default'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer'
                      }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gelap dark:text-terang truncate">
                        {lamaran.project?.title || 'Proyek'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        Klien: {lamaran.project?.client?.name || 'Tidak diketahui'}
                      </p>
                    </div>
                    {sudahReview ? (
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full shrink-0">
                        ✓ Sudah direview
                      </span>
                    ) : (
                      <span className="shrink-0 text-gray-400">
                        {sedangBuka ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    )}
                  </button>

                  {/* Form (expandable) */}
                  {sedangBuka && !sudahReview && (
                    <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-900/30 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Rating
                        </label>
                        <BintangRating nilai={rating} onChange={setRating} ukuran={28} bisaDiklik />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Komentar (opsional)
                        </label>
                        <textarea
                          value={komentar}
                          onChange={(e) => setKomentar(e.target.value)}
                          rows={3}
                          placeholder="Bagaimana pengalamanmu bekerja dengan klien ini?"
                          className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gelap dark:text-terang outline-none focus:ring-2 focus:ring-utama resize-none transition-all"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => kirimUlasan(lamaran.projectId, lamaran.project?.clientId)}
                          disabled={mengirim || rating === 0}
                          className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${rating === 0
                              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-utama text-white hover:bg-blue-700 hover:shadow-lg'
                            }`}
                        >
                          {mengirim ? <><Loader2 className="animate-spin" size={16} /> Mengirim...</> : <><Send size={16} /> Kirim Ulasan</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada proyek yang bisa kamu review.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Kamu bisa memberi ulasan setelah lamaranmu diterima.</p>
          </div>
        )}
      </div>
    </div>
  );
}
