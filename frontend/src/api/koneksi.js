import axios from 'axios';

const tarikData = axios.create({
  baseURL: 'https://capstonecc26-production.up.railway.app', 
});

tarikData.interceptors.request.use((konfigurasi) => {
  const tokenMasuk = localStorage.getItem('tokenAkses');
  if (tokenMasuk) {
    konfigurasi.headers.Authorization = `Bearer ${tokenMasuk}`;
  }
  return konfigurasi;
});

export default tarikData;