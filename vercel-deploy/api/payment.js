const JSDELIVR_URL =
  'https://cdn.jsdelivr.net/gh/xiaopengtech-maker/viettel-nnnananana@main/vercel-deploy/api/config.json';
const PURGE_URL =
  'https://purge.jsdelivr.net/gh/xiaopengtech-maker/viettel-nnnananana@main/vercel-deploy/api/config.json';

async function fetchConfigFromGitHub() {
  try { await fetch(PURGE_URL); } catch (_) {}
  const res = await fetch(JSDELIVR_URL + '?t=' + Date.now(), {
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  });
  if (!res.ok) throw new Error('Không đọc được config.json: HTTP ' + res.status);
  return await res.json();
}

export default async function handler(req, res) {
  // ✅ Xóa cache Vercel Edge hoàn toàn
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET' && req.query?.action === 'get_config') {
    try {
      const config = await fetchConfigFromGitHub();
      return res.status(200).json({
        isdn: config.isdn,
        lang: config.lang,
        pay_code: config.pay_code,
        has_token: !!(config.token),
        source: 'live'
      });
    } catch (error) {
      return res.status(500).json({ errorCode: 1, message: error.message });
    }
  }

  if (req.method === 'POST' || req.method === 'GET') {
    try {
      const config = await fetchConfigFromGitHub();

      const isdn     = process.env.VIETTEL_ISDN     || config.isdn;
      const token    = process.env.VIETTEL_TOKEN    || config.token;
      const lang     = process.env.VIETTEL_LANG     || config.lang     || 'vi';
      const pay_code = process.env.VIETTEL_PAY_CODE || config.pay_code || 'topup_web';

      if (!isdn || !token) {
        return res.status(400).json({
          errorCode: 1,
          message: 'Thiếu isdn hoặc token trong config.json'
        });
      }

      const apiUrl = `https://apigami.viettel.vn/mvt-api/myviettel.php/momo/createToken`
        + `?lang=${lang}&pay_code=${pay_code}&token=${token}&isdn=${isdn}`;

      console.log('[payment] isdn:', isdn);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      return res.status(200).json(data);

    } catch (error) {
      return res.status(500).json({ errorCode: 1, message: 'Lỗi: ' + error.message });
    }
  }

  return res.status(405).json({ errorCode: 1, message: 'Method not allowed' });
}
