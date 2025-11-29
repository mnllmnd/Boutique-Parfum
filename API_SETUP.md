# Configuration Serverless Vercel - Admin Upload Photos

## 📋 Étapes de configuration

### 1. Installer les dépendances
```bash
npm install @vercel/node form-data node-fetch
```

### 2. Configurer Cloudinary
- Va sur [Cloudinary Dashboard](https://cloudinary.com/console)
- Récupère ton `CLOUD_NAME` et `API_KEY`
- Crée un Upload Preset non-signé
- Mets à jour `.env.local`

### 3. Configurer les variables d'environnement Vercel

Sur le dashboard Vercel de ton projet :
**Settings → Environment Variables**

Ajoute :
```
ADMIN_TOKEN = un_token_sécurisé_aléatoire
CLOUDINARY_CLOUD_NAME = ton_cloud_name
CLOUDINARY_UPLOAD_PRESET = ton_upload_preset
```

### 4. Structure des fichiers API

```
/api
  /upload.ts     - Upload image vers Cloudinary
  /products.ts   - CRUD des produits
```

## 🔒 Sécurité

- L'endpoint `/api/upload` vérifie le token Bearer
- Seuls les admis authentifiés peuvent uploader
- Les images sont uploadées vers Cloudinary (stockage externalisé)

## 📤 Utilisation dans l'app

### Accéder au panneau admin
```tsx
import AdminPanel from './components/AdminPanel'

// Dans ton composant
<AdminPanel onClose={() => setShowAdmin(false)} />
```

### Authentification
- Password: défini dans `REACT_APP_ADMIN_PASSWORD`
- Token Bearer: envoyé avec chaque request à `/api/upload`

## 🚀 Déploiement

```bash
# Commit les changements
git add .
git commit -m "feat: add serverless admin upload"

# Push vers Vercel
git push

# Vercel déploiera automatiquement :
# - L'app React (client)
# - Les fonctions serverless (API)
```

## 📝 Prochaines étapes recommandées

1. **Base de données persistante**
   - Remplacer `PRODUCTS_DB` par MongoDB ou Firebase
   - Synchroniser les uploads avec la BD

2. **Authentification avancée**
   - JWT tokens au lieu de simples tokens
   - Sessions administrateur

3. **Galerie d'images**
   - Dashboard admin pour voir les images
   - Édition des produits avec les URL d'images

4. **Modération**
   - Logs des uploads
   - Suppression d'images
   - Historique des modifications

## ❓ Troubleshooting

**"401 Unauthorized"**
- Vérifie que le token est correct dans `.env`
- Envoie le header: `Authorization: Bearer ${token}`

**"Cloudinary upload failed"**
- Vérifie ton Upload Preset
- Vérifie les permissions Cloudinary

**"Function not found"**
- Les fichiers API doivent être dans `/api` à la racine
- Vérifie que tu as `npm run build` avant deploy
