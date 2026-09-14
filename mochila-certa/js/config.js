/* Mochila Certa — página Configurações */

function mcRenderConfig() {
  var root = document.getElementById('configRoot');
  var settings = mcGetSettings();

  var html = '';

  html += '<div class="card section">';
  html += '<h2 class="small" style="margin-bottom:12px;">Perfil</h2>';
  html += '<div class="settings-group">';
  html += '<div class="form-row" style="margin-bottom:0;"><label for="studentName">Seu nome</label>';
  html += '<input type="text" id="studentName" value="' + mcEscapeHtml(settings.studentName) + '" maxlength="30" /></div>';
  html += '</div></div>';

  html += '<div class="card section">';
  html += '<h2 class="small" style="margin-bottom:4px;">Dias de aula</h2>';
  html += '<p class="muted small" style="margin-bottom:12px;">Usados para saber se amanhã tem aula e para montar a grade horária.</p>';
  html += '<div class="day-toggle-grid">';
  for (var d = 0; d <= 6; d++) {
    var checked = settings.schoolDays.indexOf(d) !== -1;
    html += '<label class="day-toggle">';
    html += '<input type="checkbox" data-day-toggle="' + d + '"' + (checked ? ' checked' : '') + ' aria-label="' + MC_DAY_NAMES[d] + '" />';
    html += '<span>' + MC_DAY_SHORT[d] + '</span>';
    html += '</label>';
  }
  html += '</div></div>';

  html += '<div class="card section">';
  html += '<h2 class="small" style="margin-bottom:12px;">Aparência</h2>';
  html += '<div class="theme-switch-row">';
  html += '<span>Tema escuro</span>';
  html += '<label class="switch"><input type="checkbox" id="themeToggle"' + (settings.theme === 'dark' ? ' checked' : '') + ' /><span class="switch-track"></span></label>';
  html += '</div></div>';

  html += '<div class="card section">';
  html += '<h2 class="small" style="margin-bottom:12px;">Dados</h2>';
  html += '<p class="muted small" style="margin-bottom:14px;">Seus dados ficam salvos apenas neste navegador.</p>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
  html += '<button type="button" id="btnExport" class="btn btn-ghost btn-sm">⬇️ Exportar dados</button>';
  html += '<button type="button" id="btnImport" class="btn btn-ghost btn-sm">⬆️ Importar dados</button>';
  html += '<button type="button" id="btnRestoreExample" class="btn btn-ghost btn-sm">✨ Restaurar exemplo</button>';
  html += '</div></div>';

  html += '<div class="card danger-zone">';
  html += '<h2 class="small" style="margin-bottom:8px;">Zona de risco</h2>';
  html += '<p class="muted small" style="margin-bottom:12px;">Isso apaga matérias, materiais, grade horária e checklists salvos.</p>';
  html += '<button type="button" id="btnClearAll" class="btn btn-danger btn-sm">Limpar todos os dados</button>';
  html += '</div>';

  root.innerHTML = html;
  mcWireConfigEvents();
}

function mcWireConfigEvents() {
  var root = document.getElementById('configRoot');

  var nameInput = document.getElementById('studentName');
  nameInput.addEventListener('change', function () {
    var settings = mcGetSettings();
    settings.studentName = nameInput.value.trim() || 'Estudante';
    mcSaveSettings(settings);
    mcToast('Nome atualizado');
  });

  root.querySelectorAll('input[data-day-toggle]').forEach(function (input) {
    input.addEventListener('change', function () {
      var day = parseInt(input.getAttribute('data-day-toggle'), 10);
      var settings = mcGetSettings();
      var idx = settings.schoolDays.indexOf(day);
      if (input.checked && idx === -1) settings.schoolDays.push(day);
      if (!input.checked && idx !== -1) settings.schoolDays.splice(idx, 1);
      settings.schoolDays.sort();
      mcSaveSettings(settings);
      mcToast('Dias de aula atualizados');
    });
  });

  document.getElementById('themeToggle').addEventListener('change', function (e) {
    var settings = mcGetSettings();
    settings.theme = e.target.checked ? 'dark' : 'light';
    mcSaveSettings(settings);
    mcApplyTheme();
  });

  document.getElementById('btnExport').addEventListener('click', function () {
    var data = mcExportData();
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'mochila-certa-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    mcToast('Backup exportado');
  });

  var fileInput = document.getElementById('importFileInput');
  document.getElementById('btnImport').addEventListener('click', function () {
    fileInput.value = '';
    fileInput.click();
  });
  fileInput.addEventListener('change', function () {
    var file = fileInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        mcImportData(data);
        mcToast('Dados importados com sucesso');
        mcApplyTheme();
        mcRenderConfig();
      } catch (e) {
        alert('Não foi possível importar este arquivo. Verifique se é um backup válido da Mochila Certa.');
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('btnRestoreExample').addEventListener('click', function () {
    if (confirm('Isso substitui seus dados atuais pelos dados de exemplo. Deseja continuar?')) {
      mcRestoreExample();
      mcToast('Exemplo restaurado');
      mcApplyTheme();
      mcRenderConfig();
    }
  });

  document.getElementById('btnClearAll').addEventListener('click', function () {
    if (confirm('Tem certeza? Todos os dados serão apagados permanentemente.')) {
      mcClearAllData();
      mcApplyTheme();
      mcRenderConfig();
      mcToast('Todos os dados foram apagados');
    }
  });
}

document.addEventListener('DOMContentLoaded', mcRenderConfig);
