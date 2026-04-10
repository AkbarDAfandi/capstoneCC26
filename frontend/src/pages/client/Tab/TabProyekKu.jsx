import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Briefcase, Edit, Trash2, Users, Loader2, ChevronLeft, CheckCircle, XCircle, FileText, FileSignature, LayoutGrid, Banknote, Calendar, Save, X } from 'lucide-react';
import tarikData from '../../../api/koneksi';

export default function TabProyekKu({ idPengguna }) {
  const [daftarProyek, setDaftarProyek] = useState([]);
  const [memuat, setMemuat] = useState(true);

  // State navigasi di dalam tab: 'list', 'edit', 'detail'
  const [modeTampilan, setModeTampilan] = useState('list');
  const [proyekAktif, setProyekAktif] = useState(null);

  // State khusus pelamar
  const [pelamar, setPelamar] = useState([]);
  const [memuatPelamar, setMemuatPelamar] = useState(false);

  // State form edit
  const [formEdit, setFormEdit] = useState({
    title: '', category: '', description: '', budgetMin: '', budgetMax: '', deadline: '', status: ''
  });
  const [formEditAsli, setFormEditAsli] = useState(null);
  const [menyimpanEdit, setMenyimpanEdit] = useState(false);

  useEffect(() => {
    if (modeTampilan === 'list' && idPengguna) {
      ambilDaftarProyek();
    }
  }, [modeTampilan, idPengguna]);

  const ambilDaftarProyek = async () => {
    setMemuat(true);
    try {
      // Sesuaikan path endpoint dengan backend-mu. Misalnya get semua proyek lalu di filter id milik klien.
      const respon = await tarikData.get('/projects');
      const proyekKlien = respon.data.filter(p => p.clientId === idPengguna);
      setDaftarProyek(proyekKlien);
    } catch (eror) {
      console.error('Gagal memuat proyek:', eror);
    } finally {
      setMemuat(false);
    }
  };

  const tanganiHapus = async (idProyek) => {
    Swal.fire({
      title: 'Hapus Proyek?',
      text: 'Data yang dihapus tidak bisa dikembalikan beserta semua data pelamarnya.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33'
    }).then(async (hasil) => {
      if (hasil.isConfirmed) {
        try {
          await tarikData.delete(`/projects/${idProyek}`);
          Swal.fire('Terhapus', 'Proyek berhasil dihapus.', 'success');
          ambilDaftarProyek();
        } catch (eror) {
          Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus.', 'error');
        }
      }
    });
  };

  const bukaDetail = async (proyek) => {
    setProyekAktif(proyek);
    setModeTampilan('detail');
    setMemuatPelamar(true);
    try {
      // 1. Panggil endpoint yang benar sesuai di controllers.js
      const respon = await tarikData.get('/applications');
      
      // 2. Saring agar cuma menampilkan pelamar untuk proyek yang sedang diklik
      const pelamarProyekIni = respon.data.filter(
        (lamaran) => lamaran.projectId === proyek.id
      );
      
      setPelamar(pelamarProyekIni);
    } catch (eror) {
      console.error('Gagal memuat pelamar:', eror);
    } finally {
      setMemuatPelamar(false);
    }
  };

  const aksiPelamar = async (idAplikasi, statusAksi) => {
    const teksAksi = statusAksi === 'accepted' ? 'Menerima' : 'Menolak';
    Swal.fire({
      title: `${teksAksi} Freelancer?`,
      text: `Anda yakin ingin ${teksAksi.toLowerCase()} tawaran ini?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Lanjutkan'
    }).then(async (hasil) => {
      if (hasil.isConfirmed) {
        try {
          await tarikData.put(`/applications/${idAplikasi}`, { status: statusAksi });
          Swal.fire('Berhasil', `Kandidat telah di${statusAksi === 'accepted' ? 'terima' : 'tolak'}.`, 'success');
          setPelamar(pelamarLama => pelamarLama.map(p => 
            p.id === idAplikasi ? { ...p, status: statusAksi } : p
          ));
        } catch (eror) {
          Swal.fire('Gagal', 'Terjadi kesalahan.', 'error');
        }
      }
    });
  };

  // ---- FUNGSI EDIT PROYEK ----
  const bukaFormEdit = (proyek) => {
    const dataEdit = {
      title: proyek.title || '',
      category: proyek.category || '',
      description: proyek.description || '',
      budgetMin: proyek.budgetMin ? String(proyek.budgetMin) : '',
      budgetMax: proyek.budgetMax ? String(proyek.budgetMax) : '',
      deadline: proyek.deadline ? new Date(proyek.deadline).toISOString().split('T')[0] : '',
      status: proyek.status || 'open'
    };
    setFormEdit(dataEdit);
    setFormEditAsli(dataEdit);
    setProyekAktif(proyek);
    setModeTampilan('edit');
  };

  const tanganiInputEdit = (e) => {
    let nilai = e.target.value;
    if (e.target.name === 'budgetMin' || e.target.name === 'budgetMax') {
      nilai = nilai.replace(/\D/g, '');
    }
    setFormEdit({ ...formEdit, [e.target.name]: nilai });
  };

  const denganKoma = (angka) => {
    if (!angka) return '';
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const adaPerubahanEdit = JSON.stringify(formEdit) !== JSON.stringify(formEditAsli);

  const simpanEdit = async (e) => {
    e.preventDefault();

    if (parseInt(formEdit.budgetMin) > parseInt(formEdit.budgetMax)) {
      return Swal.fire('Perhatian', 'Anggaran Minimum tidak boleh lebih besar dari Anggaran Maksimum.', 'warning');
    }

    setMenyimpanEdit(true);
    try {
      await tarikData.put(`/projects/${proyekAktif.id}`, {
        title: formEdit.title,
        description: formEdit.description,
        category: formEdit.category,
        budgetMin: parseInt(formEdit.budgetMin),
        budgetMax: parseInt(formEdit.budgetMax),
        deadline: formEdit.deadline,
        status: formEdit.status
      });

      Swal.fire({
        title: 'Berhasil',
        text: 'Proyek berhasil diperbarui!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      setModeTampilan('list');
    } catch (eror) {
      Swal.fire('Gagal Menyimpan', eror.response?.data?.error || 'Terjadi kesalahan saat memperbarui proyek.', 'error');
    } finally {
      setMenyimpanEdit(false);
    }
  };

  const labelStatus = (status) => {
    const peta = { open: 'Terbuka', in_progress: 'Sedang Berjalan', closed: 'Selesai' };
    return peta[status] || status;
  };

  const warnaStatus = (status) => {
    const peta = {
      open: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
      in_progress: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
      closed: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
    };
    return peta[status] || '';
  };

  // ---- TAMPILAN LIST PROYEK ----
  if (modeTampilan === 'list') {
    return (
      <div className="space-y-4">
        {memuat ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-utama" size={32} /></div>
        ) : daftarProyek.length === 0 ? (
          <div className="text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16">
            <Briefcase size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-gelap dark:text-terang">Belum Ada Proyek</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Anda belum memposting pekerjaan apapun.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {daftarProyek.map((proyek) => (
              <div key={proyek.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-lg text-gelap dark:text-terang">{proyek.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${warnaStatus(proyek.status)}`}>
                      {labelStatus(proyek.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md text-xs">{proyek.category}</span>
                    <span>Tenggat: {new Date(proyek.deadline).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <button onClick={() => bukaDetail(proyek)} className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-blue-50 text-utama hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Users size={16} /> Review Kandidat
                  </button>
                  <button onClick={() => bukaFormEdit(proyek)} className="flex justify-center items-center gap-2 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:text-amber-400 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={() => tanganiHapus(proyek.id)} className="flex justify-center items-center p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---- TAMPILAN FORM EDIT PROYEK ----
  if (modeTampilan === 'edit' && proyekAktif) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
          <button onClick={() => setModeTampilan('list')} className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 shadow-sm transition-all">
            <ChevronLeft size={18} />
          </button>
          <div>
            <h2 className="font-bold text-gelap dark:text-terang text-lg leading-tight">Edit Proyek</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Perbarui detail proyek "{proyekAktif.title}"</p>
          </div>
        </div>

        <form onSubmit={simpanEdit} autoComplete="off" className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Judul */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Judul Proyek</label>
              <div className="relative">
                <FileSignature className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="text" name="title" value={formEdit.title} onChange={tanganiInputEdit} required
                  placeholder="Contoh: Pembuatan Website E-Commerce Toko Baju"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm"
                />
              </div>
            </div>

            {/* Kategori */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Kategori Pekerjaan</label>
              <div className="relative">
                <LayoutGrid className="absolute top-3 left-3 text-gray-400" size={18} />
                <select
                  name="category" value={formEdit.category} onChange={tanganiInputEdit} required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm appearance-none"
                >
                  <option value="" disabled>Pilih Kategori</option>
                  <option value="Web Development">Pengembangan Web</option>
                  <option value="Mobile App">Aplikasi Mobile</option>
                  <option value="UI/UX Design">Desain UI/UX</option>
                  <option value="Graphic Design">Desain Grafis</option>
                  <option value="Digital Marketing">Pemasaran Digital</option>
                  <option value="Other">Lainnya</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Status Proyek</label>
              <div className="relative">
                <Briefcase className="absolute top-3 left-3 text-gray-400" size={18} />
                <select
                  name="status" value={formEdit.status} onChange={tanganiInputEdit}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm appearance-none"
                >
                  <option value="open">Terbuka</option>
                  <option value="in_progress">Sedang Berjalan</option>
                  <option value="closed">Selesai</option>
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Tenggat Waktu Pengerjaan (Deadline)</label>
              <div className="relative">
                <Calendar className="absolute top-3 left-3 text-gray-400" size={18} />
                <input type="date" name="deadline" value={formEdit.deadline} onChange={tanganiInputEdit} required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm" />
              </div>
            </div>

            {/* Anggaran Min */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Anggaran Minimum (Rp)</label>
              <div className="relative">
                <Banknote className="absolute top-3 left-3 text-gray-400" size={18} />
                <input type="text" name="budgetMin" value={denganKoma(formEdit.budgetMin)} onChange={tanganiInputEdit} required placeholder="500,000" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm" />
              </div>
            </div>

            {/* Anggaran Max */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Anggaran Maksimum (Rp)</label>
              <div className="relative">
                <Banknote className="absolute top-3 left-3 text-gray-400" size={18} />
                <input type="text" name="budgetMax" value={denganKoma(formEdit.budgetMax)} onChange={tanganiInputEdit} required placeholder="1,500,000" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm" />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Deskripsi Lengkap Proyek</label>
              <textarea name="description" value={formEdit.description} onChange={tanganiInputEdit} required placeholder="Jelaskan kebutuhan, fitur yang diinginkan, kriteria, dan aturan proyek secara rinci..." rows="6" className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm resize-none" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setModeTampilan('list')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              <X size={16} /> Batal
            </button>
            <button
              type="submit"
              disabled={menyimpanEdit || !adaPerubahanEdit}
              className="flex items-center gap-2 bg-utama text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-utama/90 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {menyimpanEdit ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {menyimpanEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ---- TAMPILAN DETAIL & REVIEW PELAMAR ----
  if (modeTampilan === 'detail' && proyekAktif) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
          <button onClick={() => setModeTampilan('list')} className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 shadow-sm transition-all">
            <ChevronLeft size={18} />
          </button>
          <div>
            <h2 className="font-bold text-gelap dark:text-terang text-lg leading-tight">{proyekAktif.title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Daftar pelamar untuk proyek ini.</p>
          </div>
        </div>

        <div className="p-6">
          {memuatPelamar ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-utama" size={24} /></div>
          ) : pelamar.length === 0 ? (
            <div className="text-center py-10">
              <Users size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Belum ada freelancer yang melamar proyek ini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pelamar.map((lamaran) => (
                <div key={lamaran.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-5 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-gelap dark:text-terang">{lamaran.freelancer?.name || 'Freelancer Anonim'}</h4>
                      <p className="text-sm font-medium text-utama mt-1">Menawarkan: Rp {lamaran.offeredPrice?.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      {lamaran.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => aksiPelamar(lamaran.id, 'accepted')} className="flex items-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                            <CheckCircle size={16} /> Terima
                          </button>
                          <button onClick={() => aksiPelamar(lamaran.id, 'rejected')} className="flex items-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                            <XCircle size={16} /> Tolak
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${lamaran.status === 'accepted' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                          {lamaran.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      <FileText size={14} /> Surat Lamaran (Cover Letter)
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{lamaran.proposal}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}