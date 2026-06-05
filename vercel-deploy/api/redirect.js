// File A: trả HTML nút, nhưng link nút sẽ trỏ sang file B để redirect lần nữa.

function decodeShortcode(shortcode) {
  if (typeof shortcode !== 'string') return null;

  try {
    let base64 = shortcode.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) base64 += '=';

    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    // sửa lại giải mã đúng: Buffer.from(base64,'base64') chứ không phải 'base64' thứ 2
  } catch (e) {}
  return null;
}

// --- Lưu ý ---
/**
 * Mình sẽ không nhồi lại decode lỗi ở đây.
 * Bạn dùng decode chuẩn như file bạn đang có.
 * Paste decode của bạn vào đúng chỗ hàm dưới đây.
 */
function decodeShortcodeStrict(shortcode) {
  try {
    let base64 = shortcode.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';

    const decoded = Buffer.from(base64, 'base64').toString('utf-8');

    try {
      const data = JSON.parse(decoded);
      if (data && data.t && data.s) {
        return `https://payment.momo.vn/v2/gateway/pay?t=${encodeURIComponent(data.t)}&s=${encodeURIComponent(data.s)}`;
      }
    } catch {
      // không phải JSON
    }

    // nếu không phải json thì coi là url
    return decoded;
  } catch {
    return null;
  }
}

function isValidMoMoPaymentUrl(url) {
  try {
    const u = new URL(url);
    return u.origin === 'https://payment.momo.vn';
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  // CORS (nếu bạn không cần thì có thể bỏ)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).send('Method not allowed');

  const { code } = req.query;
  if (!code || Array.isArray(code)) return res.status(400).send('Thiếu mã link');

  const momoUrl = decodeShortcodeStrict(code);

  if (!momoUrl || !isValidMoMoPaymentUrl(momoUrl)) {
    return res.status(404).send('Link không tồn tại');
  }

  // File B để redirect lần nữa
  // Ví dụ route: /api/redirect?next=<momoUrl>
  const next = encodeURIComponent(momoUrl);

  res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chuyển tiền MoMo</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px 30px;
      text-align: center;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .logo {
      width: 80px; height: 80px;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      border-radius: 20px;
      margin: 0 auto 20px;
      display:flex; align-items:center; justify-content:center;
      font-size: 40px;
      color:#fff;
    }
    h2 { color:#333; font-size:22px; margin-bottom:10px; }
    p { color:#666; font-size:14px; margin-bottom:30px; }
    .btn {
      display:inline-block; width:100%;
      padding:16px 30px;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      color:white; font-size:18px; font-weight:600;
      border:none; border-radius:12px;
      cursor:pointer; text-decoration:none;
      transition: transform .2s, box-shadow .2s, opacity .2s;
    }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(168,85,247,0.4); }
    .btn:active { transform: translateY(0); }
    .warning {
      background:#fff3cd; color:#856404;
      padding:12px; border-radius:8px;
      font-size:13px; margin-top:20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">💰</div>
    <h2>Chuyển tiền MoMo</h2>
    <p>Nhấn nút bên dưới để mở ứng dụng MoMo</p>

    <a href="/api/redirect?next=${next}" class="btn" id="payBtn" rel="noopener noreferrer">
      📱 Mở MoMo Ngay
    </a>

    <div class="warning">
      ⚠️ Chỉ bấm 1 lần duy nhất!<br>
      Bấm lại có thể không thanh toán được.
    </div>
  </div>

  <script>
    const btn = document.getElementById('payBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.7';
        btn.textContent = 'Đang mở MoMo...';
      }, { once: true });
    }
  </script>
</body>
</html>
  `);
}
