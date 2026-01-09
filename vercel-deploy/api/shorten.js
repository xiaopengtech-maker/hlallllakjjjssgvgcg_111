// Vercel Serverless Function - Rút gọn link
// Sử dụng Base64 encoding để encode URL trong shortcode

// Encode URL thành shortcode
function encodeUrl(url) {
  // Encode URL thành base64
  const base64 = Buffer.from(url).toString('base64');
  // Làm URL-safe và rút ngắn
  const urlSafe = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  // Lấy 8 ký tự đầu làm shortcode
  return urlSafe.substring(0, 8);
}

// Decode shortcode thành URL
function decodeShortcode(shortcode) {
  try {
    // Restore base64 format
    let base64 = shortcode
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // Decode
    return Buffer.from(base64, 'base64').toString('utf-8');
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Tạo link rút gọn
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({
          error: 'URL is required'
        });
      }

      // Encode URL thành shortcode
      const shortCode = encodeUrl(url);
      
      // Trả về link rút gọn
      const baseUrl = req.headers.host || 'localhost:3000';
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const shortUrl = `${protocol}://${baseUrl}/s/${shortCode}`;
      
      return res.status(200).json({
        shortUrl,
        shortCode,
        originalUrl: url
      });
      
    } catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  }

  // GET: Lấy thông tin link
  if (req.method === 'GET') {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).json({
          error: 'Short code is required'
        });
      }

      const originalUrl = decodeShortcode(code);
      
      if (!originalUrl) {
        return res.status(404).json({
          error: 'Invalid short code'
        });
      }

      return res.status(200).json({
        originalUrl,
        shortCode: code
      });
      
    } catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  }

  return res.status(405).json({
    error: 'Method not allowed'
  });
}
