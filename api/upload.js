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

  // Déterminer le MIME type du fichier
  let mimeType = 'image/jpeg'
  if (fileType) {
    mimeType = fileType
  } else if (file.startsWith('/9j/') || file.startsWith('iVBORw0KGgo')) {
    // JPEG ou PNG (images)
    mimeType = file.startsWith('/9j/') ? 'image/jpeg' : 'image/png'
  } else {
    // Probablement audio
    mimeType = 'audio/webm'
  }

  // Déterminer le resource_type
  const resourceType = mimeType.startsWith('audio') ? 'auto' : 'image'

  // Envoi à Cloudinary
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      file: `data:${mimeType};base64,${file}`,
      upload_preset: uploadPreset,
      public_id: publicId,
      folder: "parfum",
      resource_type: resourceType
    })
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('Cloudinary error:', data)
    return res.status(400).json({
      error: data.error?.message || "Upload failed"
    })
  }

  // Upload OK
  return res.status(200).json({
    url: data.secure_url,
    publicId: data.public_id
  })
}
