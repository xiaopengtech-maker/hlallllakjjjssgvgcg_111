// Vercel Serverless Function - Rút gọn link
// Chỉ lưu parameters quan trọng từ URL MoMo

// Encode URL thành shortcode ngắn
function encodeUrl(url) {
  try {
    // Parse URL để lấy parameters
    const urlObj = new URL(url);
    const t = urlObj.searchParams.get('t');
    const s = urlObj.searchParams.get('s');
    
    if (!t || !s) {
      // Nếu không có t và s, encode toàn bộ URL
      const base64 = Buffer.from(url).toString('base64');
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    
    // Chỉ encode t và s (ngắn hơn nhiều)
    const data = JSON.stringify({ t, s });
    const base64 = Buffer.from(data).toString('base64');
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (error) {
    // Fallback: encode toàn bộ URL
    const base64 = Buffer.from(url).toString('base64');
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
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
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    
    // Kiểm tra xem có phải JSON không (t và s)
    try {
      const data = JSON.parse(decoded);
      if (data.t && data.s) {
        // Rebuild URL MoMo
        return `https://payment.momo.vn/v2/gateway/pay?t=${data.t}&s=${data.s}`;
      }
    } catch (e) {
      // Không phải JSON, trả về decoded string (URL đầy đủ)
      return decoded;
    }
    
    return decoded;
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
