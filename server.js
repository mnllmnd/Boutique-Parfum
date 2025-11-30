import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFile } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
app.use(express.json())

// Import API handlers
import uploadHandler from './api/upload.ts'
import productsHandler from './api/products.ts'

// Mock VercelRequest/VercelResponse
class MockVercelRequest {
  constructor(req) {
    Object.assign(this, req)
    this.body = req.body
    this.headers = req.headers
    this.method = req.method
    this.query = req.query
  }
}

class MockVercelResponse {
  constructor(res) {
    this.res = res
    this.statusCode = 200
    this.body = null
  }

  status(code) {
    this.statusCode = code
    this.res.status(code)
    return this
  }

  json(data) {
    this.body = data
    return this.res.json(data)
  }

  text(data) {
    return this.res.send(data)
  }
}

// Routes
app.post('/api/upload', async (req, res) => {
  const mockReq = new MockVercelRequest(req)
  const mockRes = new MockVercelResponse(res)
  await uploadHandler(mockReq, mockRes)
})

app.all('/api/products', async (req, res) => {
  const mockReq = new MockVercelRequest(req)
  mockReq.query = req.query
  const mockRes = new MockVercelResponse(res)
  await productsHandler(mockReq, mockRes)
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`\n✅ API Server running on http://localhost:${PORT}`)
  console.log(`📁 Routes available:`)
  console.log(`   POST   /api/upload    - Upload images to Cloudinary`)
  console.log(`   GET    /api/products  - Get all products`)
  console.log(`   POST   /api/products  - Create product (admin)`)
  console.log(`   PUT    /api/products  - Update product (admin)`)
  console.log(`   DELETE /api/products  - Delete product (admin)\n`)
})
