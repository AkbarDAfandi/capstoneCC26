import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import Projects from './pages/public/Projects';
import DashboardClient from './pages/client/DashboardClient';
import DashboardFreelancer from './pages/freelancer/DashboardFreelancer';
import ProjectDetail from './pages/public/ProjectDetail';
import Profile from './pages/public/Profile';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar />
          <main className="grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/dashboard/client" element={<DashboardClient />} />
              <Route path="/dashboard/freelancer" element={<DashboardFreelancer />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}