/* Mochila Certa — página Dashboard */

function mcBuildChecklistGroups(weekdayNumber) {
  var subjects = mcGetSubjects();
  var materials = mcGetMaterials();
  var schedule = mcGetSchedule();
  var subjectIds = schedule[String(weekdayNumber)] || [];

  var groups = [];
  var total = 0;

  var dailyMaterials = materials.filter(function (m) { return m.daily; });
  if (dailyMaterials.length) {
    groups.push({
      key: 'daily',
      title: 'Para o dia todo',
      color: null,
      items: dailyMaterials.map(function (m) {
        return { itemKey: 'daily:' + m.id, icon: m.icon || '🎒', label: m.name };
      }),
    });
    total += dailyMaterials.length;
  }

  subjectIds.forEach(function (subjectId) {
    var subject = mcGetSubjectById(subjectId);
    if (!subject) return;
    var items = (subject.materialIds || []).map(function (materialId) {
      var material = mcGetMaterialById(materialId);
      if (!material) return null;
      return { itemKey: 'subj:' + subject.id + ':' + material.id, icon: material.icon || '📦', label: material.name };
    }).filter(Boolean);

    groups.push({ key: 'subj:' + subject.id, title: subject.name, color: subject.color, items: items });
    total += items.length;
  });

  return { groups: groups, total: total, subjectIds: subjectIds };
}

function mcRenderDashboard() {
  var root = document.getElementById('dashboardRoot');
  var settings = mcGetSettings();
  var today = new Date();
  var tomorrow = mcTomorrow();
  var schoolDays = settings.schoolDays && settings.schoolDays.length ? settings.schoolDays : [1, 2, 3, 4, 5];
  var isSchoolDayTomorrow = schoolDays.indexOf(tomorrow.getDay()) !== -1;

  var html = '';
  html += '<div class="section">';
  html += '<h1>Olá, ' + mcEscapeHtml(settings.studentName || 'Estudante') + '! 👋</h1>';
  html += '<p class="muted">Hoje é ' + mcFormatHuman(today) + '</p>';
  html += '</div>';

  if (!isSchoolDayTomorrow) {
    var next = mcNextSchoolDay(tomorrow, schoolDays);
    html += '<div class="card empty-state">';
    html += '<span class="icon">🎉</span>';
    html += '<h2>Sem aulas amanhã!</h2>';
    if (next) {
      html += '<p class="muted">Sua próxima aula é ' + mcFormatHuman(next) + '. Aproveite para descansar.</p>';
    } else {
      html += '<p class="muted">Nenhum dia de aula está configurado ainda. Ajuste isso em <a href="config.html">Configurações</a>.</p>';
    }
    html += '</div>';
    root.innerHTML = html;
    return;
  }

  var dateKey = mcToISODate(tomorrow);
  var built = mcBuildChecklistGroups(tomorrow.getDay());
  var checklistState = mcGetChecklistState();
  var stateForDate = checklistState[dateKey] || {};

  if (built.total === 0) {
    html += '<div class="card empty-state">';
    html += '<span class="icon">🎒</span>';
    html += '<h2>Ainda não há materiais para amanhã</h2>';
    html += '<p class="muted">Cadastre suas matérias e materiais, depois monte a grade horária para ver o checklist aqui.</p>';
    html += '<p style="margin-top:14px;"><a class="btn btn-primary" href="materiais.html">Cadastrar materiais</a></p>';
    html += '</div>';
    root.innerHTML = html;
    return;
  }

  var checkedCount = 0;
  built.groups.forEach(function (g) {
    g.items.forEach(function (item) {
      if (stateForDate[item.itemKey]) checkedCount++;
    });
  });
  var percent = built.total ? Math.round((checkedCount / built.total) * 100) : 0;
  var allDone = checkedCount === built.total;

  html += '<div class="hero-card section">';
  html += '<h1>Mochila para amanhã</h1>';
  html += '<p class="muted">' + mcFormatHuman(tomorrow) + '</p>';
  html += '<div class="progress-track"><div class="progress-fill" style="width:' + percent + '%"></div></div>';
  html += '<p class="progress-label">' + checkedCount + ' de ' + built.total + ' itens prontos (' + percent + '%)</p>';
  if (allDone) {
    html += '<div class="banner-success" style="background:rgba(255,255,255,0.2);color:#fff;">✅ Tudo pronto! Sua mochila está completa para amanhã.</div>';
  }
  html += '</div>';

  html += '<div class="card section">';
  built.groups.forEach(function (group) {
    html += '<div class="subject-group">';
    html += '<div class="subject-group-head">';
    if (group.color) html += '<span class="color-dot" style="background:' + group.color + '"></span>';
    html += '<span>' + mcEscapeHtml(group.title) + '</span>';
    html += '</div>';
    group.items.forEach(function (item) {
      var checked = !!stateForDate[item.itemKey];
      html += '<label class="check-item' + (checked ? ' checked' : '') + '">';
      html += '<input type="checkbox" data-item-key="' + item.itemKey + '"' + (checked ? ' checked' : '') + ' />';
      html += '<span class="item-icon">' + item.icon + '</span>';
      html += '<span class="item-label">' + mcEscapeHtml(item.label) + '</span>';
      html += '</label>';
    });
    html += '</div>';
  });
  html += '</div>';

  root.innerHTML = html;

  root.querySelectorAll('input[type="checkbox"][data-item-key]').forEach(function (input) {
    input.addEventListener('change', function () {
      var state = mcGetChecklistState();
      if (!state[dateKey]) state[dateKey] = {};
      state[dateKey][input.getAttribute('data-item-key')] = input.checked;
      mcSaveChecklistState(state);
      mcRenderDashboard();
    });
  });
}

document.addEventListener('DOMContentLoaded', mcRenderDashboard);
