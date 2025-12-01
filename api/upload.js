export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = req.headers.authorization?.replace("Bearer ", "")
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_TOKEN

  if (auth !== adminPassword) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { file, publicId, fileType } = req.body

  if (!file) return res.status(400).json({ error: "Missing file" })
  if (!publicId) return res.status(400).json({ error: "Missing publicId" })

  // Nettoyer le publicId pour enlever les slashes et caractères spéciaux
  const cleanPublicId = publicId.replace(/[^a-zA-Z0-9_-]/g, '_')

  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME

  if (!uploadPreset || !cloudName) {
    return res.status(500).json({ error: "Cloudinary not configured" })
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`

  try {
    const bodyData = new URLSearchParams()
    bodyData.append('file', `data:${fileType || 'image/jpeg'};base64,${file}`)
    bodyData.append('upload_preset', uploadPreset)

    // FIX : folder séparé + public_id simple
    bodyData.append('folder', 'parfum')
    bodyData.append('public_id', cleanPublicId)

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: bodyData
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Cloudinary error:', data)
      return res.status(400).json({
        error: data.error?.message || data.message || "Upload failed"
      })
    }

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
