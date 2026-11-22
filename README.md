# Documentation de Foyer

Documentation de [Foyer](https://github.com/arayan48/foyer) : installation, configuration et dimensionnement des serveurs de jeu.

Construite avec Next.js et [Once UI](https://once-ui.com). Les pages sont dans `src/content/fr`, `en` et `es` (MDX, mêmes noms de fichiers dans chaque langue), l'ordre du menu dans les fichiers `meta.json`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Coolify
1. Nouvelle ressource > dépôt `arayan48/foyer-docs`, build pack **Dockerfile**, dossier de base `/`.
2. Port exposé : `3000`.
3. Domaine : `https://docs.foyer.cfd`.

Français à la racine, anglais sous `/en`, espagnol sous `/es`. Textes de l'interface : `src/i18n.ts`.
