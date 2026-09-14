/* Mochila Certa — página Materiais (matérias + catálogo de materiais) */

var mcEditingSubjectId = null;
var mcEditingMaterialId = null;
var mcExpandedSubjectId = null;
var mcNewSubjectColor = MC_PALETTE[0];

/* ---------- Matérias ---------- */

function mcRenderSubjectsPanel() {
  var root = document.getElementById('subjectsRoot');
  var subjects = mcGetSubjects();
  var materials = mcGetMaterials();

  var html = '<div class="manage-list">';

  if (!subjects.length) {
    html += '<div class="card empty-state"><span class="icon">📘</span><p class="muted">Nenhuma matéria cadastrada ainda.</p></div>';
  }

  subjects.forEach(function (subject) {
    if (mcEditingSubjectId === subject.id) {
      html += mcSubjectEditFormHtml(subject);
    } else {
      html += mcSubjectCardHtml(subject, materials);
    }
  });

  html += '</div>';

  html += '<div class="card section" style="margin-top:16px;">';
  html += '<h2 class="small" style="margin-bottom:10px;">Nova matéria</h2>';
  html += '<form id="newSubjectForm">';
  html += '<div class="form-row"><label for="newSubjectName">Nome da matéria</label>';
  html += '<input type="text" id="newSubjectName" placeholder="Ex: Matemática" required maxlength="40" /></div>';
  html += '<div class="form-row"><label>Cor</label><input type="hidden" id="newSubjectColor" value="' + mcNewSubjectColor + '" />';
  html += mcColorPickerHtml(mcNewSubjectColor, 'new-subject-color');
  html += '</div>';
  html += '<button type="submit" class="btn btn-primary">Adicionar matéria</button>';
  html += '</form></div>';

  root.innerHTML = html;
}

function mcColorPickerHtml(selectedColor, groupName) {
  var html = '<div class="color-picker" data-color-group="' + groupName + '">';
  MC_PALETTE.forEach(function (color) {
    html += '<button type="button" class="color-swatch' + (color === selectedColor ? ' selected' : '') + '" style="background:' + color + '" data-color="' + color + '" aria-label="Cor ' + color + '"></button>';
  });
  html += '</div>';
  return html;
}

function mcSubjectCardHtml(subject, materials) {
  var expanded = mcExpandedSubjectId === subject.id;
  var assigned = (subject.materialIds || []).map(function (id) { return mcGetMaterialById(id); }).filter(Boolean);

  var html = '<div class="manage-item" data-subject-id="' + subject.id + '">';
  html += '<div class="manage-item-head">';
  html += '<span class="color-dot" style="background:' + subject.color + '"></span>';
  html += '<span class="title">' + mcEscapeHtml(subject.name) + '</span>';
  html += '<div class="manage-item-actions">';
  html += '<button type="button" class="btn-icon" data-action="edit-subject" data-id="' + subject.id + '" aria-label="Editar matéria">✏️</button>';
  html += '<button type="button" class="btn-icon" data-action="delete-subject" data-id="' + subject.id + '" aria-label="Excluir matéria">🗑️</button>';
  html += '</div></div>';

  html += '<div class="chip-list">';
  if (assigned.length) {
    assigned.forEach(function (m) {
      html += '<span class="chip">' + (m.icon || '📦') + ' ' + mcEscapeHtml(m.name) + '</span>';
    });
  } else {
    html += '<span class="muted small">Nenhum material associado ainda</span>';
  }
  html += '</div>';

  html += '<button type="button" class="btn btn-ghost btn-sm" style="margin-top:10px;" data-action="toggle-materials" data-id="' + subject.id + '">';
  html += expanded ? 'Ocultar materiais' : 'Gerenciar materiais';
  html += '</button>';

  if (expanded) {
    html += '<div class="material-toggle-list">';
    if (!materials.length) {
      html += '<p class="muted small">Cadastre materiais no catálogo ao lado para associá-los aqui.</p>';
    }
    materials.forEach(function (m) {
      var checked = (subject.materialIds || []).indexOf(m.id) !== -1;
      html += '<label class="material-toggle">';
      html += '<input type="checkbox" data-action="toggle-subject-material" data-subject-id="' + subject.id + '" data-material-id="' + m.id + '"' + (checked ? ' checked' : '') + ' />';
      html += '<span>' + (m.icon || '📦') + ' ' + mcEscapeHtml(m.name) + '</span>';
      html += '</label>';
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function mcSubjectEditFormHtml(subject) {
  var html = '<div class="manage-item">';
  html += '<form data-edit-subject-form="' + subject.id + '">';
  html += '<div class="form-row"><label for="editSubjectName' + subject.id + '">Nome da matéria</label>';
  html += '<input type="text" id="editSubjectName' + subject.id + '" value="' + mcEscapeHtml(subject.name) + '" required maxlength="40" /></div>';
  html += '<div class="form-row"><label>Cor</label><input type="hidden" id="editSubjectColor' + subject.id + '" value="' + subject.color + '" />';
  html += mcColorPickerHtml(subject.color, 'edit-subject-color-' + subject.id);
  html += '</div>';
  html += '<div style="display:flex;gap:8px;">';
  html += '<button type="submit" class="btn btn-primary btn-sm">Salvar</button>';
  html += '<button type="button" class="btn btn-ghost btn-sm" data-action="cancel-edit-subject">Cancelar</button>';
  html += '</div></form></div>';
  return html;
}

/* ---------- Catálogo de materiais ---------- */

function mcRenderMaterialsPanel() {
  var root = document.getElementById('materialsRoot');
  var materials = mcGetMaterials();

  var html = '<div class="manage-list">';
  if (!materials.length) {
    html += '<div class="card empty-state"><span class="icon">🎒</span><p class="muted">Nenhum material cadastrado ainda.</p></div>';
  }

  materials.forEach(function (material) {
    if (mcEditingMaterialId === material.id) {
      html += mcMaterialEditFormHtml(material);
    } else {
      html += mcMaterialCardHtml(material);
    }
  });
  html += '</div>';

  html += '<div class="card section" style="margin-top:16px;">';
  html += '<h2 class="small" style="margin-bottom:10px;">Novo material</h2>';
  html += '<form id="newMaterialForm">';
  html += '<div class="inline-form">';
  html += '<div class="form-row" style="max-width:80px;"><label for="newMaterialIcon">Ícone</label><input type="text" id="newMaterialIcon" placeholder="🎒" maxlength="4" /></div>';
  html += '<div class="form-row"><label for="newMaterialName">Nome do material</label><input type="text" id="newMaterialName" placeholder="Ex: Caderno" required maxlength="40" /></div>';
  html += '</div>';
  html += '<label class="checkbox-row" style="margin:10px 0;"><input type="checkbox" id="newMaterialDaily" /> Levar todo dia, independente da matéria</label>';
  html += '<button type="submit" class="btn btn-primary">Adicionar material</button>';
  html += '</form></div>';

  root.innerHTML = html;
}

function mcMaterialCardHtml(material) {
  var html = '<div class="manage-item" data-material-id="' + material.id + '">';
  html += '<div class="manage-item-head">';
  html += '<span style="font-size:1.3rem;">' + (material.icon || '📦') + '</span>';
  html += '<span class="title">' + mcEscapeHtml(material.name);
  if (material.daily) html += ' <span class="muted small" style="font-weight:500;">· todo dia</span>';
  html += '</span>';
  html += '<div class="manage-item-actions">';
  html += '<button type="button" class="btn-icon" data-action="edit-material" data-id="' + material.id + '" aria-label="Editar material">✏️</button>';
  html += '<button type="button" class="btn-icon" data-action="delete-material" data-id="' + material.id + '" aria-label="Excluir material">🗑️</button>';
  html += '</div></div></div>';
  return html;
}

function mcMaterialEditFormHtml(material) {
  var html = '<div class="manage-item">';
  html += '<form data-edit-material-form="' + material.id + '">';
  html += '<div class="inline-form">';
  html += '<div class="form-row" style="max-width:80px;"><label for="editMaterialIcon' + material.id + '">Ícone</label><input type="text" id="editMaterialIcon' + material.id + '" value="' + mcEscapeHtml(material.icon || '') + '" maxlength="4" /></div>';
  html += '<div class="form-row"><label for="editMaterialName' + material.id + '">Nome</label><input type="text" id="editMaterialName' + material.id + '" value="' + mcEscapeHtml(material.name) + '" required maxlength="40" /></div>';
  html += '</div>';
  html += '<label class="checkbox-row" style="margin:10px 0;"><input type="checkbox" id="editMaterialDaily' + material.id + '"' + (material.daily ? ' checked' : '') + ' /> Levar todo dia, independente da matéria</label>';
  html += '<div style="display:flex;gap:8px;">';
  html += '<button type="submit" class="btn btn-primary btn-sm">Salvar</button>';
  html += '<button type="button" class="btn btn-ghost btn-sm" data-action="cancel-edit-material">Cancelar</button>';
  html += '</div></form></div>';
  return html;
}

/* ---------- Abas ---------- */

function mcInitTabs() {
  var btnSubjects = document.getElementById('tabBtnSubjects');
  var btnMaterials = document.getElementById('tabBtnMaterials');
  var panelSubjects = document.getElementById('panelSubjects');
  var panelMaterials = document.getElementById('panelMaterials');

  btnSubjects.addEventListener('click', function () {
    btnSubjects.classList.add('active');
    btnSubjects.setAttribute('aria-selected', 'true');
    btnMaterials.classList.remove('active');
    btnMaterials.setAttribute('aria-selected', 'false');
    panelSubjects.hidden = false;
    panelMaterials.hidden = true;
  });

  btnMaterials.addEventListener('click', function () {
    btnMaterials.classList.add('active');
    btnMaterials.setAttribute('aria-selected', 'true');
    btnSubjects.classList.remove('active');
    btnSubjects.setAttribute('aria-selected', 'false');
    panelMaterials.hidden = false;
    panelSubjects.hidden = true;
  });
}

/* ---------- Interações (delegação de eventos) ---------- */

function mcInitSubjectsInteractions() {
  var root = document.getElementById('subjectsRoot');

  root.addEventListener('click', function (e) {
    var colorBtn = e.target.closest('.color-swatch');
    if (colorBtn) {
      var group = colorBtn.closest('[data-color-group]');
      group.querySelectorAll('.color-swatch').forEach(function (b) { b.classList.remove('selected'); });
      colorBtn.classList.add('selected');
      var groupName = group.getAttribute('data-color-group');
      var hiddenInput = group.previousElementSibling && group.previousElementSibling.tagName === 'INPUT'
        ? group.previousElementSibling
        : group.parentElement.querySelector('input[type="hidden"]');
      if (hiddenInput) hiddenInput.value = colorBtn.getAttribute('data-color');
      if (groupName === 'new-subject-color') mcNewSubjectColor = colorBtn.getAttribute('data-color');
      return;
    }

    var btn = e.target.closest('button[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    var id = btn.getAttribute('data-id');

    if (action === 'edit-subject') {
      mcEditingSubjectId = id;
      mcRenderSubjectsPanel();
    } else if (action === 'cancel-edit-subject') {
      mcEditingSubjectId = null;
      mcRenderSubjectsPanel();
    } else if (action === 'delete-subject') {
      var subject = mcGetSubjectById(id);
      if (subject && confirm('Excluir a matéria "' + subject.name + '"? Ela também será removida da grade horária.')) {
        mcRemoveSubjectEverywhere(id);
        mcToast('Matéria excluída');
        mcRenderSubjectsPanel();
      }
    } else if (action === 'toggle-materials') {
      mcExpandedSubjectId = mcExpandedSubjectId === id ? null : id;
      mcRenderSubjectsPanel();
    }
  });

  root.addEventListener('change', function (e) {
    var toggle = e.target.closest('input[data-action="toggle-subject-material"]');
    if (!toggle) return;
    var subjectId = toggle.getAttribute('data-subject-id');
    var materialId = toggle.getAttribute('data-material-id');
    var subjects = mcGetSubjects();
    var subject = subjects.find(function (s) { return s.id === subjectId; });
    if (!subject) return;
    subject.materialIds = subject.materialIds || [];
    var idx = subject.materialIds.indexOf(materialId);
    if (toggle.checked && idx === -1) subject.materialIds.push(materialId);
    if (!toggle.checked && idx !== -1) subject.materialIds.splice(idx, 1);
    mcSaveSubjects(subjects);
    mcRenderSubjectsPanel();
  });

  root.addEventListener('submit', function (e) {
    var editForm = e.target.closest('form[data-edit-subject-form]');
    if (editForm) {
      e.preventDefault();
      var id = editForm.getAttribute('data-edit-subject-form');
      var name = document.getElementById('editSubjectName' + id).value.trim();
      var color = document.getElementById('editSubjectColor' + id).value;
      if (!name) return;
      var subjects = mcGetSubjects();
      var subject = subjects.find(function (s) { return s.id === id; });
      subject.name = name;
      subject.color = color;
      mcSaveSubjects(subjects);
      mcEditingSubjectId = null;
      mcToast('Matéria atualizada');
      mcRenderSubjectsPanel();
      return;
    }

    if (e.target.id === 'newSubjectForm') {
      e.preventDefault();
      var nameInput = document.getElementById('newSubjectName');
      var colorInput = document.getElementById('newSubjectColor');
      var name2 = nameInput.value.trim();
      if (!name2) return;
      var subjects2 = mcGetSubjects();
      subjects2.push({ id: mcUid('s'), name: name2, color: colorInput.value, materialIds: [] });
      mcSaveSubjects(subjects2);
      mcNewSubjectColor = MC_PALETTE[0];
      mcToast('Matéria adicionada');
      mcRenderSubjectsPanel();
    }
  });
}

function mcInitMaterialsInteractions() {
  var root = document.getElementById('materialsRoot');

  root.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    var id = btn.getAttribute('data-id');

    if (action === 'edit-material') {
      mcEditingMaterialId = id;
      mcRenderMaterialsPanel();
    } else if (action === 'cancel-edit-material') {
      mcEditingMaterialId = null;
      mcRenderMaterialsPanel();
    } else if (action === 'delete-material') {
      var material = mcGetMaterialById(id);
      if (material && confirm('Excluir o material "' + material.name + '"? Ele será removido de todas as matérias.')) {
        mcRemoveMaterialEverywhere(id);
        mcToast('Material excluído');
        mcRenderMaterialsPanel();
      }
    }
  });

  root.addEventListener('submit', function (e) {
    var editForm = e.target.closest('form[data-edit-material-form]');
    if (editForm) {
      e.preventDefault();
      var id = editForm.getAttribute('data-edit-material-form');
      var name = document.getElementById('editMaterialName' + id).value.trim();
      var icon = document.getElementById('editMaterialIcon' + id).value.trim();
      var daily = document.getElementById('editMaterialDaily' + id).checked;
      if (!name) return;
      var materials = mcGetMaterials();
      var material = materials.find(function (m) { return m.id === id; });
      material.name = name;
      material.icon = icon || '📦';
      material.daily = daily;
      mcSaveMaterials(materials);
      mcEditingMaterialId = null;
      mcToast('Material atualizado');
      mcRenderMaterialsPanel();
      return;
    }

    if (e.target.id === 'newMaterialForm') {
      e.preventDefault();
      var nameInput = document.getElementById('newMaterialName');
      var iconInput = document.getElementById('newMaterialIcon');
      var dailyInput = document.getElementById('newMaterialDaily');
      var name2 = nameInput.value.trim();
      if (!name2) return;
      var materials2 = mcGetMaterials();
      materials2.push({ id: mcUid('m'), name: name2, icon: iconInput.value.trim() || '📦', daily: dailyInput.checked });
      mcSaveMaterials(materials2);
      mcToast('Material adicionado');
      mcRenderMaterialsPanel();
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  mcInitTabs();
  mcInitSubjectsInteractions();
  mcInitMaterialsInteractions();
  mcRenderSubjectsPanel();
  mcRenderMaterialsPanel();
});
