import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  ClipboardList, UserCircle, CheckCircle, Clock, XCircle,
  BarChart3, Briefcase, Star
} from 'lucide-react';
import tarikData from '../../api/koneksi';

import TabRingkasan from './tab/TabRingkasan';
import TabLamaran from './tab/TabLamaran';
import TabPengaturan from './tab/TabPengaturan';
import TabUlasan from './tab/TabUlasan';

export default function DashboardFreelancer() {
  const arahkan = useNavigate();
  const [tabAktif, setTabAktif] = useState('ringkasan');

  const [daftarLamaran, setDaftarLamaran] = useState([]);
  const [memuatLamaran, setMemuatLamaran] = useState(true);

  const [idPengguna, setIdPengguna] = useState(null);
  const [dataProfil, setDataProfil] = useState({
    name: '', bio: '', smkMajor: '', skills: '', portfolioUrl: '', hourlyRate: ''
  });
  const [dataProfilAsli, setDataProfilAsli] = useState(null);
  const [memuatProfil, setMemuatProfil] = useState(false);
  const [menyimpanProfil, setMenyimpanProfil] = useState(false);

  // ── Helpers ──

  const dapatkanIdDariToken = () => {
    try {
      const token = localStorage.getItem('tokenAkses');
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64)).id;
    } catch { return null; }
  };

  const warnaStatus = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const ikonStatus = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const teksStatus = (status) => {
    switch (status) {
      case 'accepted': return 'Diterima';
      case 'rejected': return 'Ditolak';
      default: return 'Menunggu';
    }
  };

  const denganKoma = (angka) => {
    if (!angka && angka !== 0) return '';
    const bagian = angka.toString().split('.');
    bagian[0] = bagian[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return bagian.join('.');
  };

  // ── Data Fetching ──

  useEffect(() => {
    const id = dapatkanIdDariToken();
    if (!id) { arahkan('/login'); return; }
    setIdPengguna(id);
    ambilDaftarLamaran();
    if (tabAktif === 'profil') ambilDataProfil(id);
  }, [tabAktif]);

  const ambilDaftarLamaran = async () => {
    setMemuatLamaran(true);
    try {
      const respon = await tarikData.get('/applications');
      setDaftarLamaran(respon.data);
    } catch (eror) { console.error(eror); }
    finally { setMemuatLamaran(false); }
  };

  const ambilDataProfil = async (id) => {
    setMemuatProfil(true);
    try {
      const respon = await tarikData.get(`/users/${id}`);
      const data = respon.data;
      const fetchedData = {
        name: data.name || '', bio: data.bio || '',
        smkMajor: data.smkMajor || '', skills: data.skills || '',
        portfolioUrl: data.portfolioUrl || '', hourlyRate: data.hourlyRate || ''
      };
      setDataProfil(fetchedData);
      setDataProfilAsli(fetchedData);
    } catch (eror) { console.error(eror); }
    finally { setMemuatProfil(false); }
  };

  // ── Profile Handlers ──

  const tanganiInputProfil = (e) => {
    let nilai = e.target.value;
    if (e.target.name === 'hourlyRate') {
      nilai = nilai.replace(/,/g, '');
      if (nilai && !/^\d*\.?\d*$/.test(nilai)) return;
    }
    setDataProfil({ ...dataProfil, [e.target.name]: nilai });
  };

  const simpanProfil = async (e) => {
    e.preventDefault();
    setMenyimpanProfil(true);
    try {
      const payload = { ...dataProfil };
      if (payload.hourlyRate) payload.hourlyRate = payload.hourlyRate.toString().replace(/,/g, '');
      await tarikData.put(`/users/${idPengguna}`, payload);
      setDataProfilAsli({ ...dataProfil });
      Swal.fire({ title: 'Berhasil', text: 'Profil berhasil diperbarui!', icon: 'success', timer: 2000, showConfirmButton: false });
    } catch (eror) {
      Swal.fire({ title: 'Gagal Menyimpan', text: eror.response?.data?.error || 'Gagal menyimpan profil.', icon: 'error' });
    } finally { setMenyimpanProfil(false); }
  };

  const apakahAdaPerubahan = JSON.stringify(dataProfil) !== JSON.stringify(dataProfilAsli);

  // ── Computed Stats ──

  const statistik = useMemo(() => {
    const total = daftarLamaran.length;
    const diterima = daftarLamaran.filter(l => l.status === 'accepted').length;
    const ditolak = daftarLamaran.filter(l => l.status === 'rejected').length;
    const menunggu = daftarLamaran.filter(l => l.status === 'pending').length;
    const tingkatSukses = total > 0 ? Math.round((diterima / total) * 100) : 0;
    const rataHarga = total > 0
      ? Math.round(daftarLamaran.reduce((sum, l) => sum + (l.offeredPrice || 0), 0) / total)
      : 0;
    return { total, diterima, ditolak, menunggu, tingkatSukses, rataHarga };
  }, [daftarLamaran]);

  const dataGrafik = useMemo(() => {
    const bulanNama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const sekarang = new Date();
    const hasil = [];
    for (let i = 5; i >= 0; i--) {
      const bulan = new Date(sekarang.getFullYear(), sekarang.getMonth() - i, 1);
      const bln = bulan.getMonth();
      const thn = bulan.getFullYear();
      const jumlah = daftarLamaran.filter(l => {
        const tgl = new Date(l.createdAt);
        return tgl.getMonth() === bln && tgl.getFullYear() === thn;
      }).length;
      hasil.push({ label: `${bulanNama[bln]} ${thn}`, short: bulanNama[bln], value: jumlah });
    }
    return hasil;
  }, [daftarLamaran]);

  // ── Tab definitions ──

  const daftarTab = [
    { id: 'ringkasan', label: 'Ringkasan', ikon: <BarChart3 size={18} /> },
    { id: 'lamaran', label: 'Status Lamaran', ikon: <ClipboardList size={18} /> },
    { id: 'ulasan', label: 'Ulasan', ikon: <Star size={18} /> },
    { id: 'profil', label: 'Pengaturan', ikon: <UserCircle size={18} /> },
  ];

  // ── Render ──

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gelap relative overflow-hidden py-10">
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-utama/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-72 h-72 bg-blue-400/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gelap dark:text-terang">
              Dashboard Freelancer
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Atur karir dan pantau penawaranmu.</p>
          </div>
          <Link to="/projects" className="bg-utama text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm">
            <Briefcase size={16} /> Eksplor Proyek Baru
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-1.5 rounded-xl w-full max-w-lg mb-8 border border-gray-100 dark:border-gray-800">
          {daftarTab.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabAktif(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${tabAktif === tab.id
                  ? 'bg-white dark:bg-gray-700 text-utama shadow-sm'
                  : 'text-gray-500 hover:text-gelap dark:hover:text-terang'
                }`}
            >
              {tab.ikon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tabAktif === 'ringkasan' && (
          <TabRingkasan
            statistik={statistik}
            dataGrafik={dataGrafik}
            daftarLamaran={daftarLamaran}
            memuatLamaran={memuatLamaran}
            setTabAktif={setTabAktif}
            warnaStatus={warnaStatus}
            ikonStatus={ikonStatus}
          />
        )}

        {tabAktif === 'lamaran' && (
          <TabLamaran
            daftarLamaran={daftarLamaran}
            memuatLamaran={memuatLamaran}
            warnaStatus={warnaStatus}
            ikonStatus={ikonStatus}
            teksStatus={teksStatus}
          />
        )}

        {tabAktif === 'ulasan' && (
          <TabUlasan idPengguna={idPengguna} />
        )}

        {tabAktif === 'profil' && (
          <TabPengaturan
            dataProfil={dataProfil}
            memuatProfil={memuatProfil}
            menyimpanProfil={menyimpanProfil}
            tanganiInputProfil={tanganiInputProfil}
            simpanProfil={simpanProfil}
            denganKoma={denganKoma}
            apakahAdaPerubahan={apakahAdaPerubahan}
          />
        )}

      </div>
    </div>
  );
}

