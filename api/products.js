import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_TOKEN

let cachedClient = null

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set')
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  cachedClient = client
  return client
}

async function getProductsCollection() {
  const client = await connectToDatabase()
  const db = client.db('boutique_parfum')
  return db.collection('products')
}

export default async function handler(req, res) {
  try {
    const collection = await getProductsCollection()

    // GET - Récupérer tous les produits
    if (req.method === 'GET') {
      const products = await collection.find({}).toArray()
      return res.status(200).json({ products })
    }

    // POST - Créer un produit
    if (req.method === 'POST') {
      const authHeader = req.headers.authorization
      const token = authHeader?.substring(7)
      
      if (token !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { id, name, description, image, audioUrl, fullDescription, topNotes, heartNotes, baseNotes } = req.body

      if (!id || !name || !image) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const product = {
        id: String(id),
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

      await collection.insertOne(product)

      return res.status(201).json({
        success: true,
        product,
        message: 'Product created successfully'
      })
    }

    // PUT - Modifier un produit
    if (req.method === 'PUT') {
      const authHeader = req.headers.authorization
      const token = authHeader?.substring(7)
      
      if (token !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { id, ...updates } = req.body

      if (!id) {
        return res.status(400).json({ error: 'Missing product id' })
      }

      const result = await collection.updateOne(
        { id: String(id) },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      )

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Product not found' })
      }

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully'
      })
    }

    // DELETE - Supprimer un produit
    if (req.method === 'DELETE') {
      const authHeader = req.headers.authorization
      const token = authHeader?.substring(7)
      
      if (token !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { id } = req.query

      if (!id) {
        return res.status(400).json({ error: 'Missing product id' })
      }

      const result = await collection.deleteOne({ id: String(id) })

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Product not found' })
      }

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
}
