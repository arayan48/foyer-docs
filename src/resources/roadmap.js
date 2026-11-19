const roadmap = [
  {
    product: "Magic Docs Core",
    brand: "indigo",
    columns: [
      {
        title: "Prévu",
        tasks: [
          {
            title: "Améliorer la fonctionnalité de recherche",
            description: "Améliorer l'algorithme de recherche pour fournir des résultats plus pertinents",
            user: {
              name: "Alex Johnson",
              avatar: "https://i.pravatar.cc/150?img=1"
            },
            type: "improvement"
          },
          {
            title: "Ajouter le support du mode sombre",
            description: "Implémenter un thème sombre complet dans toute l'application",
            user: {
              name: "Sam Taylor"
            },
            type: "feature"
          },
          {
            title: "Responsive mobile",
            description: "S'assurer que tous les composants fonctionnent bien sur les appareils mobiles",
            href: "/tasks/mobile-responsiveness",
            type: "improvement"
          }
        ]
      },
      {
        title: "En cours",
        tasks: [
          {
            title: "Documentation API",
            description: "Créer une documentation complète pour tous les endpoints de l'API",
            user: {
              name: "Jamie Smith",
              avatar: "https://i.pravatar.cc/150?img=2"
            },
            href: "/tasks/api-docs",
            type: "documentation"
          },
          {
            title: "Optimisation des performances",
            description: "Améliorer les temps de chargement et réduire la taille du bundle",
            user: {
              name: "Riley Chen"
            },
            type: "performance"
          }
        ]
      },
      {
        title: "Terminé",
        tasks: [
          {
            title: "Authentification utilisateur",
            description: "Implémenter un système de connexion et d'inscription sécurisé",
            user: {
              name: "Jordan Lee",
              avatar: "https://i.pravatar.cc/150?img=3"
            },
            type: "security"
          },
          {
            title: "Bibliothèque de composants",
            description: "Créer des composants UI réutilisables pour un développement plus rapide",
            user: {
              name: "Casey Wilson"
            },
            type: "feature"
          },
          {
            title: "Tests automatisés",
            description: "Mettre en place un pipeline CI/CD avec des tests automatisés",
            user: {
              name: "Taylor Morgan",
              avatar: "https://i.pravatar.cc/150?img=4"
            },
            type: "improvement"
          }
        ]
      }
    ]
  },
  {
    product: "Magic Docs Extensions",
    brand: "cyan",
    columns: [
      {
        title: "Prévu",
        tasks: [
          {
            title: "Intégration Analytics",
            description: "Ajouter le support des plateformes d'analyse populaires",
            user: {
              name: "Morgan Smith",
              avatar: "https://i.pravatar.cc/150?img=5"
            },
            type: "feature"
          },
          {
            title: "Support de la localisation",
            description: "Ajouter le support multilingue pour la documentation",
            user: {
              name: "Robin Patel"
            },
            type: "feature"
          }
        ]
      },
      {
        title: "En cours",
        tasks: [
          {
            title: "Thèmes personnalisés",
            description: "Permettre aux utilisateurs de créer et d'appliquer des thèmes personnalisés",
            user: {
              name: "Quinn Jones",
              avatar: "https://i.pravatar.cc/150?img=6"
            },
            type: "improvement"
          }
        ]
      },
      {
        title: "Terminé",
        tasks: [
          {
            title: "Coloration syntaxique du code",
            description: "Support de la coloration syntaxique dans les blocs de code",
            user: {
              name: "Avery Williams",
              avatar: "https://i.pravatar.cc/150?img=7"
            },
            type: "feature"
          },
          {
            title: "Optimisation des images",
            description: "Optimisation automatique des images dans la documentation",
            user: {
              name: "Jordan Rivera"
            },
            type: "performance"
          }
        ]
      }
    ]
  }
];

const task = {
  bug: {
    label: "Bug",
    color: "red"
  },
  feature: {
    label: "Fonctionnalité",
    color: "green"
  },
  improvement: {
    label: "Amélioration",
    color: "blue"
  },
  documentation: {
    label: "Docs",
    color: "magenta"
  },
  performance: {
    label: "Performance",
    color: "orange"
  },
  security: {
    label: "Sécurité",
    color: "indigo"
  }
};

export { roadmap, task };