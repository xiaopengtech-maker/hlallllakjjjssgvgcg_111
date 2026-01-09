// API để redirect link rút gọn
const linkStore = new Map();

export default async function handler(req, res) {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lỗi</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          }
          h1 { color: #e74c3c; }
          p { color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>⚠️ Thiếu mã link</h1>
          <p>Vui lòng cung cấp mã link rút gọn.</p>
        </div>
      </body>
      </html>
    `);
  }

  try {
    const originalUrl = linkStore.get(code);
    
    if (originalUrl) {
      // Redirect đến URL gốc
      return res.redirect(302, originalUrl);
    } else {
      // Không tìm thấy link
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link không tồn tại</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              text-align: center;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            h1 { color: #e74c3c; }
            p { color: #666; }
            a {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Link không tồn tại</h1>
            <p>Link rút gọn này không tồn tại hoặc đã hết hạn.</p>
            <p>Mã: <code>${code}</code></p>
            <a href="/">Quay về trang chủ</a>
          </div>
        </body>
        </html>
      `);
    }
  } catch (error) {
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lỗi</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          }
          h1 { color: #e74c3c; }
          p { color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>⚠️ Có lỗi xảy ra</h1>
          <p>${error.message}</p>
        </div>
      </body>
      </html>
    `);
  }
}
