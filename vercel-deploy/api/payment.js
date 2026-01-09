// Vercel Serverless Function - Gọi createToken rồi omiPreOrder
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
      // Lấy amount từ query hoặc body
      const amount = req.query.amount || req.body?.amount || '10000';
      
      // Cấu hình mặc định
      const DEFAULT_CONFIG = {
        phoneNumber: '0346784490',
        isdn: '84346784490',
        token: '579fb011-f2e5-42e0-bcc3-9dedaf6d599e-d2ViXzg0MzQ2Nzg0NDkw'
      };
      
      // Bước 1: Gọi API createToken để lấy token mới
      const createTokenUrl = `https://apigami.viettel.vn/mvt-api/myviettel.php/momo/createToken?lang=vi&pay_code=topup_web&token=${DEFAULT_CONFIG.token}&isdn=${DEFAULT_CONFIG.isdn}`;
      
      const tokenResponse = await fetch(createTokenUrl);
      const tokenData = await tokenResponse.json();
      
      if (tokenData.errorCode !== 0) {
        return res.status(400).json(tokenData);
      }
      
      // Lấy token mới từ response
      const newToken = tokenData.data?.token || DEFAULT_CONFIG.token;
      
      // Bước 2: Gọi API omiPreOrder với token mới để lấy link thanh toán
      const apiUrl = 'https://apigami.viettel.vn/mvt-api/myviettel.php/omiPreOrder';
      
      const params = new URLSearchParams({
        amount: amount,
        token: newToken,
        ch: '',
        createTokenId: 'false',
        is_discount_tmdt: '1',
        phoneNumber: DEFAULT_CONFIG.phoneNumber,
        service_code: 'topup_web',
        type: '24',
        pay_type: '24',
        account: DEFAULT_CONFIG.phoneNumber,
        cust_info: JSON.stringify({
          custName: '',
          tin: '',
          email: '',
          address: '',
          company: '',
          codeRelationship: ''
        }),
        invoice_request: '',
        voucherList: '',
        service_type: '1',
        hot_charge: '0',
        source: 'WEBPORTAL',
        paymentType: '5'
      });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: params.toString()
      });
      
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
