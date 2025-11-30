import FormData from 'form-data'
import { Readable } from 'stream'

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET
const ADMIN_TOKEN = process.env.ADMIN_TOKEN

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const authHeader = req.headers.authorization
    const token = authHeader?.substring(7)
    
    if (token !== ADMIN_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { file, publicId } = req.body
    if (!file) {
      return res.status(400).json({ error: 'Missing file' })
    }

    // Convertir base64 en buffer
    const buffer = Buffer.from(file, 'base64')
    const stream = Readable.from(buffer)

    // Créer FormData pour Cloudinary avec upload preset
    const formData = new FormData()
    formData.append('file', stream, { filename: 'upload.jpg' })
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || 'Perfum_unsigned')
    formData.append('public_id', publicId)
    formData.append('folder', 'parfum')

    // Upload vers Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text()
      console.error('Cloudinary error:', errorData)
      try {
        const errorJson = JSON.parse(errorData)
        return res.status(400).json({ error: 'Upload failed', details: errorJson.error?.message })
      } catch {
        return res.status(400).json({ error: 'Upload failed', details: errorData })
      }
    }

    const data = await uploadResponse.json()

    return res.status(200).json({
      url: data.secure_url,
      publicId: data.public_id
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
