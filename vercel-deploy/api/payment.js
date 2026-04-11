// Vercel Serverless Function - POST vào createToken API
module.exports = async function handler(req, res) {
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
      // ===== ĐỔI TÀI KHOẢN: SỬA 2 DÒNG NÀY RỒI COMMIT =====
      const config = {
        isdn:     '84866793764',
        token:    'a9339080-e1f1-4947-ba1f-86b5b94306f9-d2ViXzg0ODY2NzkzNzY0',
        lang:     'vi',
        pay_code: 'topup_web'
      };
      // ========================================================

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
