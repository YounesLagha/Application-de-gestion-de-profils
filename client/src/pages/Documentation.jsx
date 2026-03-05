import { FileText, BookOpen } from 'lucide-react';

function Documentation({ user }) {
  const isAdmin = user?.isAdmin;

  const routes = [
    {
      methode: 'POST',
      route: '/profils',
      description: "Créer un nouvel utilisateur avec pseudo, courriel et mot de passe.",
      curl: `curl -X POST http://localhost:5000/profils \\
  -H "Content-Type: application/json" \\
  -d '{"pseudo":"john","courriel":"john@example.com","motDePasse":"abc123","isAdmin":false}'`,
      retour: `{
  "id": "...",
  "pseudo": "john",
  "courriel": "john@example.com",
  "isAdmin": false
}`,
      visible: true
    },
    {
      methode: 'POST',
      route: '/profils/login',
      description: "Authentifier un utilisateur et obtenir un token JWT.",
      curl: `curl -X POST http://localhost:5000/profils/login \\
  -H "Content-Type: application/json" \\
  -d '{"courriel":"john@example.com","motDePasse":"abc123"}'`,
      retour: `{
  "token": "eyJ...",
  "user": {
    "id": "...",
    "pseudo": "john",
    "courriel": "john@example.com",
    "isAdmin": false
  }
}`,
      visible: true
    },
    {
      methode: 'GET',
      route: '/profils',
      description: "Récupérer la liste de tous les utilisateurs. Réservé aux administrateurs.",
      curl: `curl -X GET http://localhost:5000/profils \\
  -H "Authorization: Bearer <token>"`,
      retour: `[
  {
    "_id": "...",
    "pseudo": "john",
    "courriel": "john@example.com",
    "isAdmin": false
  }
]`,
      visible: isAdmin
    },
    {
      methode: 'GET',
      route: '/profils/{id}',
      description: "Récupérer les informations d'un utilisateur par son ID.",
      curl: `curl -X GET http://localhost:5000/profils/<id> \\
  -H "Authorization: Bearer <token>"`,
      retour: `{
  "_id": "...",
  "pseudo": "john",
  "courriel": "john@example.com",
  "isAdmin": false
}`,
      visible: true
    },
    {
      methode: 'PUT',
      route: '/profils/{id}',
      description: "Modifier les informations d'un utilisateur. L'ID ne peut pas être modifié.",
      curl: `curl -X PUT http://localhost:5000/profils/<id> \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <token>" \\
  -d '{"pseudo":"newname"}'`,
      retour: `{
  "_id": "...",
  "pseudo": "newname",
  "courriel": "john@example.com",
  "isAdmin": false
}`,
      visible: true
    },
    {
      methode: 'DELETE',
      route: '/profils/{id}',
      description: "Supprimer un utilisateur par son ID. Réservé aux administrateurs.",
      curl: `curl -X DELETE http://localhost:5000/profils/<id> \\
  -H "Authorization: Bearer <token>"`,
      retour: `{
  "message": "Utilisateur supprimé",
  "utilisateur": {
    "id": "...",
    "pseudo": "john",
    "courriel": "john@example.com",
    "isAdmin": false
  }
}`,
      visible: isAdmin
    },
    {
      methode: 'GET',
      route: '/motdepasse/{longueur}',
      description: "Générer un mot de passe aléatoire contenant lettres (a-z, A-Z) et chiffres (0-9).",
      curl: `curl -X GET http://localhost:5000/motdepasse/12`,
      retour: `{
  "motDePasse": "aB3kL9mNpQ2x"
}`,
      visible: true
    }
  ];

  const methodeStyle = (methode) => {
    switch (methode) {
      case 'GET': return 'bg-emerald-100 text-emerald-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-amber-100 text-amber-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
          <BookOpen size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1f2328]">Documentation API</h2>
          <p className="text-sm text-[#656d76]">
            {isAdmin ? "Vue administrateur — toutes les routes disponibles" : "Vue utilisateur — vos routes autorisées"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {routes.filter(r => r.visible).map((route, index) => (
          <div key={index} className="bg-white rounded-xl border border-[#d1d9e0] overflow-hidden">
            <div className="p-4 border-b border-[#d1d9e0] bg-[#f6f8fa]">
              <div className="flex items-center gap-3">
                <span className={`${methodeStyle(route.methode)} px-2.5 py-0.5 rounded-md text-xs font-bold`}>
                  {route.methode}
                </span>
                <code className="text-sm font-mono text-[#1f2328]">{route.route}</code>
              </div>
              <p className="text-sm text-[#656d76] mt-2">{route.description}</p>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#656d76] font-semibold mb-1.5">Exemple curl</p>
                <div className="bg-[#161b22] rounded-lg p-3 overflow-x-auto">
                  <pre className="text-emerald-400 text-xs font-mono whitespace-pre">{route.curl}</pre>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#656d76] font-semibold mb-1.5">Réponse</p>
                <div className="bg-[#f6f8fa] border border-[#d1d9e0] rounded-lg p-3 overflow-x-auto">
                  <pre className="text-[#1f2328] text-xs font-mono whitespace-pre">{route.retour}</pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Documentation;