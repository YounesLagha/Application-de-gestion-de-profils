import { Link } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';

function Unauthorized() {
  return (
    <div className="max-w-sm mx-auto text-center mt-16">
      <div className="bg-white rounded-xl border border-[#d1d9e0] p-10">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <ShieldOff size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-[#1f2328] mb-2">Accès refusé</h2>
        <p className="text-sm text-[#656d76] mb-6">Vous n'avez pas la permission d'accéder à cette page.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-all"
        >
          <ArrowLeft size={15} />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;