// Vercel Serverless Function
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
      // Lấy parameters từ query (GET) hoặc body (POST)
      const amount = req.query.amount || req.body?.amount || '10000';
      const token = req.query.token || req.body?.token || '7f16ee6c-0c7c-4bfe-a498-56ff220565bd-d2ViXzg0MzkyNzQ2MTUy';
      const phoneNumber = req.query.phoneNumber || req.body?.phoneNumber || '0392746152';
      
      // API Viettel omiPreOrder
      const apiUrl = `https://apigami.viettel.vn/mvt-api/myviettel.php/omiPreOrder?amount=${amount}&token=${token}&ch=&createTokenId=false&is_discount_tmdt=1&phoneNumber=${phoneNumber}&service_code=topup_web&type=24&pay_type=24&account=${phoneNumber}&cust_info=%7B%22custName%22:%22%22,%22tin%22:%22%22,%22email%22:%22%22,%22address%22:%22%22,%22company%22:%22%22,%22codeRelationship%22:%22%22%7D&invoice_request=&voucherList=&service_type=1&hot_charge=0&source=WEBPORTAL&paymentType=5`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
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
