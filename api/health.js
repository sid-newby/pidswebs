// api/health.js
// Simple health check endpoint to test API routing

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      hasAzureClientId: !!process.env.AZURE_CLIENT_ID,
      hasAzureClientSecret: !!process.env.AZURE_CLIENT_SECRET,
      hasAzureTenantId: !!process.env.AZURE_TENANT_ID,
      hasOrganizerUserId: !!process.env.ORGANIZER_USER_ID,
    }
  });
}
