/* Mochila Certa — camada de dados (localStorage) */

var MC_KEYS = {
  subjects: 'mc_subjects',
  materials: 'mc_materials',
  schedule: 'mc_schedule',
  settings: 'mc_settings',
  checklist: 'mc_checklist',
};

var MC_PALETTE = ['#6C5CE7', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#0EA5E9', '#8B5CF6', '#F97316'];

var MC_DAY_NAMES = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
var MC_DAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function mcUid(prefix) {
  return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function mcReadJSON(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function mcWriteJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function mcGetSubjects() {
  return mcReadJSON(MC_KEYS.subjects, []);
}
function mcSaveSubjects(list) {
  mcWriteJSON(MC_KEYS.subjects, list);
}

function mcGetMaterials() {
  return mcReadJSON(MC_KEYS.materials, []);
}
function mcSaveMaterials(list) {
  mcWriteJSON(MC_KEYS.materials, list);
}

function mcGetSchedule() {
  return mcReadJSON(MC_KEYS.schedule, {});
}
function mcSaveSchedule(schedule) {
  mcWriteJSON(MC_KEYS.schedule, schedule);
}

function mcGetSettings() {
  var defaults = { studentName: 'Estudante', schoolDays: [1, 2, 3, 4, 5], theme: 'light' };
  var saved = mcReadJSON(MC_KEYS.settings, {});
  return Object.assign({}, defaults, saved);
}
function mcSaveSettings(settings) {
  mcWriteJSON(MC_KEYS.settings, settings);
}

function mcGetChecklistState() {
  return mcReadJSON(MC_KEYS.checklist, {});
}
function mcSaveChecklistState(state) {
  mcWriteJSON(MC_KEYS.checklist, state);
}

function mcGetSubjectById(id) {
  return mcGetSubjects().find(function (s) { return s.id === id; });
}
function mcGetMaterialById(id) {
  return mcGetMaterials().find(function (m) { return m.id === id; });
}

/* Remove referências de uma matéria/material apagado das demais estruturas */
function mcRemoveSubjectEverywhere(subjectId) {
  var subjects = mcGetSubjects().filter(function (s) { return s.id !== subjectId; });
  mcSaveSubjects(subjects);

  var schedule = mcGetSchedule();
  Object.keys(schedule).forEach(function (day) {
    schedule[day] = schedule[day].filter(function (id) { return id !== subjectId; });
  });
  mcSaveSchedule(schedule);
}

function mcRemoveMaterialEverywhere(materialId) {
  var materials = mcGetMaterials().filter(function (m) { return m.id !== materialId; });
  mcSaveMaterials(materials);

  var subjects = mcGetSubjects().map(function (s) {
    s.materialIds = (s.materialIds || []).filter(function (id) { return id !== materialId; });
    return s;
  });
  mcSaveSubjects(subjects);
}

/* Dados de exemplo, carregados apenas na primeira visita */
function mcSeedIfEmpty() {
  if (localStorage.getItem(MC_KEYS.subjects)) return;

  var materials = [
    { id: 'm_caderno', name: 'Caderno', icon: '📓', daily: false },
    { id: 'm_livro', name: 'Livro didático', icon: '📚', daily: false },
    { id: 'm_estojo', name: 'Estojo completo', icon: '✏️', daily: true },
    { id: 'm_calculadora', name: 'Calculadora', icon: '🧮', daily: false },
    { id: 'm_atlas', name: 'Atlas / mapa', icon: '🗺️', daily: false },
    { id: 'm_lab', name: 'Jaleco / material de laboratório', icon: '🧪', daily: false },
    { id: 'm_edfisica', name: 'Roupa e tênis de Educação Física', icon: '⚽', daily: false },
    { id: 'm_arte', name: 'Material de artes', icon: '🎨', daily: false },
    { id: 'm_notebook', name: 'Notebook / tablet', icon: '💻', daily: false },
    { id: 'm_agenda', name: 'Agenda escolar', icon: '🗒️', daily: true },
    { id: 'm_garrafa', name: 'Garrafa de água', icon: '🥤', daily: true },
  ];

  var subjects = [
    { id: 's_port', name: 'Português', color: '#6C5CE7', materialIds: ['m_caderno', 'm_livro'] },
    { id: 's_mat', name: 'Matemática', color: '#3B82F6', materialIds: ['m_caderno', 'm_livro', 'm_calculadora'] },
    { id: 's_hist', name: 'História', color: '#F59E0B', materialIds: ['m_caderno', 'm_livro'] },
    { id: 's_geo', name: 'Geografia', color: '#22C55E', materialIds: ['m_caderno', 'm_livro', 'm_atlas'] },
    { id: 's_quim', name: 'Química', color: '#EF4444', materialIds: ['m_caderno', 'm_lab'] },
    { id: 's_fis', name: 'Física', color: '#0EA5E9', materialIds: ['m_caderno', 'm_calculadora'] },
    { id: 's_bio', name: 'Biologia', color: '#14B8A6', materialIds: ['m_caderno', 'm_livro'] },
    { id: 's_ing', name: 'Inglês', color: '#EC4899', materialIds: ['m_caderno', 'm_livro'] },
    { id: 's_ed', name: 'Educação Física', color: '#F97316', materialIds: ['m_edfisica'] },
    { id: 's_art', name: 'Artes', color: '#8B5CF6', materialIds: ['m_arte'] },
  ];

  var schedule = {
    '1': ['s_port', 's_mat', 's_hist'],
    '2': ['s_mat', 's_geo', 's_ing'],
    '3': ['s_quim', 's_fis', 's_ed'],
    '4': ['s_bio', 's_port', 's_art'],
    '5': ['s_mat', 's_hist', 's_geo'],
  };

  mcSaveMaterials(materials);
  mcSaveSubjects(subjects);
  mcSaveSchedule(schedule);
  mcSaveSettings({ studentName: 'Estudante', schoolDays: [1, 2, 3, 4, 5], theme: 'light' });
}

function mcExportData() {
  return {
    exportedAt: new Date().toISOString(),
    subjects: mcGetSubjects(),
    materials: mcGetMaterials(),
    schedule: mcGetSchedule(),
    settings: mcGetSettings(),
    checklist: mcGetChecklistState(),
  };
}

function mcImportData(data) {
  if (!data || typeof data !== 'object') throw new Error('Arquivo inválido');
  if (data.subjects) mcSaveSubjects(data.subjects);
  if (data.materials) mcSaveMaterials(data.materials);
  if (data.schedule) mcSaveSchedule(data.schedule);
  if (data.settings) mcSaveSettings(data.settings);
  if (data.checklist) mcSaveChecklistState(data.checklist);
}

function mcClearAllData() {
  Object.keys(MC_KEYS).forEach(function (k) { localStorage.removeItem(MC_KEYS[k]); });
}

function mcRestoreExample() {
  mcClearAllData();
  mcSeedIfEmpty();
}

/* Remove estados de checklist com mais de 30 dias para não acumular lixo */
function mcPruneOldChecklists() {
  var state = mcGetChecklistState();
  var cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  var changed = false;
  Object.keys(state).forEach(function (dateKey) {
    var t = new Date(dateKey + 'T00:00:00').getTime();
    if (isNaN(t) || t < cutoff) {
      delete state[dateKey];
      changed = true;
    }
  });
  if (changed) mcSaveChecklistState(state);
}
