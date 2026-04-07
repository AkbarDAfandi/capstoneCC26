import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Loader2, Calendar, Wallet, CheckCircle, ArrowLeft, Send, Check } from 'lucide-react';
import tarikData from '../../api/koneksi';

export default function ProjectDetail() {
  const { id } = useParams();
  const [proyek, setProyek] = useState(null);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [pesanEror, setPesanEror] = useState('');

  const [tampilModal, setTampilModal] = useState(false);
  const [dataLamaran, setDataLamaran] = useState({ proposal: '', offeredPrice: '' });
  const [sedangKirim, setSedangKirim] = useState(false);

  useEffect(() => {
    const ambilDetail = async () => {
      try {
        const respon = await tarikData.get(`/projects/${id}`);
        setProyek(respon.data);
      } catch (eror) {
        setPesanEror(eror.response?.data?.error || 'Gagal mengambil detail proyek.');
      } finally {
        setSedangMemuat(false);
      }
    };
    ambilDetail();
  }, [id]);

  const tanganiInput = (e) => {
    let nilai = e.target.value;
    if (e.target.name === 'offeredPrice') {
      nilai = nilai.replace(/,/g, '');
      if (nilai && !/^\d*\.?\d*$/.test(nilai)) return;
    }
    setDataLamaran({ ...dataLamaran, [e.target.name]: nilai });
  };

  const denganKoma = (angka) => {
    if (!angka && angka !== 0) return '';
    const bagian = angka.toString().split('.');
    bagian[0] = bagian[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return bagian.join('.');
  };

  const kirimLamaran = async (e) => {
    e.preventDefault();
    setSedangKirim(true);
    try {
      const payloadOfferedPrice = dataLamaran.offeredPrice.toString().replace(/,/g, '');
      await tarikData.post('/applications', {
        projectId: id,
        proposal: dataLamaran.proposal,
        offeredPrice: payloadOfferedPrice
      });
      Swal.fire({
        title: 'Berhasil Terkirim!',
        text: 'Lamaran kamu akan ditinjau.',
        icon: 'success',
        timer: 2500,
        showConfirmButton: false
      });
      setTampilModal(false);
      setDataLamaran({ proposal: '', offeredPrice: '' });
    } catch (eror) {
      let pesan = 'Terjadi kesalahan saat mengirim lamaran.';
      if (eror.response?.status === 401) pesan = 'Silakan masuk (login) sebagai Freelancer terlebih dahulu.';
      if (eror.response?.status === 403) pesan = 'Hanya Freelancer yang bisa melakukan lamaran proyek.';
      
      Swal.fire({
        title: 'Mohon Maaf',
        text: eror.response?.data?.error || pesan,
        icon: 'error'
      });
    } finally {
      setSedangKirim(false);
    }
  };

  if (sedangMemuat) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-utama mb-4" size={48} />
        <p className="text-gray-500 font-medium">Memuat detail proyek...</p>
      </div>
    );
  }

  if (pesanEror || !proyek) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
        <div className="p-8 bg-red-100 border border-red-200 rounded-3xl text-red-600 text-center font-medium max-w-md w-full shadow-lg">
          {pesanEror || 'Proyek tidak ditemukan.'}
          <Link to="/projects" className="block mt-6 text-sm text-red-700 underline font-bold">
            Kembali ke Daftar Proyek
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-terang dark:bg-gelap relative overflow-hidden pb-20">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-utama/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <Link to="/projects" className="inline-flex items-center gap-2 text-gray-500 hover:text-utama transition-colors font-medium mb-8">
          <ArrowLeft size={20} /> Kembali ke Eksplorasi
        </Link>

        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-8 md:p-12 rounded-4xl shadow-xl shadow-utama/5 mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-utama/10 dark:bg-utama/20 text-utama font-bold rounded-full border border-utama/20">
              {proyek.category}
            </span>
            {proyek.status === 'open' ? (
              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
                <CheckCircle size={16} /> Aktif / Menerima Lamaran
              </span>
            ) : (
              <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium rounded-full">
                Ditutup / Sedang Berjalan
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-gelap dark:text-terang mb-6 leading-tight">
            {proyek.title}
          </h1>

          <div className="flex flex-wrap gap-6 md:gap-10 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <Wallet size={24} className="text-utama" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Anggaran Disediakan</p>
                <p className="font-bold text-lg text-gelap dark:text-terang">
                  Rp {new Intl.NumberFormat('id-ID').format(proyek.budgetMin)} - <br className="md:hidden" /> Rp {new Intl.NumberFormat('id-ID').format(proyek.budgetMax)}
                </p>
              </div>
            </div>

            {proyek.deadline && (
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <Calendar size={24} className="text-utama" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tenggat Waktu</p>
                  <p className="font-bold text-lg text-gelap dark:text-terang">
                    {new Date(proyek.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>



        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-100 dark:border-gray-700 p-8 rounded-4xl">
              <h2 className="text-2xl font-bold mb-6 text-gelap dark:text-terang">Rincian Pekerjaan</h2>
              <div className="text-gray-600 dark:text-gray-300 leading-loose prose prose-blue sm:prose">
                {proyek.description.split('\n').map((paragraf, id) => (
                  <p key={id} className={paragraf.trim() === '' ? 'h-4' : 'mb-4'}>{paragraf}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-4xl shadow-lg">
              <h3 className="font-bold text-gray-400 text-sm uppercase tracking-wider mb-4">Informasi Klien</h3>
              {proyek.client && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-utama to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner">
                    {proyek.client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Link to={`/profile/${proyek.client.id}`} className="font-bold text-gelap dark:text-terang text-lg hover:text-utama transition-colors line-clamp-1">
                      {proyek.client.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-0.5">Klien UMKM</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setTampilModal(!tampilModal)}
              disabled={proyek.status !== 'open'}
              className={`w-full py-4 rounded-3xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg ${proyek.status === 'open'
                  ? 'bg-utama hover:bg-blue-700 text-white hover:-translate-y-1 hover:shadow-utama/30'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed shadow-none'
                }`}
            >
              {proyek.status === 'open' ? (
                <><Send size={20} /> Ajukan Penawaran</>
              ) : (
                'Kesempatan Ditutup'
              )}
            </button>
          </div>
        </div>

        {tampilModal && proyek.status === 'open' && (
          <div className="mt-8 bg-white dark:bg-gray-900 border border-utama/20 dark:border-gray-700 p-8 rounded-4xl shadow-2xl animate-[fadeIn_0.3s_ease-out]">
            <h3 className="text-2xl font-bold text-gelap dark:text-terang mb-2">Formulir Penawaran</h3>
            <p className="text-gray-500 mb-8">Berikan alasan mengapa kamu adalah orang yang tepat.</p>

            <form onSubmit={kirimLamaran} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Tawaran Harga (Rupiah)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-medium">Rp</div>
                  <input
                    type="text" name="offeredPrice" required 
                    value={denganKoma(dataLamaran.offeredPrice)} onChange={tanganiInput}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama text-gelap dark:text-terang outline-none"
                    placeholder="Contoh: 150000"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Sesuaikan dengan rentang: Rp {new Intl.NumberFormat('id-ID').format(proyek.budgetMin)} - {new Intl.NumberFormat('id-ID').format(proyek.budgetMax)}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Proposal / Pesan Singkat</label>
                <textarea
                  name="proposal" required rows="5"
                  value={dataLamaran.proposal} onChange={tanganiInput}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-utama text-gelap dark:text-terang outline-none resize-none"
                  placeholder="Halo, saya sangat tertarik karena..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button" onClick={() => setTampilModal(false)}
                  className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-800 text-gelap dark:text-terang font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit" disabled={sedangKirim}
                  className="flex-1 py-3.5 bg-utama text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2"
                >
                  {sedangKirim ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> Kirim Penawaran</>}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
