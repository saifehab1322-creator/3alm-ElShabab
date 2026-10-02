/* =========================================================
   script.js — 3ALM ELSHABAB  (v3.0 — Full Featured)
   ========================================================= */

/* ─────────────────────────────────
   🔐 REGISTER
───────────────────────────────── */
function register(username, email, password, confirm) {
  if (!username || !email || !password || !confirm) { alert('Please fill all fields'); return; }
  if (password !== confirm) { alert('Passwords do not match'); return; }
  let users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.find(u => u.username === username)) { alert('Username already taken'); return; }
  users.push({ username, email, password });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', username);
  localStorage.setItem('userRole', 'user');
  updateNavbar();
  window.location.href = 'index.html';
}

/* ─────────────────────────────────
   🔐 LOGIN
───────────────────────────────── */
function login(username, password) {
  if (!username || !password) { alert('Enter username and password'); return; }
  let users = JSON.parse(localStorage.getItem('users')) || [];
  let found = users.find(u => u.username === username && u.password === password);
  if (!found) { alert('Wrong username or password'); return; }
  localStorage.setItem('currentUser', username);
  localStorage.setItem('userRole', 'user');
  updateNavbar();
  window.location.href = 'index.html';
}

/* ─────────────────────────────────
   🚪 LOGOUT
───────────────────────────────── */
function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userRole');
  updateNavbar();
  window.location.href = 'login.html';
}

/* ─────────────────────────────────
   🔐 CHECK AUTH
───────────────────────────────── */
function checkAuth() {
  let user = localStorage.getItem('currentUser');
  if (!user) { showAuthRequiredModal(); return false; }
  return true;
}

function ensureBootstrapModalAssets() {
  return new Promise(function(resolve) {
    if (window.bootstrap) { resolve(); return; }

    var cssUrl = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    if (!document.querySelector('link[href="' + cssUrl + '"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      var styleLink = document.querySelector('link[href$="style.css"]');
      if (styleLink && styleLink.parentNode) styleLink.parentNode.insertBefore(link, styleLink);
      else document.head.appendChild(link);
    }

    var scriptUrl = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
    var existingScript = document.querySelector('script[src="' + scriptUrl + '"]');
    if (existingScript) {
      if (window.bootstrap) { resolve(); return; }
      existingScript.addEventListener('load', function() { resolve(); });
      existingScript.addEventListener('error', function() { resolve(); });
      return;
    }

    var script = document.createElement('script');
    script.src = scriptUrl;
    script.defer = true;
    script.onload = function() { resolve(); };
    script.onerror = function() { resolve(); };
    (document.body || document.head).appendChild(script);
  });
}

function ensureAuthRequiredModalMarkup() {
  if (document.getElementById('authRequiredModal')) return;
  document.body.insertAdjacentHTML('beforeend',
    '<div class="modal fade" id="authRequiredModal" tabindex="-1" aria-labelledby="authRequiredModalLabel" aria-hidden="true">'
    + '<div class="modal-dialog modal-dialog-centered modal-sm">'
    + '<div class="modal-content bg-dark text-white border-0 shadow-lg" style="background:rgba(10,12,14,0.96); z-index:99999;">'
    + '<div class="modal-header border-0 pb-0">'
    + '<div class="d-flex align-items-center gap-3">'
    + '<div class="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style="width:54px; height:54px; font-size:1.4rem;">🔒</div>'
    + '<div>'
    + '<h5 class="modal-title text-white" id="authRequiredModalLabel">يجب تسجيل الدخول أولاً</h5>'
    + '<p class="mb-0 text-secondary small">لإتمام عملية الحجز والاستفادة من جميع خدمات الموقع، يرجى تسجيل الدخول أو إنشاء حساب جديد.</p>'
    + '</div>'
    + '</div>'
    + '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>'
    + '</div>'
    + '<div class="modal-body pt-3">'
    + '<div class="d-grid gap-2">'
    + '<button type="button" class="btn btn-success btn-lg" onclick="window.location.href=\'login.html\'">تسجيل الدخول</button>'
    + '<button type="button" class="btn btn-outline-light btn-lg" onclick="window.location.href=\'register.html\'">إنشاء حساب</button>'
    + '<button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">إغلاق</button>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</div>'
  );
}

function showAuthRequiredModal() {
  ensureAuthRequiredModalMarkup();
  ensureBootstrapModalAssets().then(function() {
    var modalEl = document.getElementById('authRequiredModal');
    if (!modalEl) return;
    var modal = bootstrap.Modal.getOrCreateInstance(modalEl, { backdrop: 'static', keyboard: true });
    modal.show();
  });
}

function goToBooking() { if (!checkAuth()) return; window.location.href = 'booking.html'; }
function goToProfile()  { if (!checkAuth()) return; window.location.href = 'profile.html'; }

/* ─────────────────────────────────
   🧠 UPDATE NAVBAR
───────────────────────────────── */
function updateNavbar() {
  let user = localStorage.getItem('currentUser');
  document.querySelectorAll('.nav-links a').forEach(a => {
    let text = a.textContent.trim().toLowerCase();
    if (text === 'login' || text === 'register') a.parentElement.style.display = user ? 'none' : '';
    if (text === 'logout') a.parentElement.style.display = user ? '' : 'none';
    if (text === 'profile' || text === 'my bookings' || text === 'my booking') a.parentElement.style.display = user ? '' : 'none';
  });
}

/* ─────────────────────────────────
   🔔 TOAST
───────────────────────────────── */
function showToast(message, duration) {
  duration = duration || 3000;
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(function(){ toast.classList.remove('show'); }, duration);
}

/* ─────────────────────────────────
   📋 MODAL CONTROLS
───────────────────────────────── */
function openModal(id) {
  var modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  var modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  modal.querySelectorAll('input').forEach(function(i){ i.value = ''; });
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('open');
});

/* ─────────────────────────────────
   🔑 CHANGE PASSWORD
───────────────────────────────── */
function submitPassword() {
  var oldPass     = document.getElementById('old-pass') ? document.getElementById('old-pass').value.trim() : '';
  var newPass     = document.getElementById('new-pass') ? document.getElementById('new-pass').value.trim() : '';
  var confirmPass = document.getElementById('confirm-pass') ? document.getElementById('confirm-pass').value.trim() : '';
  if (!oldPass || !newPass || !confirmPass) { showToast('من فضلك أكمل جميع الحقول'); return; }
  if (newPass.length < 6) { showToast('كلمة السر يجب أن تكون 6 أحرف على الأقل'); return; }
  if (newPass !== confirmPass) { showToast('كلمتا السر غير متطابقتين'); return; }
  var currentUser = localStorage.getItem('currentUser');
  var users = JSON.parse(localStorage.getItem('users')) || [];
  var idx = users.findIndex(function(u){ return u.username === currentUser; });
  if (idx !== -1) {
    if (users[idx].password !== oldPass) { showToast('كلمة السر الحالية غير صحيحة'); return; }
    users[idx].password = newPass;
    localStorage.setItem('users', JSON.stringify(users));
  }
  closeModal('modal-password');
  showToast('تم تغيير كلمة السر بنجاح');
}

/* ─────────────────────────────────
   📞 EDIT PHONE
───────────────────────────────── */
function submitPhone() {
  var phone = document.getElementById('new-phone') ? document.getElementById('new-phone').value.trim() : '';
  if (!phone) { showToast('من فضلك أدخل رقم الهاتف'); return; }
  if (!/^[0-9+\s\-]{7,15}$/.test(phone)) { showToast('رقم الهاتف غير صحيح'); return; }
  var currentUser = localStorage.getItem('currentUser');
  var users = JSON.parse(localStorage.getItem('users')) || [];
  var idx = users.findIndex(function(u){ return u.username === currentUser; });
  if (idx !== -1) {
    users[idx].phone = phone;
    localStorage.setItem('users', JSON.stringify(users));
    var phoneDisplay = document.getElementById('profile-phone-display');
    if (phoneDisplay) phoneDisplay.textContent = phone;
  }
  closeModal('modal-phone');
  showToast('تم تحديث رقم الهاتف بنجاح');
}

/* ─────────────────────────────────
   🚪 CONFIRM LOGOUT
───────────────────────────────── */
function confirmLogout() {
  closeModal('modal-logout');
  showToast('تم تسجيل الخروج بنجاح، إلى اللقاء!');
  setTimeout(function(){
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
  }, 1500);
}

/* ─────────────────────────────────
   ❌ CANCEL BOOKING
───────────────────────────────── */
function cancelBooking(btn) {
  var row = btn.closest('tr');
  if (!row) {
    var card = btn.closest('.b-card');
    if (card && confirm('Cancel this booking?')) {
      card.style.opacity = '0';
      card.style.transform = 'translateX(20px)';
      card.style.transition = 'all 0.3s ease';
      setTimeout(function(){ card.remove(); checkEmpty(); }, 300);
    }
    return;
  }
  var facilityName = row.querySelector('td strong') ? row.querySelector('td strong').textContent : 'الحجز';
  if (confirm('هل أنت متأكد من إلغاء حجز "' + facilityName + '"؟')) {
    var statusCell = row.querySelector('.status');
    if (statusCell) { statusCell.textContent = 'ملغي'; statusCell.className = 'status pending'; }
    row.setAttribute('data-status', 'cancelled');
    btn.remove();
    showToast('تم إلغاء حجز ' + facilityName + ' بنجاح');
    updateBookingCount();
  }
}

/* ─────────────────────────────────
   🔍 FILTER BOOKINGS
───────────────────────────────── */
function filterBookings(filter, clickedBtn) {
  document.querySelectorAll('.filter-tab').forEach(function(b){ b.classList.remove('active-tab'); });
  if (clickedBtn) clickedBtn.classList.add('active-tab');
  document.querySelectorAll('#bookings-body tr').forEach(function(row){
    row.style.display = (filter === 'all' || row.getAttribute('data-status') === filter) ? '' : 'none';
  });
}

function filterTab(el, status) {
  document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
  el.classList.add('active');
  var cards = document.querySelectorAll('.b-card');
  var visible = 0;
  cards.forEach(function(card){
    var show = status === 'all' || card.dataset.status === status;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  var empty = document.getElementById('emptyState');
  if (empty) empty.style.display = visible === 0 ? 'flex' : 'none';
}

function checkEmpty() {
  var cards = document.querySelectorAll('.b-card');
  var empty = document.getElementById('emptyState');
  if (empty) empty.style.display = cards.length === 0 ? 'flex' : 'none';
}

/* ─────────────────────────────────
   📊 UPDATE STATS
───────────────────────────────── */
function updateBookingCount() {
  var rows      = document.querySelectorAll('#bookings-body tr');
  var confirmed = document.querySelectorAll('#bookings-body tr[data-status="confirmed"]').length;
  var cancelled = document.querySelectorAll('#bookings-body tr[data-status="cancelled"]').length;
  var total     = rows.length;
  var countEl   = document.getElementById('bookings-count');
  if (countEl) countEl.textContent = total + ' حجوزات';
  document.querySelectorAll('[data-stat]').forEach(function(el){
    if (el.dataset.stat === 'total')     el.textContent = total;
    if (el.dataset.stat === 'confirmed') el.textContent = confirmed;
    if (el.dataset.stat === 'cancelled') el.textContent = cancelled;
  });
}

/* ─────────────────────────────────
   🖼️ PROFILE IMAGE UPLOAD
───────────────────────────────── */
function initProfileImage() {
  var img     = document.getElementById('profile-avatar');
  var trigger = document.getElementById('avatar-upload-trigger');
  var input   = document.getElementById('avatar-input');
  if (!img || !trigger || !input) return;
  var saved = localStorage.getItem('profileImage');
  if (saved) img.src = saved;
  trigger.addEventListener('click', function(){ input.click(); });
  input.addEventListener('change', function(){
    var file = this.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('الملف المختار ليس صورة'); return; }
    var reader = new FileReader();
    reader.onload = function(e){
      img.src = e.target.result;
      localStorage.setItem('profileImage', e.target.result);
      showToast('تم تحديث الصورة الشخصية');
    };
    reader.readAsDataURL(file);
  });
}

/* ─────────────────────────────────
   👤 LOAD PROFILE DATA
───────────────────────────────── */
function loadProfileData() {
  var currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;
  var users = JSON.parse(localStorage.getItem('users')) || [];
  var user  = users.find(function(u){ return u.username === currentUser; });

  var nameEl  = document.getElementById('profile-display-name');
  var userEl  = document.getElementById('profile-username');
  var emailEl = document.getElementById('profile-email-display');
  var phoneEl = document.getElementById('profile-phone-display');

  if (nameEl) nameEl.textContent  = user && user.fname ? (user.fname + ' ' + (user.lname||'')).trim() : currentUser;
  if (userEl) userEl.textContent  = '@' + currentUser;
  if (emailEl) emailEl.textContent = user && user.email ? user.email : '—';
  if (phoneEl) phoneEl.textContent = user && user.phone ? user.phone : '—';

  var savedImage = localStorage.getItem('profileImage');
  var avatarEl   = document.getElementById('profile-avatar');
  if (avatarEl && savedImage) avatarEl.src = savedImage;
}

/* ─────────────────────────────────
   🏟️ STADIUM MODAL DATA
───────────────────────────── */
var stadiumsData = [
  { id:'A', name:'Stadium A — Elite',    emoji:'🏟️', location:'Mansoura, Gaish Street',    type:'Stadium 11', players:'22', price:100,  rating:4.9, status:'available', features:['Floodlights','Parking','Showers'],                bg:'linear-gradient(135deg,#0a1a0d,#0d2a14)', description:'ملعب كبير مضاء بالكامل مع مواقف سيارات وغرف تغيير ملابس. مناسب لمباريات الـ 11 والبطولات.', hours:'6:00ص — 12:00م', size:'105 × 68 م', surface:'عشب صناعي' },
  { id:'B', name:'Stadium B — 5-a-Side', emoji:'⚽',  location:'Mansoura, Gomhoria Street', type:'5-a-Side',   players:'10', price:150,  rating:4.7, status:'available', features:['Floodlights','Café'],                            bg:'linear-gradient(135deg,#0d1a10,#162d1a)', description:'ملعب خماسي مريح مع كافيه مجاور. الخيار الأمثل للمباريات السريعة مع الأصدقاء.',          hours:'8:00ص — 2:00ص', size:'40 × 25 م',  surface:'عشب صناعي' },
  { id:'C', name:'Stadium C — Premium',  emoji:'🥅',  location:'Mansoura, City Center',     type:'Stadium 11', players:'22', price:200,  rating:5.0, status:'busy',      features:['Floodlights','Parking','Showers','VIP Lounge'], bg:'linear-gradient(135deg,#101a0d,#1a2e12)', description:'أفضل ملعب في المنصورة — VIP Lounge، عشب ممتاز، وإضاءة احترافية.',                         hours:'7:00ص — 1:00ص', size:'105 × 68 م', surface:'عشب طبيعي' },
  { id:'D', name:'Stadium D — Indoor',   emoji:'🏆',  location:'Mansoura, Sports Complex',  type:'Indoor',     players:'10', price:250,  rating:4.5, status:'available', features:['Air Conditioning','Café'],                       bg:'linear-gradient(135deg,#0a150c,#0f2214)', description:'ملعب مغطى بالكامل بتكييف مركزي — العب في كل الأحوال الجوية.',                              hours:'9:00ص — 11:00م', size:'40 × 25 م',  surface:'بارنية (parquet)' },
  { id:'E', name:'Night Arena',          emoji:'🌙',  location:'Mansoura, North District',  type:'7-a-Side',   players:'14', price:120,  rating:4.6, status:'available', features:['Floodlights','Night Rates'],                     bg:'linear-gradient(135deg,#0c1a0e,#142618)', description:'ملعب سبعي مضاء للليل مع أسعار مخفضة بعد الـ 10 مساءً.',                                   hours:'4:00م — 4:00ص', size:'65 × 45 م',  surface:'عشب صناعي' },
  { id:'F', name:'Special Force 90',     emoji:'⭐',  location:"Mansoura, Tala'at St.",      type:'Stadium 11', players:'22', price:180,  rating:4.8, status:'full',      features:['Turf Grass','Parking','Showers'],                bg:'linear-gradient(135deg,#0d1f10,#163020)', description:'أقدم وأشهر ملعب في المنصورة. عشب طبيعي فاخر وتاريخ طويل من المباريات الأسطورية.',       hours:'6:00ص — 12:00م', size:'105 × 68 م', surface:'عشب طبيعي' }
];

/* ─────────────────────────────────
   🎲 SIDEBAR ACTIVE STATE
───────────────────────────────── */
function setActiveSidebarItem() {
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item a').forEach(function(a){
    if ((a.getAttribute('href') || '') === currentPage) {
      var item = a.closest('.nav-item');
      if (item) item.classList.add('active');
    }
  });
}

/* ─────────────────────────────────
   🔍 SEARCH (index.html)
───────────────────────────────── */
function search() {
  var dateEl = document.getElementById('date');
  var timeEl = document.getElementById('time');
  var date = dateEl ? dateEl.value : '';
  var time = timeEl ? timeEl.value : '';
  if (!date || !time) { showToast('من فضلك اختر التاريخ والوقت'); return; }
  window.location.href = 'stadium.html';
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToSection(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }

/* ─────────────────────────────────
   🚀 AUTO RUN ON LOAD
───────────────────────────────── */
window.addEventListener('DOMContentLoaded', function(){
  updateNavbar();
  setActiveSidebarItem();
  loadProfileData();
  initProfileImage();
  updateBookingCount();
});

/* ─────────────────────────────────
   🌙 THEME TOGGLE (Dark / Light)
───────────────────────────────── */
function initTheme() {
  var saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'light') document.body.classList.add('light-mode');
  updateThemeBtn();
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  var isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  updateThemeBtn();
}

function updateThemeBtn() {
  var isLight = document.body.classList.contains('light-mode');
  var icons = document.querySelectorAll('.theme-toggle-icon');
  icons.forEach(function(i){ i.textContent = isLight ? '☀️' : '🌙'; });
  // Let i18n handle labels if available
  if (typeof applyLang === 'function') {
    var lang = typeof getLang === 'function' ? getLang() : 'ar';
    var TRANS = typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS[lang] : {};
    var labels = document.querySelectorAll('.theme-toggle-text');
    labels.forEach(function(l){
      l.textContent = isLight
        ? (TRANS['الوضع الليلي'] || (lang==='ar' ? 'الوضع الليلي' : 'Dark Mode'))
        : (TRANS['الوضع النهاري'] || (lang==='ar' ? 'الوضع النهاري' : 'Light Mode'));
    });
  }
}

window.addEventListener('DOMContentLoaded', function(){
  initTheme();
  updateNavbar();
  setActiveSidebarItem();
  loadProfileData();
  initProfileImage();
  updateBookingCount();
});
