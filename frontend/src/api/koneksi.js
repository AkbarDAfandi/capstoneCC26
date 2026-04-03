import axios from 'axios';

const tarikData = axios.create({
  baseURL: 'http://localhost:3000', 
});

tarikData.interceptors.request.use((konfigurasi) => {
  const tokenMasuk = localStorage.getItem('tokenAkses');
  if (tokenMasuk) {
    konfigurasi.headers.Authorization = `Bearer ${tokenMasuk}`;
  }
  return konfigurasi;
});

export default tarikData;