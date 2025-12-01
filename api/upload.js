export default async function handler(req, res) {
  // Autoriser uniquement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Vérification du mot de passe admin
  const auth = req.headers.authorization?.replace("Bearer ", "")
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_TOKEN
  
  if (auth !== adminPassword) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  // Récupération des données envoyées
  const { file, publicId, fileType } = req.body

  if (!file) {
    return res.status(400).json({ error: "Missing file" })
  }

  // Variables Cloudinary (depuis Vercel)
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME

  if (!uploadPreset || !cloudName) {
    return res.status(500).json({ error: "Cloudinary not configured" })
  }

  // URL API Cloudinary
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`

  try {
    // Créer URLSearchParams pour l'upload (compatible avec Cloudinary)
    const params = new URLSearchParams()
    params.append('file', `data:${fileType || 'image/jpeg'};base64,${file}`)
    params.append('upload_preset', uploadPreset)
    params.append('public_id', publicId)
    params.append('folder', 'parfum')

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: params
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Cloudinary error:', {
        status: response.status,
        error: data.error,
        message: data.message
      })
      return res.status(400).json({
        error: data.error?.message || data.message || "Upload failed",
        details: data.error
      })
    }

    // Upload OK
    return res.status(200).json({
      url: data.secure_url,
      publicId: data.public_id
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Server error'
    })
  }
}
