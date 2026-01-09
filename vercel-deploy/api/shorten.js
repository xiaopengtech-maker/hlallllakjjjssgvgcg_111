// Vercel Serverless Function - Rút gọn link
// Sử dụng Vercel KV hoặc in-memory storage đơn giản

// In-memory storage (đơn giản, mất data khi restart)
// Để persistent, cần dùng Vercel KV hoặc database
const linkStore = new Map();

// Tạo mã ngắn từ URL
function generateShortCode(url) {
  // Tạo hash đơn giản từ URL
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Chuyển thành base36 và lấy 6 ký tự
  const shortCode = Math.abs(hash).toString(36).substring(0, 6);
  return shortCode;
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

      // Tạo mã ngắn
      const shortCode = generateShortCode(url);
      
      // Lưu vào store
      linkStore.set(shortCode, url);
      
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

  // GET: Redirect từ link rút gọn
  if (req.method === 'GET') {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).json({
          error: 'Short code is required'
        });
      }

      const originalUrl = linkStore.get(code);
      
      if (!originalUrl) {
        return res.status(404).json({
          error: 'Link not found'
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
