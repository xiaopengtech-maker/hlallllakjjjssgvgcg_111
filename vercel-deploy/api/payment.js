// Vercel Serverless Function
// Config được đọc từ GitHub raw file — mọi máy đều dùng chung

// === URL file config.json trên GitHub của bạn ===
const GITHUB_CONFIG_URL = process.env.GITHUB_CONFIG_URL
  || 'https://raw.githubusercontent.com/yourname/yourrepo/main/config.json';

// Cache config trong RAM (tránh gọi GitHub quá nhiều)
let cachedConfig = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 60 giây

async function fetchConfigFromGitHub() {
  const now = Date.now();
  if (cachedConfig && (now - cacheTime) < CACHE_TTL) {
    console.log('Using cached config');
    return cachedConfig;
  }

  console.log('Fetching config from GitHub:', GITHUB_CONFIG_URL);
  const res = await fetch(GITHUB_CONFIG_URL + '?t=' + now); // bust cache
  if (!res.ok) throw new Error('Không đọc được config từ GitHub: ' + res.status);

  cachedConfig = await res.json();
  cacheTime = now;
  console.log('Config loaded from GitHub, isdn:', cachedConfig.isdn);
  return cachedConfig;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // === GET /api/payment?action=get_config ===
  // Trả về config hiện tại từ GitHub (không lộ token)
  if (req.method === 'GET' && req.query?.action === 'get_config') {
    try {
      const config = await fetchConfigFromGitHub();
      return res.status(200).json({
        isdn: config.isdn,
        lang: config.lang,
        pay_code: config.pay_code,
        has_token: !!(config.token),
        source: 'github'
      });
    } catch (error) {
      return res.status(500).json({ errorCode: 1, message: error.message });
    }
  }

  // === GET /api/payment?action=reload_config ===
  // Xóa cache, buộc đọc lại từ GitHub ngay lập tức
  if (req.method === 'GET' && req.query?.action === 'reload_config') {
    cachedConfig = null;
    cacheTime = 0;
    try {
      const config = await fetchConfigFromGitHub();
      return res.status(200).json({
        success: true,
        message: 'Config đã được reload từ GitHub',
        isdn: config.isdn,
        lang: config.lang,
        pay_code: config.pay_code
      });
    } catch (error) {
      return res.status(500).json({ errorCode: 1, message: error.message });
    }
  }

  // === POST hoặc GET → gọi createToken API ===
  if (req.method === 'POST' || req.method === 'GET') {
    try {
      // Đọc config từ GitHub
      const githubConfig = await fetchConfigFromGitHub();

      // Body/Query từ request (nếu muốn override tạm thời)
      const body = req.method === 'POST' ? (req.body || {}) : (req.query || {});

      // Ưu tiên: Vercel Env Vars > GitHub config > Body/Query
      const config = {
        isdn:     process.env.VIETTEL_ISDN     || githubConfig.isdn     || body.isdn,
        token:    process.env.VIETTEL_TOKEN    || githubConfig.token    || body.token,
        lang:     process.env.VIETTEL_LANG     || githubConfig.lang     || body.lang     || 'vi',
        pay_code: process.env.VIETTEL_PAY_CODE || githubConfig.pay_code || body.pay_code || 'topup_web',
      };

      if (!config.isdn || !config.token) {
        return res.status(400).json({
          errorCode: 1,
          message: 'Thiếu isdn hoặc token trong config.json trên GitHub'
        });
      }

      const apiUrl = `https://apigami.viettel.vn/mvt-api/myviettel.php/momo/createToken`
        + `?lang=${config.lang}&pay_code=${config.pay_code}&token=${config.token}&isdn=${config.isdn}`;

      console.log('Calling createToken API, isdn:', config.isdn);

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
        message: 'Lỗi: ' + error.message
      });
    }
  }

  return res.status(405).json({ errorCode: 1, message: 'Method not allowed' });
}
