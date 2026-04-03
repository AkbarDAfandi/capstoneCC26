import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

import logoBaru from '../assets/Logo_Biru.png'; 

export default function Navbar() {
  const { temaGelap, saklarTema } = useContext(ThemeContext);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-terang/70 dark:bg-gelap/70 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <Link to="/" className="flex items-center gap-4 group">
            
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg border border-gray-100 dark:border-gray-700 p-0.5 group-hover:scale-110 group-hover:rotate-[-8deg] transition-all duration-300 ease-out">
              <img 
                src={logoBaru} 
                alt="FreelanceHub Logo" 
                className="rounded-full w-full h-full object-contain"
              />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-gelap dark:text-terang">
              Freelance<span className="text-utama">Hub</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <button 
              onClick={saklarTema} 
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform"
            >
              {temaGelap ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/login" className="font-semibold text-gray-700 dark:text-gray-200 hover:text-utama dark:hover:text-utama transition-colors">
              Masuk
            </Link>
            <Link 
              to="/register" 
              className="bg-gelap dark:bg-terang text-terang dark:text-gelap px-6 py-2.5 rounded-full font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Daftar Gratis
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}