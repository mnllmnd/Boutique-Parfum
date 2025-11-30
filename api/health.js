export default async function handler(req, res) {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      MONGODB_URI: process.env.MONGODB_URI ? '✓ set' : '✗ missing',
      ADMIN_TOKEN: process.env.ADMIN_TOKEN ? '✓ set' : '✗ missing',
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✓ set' : '✗ missing',
      CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET ? '✓ set' : '✗ missing'
    }
  })
}
