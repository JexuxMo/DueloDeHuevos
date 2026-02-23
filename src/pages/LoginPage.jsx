import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export default function LoginPage({ onNavigate }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      return;
    }

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
            <p className="text-yellow-300">¡TCG Online!</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-2">Usuario</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-2">Contraseña</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all transform hover:scale-105"
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-yellow-400 hover:text-yellow-300 text-sm">
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
