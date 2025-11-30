export default async function handler(req, res) {
  // Autoriser uniquement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Vérification du token admin
  const auth = req.headers.authorization?.replace("Bearer ", "")
  if (auth !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  // Récupération des données envoyées
  const { file, publicId } = req.body

  if (!file) {
    return res.status(400).json({ error: "Missing file" })
  }

  // Variables Cloudinary (depuis Vercel)
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME

  // URL API Cloudinary
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`

  // Envoi à Cloudinary
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      file: `data:image/jpeg;base64,${file}`,
      upload_preset: uploadPreset,
      public_id: publicId,
      folder: "parfum"
    })
  })

  const data = await response.json()

  if (!response.ok) {
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
