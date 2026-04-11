// Vercel Serverless Function - payment.js
// Config hardcode — muốn đổi thì sửa thẳng file này rồi deploy lại

const CONFIG = {
  isdn:     '866793764',
  token:    '9a9ab762-95dd-43fc-a996-ef87af3727ed-d2ViXzg0ODY2NzkzNzY0',
  lang:     'vi',
  pay_code: 'topup_web'
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const apiUrl = `https://apigami.viettel.vn/mvt-api/myviettel.php/momo/createToken`
      + `?lang=${CONFIG.lang}&pay_code=${CONFIG.pay_code}&token=${CONFIG.token}&isdn=${CONFIG.isdn}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      errorCode: 1,
      message: 'Lỗi: ' + error.message
    });
  }
}
