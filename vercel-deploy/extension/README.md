# Viettel Token Grabber - Chrome Extension

## Cách cài đặt

1. Mở Chrome → vào `chrome://extensions/`
2. Bật **Developer mode** (góc trên phải)
3. Nhấn **Load unpacked** → chọn thư mục `extension`
4. Extension xuất hiện trên thanh công cụ

## Cách dùng

### Tự động bắt token
1. Nhấn icon extension → **🌐 Mở trang Viettel**
2. Đăng nhập tài khoản Viettel của bạn
3. Vào mục **Nạp tiền qua tài khoản ngân hàng**
4. Trang tải xong → Extension **tự động bắt token** (hiển thị trong popup)
5. Nhấn **⬆️ Áp dụng token vừa bắt** → điền vào form
6. Nhấn **💾 Lưu cấu hình**

### Cấu hình Vercel (khuyến nghị)
Vào Vercel Dashboard → Project → Settings → Environment Variables, thêm:
- `VIETTEL_ISDN` = số điện thoại (VD: `0866793764`)
- `VIETTEL_TOKEN` = token vừa lấy được
- `VIETTEL_LANG` = `vi`
- `VIETTEL_PAY_CODE` = `topup_web`

### Sử dụng không cần Vercel env vars
Trong popup, nhập URL API và nhấn **📤 Gửi config lên API** để gửi token qua request body.

## Khi token hết hạn (die)
1. Mở popup → **🌐 Mở trang Viettel**
2. Đăng nhập lại và vào trang nạp tiền
3. Extension bắt token mới tự động
4. Nhấn **⬆️ Áp dụng** → **💾 Lưu** → cập nhật Vercel env vars
