import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [temaGelap, setTemaGelap] = useState(false);

  useEffect(() => {
    const memoriTema = localStorage.getItem('tema-freelancehub');
    if (memoriTema === 'gelap') {
      setTemaGelap(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const saklarTema = () => {
    setTemaGelap((sebelumnya) => {
      const modeBaru = !sebelumnya;
      if (modeBaru) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('tema-freelancehub', 'gelap');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('tema-freelancehub', 'terang');
      }
      return modeBaru;
    });
  };

  return (
    <ThemeContext.Provider value={{ temaGelap, saklarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}