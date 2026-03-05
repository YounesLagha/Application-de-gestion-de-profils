import { useState } from 'react';
import axios from 'axios';
import { Shield, Users, Search, Trash2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

function Admin({ token }) {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [idRecherche, setIdRecherche] = useState('');
  const [utilisateurTrouve, setUtilisateurTrouve] = useState(null);
  const [idSuppression, setIdSuppression] = useState('');
  const [utilisateurASupprimer, setUtilisateurASupprimer] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');

  const showMessage = (msg, type = 'error') => {
    setMessage(msg);
    setMessageType(type);
  };

  const chargerTous = async () => {
    try {
      const res = await axios.get('http://localhost:5000/profils', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUtilisateurs(res.data);
      showMessage('');
    } catch (error) {
      showMessage(error.response?.data?.message || "Erreur");
    }
  };

  const rechercherParId = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/profils/${idRecherche}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUtilisateurTrouve(res.data);
      showMessage('');
    } catch (error) {
      setUtilisateurTrouve(null);
      showMessage(error.response?.data?.message || "Utilisateur non trouvé");
    }
  };

  const chercherPourSupprimer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/profils/${idSuppression}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUtilisateurASupprimer(res.data);
      showMessage('');
    } catch (error) {
      setUtilisateurASupprimer(null);
      showMessage(error.response?.data?.message || "Utilisateur non trouvé");
    }
  };

  const confirmerSuppression = async () => {
    try {
      await axios.delete(`http://localhost:5000/profils/${idSuppression}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage("Utilisateur supprimé avec succès", 'success');
      setUtilisateurASupprimer(null);
      setIdSuppression('');
      chargerTous();
    } catch (error) {
      showMessage(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const InfoRow = ({ label, value, mono }) => (
    <div className="flex items-center justify-between py-2 border-b border-[#d1d9e0] last:border-0">
      <span className="text-sm text-[#656d76]">{label}</span>
      <span className={`text-sm text-[#1f2328] ${mono ? 'font-mono text-xs' : 'font-medium'}`}>{value}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1f2328]">Administration</h2>
          <p className="text-sm text-[#656d76]">Gérez les utilisateurs de la plateforme</p>
        </div>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm border ${
          messageType === 'success'
            ? 'bg-teal-50 border-teal-200 text-teal-700'
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {messageType === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {message}
        </div>
      )}

      {/* Tous les utilisateurs */}
      <div className="bg-white rounded-xl border border-[#d1d9e0]">
        <div className="flex items-center justify-between p-4 border-b border-[#d1d9e0]">
          <h3 className="text-sm font-semibold text-[#1f2328] flex items-center gap-2">
            <Users size={15} className="text-teal-600" />
            Utilisateurs
            {utilisateurs.length > 0 && (
              <span className="bg-[#e8e8e8] text-[#656d76] text-xs px-2 py-0.5 rounded-full">{utilisateurs.length}</span>
            )}
          </h3>
          <button
            onClick={chargerTous}
            className="flex items-center gap-1.5 bg-[#f6f8fa] border border-[#d1d9e0] text-[#1f2328] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#eaeef2] transition-colors"
          >
            <RefreshCw size={12} />
            Charger
          </button>
        </div>

        {utilisateurs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f6f8fa]">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#656d76]">ID</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#656d76]">Pseudo</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#656d76]">Courriel</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map((u, i) => (
                  <tr key={u._id} className={`hover:bg-[#f6f8fa] transition-colors ${i !== utilisateurs.length - 1 ? 'border-b border-[#d1d9e0]' : ''}`}>
                    <td className="px-4 py-2.5 text-xs text-[#656d76] font-mono">{u._id}</td>
                    <td className="px-4 py-2.5 text-sm font-medium text-[#1f2328]">{u.pseudo}</td>
                    <td className="px-4 py-2.5 text-sm text-[#656d76]">{u.courriel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-[#656d76]">
            Cliquez sur "Charger" pour charger les utilisateurs
          </div>
        )}
      </div>

      {/* Rechercher par ID */}
      <div className="bg-white rounded-xl border border-[#d1d9e0] p-5">
        <h3 className="text-sm font-semibold text-[#1f2328] flex items-center gap-2 mb-4">
          <Search size={15} className="text-teal-600" />
          Rechercher par ID
        </h3>
        <form onSubmit={rechercherParId} className="flex gap-2 mb-4">
          <input
            type="text"
            value={idRecherche}
            onChange={(e) => setIdRecherche(e.target.value)}
            placeholder="Entrez l'ID de l'utilisateur"
            className="flex-1 bg-[#f6f8fa] border border-[#d1d9e0] text-[#1f2328] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition placeholder-[#afb8c1]"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            <Search size={13} />
            Chercher
          </button>
        </form>
        {utilisateurTrouve && (
          <div className="bg-[#f6f8fa] border border-[#d1d9e0] rounded-lg p-4">
            <InfoRow label="ID" value={utilisateurTrouve._id} mono />
            <InfoRow label="Pseudo" value={utilisateurTrouve.pseudo} />
            <InfoRow label="Courriel" value={utilisateurTrouve.courriel} />
            <InfoRow label="Admin" value={utilisateurTrouve.isAdmin ? 'Oui' : 'Non'} />
          </div>
        )}
      </div>

      {/* Supprimer */}
      <div className="bg-white rounded-xl border border-red-200 p-5">
        <h3 className="text-sm font-semibold text-[#1f2328] flex items-center gap-2 mb-4">
          <Trash2 size={15} className="text-red-500" />
          Zone de suppression
        </h3>
        <form onSubmit={chercherPourSupprimer} className="flex gap-2 mb-4">
          <input
            type="text"
            value={idSuppression}
            onChange={(e) => setIdSuppression(e.target.value)}
            placeholder="ID de l'utilisateur à supprimer"
            className="flex-1 bg-[#f6f8fa] border border-[#d1d9e0] text-[#1f2328] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition placeholder-[#afb8c1]"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-[#f6f8fa] border border-[#d1d9e0] text-[#1f2328] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#eaeef2] transition-colors"
          >
            <Search size={13} />
            Chercher
          </button>
        </form>
        {utilisateurASupprimer && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-red-700 mb-3">Vous êtes sur le point de supprimer :</p>
            <div className="mb-4">
              <InfoRow label="ID" value={utilisateurASupprimer._id} mono />
              <InfoRow label="Pseudo" value={utilisateurASupprimer.pseudo} />
              <InfoRow label="Courriel" value={utilisateurASupprimer.courriel} />
              <InfoRow label="Admin" value={utilisateurASupprimer.isAdmin ? 'Oui' : 'Non'} />
            </div>
            <button
              onClick={confirmerSuppression}
              className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <Trash2 size={13} />
              Supprimer définitivement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;