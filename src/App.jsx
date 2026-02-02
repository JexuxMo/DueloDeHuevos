/**
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR, FUNCIONA
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/

import React, { useState, createContext, useContext, useEffect } from 'react';
import { Home, Swords, Book, ShoppingBag, User, Menu, X, Trophy, Users, LogOut, Plus, Search, Filter } from 'lucide-react';

// ==========================================
// CONTEXTO DE AUTENTICACIÓN
// ==========================================
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const mockUser = {
        id: 1,
        username: username,
        email: `${username}@duelodehuevos.com`,
        rankPoints: 1250,
        wins: 23,
        losses: 12,
        gold: 2450,
        avatar: null
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock_jwt_token_123');
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Credenciales inválidas' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const mockUser = {
        id: Date.now(),
        username,
        email,
        rankPoints: 0,
        wins: 0,
        losses: 0,
        gold: 1000,
        avatar: null
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock_jwt_token_' + Date.now());
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al registrar usuario' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};



// ==========================================
// PÁGINA DE LOGIN
// ==========================================
const LoginPage = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        onNavigate('home');
      } else {
        setError(result.error);
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      const result = await register(formData.username, formData.email, formData.password);
      if (result.success) {
        onNavigate('home');
      } else {
        setError(result.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-yellow-200 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-yellow-500 rounded-full mb-4">
              <div className="text-6xl">🥚</div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Duelo de Huevos</h1>
            <p className="text-yellow-300">
              {isLogin ? '¡TCG Online!' : '¡TCG Online!'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                placeholder="Ingresa tu usuario"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  placeholder="tu@email.com"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all transform hover:scale-105"
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-yellow-400 hover:text-yellow-300 text-sm"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// NAVEGACIÓN
// ==========================================
const Navigation = ({ currentPage, onNavigate, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  const NavButton = ({ icon: Icon, label, page }) => (
    <button
      onClick={() => onNavigate(page)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        currentPage === page
          ? 'bg-yellow-600 text-white'
          : 'text-gray-300 hover:bg-gray-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="bg-gray-900 border-b border-yellow-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="text-3xl">🥚</div>
            <span className="text-xl font-bold text-white">Duelo de Huevos</span>
          </div>

          <div className="hidden md:flex space-x-1">
            <NavButton icon={Home} label="Inicio" page="home" />
            <NavButton icon={Swords} label="Jugar" page="play" />
            <NavButton icon={Book} label="Constructor" page="deckbuilder" />
            <NavButton icon={ShoppingBag} label="Colección" page="collection" />
            <NavButton icon={Trophy} label="Ranking" page="ranking" />
            <NavButton icon={User} label="Perfil" page="profile" />
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
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
            <NavButton icon={Home} label="Inicio" page="home" />
            <NavButton icon={Swords} label="Jugar" page="play" />
            <NavButton icon={Book} label="Constructor" page="deckbuilder" />
            <NavButton icon={ShoppingBag} label="Colección" page="collection" />
            <NavButton icon={Trophy} label="Ranking" page="ranking" />
            <NavButton icon={User} label="Perfil" page="profile" />
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
};

// ==========================================
// PÁGINAS
// ==========================================
const HomePage = () => {
  const { user } = useAuth();
  const winRate = user.wins + user.losses > 0 
    ? ((user.wins / (user.wins + user.losses)) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        ¡Bienvenido, {user?.username}! 🥚
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500">
          <Users className="w-12 h-12 text-yellow-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Jugadores Online</h3>
          <p className="text-4xl font-bold text-yellow-400">847</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-green-500">
          <Trophy className="w-12 h-12 text-green-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Tus Victorias</h3>
          <p className="text-4xl font-bold text-green-400">{user?.wins}</p>
          <p className="text-sm text-gray-400 mt-2">Win Rate: {winRate}%</p>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <h4 className="text-sm font-bold text-red-400 mb-1">Tus Derrotas</h4>
            <p className="text-2xl font-bold text-red-400">{user?.losses}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-purple-500">
          <Swords className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Puntos de Ranking</h3>
          <p className="text-4xl font-bold text-purple-400">{user?.rankPoints}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-xl p-8 border border-yellow-500">
        <h2 className="text-2xl font-bold text-white mb-4">🔥 Partida Rápida</h2>
        <p className="text-gray-300 mb-6">
          Encuentra un oponente y comienza a jugar inmediatamente
        </p>
        <button className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-all transform hover:scale-105">
          Buscar Partida
        </button>
      </div>
    </div>
  );
};

const PlayPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Modos de Juego</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-8 border border-yellow-500 hover:border-yellow-400 transition-colors">
          <Swords className="w-16 h-16 text-yellow-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">⚡ Duelo Rápido</h3>
          <p className="text-gray-300 mb-4">
            Partida rápida contra un oponente aleatorio. Perfecto para practicar.
          </p>
          <button className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold">
            Jugar Ahora
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 border border-blue-500 hover:border-blue-400 transition-colors">
          <Trophy className="w-16 h-16 text-blue-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">🏆 Clasificatoria</h3>
          <p className="text-gray-300 mb-4">
            Juega en modo clasificatorio y sube en el ranking global.
          </p>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">
            Entrar a Ranked
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 border border-green-500 hover:border-green-400 transition-colors">
          <Users className="w-16 h-16 text-green-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">👥 Sala Privada</h3>
          <p className="text-gray-300 mb-4">
            Crea una sala y juega con tus amigos. Comparte el código de sala.
          </p>
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold">
            Crear Sala
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 border border-purple-500 hover:border-purple-400 transition-colors">
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-2xl font-bold text-white mb-3">🎮 vs IA</h3>
          <p className="text-gray-300 mb-4">
            Entrena contra la inteligencia artificial. 3 niveles de dificultad.
          </p>
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold">
            Practicar
          </button>
        </div>
      </div>
    </div>
  );
};

const DeckBuilderPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeck, setSelectedDeck] = useState(null);

  const mockDecks = [
    { id: 1, name: 'Huevos de Fuego', cards: 42, wins: 15, losses: 8 },
    { id: 2, name: 'Defensores Ovoides', cards: 40, wins: 12, losses: 10 },
    { id: 3, name: 'Gallinas Legendarias', cards: 45, wins: 8, losses: 5 }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Constructor de Mazos</h1>
        <button className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg">
          <Plus className="w-5 h-5" />
          <span>Nuevo Mazo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl p-4 border border-yellow-500">
            <h3 className="text-lg font-bold text-white mb-4">Tus Mazos</h3>
            <div className="space-y-3">
              {mockDecks.map(deck => (
                <div
                  key={deck.id}
                  onClick={() => setSelectedDeck(deck)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                    selectedDeck?.id === deck.id
                      ? 'bg-yellow-600 border-yellow-400'
                      : 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white">{deck.name}</h4>
                    <span className="text-yellow-400">{deck.cards} cartas</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {deck.wins}V - {deck.losses}D
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500">
            <div className="mb-6">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar cartas..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <button className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {selectedDeck ? (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Editando: {selectedDeck.name}
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[2/3] bg-gradient-to-br from-yellow-900 to-orange-900 rounded-lg border border-yellow-500 flex items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors"
                    >
                      <span className="text-4xl">🥚</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  Selecciona un mazo o crea uno nuevo para empezar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionPage = () => {
  const cardTypes = ['Huevos de Combate', 'Hechizos', 'Trampas', 'Encantamientos Fuertes', 'Encantamientos Débiles'];
  const [selectedType, setSelectedType] = useState('Todas');

  const mockCards = Array(24).fill(null).map((_, i) => ({
    id: i + 1,
    name: `Carta ${i + 1}`,
    type: cardTypes[i % 5]
  }));

  const filteredCards = selectedType === 'Todas'
    ? mockCards
    : mockCards.filter(card => card.type === selectedType);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Tu Colección</h1>
        <div className="text-white">
          <span className="text-gray-400">Total: </span>
          <span className="text-2xl font-bold text-yellow-400">147</span>
          <span className="text-gray-400"> / 500 cartas</span>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedType('Todas')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            selectedType === 'Todas'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setSelectedType('Huevos de Combate')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            selectedType === 'Huevos de Combate'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          Huevos de Combate
        </button>
        <button
          onClick={() => setSelectedType('Hechizos')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            selectedType === 'Hechizos'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          Hechizos
        </button>
        <button
          onClick={() => setSelectedType('Trampas')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            selectedType === 'Trampas'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          Trampas
        </button>
        <button
          onClick={() => setSelectedType('Encantamientos Fuertes')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            selectedType === 'Encantamientos Fuertes'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          Encantamientos Fuertes
        </button>
        <button
          onClick={() => setSelectedType('Encantamientos Débiles')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            selectedType === 'Encantamientos Débiles'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          Encantamientos Débiles
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredCards.map(card => (
          <div
            key={card.id}
            className="bg-gray-800 rounded-lg p-3 border border-yellow-500 hover:border-yellow-400 transition-colors cursor-pointer group"
          >
            <div className="aspect-[2/3] bg-gradient-to-br from-yellow-900 to-orange-900 rounded-lg mb-2 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-4xl">🥚</span>
            </div>
            <p className="text-white text-sm text-center font-bold">{card.name}</p>
            <p className="text-gray-400 text-xs text-center">{card.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RankingPage = () => {
  const mockRanking = Array(10).fill(null).map((_, i) => ({
    rank: i + 1,
    username: `Jugador${i + 1}`,
    points: 3000 - (i * 100),
    wins: 50 - i,
    losses: 10 + i
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">🏆 Ranking Global</h1>

      <div className="bg-gray-800 rounded-xl overflow-hidden border border-yellow-500">
        <table className="w-full">
          <thead className="bg-yellow-900">
            <tr>
              <th className="px-6 py-3 text-left text-white font-bold">Pos</th>
              <th className="px-6 py-3 text-left text-white font-bold">Jugador</th>
              <th className="px-6 py-3 text-left text-white font-bold">Puntos</th>
              <th className="px-6 py-3 text-left text-white font-bold">V/D</th>
              <th className="px-6 py-3 text-left text-white font-bold">Ratio</th>
            </tr>
          </thead>
          <tbody>
            {mockRanking.map((player, i) => (
              <tr key={i} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4">
                  <span className={`font-bold ${
                    i === 0 ? 'text-yellow-400 text-xl' :
                    i === 1 ? 'text-gray-300 text-lg' :
                    i === 2 ? 'text-orange-400' :
                    'text-white'
                  }`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${player.rank}`}
                  </span>
                </td>
                <td className="px-6 py-4 text-white font-bold">{player.username}</td>
                <td className="px-6 py-4 text-yellow-400 font-bold">{player.points}</td>
                <td className="px-6 py-4 text-green-400">{player.wins}/{player.losses}</td>
                <td className="px-6 py-4 text-white">
                  {((player.wins / (player.wins + player.losses)) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { user } = useAuth();
  const winRate = user.wins + user.losses > 0 
    ? ((user.wins / (user.wins + user.losses)) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Tu Perfil</h1>
      <div className="bg-gray-800 rounded-xl p-8 border border-yellow-500">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center text-5xl">
            🥚
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
            <p className="text-yellow-400">Nivel 15 • {user?.rankPoints} puntos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Estadísticas</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Victorias:</span>
                <span className="text-green-400 font-bold">{user?.wins}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Derrotas:</span>
                <span className="text-red-400 font-bold">{user?.losses}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Win Rate:</span>
                <span className="text-yellow-400 font-bold">{winRate}%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">Información</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Email:</span>
                <span className="text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Oro:</span>
                <span className="text-yellow-400 font-bold">{user?.gold} 🪙</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Cartas:</span>
                <span className="text-white font-bold">147</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };

  const renderPage = () => {
    if (!user) {
      return <LoginPage onNavigate={setCurrentPage} />;
    }

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

  /// El AuthProvider se creaba DENTRO del if
  // if (!user) {
  //   return (
  //     <AuthProvider>
  //       <LoginPage onNavigate={setCurrentPage} />
  //     </AuthProvider>
  //   );
  // }
  
  if (!user) {
    return <LoginPage onNavigate={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-yellow-200 to-slate-400">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default function DueloDeHuevos() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}