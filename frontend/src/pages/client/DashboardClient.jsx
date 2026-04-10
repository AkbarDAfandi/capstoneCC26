import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UserCircle, Briefcase, PlusCircle, LayoutDashboard } from 'lucide-react';
import tarikData from '../../api/koneksi';

import TabProfilKlien from './Tab/TabProfilKlien';
import TabBuatProyek from './Tab/TabBuatProyek';
import TabProyekKu from './Tab/TabProyekKu';

export default function DashboardClient() {
  const arahkan = useNavigate();
  const [tabAktif, setTabAktif] = useState('proyek-ku');

  const [idPengguna, setIdPengguna] = useState(null);
  const [dataProfil, setDataProfil] = useState({ name: '', bio: '' });
  const [dataProfilAsli, setDataProfilAsli] = useState(null);
  const [memuatProfil, setMemuatProfil] = useState(false);
  const [menyimpanProfil, setMenyimpanProfil] = useState(false);

  const dapatkanIdDariToken = () => {
    try {
      const token = localStorage.getItem('tokenAkses');
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64)).id;
    } catch { return null; }
  };

  useEffect(() => {
    const id = dapatkanIdDariToken();
    if (!id) { arahkan('/login'); return; }
    setIdPengguna(id);
    if (tabAktif === 'profil' || tabAktif === 'proyek-ku') ambilDataProfil(id);
  }, [tabAktif]);

  const ambilDataProfil = async (id) => {
    setMemuatProfil(true);
    try {
      const respon = await tarikData.get(`/users/${id}`);
      const data = respon.data;
      const dataDiambil = {
        name: data.name || '',
        bio: data.bio || ''
      };
      setDataProfil(dataDiambil);
      setDataProfilAsli(dataDiambil);
    } catch (eror) {
      console.error('Gagal mengambil profil:', eror);
    } finally {
      setMemuatProfil(false);
    }
  };

  const tanganiInputProfil = (e) => {
    setDataProfil({ ...dataProfil, [e.target.name]: e.target.value });
  };

  const simpanProfil = async (e) => {
    e.preventDefault();
    setMenyimpanProfil(true);
    try {
      await tarikData.put(`/users/${idPengguna}`, dataProfil);
      setDataProfilAsli({ ...dataProfil });
      Swal.fire({ title: 'Berhasil', text: 'Profil bisnis berhasil diperbarui!', icon: 'success', timer: 2000, showConfirmButton: false });
    } catch (eror) {
      Swal.fire({ title: 'Gagal Menyimpan', text: eror.response?.data?.error || 'Gagal menyimpan profil.', icon: 'error' });
    } finally {
      setMenyimpanProfil(false);
    }
  };

  const apakahAdaPerubahan = JSON.stringify(dataProfil) !== JSON.stringify(dataProfilAsli);

  const daftarTab = [
    { id: 'proyek-ku', label: 'ProyekKu', ikon: <Briefcase size={18} /> },
    { id: 'buat-proyek', label: 'Tulis Proyek Baru', ikon: <PlusCircle size={18} /> },
    { id: 'profil', label: 'Pengaturan Profil', ikon: <UserCircle size={18} /> },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gelap relative overflow-hidden py-10">
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-utama/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-blue-400/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gelap dark:text-terang flex items-center gap-3">
            <LayoutDashboard className="text-utama" size={28} />
            Dashboard Klien
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Kelola proyek UMKM Anda dan temukan talenta terbaik.</p>
        </div>

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

        {tabAktif === 'proyek-ku' && <TabProyekKu idPengguna={idPengguna} />}
        {tabAktif === 'buat-proyek' && <TabBuatProyek idPengguna={idPengguna} pindahTab={setTabAktif} />}
        {tabAktif === 'profil' && (
          <TabProfilKlien
            dataProfil={dataProfil}
            memuatProfil={memuatProfil}
            menyimpanProfil={menyimpanProfil}
            tanganiInputProfil={tanganiInputProfil}
            simpanProfil={simpanProfil}
            apakahAdaPerubahan={apakahAdaPerubahan}
          />
        )}
      </div>
    </div>
  );
}