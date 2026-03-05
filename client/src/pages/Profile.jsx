import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCircle, User, Mail, Lock, Save, AlertCircle, CheckCircle, Hash } from 'lucide-react';

function Profile({ user, token, setUser }) {
  const [pseudo, setPseudo] = useState(user.pseudo || '');
  const [courriel, setCourriel] = useState(user.courriel || '');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const chargerProfil = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/profils/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPseudo(res.data.pseudo);
        setCourriel(res.data.courriel);
      } catch (error) {
        setMessage("Erreur lors du chargement du profil");
      }
    };
    chargerProfil();
  }, [user.id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSucces(false);
    setLoading(true);
    try {
      const donnees = { pseudo, courriel };
      if (motDePasse) donnees.motDePasse = motDePasse;

      const res = await axios.put(`http://localhost:5000/profils/${user.id}`, donnees, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUser = { ...user, pseudo: res.data.pseudo, courriel: res.data.courriel };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSucces(true);
      setMessage("Profil modifié avec succès !");
      setMotDePasse('');
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-4">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-[#d1d9e0] p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user.pseudo.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1f2328]">{user.pseudo}</h2>
            <div className="flex items-center gap-1 mt-0.5">
              <Hash size={12} className="text-[#656d76]" />
              <span className="text-xs text-[#656d76] font-mono">{user.id}</span>
            </div>
            {user.isAdmin && (
              <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full">
                Administrateur
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-xl border border-[#d1d9e0] p-6">
        <h3 className="text-sm font-semibold text-[#1f2328] mb-4 flex items-center gap-2">
          <UserCircle size={16} className="text-teal-600" />
          Modifier mes informations
        </h3>

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
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1f2328] mb-1.5">Nouveau mot de passe</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#656d76]" />
              <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#f6f8fa] border border-[#d1d9e0] text-[#1f2328] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition placeholder-[#afb8c1]"
                placeholder="Laisser vide pour ne pas changer"
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
                <Save size={15} />
                Enregistrer les modifications
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;