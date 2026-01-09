# 🎯 HƯỚNG DẪN DEPLOY CHI TIẾT - FIX LỖI 404

## ⚠️ LÝ DO BỊ 404

Bạn bị lỗi 404 vì **CHƯA CHỌN ROOT DIRECTORY**!

Vercel mặc định tìm files ở thư mục gốc, nhưng files của chúng ta nằm trong folder `vercel-deploy/`

## ✅ CÁCH FIX

### Khi deploy lần đầu:

1. **Vào Vercel Dashboard**: https://vercel.com
2. **Click "Add New..."** → **"Project"**
3. **Import repository** từ GitHub
4. **Ở màn hình "Configure Project"**, bạn sẽ thấy:

```
┌─────────────────────────────────────────┐
│ Configure Project                        │
├─────────────────────────────────────────┤
│                                          │
│ Framework Preset: [None ▼]              │
│                                          │
│ Root Directory: [./  ▼] [Edit]         │  ← CLICK VÀO ĐÂY!
│                                          │
│ Build Command: [    ]                   │
│                                          │
│ Output Directory: [    ]                │
│                                          │
└─────────────────────────────────────────┘
```

5. **CLICK VÀO NÚT "Edit"** bên cạnh "Root Directory"
6. **Một popup hiện ra**, chọn folder **`vercel-deploy`**
7. **Click "Continue"**
8. **Click "Deploy"**

### Nếu đã deploy rồi (đang bị 404):

1. **Vào project** trên Vercel Dashboard
2. **Click "Settings"** (thanh menu bên trái)
3. **Click "General"**
4. **Scroll xuống tìm "Root Directory"**
5. **Click "Edit"**
6. **Chọn `vercel-deploy`**
7. **Click "Save"**
8. **Vào tab "Deployments"**
9. **Click "..." → "Redeploy"**

## 📋 CHECKLIST TRƯỚC KHI DEPLOY

- [ ] Đã push code lên GitHub
- [ ] Repository có folder `vercel-deploy/`
- [ ] Trong `vercel-deploy/` có:
  - [ ] `index.html`
  - [ ] `vercel.json`
  - [ ] `package.json`
  - [ ] Folder `api/` với 3 files: `payment.js`, `shorten.js`, `redirect.js`

## 🎬 BƯỚC DEPLOY CHI TIẾT

### Bước 1: Chuẩn bị GitHub

```bash
# Nếu chưa có git
git init

# Add tất cả files
git add .

# Commit
git commit -m "Deploy Viettel MoMo Payment"

# Tạo repo mới trên GitHub, sau đó:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Bước 2: Kết nối Vercel

1. Mở https://vercel.com
2. Đăng nhập bằng GitHub
3. Cho phép Vercel truy cập repositories

### Bước 3: Import Project

1. Click **"Add New..."** (góc trên bên phải)
2. Chọn **"Project"**
3. Tìm repository của bạn
4. Click **"Import"**

### Bước 4: Configure (QUAN TRỌNG!)

Màn hình "Configure Project" hiện ra:

**A. Framework Preset:**
- Chọn: **"Other"** hoặc **"None"**

**B. Root Directory:** ← **ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT!**
- Mặc định: `./` (SAI!)
- Click nút **"Edit"** 
- Chọn folder: **`vercel-deploy`** (ĐÚNG!)
- Click **"Continue"**

**C. Build Settings:**
- Build Command: **Để trống**
- Output Directory: **Để trống**
- Install Command: **Để trống**

**D. Environment Variables:**
- **Không cần** (để trống)

### Bước 5: Deploy

1. Click nút **"Deploy"** (màu xanh, to to)
2. Đợi 1-2 phút
3. Xong!

## 🎉 SAU KHI DEPLOY THÀNH CÔNG

Bạn sẽ thấy:
```
✓ Deployment Ready
Your project is live at:
https://your-project-name.vercel.app
```

**Test ngay:**
1. Click vào link
2. Thấy giao diện "Tạo Link Thanh Toán MoMo"
3. Click nút "Tạo Link Thanh Toán"
4. Nếu thành công → Có link rút gọn hiện ra

## 🐛 TROUBLESHOOTING

### Vẫn bị 404?

**Kiểm tra:**
```bash
# Xem Root Directory đã đúng chưa
1. Vào Settings → General
2. Tìm "Root Directory"
3. Phải là: vercel-deploy
4. Nếu sai → Edit → Chọn lại → Save
5. Redeploy
```

### API không hoạt động?

**Kiểm tra:**
1. Vào tab **"Functions"** trên Vercel
2. Xem có 3 functions không:
   - `/api/payment`
   - `/api/shorten`
   - `/api/redirect`
3. Nếu không có → Root Directory sai → Fix lại

### Link rút gọn không hoạt động?

**Nguyên nhân:** 
- In-memory storage bị reset khi function restart
- Đây là giới hạn của free tier

**Giải pháp:**
- Dùng Vercel KV (database) - cần upgrade
- Hoặc chấp nhận link tạm thời

## 💡 TIPS

1. **Custom Domain:**
   - Settings → Domains
   - Add domain miễn phí

2. **Auto Deploy:**
   - Mỗi lần push code
   - Vercel tự động deploy

3. **Preview Deployments:**
   - Mỗi Pull Request
   - Có preview URL riêng

## 📞 CẦN TRỢ GIÚP?

Nếu vẫn gặp vấn đề:
1. Chụp ảnh màn hình lỗi
2. Kiểm tra logs: Deployments → Click vào deployment → View Function Logs
3. Đảm bảo Root Directory = `vercel-deploy`

---

**TÓM LẠI: ĐIỀU QUAN TRỌNG NHẤT LÀ CHỌN ROOT DIRECTORY = `vercel-deploy`**
