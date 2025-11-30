import { useState, useEffect } from 'react'
import './AdminPanel.css'

interface AdminPanelProps {
  readonly onClose?: () => void
}

interface Product {
  id: number | string
  name: string
  description: string
  image: string
  notes?: string
}

type AdminTab = 'upload' | 'manage'

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminToken, setAdminToken] = useState('')
  const [activeTab, setActiveTab] = useState<AdminTab>('upload')
  
  // Upload state
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null)
  const [productId, setProductId] = useState('')
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [uploadUrl, setUploadUrl] = useState('')
  
  // Manage state
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  // Load products when tab changes
  useEffect(() => {
    if (activeTab === 'manage' && isAuthenticated) {
      loadProducts()
    }
  }, [activeTab, isAuthenticated])

  const loadProducts = async () => {
    setLoadingProducts(true)
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.products) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleDeleteProduct = async (prodId: number | string) => {
    if (!window.confirm('Supprimer ce produit ?')) return

    try {
      const response = await fetch(`/api/products?id=${prodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== prodId))
        setUploadStatus('✓ Produit supprimé')
      } else {
        setUploadStatus('✗ Erreur suppression')
      }
    } catch (error) {
      setUploadStatus(`✗ Erreur: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setEditName(product.name)
    setEditDescription(product.description)
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return

    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editName,
          description: editDescription
        })
      })

      if (response.ok) {
        setProducts(products.map(p => 
          p.id === editingProduct.id 
            ? { ...p, name: editName, description: editDescription }
            : p
        ))
        setEditingProduct(null)
        setUploadStatus('✓ Produit modifié')
      } else {
        setUploadStatus('✗ Erreur modification')
      }
    } catch (error) {
      setUploadStatus(`✗ Erreur: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }

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

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      setSelectedAudio(file)
      setUploadStatus('')
    } else {
      setUploadStatus('Veuillez sélectionner un fichier audio valide')
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
        const base64String = reader.result as string
        const base64 = base64String.split(',')[1]
        
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

        if (!response.ok) {
          await response.text()
          setUploadStatus(`✗ Erreur serveur: ${response.status}`)
          setUploading(false)
          return
        }

        const data = await response.json() as { url: string; publicId: string }
        setUploadUrl(data.url)

        // Upload audio si sélectionné
        let audioUrlResult = ''
        if (selectedAudio) {
          try {
            const audioReader = new FileReader()
            audioReader.readAsDataURL(selectedAudio)
            
            audioReader.onload = async () => {
              const audioBase64String = audioReader.result as string
              const audioBase64 = audioBase64String.split(',')[1]
              
              const audioResponse = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                  file: audioBase64,
                  publicId: `audio_${productId || Date.now()}`
                })
              })

              if (audioResponse.ok) {
                const audioData = await audioResponse.json()
                audioUrlResult = audioData.url
              }

              // Créer le produit avec image et audio
              if (productName.trim()) {
                try {
                  const createResponse = await fetch('/api/products', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${adminToken}`
                    },
                    body: JSON.stringify({
                      id: productId || `product_${Date.now()}`,
                      name: productName,
                      description: productDescription,
                      image: data.url,
                      audioUrl: audioUrlResult || undefined,
                      fullDescription: productDescription,
                      topNotes: 'Bergamote',
                      heartNotes: 'Fleur',
                      baseNotes: 'Bois'
                    })
                  })

                  if (createResponse.ok) {
                    setUploadStatus(`✓ Produit créé avec succès!`)
                    setProductName('')
                    setProductDescription('')
                    setSelectedAudio(null)
                    loadProducts()
                  }
                } catch {
                  setUploadStatus(`✓ Upload réussi!`)
                }
              }

              setSelectedFile(null)
              navigator.clipboard.writeText(data.url)
              setUploading(false)
            }
          } catch {
            // Si l'audio échoue, continuer avec juste l'image
            if (productName.trim()) {
              try {
                const createResponse = await fetch('/api/products', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                  },
                  body: JSON.stringify({
                    id: productId || `product_${Date.now()}`,
                    name: productName,
                    description: productDescription,
                    image: data.url,
                    fullDescription: productDescription,
                    topNotes: 'Bergamote',
                    heartNotes: 'Fleur',
                    baseNotes: 'Bois'
                  })
                })

                if (createResponse.ok) {
                  setUploadStatus(`✓ Produit créé (audio non uploadé)`)
                  setProductName('')
                  setProductDescription('')
                  loadProducts()
                }
              } catch {
                setUploadStatus(`✓ Upload réussi!`)
              }
            }
            setSelectedFile(null)
            setUploading(false)
          }
        } else {
          // Pas d'audio, juste créer le produit avec l'image
          if (productName.trim()) {
            try {
              const createResponse = await fetch('/api/products', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                  id: productId || `product_${Date.now()}`,
                  name: productName,
                  description: productDescription,
                  image: data.url,
                  fullDescription: productDescription,
                  topNotes: 'Bergamote',
                  heartNotes: 'Fleur',
                  baseNotes: 'Bois'
                })
              })

              if (createResponse.ok) {
                setUploadStatus(`✓ Produit créé avec succès!`)
                setProductName('')
                setProductDescription('')
                loadProducts()
              } else {
                setUploadStatus(`✓ Upload réussi! (Produit non créé)`)
              }
            } catch {
              setUploadStatus(`✓ Upload réussi! (Erreur création produit)`)
            }
          }
          
          setSelectedFile(null)
          navigator.clipboard.writeText(data.url)
          setUploading(false)
        }
      }
    } catch (error) {
      setUploadStatus(`✗ Erreur: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
        <div className="admin-header">
          <div className="admin-tabs">
            <button 
              className={`admin-tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              📤 Uploader
            </button>
            <button 
              className={`admin-tab ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              📋 Gérer
            </button>
          </div>
          <button className="admin-close" onClick={onClose}>✕</button>
        </div>

        <div className="admin-content">
          {activeTab === 'upload' ? (
            <>
              <form onSubmit={handleUpload} className="admin-form">
                <div className="form-group">
                  <label htmlFor="file">Image *</label>
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="admin-input"
                    required
                  />
                  {selectedFile && (
                    <p className="file-info">✓ {selectedFile.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="productId">ID Produit (optionnel)</label>
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
                  <label htmlFor="productName">Nom du Produit (optionnel)</label>
                  <input
                    id="productName"
                    type="text"
                    placeholder="Ex: Rose Cosmique"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="productDescription">Description (optionnel)</label>
                  <textarea
                    id="productDescription"
                    placeholder="Décrire le produit..."
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="admin-input admin-textarea"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="audio">Audio/Vocal (optionnel)</label>
                  <input
                    id="audio"
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioSelect}
                    className="admin-input"
                  />
                  {selectedAudio && (
                    <p className="file-info">🎙️ {selectedAudio.name}</p>
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

              {uploadStatus && (
                <div className={`admin-status ${uploadStatus.includes('✓') ? 'success' : 'error'}`}>
                  {uploadStatus}
                </div>
              )}

              {uploadUrl && (
                <div className="upload-result">
                  <p className="result-label">URL de l'image :</p>
                  <div className="url-box">
                    <input 
                      type="text" 
                      value={uploadUrl} 
                      readOnly 
                      className="url-input"
                    />
                    <button 
                      className="copy-btn"
                      onClick={() => navigator.clipboard.writeText(uploadUrl)}
                      title="Copier l'URL"
                    >
                      📋 Copier
                    </button>
                  </div>
                </div>
              )}

              <div className="admin-info">
                <h3>ℹ️ Instructions</h3>
                <ul>
                  <li><strong>Image</strong> : JPG ou PNG (requis)</li>
                  <li><strong>ID Produit</strong> : Auto-généré si vide</li>
                  <li><strong>Nom & Description</strong> : Optionnels</li>
                  <li>L'URL est copiée automatiquement au presse-papiers</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <h3 className="manage-title">Gérer les produits</h3>
              {loadingProducts && <p className="loading">Chargement...</p>}
              
              {editingProduct ? (
                <div className="edit-form">
                  <h4>Modifier: {editingProduct.name}</h4>
                  <div className="form-group">
                    <label>Nom</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="admin-input admin-textarea"
                      rows={3}
                    />
                  </div>
                  <div className="edit-actions">
                    <button 
                      className="admin-btn save-btn"
                      onClick={handleSaveEdit}
                    >
                      💾 Enregistrer
                    </button>
                    <button 
                      className="admin-btn cancel-btn"
                      onClick={() => setEditingProduct(null)}
                    >
                      ✕ Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="products-list">
                  {products.length === 0 ? (
                    <p className="no-products">Aucun produit</p>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="product-item">
                        <img src={product.image} alt={product.name} className="product-thumb" />
                        <div className="product-info">
                          <h4>{product.name}</h4>
                          <p>{product.description}</p>
                          <small>ID: {product.id}</small>
                        </div>
                        <div className="product-actions">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleEditProduct(product)}
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {uploadStatus && (
                <div className={`admin-status ${uploadStatus.includes('✓') ? 'success' : 'error'}`}>
                  {uploadStatus}
                </div>
              )}
            </>
          )}
        </div>

        <button 
          className="admin-logout"
          onClick={() => {
            setIsAuthenticated(false)
            setAdminToken('')
            setUploadStatus('')
            setUploadUrl('')
            setEditingProduct(null)
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  )
}
