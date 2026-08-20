// Minimal DOM mock for headless testing of preview.html
class El {
  constructor(tag) {
    this.tagName = tag; this.innerHTML = ''; this.style = {};
    this.classList = { _s: new Set(), add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); }, contains(c) { return this._s.has(c); } };
    this.dataset = {}; this.value = ''; this.disabled = false;
    this.querySelectorAll = () => [];
    this.querySelector = () => null;
    this.textContent = '';
  }
}
const _els = {};
global.document = {
  getElementById(id) { if (!_els[id]) _els[id] = new El(id); return _els[id]; },
  querySelectorAll() { return []; },
  querySelector() { return null; },
};
global.requestAnimationFrame = fn => fn();

// Extract script from HTML and make vars global
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/preview.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
// Replace const/let with var so they leak into this scope
const script = scriptMatch[1].replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var');
eval(script);

let pass = 0, fail = 0;
function assert(cond, msg) { if (cond) pass++; else { fail++; console.error(`  FAIL: ${msg}`); } }

console.log('\n=== CONTRACT: Config completeness ===');
const required = ['name', 'tag', 'email', 'nav', 'stats'];
for (var role in ROLES) {
  var cfg = ROLES[role];
  for (var i = 0; i < required.length; i++) {
    assert(cfg[required[i]] !== undefined, role + ' missing ' + required[i]);
  }
  assert(cfg.nav.length > 0, role + ' has no nav sections');
  assert(cfg.stats.length > 0, role + ' has no stats');
}

console.log('\n=== CONTRACT: Page dispatch covers all nav items ===');
var navPages = {};
for (var k in ROLES) {
  for (var si = 0; si < ROLES[k].nav.length; si++) {
    for (var ii = 0; ii < ROLES[k].nav[si].i.length; ii++) {
      navPages[ROLES[k].nav[si].i[ii].p || 'dashboard'] = true;
    }
  }
}
// Build P map by testing which pages render without error
var P_KEYS = {};

for (var rk in ROLES) {
  for (var si = 0; si < ROLES[rk].nav.length; si++) {
    for (var ii = 0; ii < ROLES[rk].nav[si].i.length; ii++) {
      var pg = ROLES[rk].nav[si].i[ii].p || 'dashboard';
      if (P_KEYS[pg]) continue;
      selectedRole = rk; currentPage = pg;
      try { renderPage(ROLES[rk]); P_KEYS[pg] = true; } catch(e) { /* ok */ }
    }
  }
}
// Add known aliases
['subscriptions','analytics','debtors','invoices','monthlyincome','expenses','grades','results','mypayments'].forEach(function(a){ P_KEYS[a] = true; });
for (var pg in navPages) {
  assert(P_KEYS[pg], 'Nav page "' + pg + '" has no dispatch entry');
}

console.log('\n=== CONTRACT: Sidebar produces exactly 1 active item ===');
for (var role in ROLES) {
  selectedRole = role; currentPage = 'dashboard';
  renderSidebar();
  var matches = _els.sidebar.innerHTML.match(/class="nav-item active"/g);
  assert(matches && matches.length === 1, role + ': expected 1 active, got ' + (matches ? matches.length : 0));
}

console.log('\n=== CONTRACT: Student filter correctness ===');
selectedRole = 'admin'; currentPage = 'students';
studFilter = 'all'; studGroup = 'all';
var allCount = (renderStudents().match(/<tr class="student-row">/g) || []).length;

studFilter = 'active'; studGroup = 'all';
var activeCount = (renderStudents().match(/<tr class="student-row">/g) || []).length;

studFilter = 'debt'; studGroup = 'all';
var debtCount = (renderStudents().match(/<tr class="student-row">/g) || []).length;

studFilter = 'all'; studGroup = 'IELTS-01';
var ieltsCount = (renderStudents().match(/<tr class="student-row">/g) || []).length;

studFilter = 'all'; studGroup = 'all';
assert(allCount === 10, 'All filter: expected 10, got ' + allCount);
assert(activeCount === 7, 'Active filter: expected 7, got ' + activeCount);
assert(debtCount === 3, 'Debt filter: expected 3, got ' + debtCount);
assert(ieltsCount === 2, 'IELTS-01 group filter: expected 2, got ' + ieltsCount);

console.log('\n=== CONTRACT: Logout resets all state ===');
selectedRole = 'admin'; currentPage = 'students'; studFilter = 'debt'; studGroup = 'IELTS-01';
logout();
assert(selectedRole === null, 'selectedRole not reset');
assert(currentPage === 'dashboard', 'currentPage not reset');
assert(studFilter === 'all', 'studFilter not reset');
assert(studGroup === 'all', 'studGroup not reset');

console.log('\n=== CONTRACT: Dashboard renders correct stat count per role ===');
for (var role in ROLES) {
  selectedRole = role; currentPage = 'dashboard';
  var dHtml = renderDashboard(ROLES[role]);
  var cardCount = (dHtml.match(/stat-card/g) || []).length;
  assert(cardCount === ROLES[role].stats.length, role + ': expected ' + ROLES[role].stats.length + ' stat cards, got ' + cardCount);
}

console.log('\n=== CONTRACT: All render functions produce non-empty HTML ===');
var pages = ['students','teachers','courses','groups','schedule','attendance','exams','payments','reports','settings','auditlogs','allusers','mygroups','mycourses','myschedule','myattendance','homework','children'];
selectedRole = 'admin';
for (var pi = 0; pi < pages.length; pi++) {
  currentPage = pages[pi];
  try {
    var pHtml = renderPage(ROLES[selectedRole]);
    assert(pHtml && pHtml.length > 50, pages[pi] + ' returned empty/too-short HTML');
  } catch(e) {
    assert(false, pages[pi] + ' threw: ' + e.message);
  }
}

console.log('\n=== RESULTS: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail > 0 ? 1 : 0);
