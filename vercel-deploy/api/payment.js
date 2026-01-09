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
      // API Viettel
      const apiUrl = 'https://apigami.viettel.vn/mvt-api/myviettel.php/momo/createToken?lang=vi&pay_code=topup_web&token=f4149290-a883-4c61-bf55-9566142ff665-d2ViXzg0MzQ2Nzg0NDkw&isdn=84346784490';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
