import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, User, Mail, Lock, KeyRound, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

function Register() {
  const [pseudo, setPseudo] = useState('');
  const [courriel, setCourriel] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [longueurMdp, setLongueurMdp] = useState(12);
  const [message, setMessage] = useState('');
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(false);

  const genererMotDePasse = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/motdepasse/${longueurMdp}`);
      setMotDePasse(res.data.motDePasse);
    } catch (error) {
      setMessage("Erreur lors de la génération du mot de passe");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSucces(false);
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/profils', {
        pseudo,
        courriel,
        motDePasse,
        isAdmin
      });
      setSucces(true);
      setMessage("Compte créé avec succès !");
      setPseudo('');
      setCourriel('');
      setMotDePasse('');
      setIsAdmin(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UserPlus size={24} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#1f2328]">Créer un compte</h2>
        <p className="text-[#656d76] text-sm mt-1">Rejoignez la plateforme en quelques secondes</p>
      </div>

      <div className="bg-white rounded-xl border border-[#d1d9e0] p-6">
        {message && (
          <div className={`flex items-center gap-2 p-3 rounded-lg mb-5 text-sm border ${
            succes
              ? 'bg-teal-50 border-teal-200 text-teal-700'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {succes ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1f2328] mb-1.5">Pseudo</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#656d76]" />
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#f6f8fa] border border-[#d1d9e0] text-[#1f2328] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                placeholder="Votre pseudo"
                required
              />
            </div>
          </div>

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
                type="text"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#f6f8fa] border border-[#d1d9e0] text-[#1f2328] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                placeholder="Votre mot de passe"
                required
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                value={longueurMdp}
                onChange={(e) => setLongueurMdp(e.target.value)}
                className="w-16 bg-[#f6f8fa] border border-[#d1d9e0] text-[#1f2328] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                min="4"
                max="50"
              />
              <button
                type="button"
                onClick={genererMotDePasse}
                className="flex items-center gap-1.5 bg-[#f6f8fa] border border-[#d1d9e0] text-[#1f2328] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#eaeef2] transition-colors"
              >
                <KeyRound size={13} className="text-teal-600" />
                Générer
              </button>
            </div>
          </div>

          <label htmlFor="admin-check" className="flex items-center gap-2.5 cursor-pointer bg-[#f6f8fa] border border-[#d1d9e0] p-3 rounded-lg hover:bg-[#eaeef2] transition-colors">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="w-4 h-4 rounded accent-teal-600"
              id="admin-check"
            />
            <ShieldCheck size={15} className="text-teal-600" />
            <span className="text-sm text-[#1f2328]">Compte administrateur</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={15} />
                Créer le compte
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-[#656d76] mt-4">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-teal-600 hover:underline font-medium">Se connecter</Link>
      </p>
    </div>
  );
}

export default Register;