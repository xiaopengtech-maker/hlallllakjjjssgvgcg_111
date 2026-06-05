// Vercel Serverless Function - GET link rút gọn (có nút bấm)
// IMPORTANT: nên chạy ở Node runtime vì có dùng Buffer.

function decodeShortcode(shortcode) {
  if (typeof shortcode !== 'string') return null;

  try {
    // base64 URL-safe -> base64
    let base64 = shortcode.replace(/-/g, '+').replace(/_/g, '/');

    // pad '='
    while (base64.length % 4 !== 0) base64 += '=';

    const decoded = Buffer.from(base64, 'base64').toString('utf-8');

    // Nếu decoded là JSON dạng {t, s} -> chuyển sang MoMo payment gateway
    try {
      const data = JSON.parse(decoded);
      if (data && data.t && data.s) {
        return `https://payment.momo.vn/v2/gateway/pay?t=${encodeURIComponent(
          data.t
        )}&s=${encodeURIComponent(data.s)}`;
      }
    } catch {
      // decoded không phải JSON -> coi như chuỗi URL
    }

    return decoded;
  } catch {
    return null;
  }
}

function isValidMoMoPaymentUrl(url) {
  try {
    const u = new URL(url);

    // Chỉ cho phép domain MoMo gateway (bạn có thể nới thêm nếu cần)
    if (u.origin !== 'https://payment.momo.vn') return false;

    // Path có thể khác nhau tùy hệ thống; nếu muốn chặt hơn thì check thêm:
    // if (u.pathname !== '/v2/gateway/pay') return false;

    // Check có query t & s
    if (!u.searchParams.get('t')) return false;
    if (!u.searchParams.get('s')) return false;

    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  try {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).send('Method not allowed');

    const { code } = req.query;

    // validate code
    if (!code || Array.isArray(code)) {
      return res.status(400).send('Thiếu mã link');
    }

    const momoUrl = decodeShortcode(code);

    if (!momoUrl) {
      return res.status(404).send('Link không tồn tại');
    }

    // validate url để tránh render link rác
    if (!isValidMoMoPaymentUrl(momoUrl)) {
      return res.status(404).send('Link không tồn tại');
    }

    res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chuyển tiền MoMo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
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
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      border-radius: 20px;
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
    }
    h2 {
      color: #333;
      font-size: 22px;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      font-size: 14px;
      margin-bottom: 30px;
    }
    .btn {
      display: inline-block;
      width: 100%;
      padding: 16px 30px;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      color: white;
      font-size: 18px;
      font-weight: 600;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(168, 85, 247, 0.4);
    }
    .btn:active { transform: translateY(0); }
    .warning {
      background: #fff3cd;
      color: #856404;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">💰</div>
    <h2>Chuyển tiền MoMo</h2>
    <p>Nhấn nút bên dưới để mở ứng dụng MoMo</p>

    <a href="${momoUrl}"
       class="btn"
       id="payBtn"
       rel="noopener noreferrer">
      📱 Mở MoMo Ngay
    </a>

    <div class="warning">
      ⚠️ Chỉ bấm 1 lần duy nhất!<br>
      Bấm lại sẽ không thanh toán được.
    </div>
  </div>

  <script>
    // Chống bấm nhiều lần: khi user bấm -> disable ngay
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
  } catch (err) {
    console.error('FUNCTION_CRASH:', err);
    return res.status(500).send('Lỗi server');
  }
}
