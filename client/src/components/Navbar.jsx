import { Link, useLocation } from 'react-router-dom';
import { UserCircle, Shield, FileText, LogOut, LogIn, UserPlus } from 'lucide-react';

function Navbar({ user, logout }) {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
      location.pathname === path
        ? 'bg-white/10 text-white'
        : 'text-gray-400 hover:text-gray-200'
    }`;

  return (
    <nav className="bg-[#161b22] border-b border-[#30363d]">
      <div className="max-w-5xl mx-auto px-6 h-14 flex justify-between items-center">
        <Link to={user ? "/profile" : "/"} className="flex items-center gap-2 text-white font-semibold text-lg tracking-tight">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">GP</div>
          ProfilManager
        </Link>
        <div className="flex gap-1 items-center">
          {!user && (
            <Link to="/" className={linkClass('/')}>
              <UserPlus size={15} />
              Inscription
            </Link>
          )}
          <Link to="/documentation" className={linkClass('/documentation')}>
            <FileText size={15} />
            API Docs
          </Link>
          {!user ? (
            <Link to="/login" className={linkClass('/login')}>
              <LogIn size={15} />
              Connexion
            </Link>
          ) : (
            <>
              <Link to="/profile" className={linkClass('/profile')}>
                <UserCircle size={15} />
                Profil
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className={linkClass('/admin')}>
                  <Shield size={15} />
                  Admin
                </Link>
              )}
              <div className="ml-3 pl-3 border-l border-[#30363d] flex items-center gap-2">
                <div className="w-7 h-7 bg-teal-500/20 border border-teal-500/30 rounded-full flex items-center justify-center text-teal-400 text-xs font-bold">
                  {user.pseudo.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-300 text-sm">{user.pseudo}</span>
                <button
                  onClick={logout}
                  className="ml-1 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                  title="Déconnexion"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;