import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

function Login({ login }) {
  const [courriel, setCourriel] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/profils/login', {
        courriel,
        motDePasse
      });
      login(res.data.token, res.data.user);
      navigate('/profile');
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LogIn size={24} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#1f2328]">Bon retour !</h2>
        <p className="text-[#656d76] text-sm mt-1">Connectez-vous à votre compte</p>
      </div>

      <div className="bg-white rounded-xl border border-[#d1d9e0] p-6">
        {message && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-5 text-sm">
            <AlertCircle size={15} />
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1f2328] mb-1.5">Courriel</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#656d76]" />
              <input
                type="email"
                value={courriel}
                onChange={(e) => setCourriel(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#f6f8fa] border border-[#d1d9e0] text-[#1f2328] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                placeholder="votre@courriel.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1f2328] mb-1.5">Mot de passe</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#656d76]" />
              <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#f6f8fa] border border-[#d1d9e0] text-[#1f2328] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={15} />
                Se connecter
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-[#656d76] mt-4">
        Pas encore de compte ?{' '}
        <Link to="/" className="text-teal-600 hover:underline font-medium">Créer un compte</Link>
      </p>
    </div>
  );
}

export default Login;