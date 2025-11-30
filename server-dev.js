import express from 'express'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { Readable } from 'stream'
import crypto from 'crypto'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const app = express()

// Middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

// In-memory products database
const PRODUCTS_DB = {}

// Upload handler
app.post('/api/upload', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.substring(7) // Remove 'Bearer '
    
    if (token !== process.env.ADMIN_TOKEN) {
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
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'Perfum_unsigned')
    formData.append('public_id', publicId)
    formData.append('folder', 'parfum')

    // Upload vers Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
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
})

// Products handler
app.all('/api/products', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const isAdmin = authHeader?.startsWith('Bearer ') && 
      authHeader.substring(7) === process.env.ADMIN_TOKEN

    // GET - Récupérer tous les produits
    if (req.method === 'GET') {
      const products = Object.values(PRODUCTS_DB)
      return res.status(200).json({ products })
    }

    // POST - Créer un produit
    if (req.method === 'POST') {
      if (!isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { id, name, description, image, audioUrl, fullDescription, topNotes, heartNotes, baseNotes } = req.body

      if (!id || !name || !image) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const product = {
        id: Number.parseInt(id, 10),
        name,
        description,
        notes: `${topNotes}, ${heartNotes}, ${baseNotes}`,
        image,
        audioUrl,
        fullDescription,
        topNotes,
        heartNotes,
        baseNotes,
        createdAt: new Date().toISOString()
      }

      PRODUCTS_DB[id] = product

      return res.status(201).json({
        success: true,
        product,
        message: 'Product created successfully'
      })
    }

    // PUT - Modifier un produit
    if (req.method === 'PUT') {
      if (!isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { id, ...updates } = req.body

      if (!id || !PRODUCTS_DB[id]) {
        return res.status(404).json({ error: 'Product not found' })
      }

      PRODUCTS_DB[id] = { 
        ...PRODUCTS_DB[id], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      }

      return res.status(200).json({
        success: true,
        product: PRODUCTS_DB[id],
        message: 'Product updated successfully'
      })
    }

    // DELETE - Supprimer un produit
    if (req.method === 'DELETE') {
      if (!isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { id } = req.query

      if (!id || !PRODUCTS_DB[id]) {
        return res.status(404).json({ error: 'Product not found' })
      }

      delete PRODUCTS_DB[id]

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Products error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      ADMIN_TOKEN: process.env.ADMIN_TOKEN ? '✓ set' : '✗ missing',
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✓ set' : '✗ missing',
      CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET ? '✓ set' : '✗ missing'
    }
  })
})

const PORT = process.env.API_PORT || 3000
app.listen(PORT, () => {
  console.log(`\n✅ API Development Server`)
  console.log(`📍 Running on http://localhost:${PORT}`)
  console.log(`\n📁 Available endpoints:`)
  console.log(`   POST   /api/upload    - Upload images to Cloudinary`)
  console.log(`   GET    /api/products  - Get all products`)
  console.log(`   POST   /api/products  - Create product (admin)`)
  console.log(`   PUT    /api/products  - Update product (admin)`)
  console.log(`   DELETE /api/products  - Delete product (admin)`)
  console.log(`   GET    /health        - Health check\n`)
})
