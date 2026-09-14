/* Mochila Certa — página Grade Horária */

var MC_WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

function mcRenderGrade() {
  var root = document.getElementById('gradeRoot');
  var settings = mcGetSettings();
  var subjects = mcGetSubjects();
  var schedule = mcGetSchedule();
  var schoolDays = settings.schoolDays && settings.schoolDays.length ? settings.schoolDays : [1, 2, 3, 4, 5];
  var days = MC_WEEK_ORDER.filter(function (d) { return schoolDays.indexOf(d) !== -1; });

  if (!subjects.length) {
    root.innerHTML =
      '<div class="card empty-state"><span class="icon">📚</span><h2>Cadastre matérias primeiro</h2>' +
      '<p class="muted">Antes de montar a grade, adicione suas matérias na página Materiais.</p>' +
      '<p style="margin-top:14px;"><a class="btn btn-primary" href="materiais.html">Ir para Materiais</a></p></div>';
    return;
  }

  if (!days.length) {
    root.innerHTML =
      '<div class="card empty-state"><span class="icon">🗓️</span><h2>Nenhum dia de aula configurado</h2>' +
      '<p class="muted">Defina quais dias você tem aula em Configurações.</p>' +
      '<p style="margin-top:14px;"><a class="btn btn-primary" href="config.html">Ir para Configurações</a></p></div>';
    return;
  }

  var html = '<div class="day-columns">';
  days.forEach(function (day) {
    var dayKey = String(day);
    var subjectIds = schedule[dayKey] || [];
    html += '<div class="day-column">';
    html += '<h3>' + MC_DAY_NAMES[day].replace('-feira', '') + '</h3>';

    if (!subjectIds.length) {
      html += '<p class="muted small">Nenhuma aula ainda.</p>';
    }

    subjectIds.forEach(function (subjectId, idx) {
      var subject = mcGetSubjectById(subjectId);
      if (!subject) return;
      html += '<div class="day-slot">';
      html += '<span class="color-dot" style="background:' + subject.color + '"></span>';
      html += '<span class="slot-name">' + mcEscapeHtml(subject.name) + '</span>';
      html += '<div class="day-slot-actions">';
      html += '<button type="button" class="btn-icon" data-action="up" data-day="' + day + '" data-index="' + idx + '"' + (idx === 0 ? ' disabled' : '') + ' aria-label="Mover para cima">▲</button>';
      html += '<button type="button" class="btn-icon" data-action="down" data-day="' + day + '" data-index="' + idx + '"' + (idx === subjectIds.length - 1 ? ' disabled' : '') + ' aria-label="Mover para baixo">▼</button>';
      html += '<button type="button" class="btn-icon" data-action="remove" data-day="' + day + '" data-index="' + idx + '" aria-label="Remover matéria deste dia">✕</button>';
      html += '</div>';
      html += '</div>';
    });

    html += '<div class="day-add">';
    html += '<select data-day-select="' + day + '" aria-label="Adicionar matéria em ' + MC_DAY_NAMES[day] + '">';
    html += '<option value="">+ adicionar matéria</option>';
    subjects.forEach(function (s) {
      html += '<option value="' + s.id + '">' + mcEscapeHtml(s.name) + '</option>';
    });
    html += '</select>';
    html += '</div>';

    html += '</div>';
  });
  html += '</div>';

  root.innerHTML = html;

  root.querySelectorAll('button[data-action]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var day = btn.getAttribute('data-day');
      var index = parseInt(btn.getAttribute('data-index'), 10);
      var action = btn.getAttribute('data-action');
      var sch = mcGetSchedule();
      var list = sch[day] || [];

      if (action === 'remove') {
        list.splice(index, 1);
      } else if (action === 'up' && index > 0) {
        var tmp = list[index - 1];
        list[index - 1] = list[index];
        list[index] = tmp;
      } else if (action === 'down' && index < list.length - 1) {
        var tmp2 = list[index + 1];
        list[index + 1] = list[index];
        list[index] = tmp2;
      }

      sch[day] = list;
      mcSaveSchedule(sch);
      mcRenderGrade();
    });
  });

  root.querySelectorAll('select[data-day-select]').forEach(function (select) {
    select.addEventListener('change', function () {
      var day = select.getAttribute('data-day-select');
      var subjectId = select.value;
      if (!subjectId) return;
      var sch = mcGetSchedule();
      if (!sch[day]) sch[day] = [];
      sch[day].push(subjectId);
      mcSaveSchedule(sch);
      mcToast('Matéria adicionada ao dia');
      mcRenderGrade();
    });
  });
}

document.addEventListener('DOMContentLoaded', mcRenderGrade);
