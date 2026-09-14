/* Mochila Certa — helpers compartilhados entre páginas */

function mcApplyTheme() {
  var settings = mcGetSettings();
  document.documentElement.setAttribute('data-theme', settings.theme === 'dark' ? 'dark' : 'light');
}

function mcPad2(n) {
  return n < 10 ? '0' + n : '' + n;
}

function mcToISODate(date) {
  return date.getFullYear() + '-' + mcPad2(date.getMonth() + 1) + '-' + mcPad2(date.getDate());
}

function mcFormatHuman(date) {
  var dayName = MC_DAY_NAMES[date.getDay()];
  return dayName + ', ' + mcPad2(date.getDate()) + '/' + mcPad2(date.getMonth() + 1);
}

function mcTomorrow() {
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  return d;
}

/* Encontra o próximo dia (a partir de startDate, inclusive) que está marcado como dia de aula */
function mcNextSchoolDay(startDate, schoolDays) {
  var d = new Date(startDate);
  for (var i = 0; i < 8; i++) {
    if (schoolDays.indexOf(d.getDay()) !== -1) return d;
    d.setDate(d.getDate() + 1);
  }
  return null;
}

function mcToast(message) {
  var el = document.getElementById('mcToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mcToast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.remove('toast-show');
  void el.offsetWidth;
  el.classList.add('toast-show');
  clearTimeout(el._mcTimer);
  el._mcTimer = setTimeout(function () { el.classList.remove('toast-show'); }, 2600);
}

function mcEscapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function mcMarkActiveNav() {
  var page = document.body.getAttribute('data-page');
  document.querySelectorAll('.tabbar a').forEach(function (a) {
    if (a.getAttribute('data-nav') === page) {
      a.setAttribute('aria-current', 'page');
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  mcSeedIfEmpty();
  mcPruneOldChecklists();
  mcApplyTheme();
  mcMarkActiveNav();
});
