import { VercelRequest, VercelResponse } from '@vercel/node'

interface Product {
  id: number
  name: string
  description: string
  notes: string
  image: string
  audioUrl?: string
  fullDescription: string
  topNotes: string
  heartNotes: string
  baseNotes: string
  createdAt: string
  updatedAt?: string
}

type ProductsDB = Record<string, Product>

// Base de données temporaire (remplace avec une vraie BD)
const PRODUCTS_DB: ProductsDB = {}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Vérification admin
  const authHeader = req.headers.authorization
  const isAdmin =
    authHeader?.startsWith('Bearer ') &&
    authHeader.substring(7) === process.env.ADMIN_TOKEN

  try {
    /**
     * =====================================================
     * GET → Récupérer tous les produits
     * =====================================================
     */
    if (req.method === 'GET') {
      const products = Object.values(PRODUCTS_DB)
      return res.status(200).json({ products })
    }

    /**
     * =====================================================
     * POST → Ajouter un produit (Admin)
     * =====================================================
     */
    if (req.method === 'POST') {
      if (!isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const {
        id,
        name,
        description,
        image,
        audioUrl,
        fullDescription,
        topNotes,
        heartNotes,
        baseNotes
      } = req.body as {
        id: string
        name: string
        description: string
        image: string
        audioUrl?: string
        fullDescription: string
        topNotes: string
        heartNotes: string
        baseNotes: string
      }

      if (!id || !name || !image) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const product: Product = {
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

    /**
     * =====================================================
     * PUT → Modifier un produit (Admin)
     * =====================================================
     */
    if (req.method === 'PUT') {
      if (!isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { id, ...updates } = req.body as Partial<Product> & {
        id: string
      }

      if (!id || !PRODUCTS_DB[id]) {
        return res.status(404).json({ error: 'Product not found' })
      }

      PRODUCTS_DB[id] = {
        ...PRODUCTS_DB[id],
        ...(updates as Partial<Product>),
        updatedAt: new Date().toISOString()
      }

      return res.status(200).json({
        success: true,
        product: PRODUCTS_DB[id],
        message: 'Product updated successfully'
      })
    }

    /**
     * =====================================================
     * DELETE → Supprimer un produit (Admin)
     * =====================================================
     */
    if (req.method === 'DELETE') {
      if (!isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      let { id } = req.query

      // Correction : req.query.id peut être string | string[]
      if (Array.isArray(id)) {
        id = id[0]
      }

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
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
