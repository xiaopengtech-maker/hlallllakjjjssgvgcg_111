# 🚀 Hướng Dẫn Deploy Chi Tiết

## Bước 1: Chuẩn bị

Đảm bảo bạn có:
- Tài khoản GitHub
- Tài khoản Vercel (đăng ký miễn phí tại https://vercel.com)

## Bước 2: Push code lên GitHub

```bash
# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit"

# Tạo repo trên GitHub và push
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

## Bước 3: Deploy trên Vercel

### Cách 1: Qua Vercel Dashboard (Khuyên dùng)

1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub
3. Click nút **"Add New..."** → **"Project"**
4. Chọn repository của bạn
5. **QUAN TRỌNG:** Trong phần **"Configure Project"**:
   - **Root Directory**: Chọn `vercel-deploy` (không để trống!)
   - **Framework Preset**: None
   - **Build Command**: Để trống
   - **Output Directory**: Để trống
6. Click **"Deploy"**
7. Đợi vài phút để deploy hoàn tất

### Cách 2: Qua Vercel CLI

```bash
# Cài Vercel CLI
npm install -g vercel

# Di chuyển vào folder vercel-deploy
cd vercel-deploy

# Login
vercel login

# Deploy
vercel

# Deploy production
vercel --prod
```

## Bước 4: Kiểm tra

Sau khi deploy thành công:
1. Vercel sẽ cung cấp URL: `https://your-project.vercel.app`
2. Truy cập URL để kiểm tra
3. Click nút "Tạo Link Thanh Toán"
4. Kiểm tra xem có tạo được link không

## ⚠️ Xử lý lỗi 404

Nếu bạn gặp lỗi 404:

### Nguyên nhân 1: Chưa chọn Root Directory
**Giải pháp:**
1. Vào Vercel Dashboard
2. Chọn project của bạn
3. Settings → General
4. Tìm **"Root Directory"**
5. Chọn `vercel-deploy`
6. Save và redeploy

### Nguyên nhân 2: File vercel.json không đúng
**Giải pháp:**
- Đảm bảo file `vercel.json` có trong folder `vercel-deploy/`
- Nội dung phải đúng format JSON

### Nguyên nhân 3: API routes không hoạt động
**Giải pháp:**
1. Kiểm tra folder `api/` có các file:
   - `payment.js`
   - `shorten.js`
   - `redirect.js`
2. Redeploy project

## 🔍 Debug

### Xem logs:
1. Vào Vercel Dashboard
2. Chọn project
3. Click vào deployment mới nhất
4. Xem tab "Functions" để xem logs

### Test API trực tiếp:
```bash
# Test API payment
curl -X POST https://your-project.vercel.app/api/payment

# Test API shorten
curl -X POST https://your-project.vercel.app/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

## 📱 Sau khi deploy thành công

Bạn sẽ có:
- URL chính: `https://your-project.vercel.app`
- API payment: `https://your-project.vercel.app/api/payment`
- API shorten: `https://your-project.vercel.app/api/shorten`
- Redirect: `https://your-project.vercel.app/s/{code}`

## 💡 Tips

1. **Custom Domain:**
   - Vào Settings → Domains
   - Add domain của bạn
   - Miễn phí!

2. **Environment Variables:**
   - Nếu cần thêm token/config
   - Settings → Environment Variables
   - Add biến và redeploy

3. **Auto Deploy:**
   - Mỗi lần push code lên GitHub
   - Vercel tự động deploy
   - Rất tiện!

## 🆘 Cần hỗ trợ?

Nếu vẫn gặp vấn đề:
1. Kiểm tra lại Root Directory = `vercel-deploy`
2. Xem logs trên Vercel Dashboard
3. Đảm bảo tất cả files trong folder `vercel-deploy/`
