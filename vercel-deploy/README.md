# 🚀 Deploy Lên Vercel - Miễn Phí Vĩnh Viễn

Web application tạo link thanh toán MoMo từ Viettel API, deploy miễn phí lên Vercel.

## ✨ Tính năng

- ✅ Tạo link thanh toán MoMo tự động
- ✅ **Rút gọn link tự động (không qua bên thứ 3)**
- ✅ Hiển thị 3 loại link (rút gọn, gốc, deeplink)
- ✅ Copy nhanh từng link
- ✅ Giao diện đẹp, responsive
- ✅ **Không cần treo máy 24/7**
- ✅ **Hệ thống rút gọn link riêng**

## 🚀 Cách Deploy Lên Vercel

### Phương án 1: Deploy qua Vercel CLI (Nhanh)

```bash
# 1. Cài Vercel CLI
npm install -g vercel

# 2. Di chuyển vào folder này
cd vercel-deploy

# 3. Login Vercel
vercel login

# 4. Deploy
vercel

# 5. Deploy production (sau khi test OK)
vercel --prod
```

### Phương án 2: Deploy qua Vercel Web (Dễ)

1. **Push code lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy trên Vercel:**
   - Truy cập: https://vercel.com
   - Đăng nhập bằng GitHub
   - Click "New Project"
   - Import repository của bạn
   - Root Directory: chọn `vercel-deploy`
   - Click "Deploy"

3. **Xong!** Website sẽ có domain: `your-project.vercel.app`

## 📁 Cấu trúc folder

```
vercel-deploy/
├── api/
│   └── payment.js          # Serverless Function xử lý API
├── index.html              # Giao diện chính
├── vercel.json            # Cấu hình Vercel
├── .gitignore            # Git ignore
└── README.md             # File này
```

## 🎯 Cách sử dụng sau khi deploy

1. Truy cập domain Vercel của bạn (vd: `your-project.vercel.app`)
2. Click nút "Tạo Link Thanh Toán"
3. Đợi vài giây
4. Copy link rút gọn để gửi cho người khác

## ⚙️ Cấu hình (Tùy chọn)

Để thay đổi token hoặc số điện thoại, sửa file `api/payment.js`:

```javascript
const apiUrl = 'https://apigami.viettel.vn/mvt-api/myviettel.php/momo/createToken?lang=vi&pay_code=topup_web&token=YOUR_TOKEN&isdn=YOUR_PHONE';
```

Sau đó deploy lại:
```bash
vercel --prod
```

## 💰 Chi phí

**MIỄN PHÍ VĨNH VIỄN!**

Vercel Free tier bao gồm:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/tháng
- ✅ Serverless Functions
- ✅ HTTPS miễn phí
- ✅ Custom domain
- ✅ Không giới hạn projects

## 🔧 Troubleshooting

### Lỗi khi deploy
```bash
# Xóa cache và deploy lại
rm -rf .vercel
vercel --prod
```

### API không hoạt động
- Kiểm tra logs trên Vercel Dashboard
- Vào Functions → Xem logs của `payment.js`

### Thay đổi code
```bash
# Sau khi sửa code, deploy lại
vercel --prod
```

## 📱 Demo

Sau khi deploy thành công, bạn sẽ có:
- Domain: `https://your-project.vercel.app`
- HTTPS tự động
- Tốc độ nhanh (CDN toàn cầu)

## 🌟 Ưu điểm Vercel

1. **Miễn phí vĩnh viễn** - Không giới hạn
2. **Không cần treo máy** - Serverless
3. **Tốc độ nhanh** - CDN toàn cầu
4. **HTTPS miễn phí** - Tự động
5. **Auto deploy** - Push code là deploy
6. **Không sleep** - Khác Render/Railway

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Xem logs trên Vercel Dashboard
2. Kiểm tra console log trong browser (F12)
3. Đọc docs: https://vercel.com/docs

## 📄 License

MIT License - Free to use

---

**Made with ❤️ - Deploy và dùng miễn phí vĩnh viễn!**
