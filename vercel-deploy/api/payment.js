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

  // === GET /api/payment?action=get_config ===
  // Trả về config hiện tại (không trả token vì bảo mật)
  if (req.method === 'GET' && req.query?.action === 'get_config') {
    return res.status(200).json({
      isdn: process.env.VIETTEL_ISDN || '',
      lang: process.env.VIETTEL_LANG || 'vi',
      pay_code: process.env.VIETTEL_PAY_CODE || 'topup_web',
      has_token: !!(process.env.VIETTEL_TOKEN)
    });
  }

  if (req.method === 'POST' || req.method === 'GET') {
    try {
      // Đọc body (POST) hoặc query (GET)
      const body = req.method === 'POST' ? (req.body || {}) : (req.query || {});

      // Cấu hình mặc định (fallback cuối cùng)
      const DEFAULT_CONFIG = {
        isdn: '84392746152',
        token: '92172319-2641-4030-a1f0-ca55ad437698-d2ViXzg0MzkyNzQ2MTUy',
        lang: 'vi',
        pay_code: 'topup_web'
      };

      // Ưu tiên: Vercel Env Vars > Body/Query từ request > Default hardcode
      const config = {
        isdn:     process.env.VIETTEL_ISDN     || body.isdn     || DEFAULT_CONFIG.isdn,
        token:    process.env.VIETTEL_TOKEN    || body.token    || DEFAULT_CONFIG.token,
        lang:     process.env.VIETTEL_LANG     || body.lang     || DEFAULT_CONFIG.lang,
        pay_code: process.env.VIETTEL_PAY_CODE || body.pay_code || DEFAULT_CONFIG.pay_code,
      };

      // POST vào API createToken
      const apiUrl = `https://apigami.viettel.vn/mvt-api/myviettel.php/momo/createToken?lang=${config.lang}&pay_code=${config.pay_code}&token=${config.token}&isdn=${config.isdn}`;

      console.log('Calling createToken API with isdn:', config.isdn);

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
