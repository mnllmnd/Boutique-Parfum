# Configuration MongoDB Atlas pour Vercel

## 1. Créer un compte MongoDB Atlas

1. Allez sur https://www.mongodb.com/cloud/atlas
2. Créer un compte gratuit
3. Créer un cluster gratuit (M0)

## 2. Configuration du cluster

1. Dans "Security" > "Network Access", ajouter `0.0.0.0/0` pour permettre les connexions de n'importe où
2. Dans "Security" > "Database Access", créer un utilisateur administrateur
3. Récupérer la connection string : `mongodb+srv://username:password@cluster.mongodb.net/`

## 3. Variables d'environnement Vercel

Ajouter à Vercel Dashboard > Project Settings > Environment Variables :

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
ADMIN_TOKEN=admin123
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_UPLOAD_PRESET=Perfum_unsigned
```

## 4. Structure de la base de données

La base `boutique_parfum` sera créée automatiquement avec la collection `products`.

Chaque produit a cette structure :
```json
{
  "id": "product_123",
  "name": "Nom du produit",
  "description": "Description",
  "image": "https://...",
  "audioUrl": "https://...",
  "topNotes": "...",
  "heartNotes": "...",
  "baseNotes": "...",
  "createdAt": "ISO date"
}
```

## 5. Endpoints API

- `GET /api/products` - Récupérer tous les produits
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products` - Modifier un produit (admin)
- `DELETE /api/products?id=...` - Supprimer un produit (admin)
- `POST /api/upload` - Upload image/audio (admin)
- `GET /api/health` - Health check
