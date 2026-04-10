import { useState } from 'react';
import Swal from 'sweetalert2';
import { Send, FileSignature, LayoutGrid, Banknote, Calendar, Loader2 } from 'lucide-react';
import tarikData from '../../../api/koneksi';

export default function TabBuatProyek({ pindahTab }) {
  const [memuat, setMemuat] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', description: '', minPrice: '', maxPrice: '', deadline: ''
  });

  const tanganiInput = (e) => {
    let nilai = e.target.value;
    if (e.target.name === 'minPrice' || e.target.name === 'maxPrice') {
      nilai = nilai.replace(/\D/g, '');
    }
    setForm({ ...form, [e.target.name]: nilai });
  };

  const denganKoma = (angka) => {
    if (!angka) return '';
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const tanganiSimpan = async (e) => {
    e.preventDefault();
    if (parseInt(form.minPrice) > parseInt(form.maxPrice)) {
      return Swal.fire('Perhatian', 'Anggaran Minimum tidak boleh lebih besar dari Anggaran Maksimum.', 'warning');
    }

    setMemuat(true);
    try {
      const payload = {
        ...form,
        budgetMin: parseInt(form.minPrice),
        budgetMax: parseInt(form.maxPrice)
      };
      await tarikData.post('/projects', payload);
      Swal.fire({ title: 'Berhasil', text: 'Proyek baru telah berhasil dipublikasikan!', icon: 'success', timer: 2000, showConfirmButton: false });
      setForm({ title: '', category: '', description: '', minPrice: '', maxPrice: '', deadline: '' });
      pindahTab('proyek-ku');
    } catch (eror) {
      Swal.fire('Gagal Membuat Proyek', eror.response?.data?.error || 'Terjadi kesalahan sistem.', 'error');
    } finally {
      setMemuat(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gelap dark:text-terang">Publikasikan Proyek Baru</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Isi rincian pekerjaan dengan jelas agar mendapatkan pelamar yang sesuai kriteria.</p>
      </div>

      <form onSubmit={tanganiSimpan} autoComplete="off" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Judul Proyek</label>
            <div className="relative">
              <FileSignature className="absolute top-3 left-3 text-gray-400" size={18} />
              <input type="text" name="title" value={form.title} onChange={tanganiInput} required placeholder="Contoh: Pembuatan Website E-Commerce Toko Baju" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Kategori Pekerjaan</label>
            <div className="relative">
              <LayoutGrid className="absolute top-3 left-3 text-gray-400" size={18} />
              <select name="category" value={form.category} onChange={tanganiInput} required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm appearance-none">
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

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Tenggat Waktu Pengerjaan (Deadline)</label>
            <div className="relative">
              <Calendar className="absolute top-3 left-3 text-gray-400" size={18} />
              <input type="date" name="deadline" value={form.deadline} onChange={tanganiInput} required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Anggaran Minimum (Rp)</label>
            <div className="relative">
              <Banknote className="absolute top-3 left-3 text-gray-400" size={18} />
              <input type="text" name="minPrice" value={denganKoma(form.minPrice)} onChange={tanganiInput} required placeholder="500,000" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Anggaran Maksimum (Rp)</label>
            <div className="relative">
              <Banknote className="absolute top-3 left-3 text-gray-400" size={18} />
              <input type="text" name="maxPrice" value={denganKoma(form.maxPrice)} onChange={tanganiInput} required placeholder="1,500,000" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm" />
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Deskripsi Lengkap Proyek</label>
            <textarea name="description" value={form.description} onChange={tanganiInput} required placeholder="Jelaskan kebutuhan, fitur yang diinginkan, kriteria, dan aturan proyek secara rinci..." rows="6" className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-utama outline-none text-sm resize-none" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={memuat} className="bg-utama text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-utama/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed">
            {memuat ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Posting Proyek Sekarang
          </button>
        </div>
      </form>
    </div>
  );
}