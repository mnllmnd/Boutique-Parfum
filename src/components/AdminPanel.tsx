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
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedAudioUrl, setRecordedAudioUrl] = useState('')
  
  // Manage state
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  // Load products when tab changes or on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
    }
  }, [isAuthenticated])

  // Clear form after successful upload
  const clearForm = () => {
    setProductName('')
    setProductDescription('')
    setProductId('')
    setSelectedFile(null)
    setSelectedAudio(null)
    setRecordedAudioUrl('')
  }

  const loadProducts = async () => {
    setLoadingProducts(true)
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to load products')
      const data = await response.json()
      if (data.products) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error)
      setUploadStatus('✗ Erreur chargement produits')
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
        setTimeout(() => setUploadStatus(''), 3000)
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
        setTimeout(() => setUploadStatus(''), 3000)
      } else {
        setUploadStatus('✗ Erreur modification')
      }
    } catch (error) {
      setUploadStatus(`✗ Erreur: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminToken.length > 0) {
      setIsAuthenticated(true)
      setUploadStatus('Authentifié avec succès ✓')
      setTimeout(() => setUploadStatus(''), 3000)
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      
      recorder.ondataavailable = (e) => {
        const audioBlob = new Blob([e.data], { type: 'audio/webm' })
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' })
        setSelectedAudio(audioFile)
        
        const url = URL.createObjectURL(audioBlob)
        setRecordedAudioUrl(url)
      }
      
      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)
      
      const interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 300) {
            recorder.stop()
            clearInterval(interval)
            return 300
          }
          return prev + 1
        })
      }, 1000)
    } catch {
      setUploadStatus('❌ Erreur accès au microphone. Vérifiez les permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setUploadStatus('✓ Enregistrement terminé')
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
      // Convert image to base64
      const imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64String = reader.result as string
          resolve(base64String.split(',')[1])
        }
        reader.readAsDataURL(selectedFile)
      })

      // Upload image
      const imageResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          file: imageBase64,
          publicId: productId || `product_${Date.now()}`
        })
      })

      if (!imageResponse.ok) {
        throw new Error(`Erreur serveur: ${imageResponse.status}`)
      }

      const imageData = await imageResponse.json()
      setUploadUrl(imageData.url)

      let audioUrl = ''
      // Upload audio if exists
      if (selectedAudio) {
        try {
          const audioBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => {
              const base64String = reader.result as string
              resolve(base64String.split(',')[1])
            }
            reader.readAsDataURL(selectedAudio)
          })

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
            audioUrl = audioData.url
          }
        } catch (error) {
          console.error('Audio upload failed:', error)
        }
      }

      // Create product
      if (productName.trim()) {
        const productData = {
          id: productId || `product_${Date.now()}`,
          name: productName,
          description: productDescription,
          image: imageData.url,
          ...(audioUrl && { audioUrl }),
          fullDescription: productDescription,
          topNotes: 'Bergamote',
          heartNotes: 'Fleur',
          baseNotes: 'Bois'
        }

        const createResponse = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify(productData)
        })

        if (createResponse.ok) {
          setUploadStatus('✓ Produit créé avec succès!')
          clearForm()
          loadProducts() // Refresh products list
        } else {
          setUploadStatus('✓ Upload réussi! (Erreur création produit)')
        }
      } else {
        setUploadStatus('✓ Upload réussi!')
      }

      navigator.clipboard.writeText(imageData.url)
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

          {uploadStatus && (
            <div className={`admin-status ${uploadStatus.includes('✓') ? 'success' : 'error'}`}>
              {uploadStatus}
            </div>
          )}
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
              📤 Upload
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
                  <label htmlFor="productId">ID Produit</label>
                  <input
                    id="productId"
                    type="text"
                    placeholder="Auto-généré si vide"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="productName">Nom du Produit</label>
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
                  <label htmlFor="productDescription">Description</label>
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
                  <label>Audio (optionnel)</label>
                  
                  <div className="audio-recorder">
                    {!isRecording ? (
                      <button
                        type="button"
                        className="record-btn"
                        onClick={startRecording}
                      >
                        🎙️ Enregistrer
                      </button>
                    ) : (
                      <div className="recording-active">
                        <button
                          type="button"
                          className="record-btn stop"
                          onClick={stopRecording}
                        >
                          ⏹️ Arrêter
                        </button>
                        <span className="recording-time">
                          {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}
                        </span>
                      </div>
                    )}
                  </div>

                  {recordedAudioUrl && (
                    <div className="audio-preview">
                      <audio controls src={recordedAudioUrl} />
                      <button
                        type="button"
                        className="delete-audio-btn"
                        onClick={() => {
                          setRecordedAudioUrl('')
                          setSelectedAudio(null)
                        }}
                      >
                        ✕ Supprimer
                      </button>
                    </div>
                  )}

                  <div className="audio-or">ou</div>
                  <input
                    id="audio"
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioSelect}
                    className="admin-input"
                  />
                  {selectedAudio && !recordedAudioUrl && (
                    <p className="file-info">📁 {selectedAudio.name}</p>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="admin-btn"
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? 'Upload...' : 'Uploader'}
                </button>
              </form>

              {uploadStatus && (
                <div className={`admin-status ${uploadStatus.includes('✓') ? 'success' : 'error'}`}>
                  {uploadStatus}
                </div>
              )}

              {uploadUrl && (
                <div className="upload-result">
                  <p className="result-label">URL image :</p>
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
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="manage-header">
                <h3 className="manage-title">Produits ({products.length})</h3>
                <button 
                  className="refresh-btn"
                  onClick={loadProducts}
                  disabled={loadingProducts}
                >
                  🔄
                </button>
              </div>
              
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
                      💾 Sauvegarder
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
                          >
                            ✏️
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteProduct(product.id)}
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