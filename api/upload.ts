import { VercelRequest, VercelResponse } from '@vercel/node'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { Readable } from 'stream'

interface CloudinaryResponse {
  secure_url: string
  public_id: string
}

interface UploadRequest {
  file: string
  publicId: string
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Vérifier l'authentification
  const authHeader = req.headers.authorization
  const token = authHeader?.substring(7) // Remove 'Bearer '
  
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { file, publicId } = req.body as UploadRequest

    if (!file) {
      return res.status(400).json({ error: 'Missing file' })
    }

    // Convertir base64 en buffer
    const buffer = Buffer.from(file, 'base64')
    const stream = Readable.from(buffer)

    // Créer FormData pour Cloudinary
    const formData = new FormData()
    formData.append('file', stream, { filename: 'upload.jpg' })
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || '')
    formData.append('public_id', publicId)

    // Upload vers Cloudinary - FormData type est compatible avec body
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData as unknown as NodeJS.ReadableStream
      }
    )

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text()
      console.error('Cloudinary error:', errorData)
      return res.status(400).json({ error: 'Upload failed' })
    }

    const data = await uploadResponse.json() as CloudinaryResponse

    return res.status(200).json({
      url: data.secure_url,
      publicId: data.public_id
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
