import { useState } from 'react';
import { Book, Home, LogOut, Menu, ShoppingBag, Swords, Trophy, User, X } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const NavButton = ({ currentPage, onNavigate, icon, label, page }) => {
  const IconComponent = icon;

  return (
    <button
      onClick={() => onNavigate(page)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        currentPage === page ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:bg-gray-800'
      }`}
    >
      <IconComponent className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
};

export default function Navigation({ currentPage, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-yellow-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="text-3xl">🥚</div>
            <span className="text-xl font-bold text-white">Duelo de Huevos</span>
          </div>

          <div className="hidden md:flex space-x-1">
            <NavButton currentPage={currentPage} onNavigate={onNavigate} icon={Home} label="Inicio" page="home" />
            <NavButton currentPage={currentPage} onNavigate={onNavigate} icon={Swords} label="Jugar" page="play" />
            <NavButton currentPage={currentPage} onNavigate={onNavigate} icon={Book} label="Constructor" page="deckbuilder" />
            <NavButton currentPage={currentPage} onNavigate={onNavigate} icon={ShoppingBag} label="Colección" page="collection" />
            <NavButton currentPage={currentPage} onNavigate={onNavigate} icon={Trophy} label="Ranking" page="ranking" />
            <NavButton currentPage={currentPage} onNavigate={onNavigate} icon={User} label="Perfil" page="profile" />
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden md:flex items-center space-x-4">
            <div className="text-yellow-400 font-bold">{user?.gold} 🪙</div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <div className="text-yellow-400 font-bold mb-2">{user?.gold} 🪙</div>
            <NavButton currentPage={currentPage} onNavigate={onNavigate} icon={Home} label="Inicio" page="home" />
            <NavButton currentPage={currentPage} onNavigate={onNavigate} icon={Swords} label="Jugar" page="play" />
            <NavButton currentPage={currentPage} onNavigate={onNavigate} icon={Book} label="Constructor" page="deckbuilder" />
            <NavButton currentPage={currentPage} onNavigate={onNavigate} icon={ShoppingBag} label="Colección" page="collection" />
            <NavButton currentPage={currentPage} onNavigate={onNavigate} icon={Trophy} label="Ranking" page="ranking" />
            <NavButton currentPage={currentPage} onNavigate={onNavigate} icon={User} label="Perfil" page="profile" />
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
