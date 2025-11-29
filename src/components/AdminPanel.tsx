import { useState } from 'react'
import './AdminPanel.css'

interface AdminPanelProps {
  readonly onClose?: () => void
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminToken, setAdminToken] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [productId, setProductId] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Authentification admin - le mot de passe est stocké dans les variables d'environnement
    // Pour la démo, accepte n'importe quel mot de passe et le stocke comme token
    if (adminToken.length > 0) {
      setIsAuthenticated(true)
      setUploadStatus('Authentifié avec succès ✓')
    } else {
      setUploadStatus('Veuillez entrer un mot de passe')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setUploadStatus('')
    } else {
      setUploadStatus('Veuillez sélectionner une image valide')
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !isAuthenticated) {
      setUploadStatus('Erreur : fichier ou authentification manquante')
      return
    }

    setUploading(true)
    setUploadStatus('Upload en cours...')

    try {
      const reader = new FileReader()
      reader.readAsDataURL(selectedFile)
      
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1]
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            file: base64,
            publicId: productId || `product_${Date.now()}`
          })
        })

        const data = await response.json()

        if (response.ok) {
          setUploadStatus(`✓ Upload réussi! URL: ${data.url}`)
          setSelectedFile(null)
          setProductId('')
          // Copier l'URL dans le presse-papiers
          navigator.clipboard.writeText(data.url)
        } else {
          setUploadStatus(`✗ Erreur: ${data.error || 'Upload failed'}`)
        }
      }
    } catch (error) {
      setUploadStatus(`✗ Erreur: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-panel">
        <div className="admin-container">
          <button className="admin-close" onClick={onClose}>✕</button>
          <h2 className="admin-title">Admin Panel</h2>
          
          <form onSubmit={handleLogin} className="admin-login">
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="admin-input"
            />
            <button type="submit" className="admin-btn">Se connecter</button>
          </form>

          {uploadStatus && <p className="admin-status">{uploadStatus}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <button className="admin-close" onClick={onClose}>✕</button>
        <h2 className="admin-title">Upload Photo Produit</h2>

        <form onSubmit={handleUpload} className="admin-form">
          <div className="form-group">
            <label htmlFor="productId">ID Produit</label>
            <input
              id="productId"
              type="text"
              placeholder="Ex: product_123"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="admin-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="file">Sélectionner une image</label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="admin-input"
            />
            {selectedFile && (
              <p className="file-info">✓ {selectedFile.name} sélectionné</p>
            )}
          </div>

          <button 
            type="submit" 
            className="admin-btn"
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Upload en cours...' : 'Uploader l\'image'}
          </button>
        </form>

        {uploadStatus && <p className="admin-status">{uploadStatus}</p>}

        <div className="admin-info">
          <h3>Instructions</h3>
          <ul>
            <li>Sélectionnez une image JPG ou PNG</li>
            <li>Entrez un ID de produit (optionnel)</li>
            <li>Cliquez sur "Uploader l\'image"</li>
            <li>L\'URL sera automatiquement copiée dans le presse-papiers</li>
          </ul>
        </div>

        <button 
          className="admin-logout"
          onClick={() => {
            setIsAuthenticated(false)
            setAdminToken('')
            setUploadStatus('')
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  )
}
