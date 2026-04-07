// ===================== STORAGE KEYS =====================
const KEYS = {
  captured: 'viettel_captured',
  config:   'viettel_config',
  apiUrl:   'viettel_api_url'
};

// ===================== HELPERS =====================
function $(id) { return document.getElementById(id); }

function showAlert(msg, type = 'ok') {
  const box = $('alertBox');
  box.textContent = msg;
  box.className = `alert show alert-${type}`;
  setTimeout(() => { box.className = 'alert'; }, 3500);
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('vi-VN');
}

function maskToken(token) {
  if (!token || token.length < 12) return token;
  return token.substring(0, 8) + '...' + token.slice(-6);
}

// ===================== RENDER CAPTURED =====================
function renderCaptured(data) {
  const box = $('capturedBox');
  const applyBtn = $('btnApplyCaptured');

  if (!data) {
    box.innerHTML = `
      <div class="empty-box">
        <span class="icon">🔍</span>
        Chưa có token.<br>Mở trang Viettel và nạp tiền để bắt.
      </div>`;
    applyBtn.disabled = true;
    return;
  }

  box.innerHTML = `
    <div class="captured-box">
      <div class="row">
        <span class="key">📱 isdn</span>
        <span class="val">${data.isdn}</span>
      </div>
      <div class="row">
        <span class="key">🔑 token</span>
        <span class="val" title="${data.token}">${maskToken(data.token)}</span>
      </div>
      <div class="row">
        <span class="key">🌐 lang</span>
        <span class="val">${data.lang}</span>
      </div>
    </div>
    <p class="time-hint">⏰ Bắt lúc: ${formatDate(data.captured_at)}</p>
  `;
  applyBtn.disabled = false;
}

// ===================== LOAD SAVED CONFIG =====================
function loadConfig() {
  chrome.storage.local.get([KEYS.config, KEYS.apiUrl], (res) => {
    const cfg = res[KEYS.config] || {};
    if (cfg.isdn)     $('cfgIsdn').value    = cfg.isdn;
    if (cfg.token)    $('cfgToken').value   = cfg.token;
    if (cfg.lang)     $('cfgLang').value    = cfg.lang    || 'vi';
    if (cfg.pay_code) $('cfgPayCode').value = cfg.pay_code || 'topup_web';
    if (res[KEYS.apiUrl]) $('cfgApiUrl').value = res[KEYS.apiUrl];
  });
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  // Load captured
  chrome.runtime.sendMessage({ type: 'GET_CAPTURED' }, (res) => {
    renderCaptured(res?.data || null);
  });

  // Load saved config
  loadConfig();

  // === OPEN VIETTEL ===
  $('btnOpenViettel').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'OPEN_VIETTEL' });
    window.close();
  });

  // === CLEAR CAPTURED ===
  $('btnClearCaptured').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'CLEAR_CAPTURED' }, () => {
      renderCaptured(null);
      showAlert('Đã xóa token đã bắt.', 'ok');
    });
  });

  // === APPLY CAPTURED → FORM ===
  $('btnApplyCaptured').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'GET_CAPTURED' }, (res) => {
      const d = res?.data;
      if (!d) return showAlert('Không có token để áp dụng.', 'err');
      $('cfgIsdn').value    = d.isdn;
      $('cfgToken').value   = d.token;
      $('cfgLang').value    = d.lang || 'vi';
      $('cfgPayCode').value = 'topup_web';
      showAlert('✅ Đã điền token vào form. Nhấn Lưu để lưu lại.', 'ok');
    });
  });

  // === SAVE CONFIG ===
  $('btnSaveConfig').addEventListener('click', () => {
    const config = {
      isdn:     $('cfgIsdn').value.trim(),
      token:    $('cfgToken').value.trim(),
      lang:     $('cfgLang').value.trim()    || 'vi',
      pay_code: $('cfgPayCode').value.trim() || 'topup_web'
    };

    if (!config.isdn || !config.token) {
      return showAlert('Vui lòng nhập đủ số điện thoại và token!', 'err');
    }

    const apiUrl = $('cfgApiUrl').value.trim();

    chrome.storage.local.set({ [KEYS.config]: config, [KEYS.apiUrl]: apiUrl }, () => {
      showAlert('✅ Đã lưu cấu hình thành công!', 'ok');
      // Mark fields success
      ['cfgIsdn','cfgToken'].forEach(id => {
        $(id).classList.add('success');
        setTimeout(() => $(id).classList.remove('success'), 2000);
      });
    });
  });

  // === TEST API ===
  $('btnTestApi').addEventListener('click', async () => {
    const url = $('cfgApiUrl').value.trim();
    if (!url) return showAlert('Nhập URL API trước!', 'err');
    try {
      const r = await fetch(url + '?action=get_config');
      const d = await r.json();
      showAlert(`✅ API OK! isdn env: ${d.isdn || '(chưa set)'}, has_token: ${d.has_token}`, 'ok');
    } catch(e) {
      showAlert('❌ Không kết nối được API: ' + e.message, 'err');
    }
  });

  // === SEND TO API ===
  $('btnSendToApi').addEventListener('click', async () => {
    const url = $('cfgApiUrl').value.trim();
    if (!url) return showAlert('Nhập URL API trước!', 'err');

    const config = {
      isdn:     $('cfgIsdn').value.trim(),
      token:    $('cfgToken').value.trim(),
      lang:     $('cfgLang').value.trim()    || 'vi',
      pay_code: $('cfgPayCode').value.trim() || 'topup_web'
    };
    if (!config.isdn || !config.token) {
      return showAlert('Nhập đủ isdn và token trước!', 'err');
    }

    const btn = $('btnSendToApi');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Đang gửi...';

    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const d = await r.json();
      if (d.errorCode === 0 || d.payUrl || d.qrCodeUrl) {
        showAlert('✅ Gửi thành công! API hoạt động tốt.', 'ok');
      } else {
        showAlert('⚠️ API phản hồi: ' + (d.message || JSON.stringify(d)), 'err');
      }
    } catch(e) {
      showAlert('❌ Lỗi: ' + e.message, 'err');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '📤 Gửi config lên API (qua request)';
    }
  });

  // Listen for real-time token capture from background
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'TOKEN_CAPTURED') {
      renderCaptured(msg.data);
      showAlert('🎉 Đã bắt được token mới!', 'ok');
    }
  });
});
