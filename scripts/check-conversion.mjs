import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const consentSource = await readFile('consent.js', 'utf8');
function consentHarness(saved = {}, pixelId = '1914558179481592') {
  const handlers = {};
  const button = (choice) => ({ dataset: { consent: choice }, addEventListener: (_event, action) => { handlers[choice] = action; }, focus() {} });
  const buttons = [button('reject'), button('accept')];
  const banner = { hidden: true, querySelector: (selector) => selector === 'button' ? buttons[0] : {}, querySelectorAll: () => buttons };
  const scripts = [];
  const removedCookies = [];
  const document = {
    getElementById: () => banner, querySelectorAll: () => [],
    createElement: () => ({}), head: { append: (element) => scripts.push(element) },
    set cookie(value) { removedCookies.push(value); }
  };
  const storage = new Map(Object.entries(saved));
  const window = { GH_MARKETING: { pixelId } };
  const context = { window, document, location: { hostname: 'gastrohelp.es' }, localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }, Date, Set, Object, Number, String };
  vm.runInNewContext(consentSource, context);
  return { window, scripts, handlers, banner, storage, removedCookies };
}
const first = consentHarness({ 'gastrohelp-cookie-consent-v1': JSON.stringify({ value: 'all' }) });
assert.equal(first.scripts.length, 0, 'Legacy consent must not activate advertising');
assert.equal(first.banner.hidden, false);
const previousChoice = consentHarness({ 'gastrohelp-consent-v2': JSON.stringify({ choice: 'accept', timestamp: Date.now() }) });
assert.equal(previousChoice.scripts.length, 0, 'Consent given while advertising was disabled must not activate Meta');
assert.equal(previousChoice.banner.hidden, false);
first.handlers.reject();
first.window.GHAnalytics.track('Lead');
assert.equal(first.scripts.length, 0, 'Rejecting must not load Meta');
first.handlers.accept();
assert.equal(first.scripts.length, 1);
let queue = first.window.fbq.queue.map((args) => Array.from(args));
assert.equal(queue.filter((args) => args[1] === 'PageView').length, 1);
assert.ok(queue.some((args) => args[0] === 'set' && args[1] === 'autoConfig' && args[2] === false));
assert.ok(queue.some((args) => args[0] === 'init' && args[1] === '1914558179481592' && args.length === 2), 'Use the confirmed public ID without advanced matching');
first.window.GHAnalytics.track('Lead');
queue = first.window.fbq.queue.map((args) => Array.from(args));
assert.equal(queue.filter((args) => args[0] === 'track' && args[1] === 'Lead').length, 1);
first.handlers.reject();
const countAfterRevoke = first.window.fbq.queue.length;
first.window.GHAnalytics.track('Lead');
assert.equal(first.window.fbq.queue.length, countAfterRevoke, 'Revoked consent blocks new events');
assert.ok(first.removedCookies.some((entry) => entry.startsWith('_fbp=;')));
assert.ok(first.removedCookies.some((entry) => entry.startsWith('_fbc=;')));
const expired = consentHarness({ 'gastrohelp-consent-v3': JSON.stringify({ choice: 'accept', timestamp: Date.now() - 181 * 86400000 }) });
assert.equal(expired.scripts.length, 0);
assert.equal(expired.banner.hidden, false);
const inactive = consentHarness({}, '');
inactive.handlers.accept();
inactive.window.GHAnalytics.track('Lead');
assert.equal(inactive.scripts.length, 0, 'Missing pixel ID must keep Meta disabled');

const workflow = await readFile('automation/web-leads.js', 'utf8');
const scriptMatch = workflow.match(/jsCode:("(?:\\.|[^"\\])*")/);
assert.ok(scriptMatch, 'Workflow must include server validation');
const validate = new Function('$input', '$getWorkflowStaticData', JSON.parse(scriptMatch[1]));
const validBody = { name: 'Prueba GastroHelp', restaurant: 'Restaurante de prueba', address: 'Dirección de prueba, Castellón', phone: '+34613885231', email: 'gastrohelpsmart@gmail.com', interest: 'web', privacy: true, website: '', startedAt: Date.now() - 5000, requestId: 'test-valid-request-2026' };
const run = (body, origin = 'https://gastrohelp.es', state = {}) => validate({ first: () => ({ json: { body, headers: { origin } } }) }, () => state)[0].json;
assert.equal(run(validBody).valid, true);
assert.equal(run({ ...validBody, privacy: false }).valid, false);
assert.equal(run({ ...validBody, website: 'https://spam.example' }).valid, false);
assert.equal(run({ ...validBody, email: 'person@example.com\r\nBcc:bad@example.com' }).valid, false);
assert.equal(run({ ...validBody, address: { text: 'invalid' } }).valid, false);
assert.equal(run(validBody, 'https://unrelated.example').status, 403);
const duplicate = run(validBody, 'https://gastrohelp.es', { delivered: { [validBody.requestId]: Date.now() } });
assert.equal(duplicate.valid, false, 'An already delivered request must not go to the mail node');
assert.equal(duplicate.ok, true);
assert.equal(run(validBody, 'https://gastrohelp.es', { minute: Math.floor(Date.now() / 60000), minuteCount: 10 }).status, 429);
assert.match(workflow, /toEmail:'gastrohelpsmart@gmail.com'/, 'Recipient must remain fixed');
assert.match(workflow, /continueRegularOutput/, 'Mail errors must reach the acceptance check');
console.log('Conversion checks passed: consent gates, no automatic matching, validation, fixed recipient and duplicate handling.');
