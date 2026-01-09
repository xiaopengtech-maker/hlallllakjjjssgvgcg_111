// Vercel Serverless Function - Chỉ dùng API createToken
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST' || req.method === 'GET') {
    try {
      // Cấu hình mặc định
      const DEFAULT_CONFIG = {
        phoneNumber: '84346784490',
        token: 'f4149290-a883-4c61-bf55-9566142ff665-d2ViXzg0MzQ2Nzg0NDkw'
      };
      
      // Gọi API createToken
      const createTokenUrl = `https://apigami.viettel.vn/mvt-api/myviettel.php/momo/createToken?lang=vi&pay_code=topup_web&token=${DEFAULT_CONFIG.token}&isdn=${DEFAULT_CONFIG.phoneNumber}`;
      
      const response = await fetch(createTokenUrl);
      const data = await response.json();
      
      return res.status(200).json(data);
      
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ 
        errorCode: 1, 
        message: 'Lỗi khi gọi API: ' + error.message 
      });
    }
  }

  return res.status(405).json({ 
    errorCode: 1,
    message: 'Method not allowed' 
  });
}
