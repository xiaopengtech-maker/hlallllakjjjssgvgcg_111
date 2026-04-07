// Background Service Worker - Lắng nghe network request để bắt token

// Lắng nghe các request đến API Viettel để bắt token
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = details.url;
    
    // Bắt request đến getTokenByIsdn
    if (url.includes('apigami.viettel.vn') && url.includes('getTokenByIsdn')) {
      try {
        const urlObj = new URL(url);
        const lang  = urlObj.searchParams.get('lang');
        const token = urlObj.searchParams.get('token');
        const isdn  = urlObj.searchParams.get('isdn');
        
        if (token && isdn) {
          // Chuẩn hóa isdn: bỏ dấu + hoặc 84 ở đầu nếu có, chuyển về 0xxx
          let normalIsdn = isdn;
          if (isdn.startsWith('84')) {
            normalIsdn = '0' + isdn.slice(2);
          } else if (isdn.startsWith('+84')) {
            normalIsdn = '0' + isdn.slice(3);
          }
          
          const captured = { lang, token, isdn: normalIsdn, raw_isdn: isdn, captured_at: new Date().toISOString() };
          
          // Lưu vào storage
          chrome.storage.local.set({ viettel_captured: captured }, () => {
            console.log('[ViettelGrabber] Token captured:', captured);
          });
          
          // Gửi thông báo đến popup nếu đang mở
          chrome.runtime.sendMessage({ type: 'TOKEN_CAPTURED', data: captured }).catch(() => {});
        }
      } catch (e) {
        console.error('[ViettelGrabber] Parse error:', e);
      }
    }
  },
  { urls: ["https://apigami.viettel.vn/*"] }
);

// Lắng nghe message từ popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_CAPTURED') {
    chrome.storage.local.get(['viettel_captured'], (result) => {
      sendResponse({ data: result.viettel_captured || null });
    });
    return true; // async
  }
  
  if (msg.type === 'OPEN_VIETTEL') {
    chrome.tabs.create({ url: 'https://viettel.vn/vx/nap-tien-qua-tai-khoan-ngan-hang' });
    sendResponse({ ok: true });
  }
  
  if (msg.type === 'CLEAR_CAPTURED') {
    chrome.storage.local.remove(['viettel_captured'], () => {
      sendResponse({ ok: true });
    });
    return true;
  }
});
