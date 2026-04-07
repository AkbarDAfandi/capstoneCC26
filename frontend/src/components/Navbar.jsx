import { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, User, LogOut, ChevronDown, Briefcase, LayoutDashboard, Home } from 'lucide-react';
import Swal from 'sweetalert2';
import { ThemeContext } from '../context/ThemeContext';

import logoBaru from '../assets/Logo_Biru.png';

export default function Navbar() {
  const { temaGelap, saklarTema } = useContext(ThemeContext);
  const arahkan = useNavigate();
  const lokasi = useLocation();
  const [dataUser, setDataUser] = useState(null);
  const [bukaMenu, setBukaMenu] = useState(false);
  const refMenu = useRef(null);

  useEffect(() => {
    const ambilAkun = () => {
      const token = localStorage.getItem('tokenAkses');
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          setDataUser(payload);
        } catch (e) {
          setDataUser(null);
        }
      } else {
        setDataUser(null);
      }
    };

    ambilAkun();
    window.addEventListener('storage', ambilAkun);
    return () => window.removeEventListener('storage', ambilAkun);
  }, [lokasi.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (refMenu.current && !refMenu.current.contains(e.target)) {
        setBukaMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // close dropdown
  useEffect(() => {
    setBukaMenu(false);
  }, [lokasi.pathname]);

  const tanganiKeluar = () => {
    setBukaMenu(false);
    Swal.fire({
      title: 'Yakin ingin keluar?',
      text: 'Sesi kamu akan diakhiri.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#045a8c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('tokenAkses');
        setDataUser(null);
        arahkan('/login');
        Swal.fire({
          title: 'Telah Keluar',
          text: 'Sampai jumpa kembali!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // cek path
  const isActive = (path) => {
    if (path === '/') return lokasi.pathname === '/';
    return lokasi.pathname.startsWith(path);
  };

  const navLinkClass = (path) =>
    `relative flex items-center gap-1.5 px-1 py-1 text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-utama'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
    }`;

  const activeBar = (path) =>
    isActive(path)
      ? 'absolute -bottom-[1.47rem] left-0 right-0 h-0.5 bg-utama rounded-full'
      : '';

  const dashboardPath = dataUser?.role === 'client' ? '/dashboard/client' : '/dashboard/freelancer';

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-terang/80 dark:bg-gelap/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 dark:border-gray-700 p-0.5 group-hover:scale-110 transition-transform duration-200">
              <img
                src={logoBaru}
                alt="FreelanceHub Logo"
                className="rounded-full w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-lg tracking-tight text-gelap dark:text-terang">
              Freelance<span className="text-utama">Hub</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">

            <div className="hidden md:flex items-center gap-5">
              <Link to="/" className={navLinkClass('/')}>
                <Home size={15} />
                Beranda
                <span className={activeBar('/')} />
              </Link>
              <Link to="/projects" className={navLinkClass('/projects')}>
                <Briefcase size={15} />
                Proyek
                <span className={activeBar('/projects')} />
              </Link>
              {dataUser && (
                <Link to={dashboardPath} className={navLinkClass('/dashboard')}>
                  <LayoutDashboard size={15} />
                  Dashboard
                  <span className={activeBar('/dashboard')} />
                </Link>
              )}
            </div>

            <div className="hidden md:block w-px h-5 bg-gray-200 dark:bg-gray-700" />

            <button
              onClick={saklarTema}
              className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              title={temaGelap ? 'Mode Terang' : 'Mode Gelap'}
            >
              {temaGelap ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {dataUser ? (
              <div className="relative" ref={refMenu}>
                <button
                  onClick={() => setBukaMenu(!bukaMenu)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-utama to-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {dataUser.name ? dataUser.name.charAt(0).toUpperCase() : <User size={14} />}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300 max-w-25 truncate">
                    {dataUser.name || 'User'}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 ${bukaMenu ? 'rotate-180' : ''}`}
                  />
                </button>

                {bukaMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      to={`/profile/${dataUser.id}`}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <User size={15} className="text-gray-400" />
                      Profil Saya
                    </Link>
                    <Link
                      to={dashboardPath}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors md:hidden"
                    >
                      <LayoutDashboard size={15} className="text-gray-400" />
                      Dashboard
                    </Link>
                    <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                    <button
                      onClick={tanganiKeluar}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                    >
                      <LogOut size={15} />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-utama dark:hover:text-utama hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-utama text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-utama/90 hover:shadow-md transition-all duration-200"
                >
                  Daftar
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}