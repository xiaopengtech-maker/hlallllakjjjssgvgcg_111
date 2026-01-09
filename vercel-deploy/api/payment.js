// Vercel Serverless Function - POST vào createToken API
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
        isdn: '84346784490',
        token: '579fb011-f2e5-42e0-bcc3-9dedaf6d599e-d2ViXzg0MzQ2Nzg0NDkw',
        lang: 'vi',
        pay_code: 'topup_web'
      };
      
      // POST vào API createToken (KHÔNG CẦN amount parameter)
      const apiUrl = `https://apigami.viettel.vn/mvt-api/myviettel.php/momo/createToken?lang=${DEFAULT_CONFIG.lang}&pay_code=${DEFAULT_CONFIG.pay_code}&token=${DEFAULT_CONFIG.token}&isdn=${DEFAULT_CONFIG.isdn}`;
      
      console.log('Calling createToken API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      console.log('API Response:', data);
      
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
