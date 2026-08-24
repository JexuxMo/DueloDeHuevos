import { useState } from 'react';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import CollectionPage from './pages/CollectionPage';
import DeckBuilderPage from './pages/DeckBuilderPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PlayPage from './pages/PlayPage';
import ProfilePage from './pages/ProfilePage';
import RankingPage from './pages/RankingPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('login');
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };

  const renderPage = () => {
    if (!user) return <LoginPage onNavigate={setCurrentPage} />;

    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'play':
        return <PlayPage />;
      case 'deckbuilder':
        return <DeckBuilderPage />;
      case 'collection':
        return <CollectionPage />;
      case 'ranking':
        return <RankingPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-400 via-yellow-200 to-slate-400 flex items-center justify-center">
        <p className="text-gray-900 text-xl font-bold">Cargando sesión...</p>
      </div>
    );
  }

  if (!user) return renderPage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-yellow-200 to-slate-400">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
      <main
        className={
          currentPage === 'deckbuilder'
            ? 'w-full'
            : 'max-w-7xl mx-auto'
        }
      >
        {renderPage()}
      </main>
    </div>
  );
}

export default function DueloDeHuevos() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
