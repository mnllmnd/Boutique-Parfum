export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body

  if (!password) {
    return res.status(400).json({ error: 'Password required' })
  }

  // Récupérer le mot de passe depuis les variables d'environnement
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD env variable is not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // Vérifier le mot de passe
  if (password === adminPassword) {
    return res.status(200).json({ success: true, message: 'Authentication successful' })
  } else {
    return res.status(401).json({ success: false, message: 'Invalid password' })
  }
}
