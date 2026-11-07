/**
 * Tests for Code.gs. Run with:  node booking-reminders/_reminders.test.js
 * Loads the Apps Script file into a sandbox with fake UrlFetchApp,
 * PropertiesService, LockService, ScriptApp and Utilities (no network).
 */
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = fs.readFileSync(path.join(here, 'Code.gs'), 'utf8');

let passed = 0;
const ok = (cond, label) => {
  assert.ok(cond, label);
  passed += 1;
};
const eq = (a, b, label) => {
  // values from the vm sandbox have their own Array prototype → compare as JSON
  assert.deepStrictEqual(JSON.parse(JSON.stringify(a ?? null)), JSON.parse(JSON.stringify(b ?? null)), label);
  passed += 1;
};

const H = 60 * 60 * 1000;
const NOW = Date.UTC(2026, 10, 7, 12, 0, 0); // 2026-11-07 12:00 UTC
const iso = (ms) => new Date(ms).toISOString().replace('Z', '000Z'); // TidyCal style: 6 decimals

const TAGS = [
  { id: 1, name: 'Quiz Booked a Call' },
  { id: 48, name: 'Quiz Call 48 hour reminder' },
  { id: 24, name: 'Quiz Call 24 hour reminder' },
  { id: 2, name: 'Quiz Call 01 hour reminder' },
  { id: 99, name: 'TidyCal Booked' },
];

/** Builds a sandbox. kit = { tags, members: {tagId: [subscriber]}, fail: fn(url, method) → code|null } */
function sandbox(kit, opts = {}) {
  const calls = [];
  const props = { KIT_API_SECRET: 'test-secret', ...(opts.props || {}) };
  let locked = !!opts.locked;
  const triggers = [...(opts.triggers || [])];
  const sleeps = [];

  const respond = (code, data) => ({
    getResponseCode: () => code,
    getContentText: () => JSON.stringify(data),
  });

  const UrlFetchApp = {
    fetch(url, params) {
      const method = (params.method || 'get').toLowerCase();
      calls.push({ url, method, body: params.payload ? JSON.parse(params.payload) : null });
      const forced = kit.fail && kit.fail(url, method, calls.length);
      if (forced) return respond(forced, { message: 'forced ' + forced });
      const u = new URL(url);
      const p = u.pathname.replace('/v3', '');
      if (method === 'get' && p === '/account') return respond(200, { name: 'Alefiya at Nomads' });
      if (method === 'get' && p === '/tags') return respond(200, { tags: kit.tags || TAGS });
      let m = p.match(/^\/tags\/(\d+)\/subscriptions$/);
      if (method === 'get' && m) {
        const all = (kit.members && kit.members[m[1]]) || [];
        const page = Number(u.searchParams.get('page') || 1);
        const per = 50;
        const slice = all.slice((page - 1) * per, page * per);
        return respond(200, {
          total_subscriptions: all.length,
          page,
          total_pages: Math.max(1, Math.ceil(all.length / per)),
          subscriptions: slice.map((s) => ({ id: 1000 + s.id, state: 'active', subscriber: s })),
        });
      }
      m = p.match(/^\/tags\/(\d+)\/subscribe$/);
      if (method === 'post' && m) {
        const body = JSON.parse(params.payload);
        return respond(200, { subscription: { subscriber: { id: 1 }, email: body.email } });
      }
      return respond(404, { message: 'not found' });
    },
  };

  const ctx = {
    console: { log: () => {}, error: () => {} },
    Date,
    Math,
    JSON,
    Number,
    String,
    Object,
    Error,
    encodeURIComponent,
    UrlFetchApp,
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] || null }) },
    LockService: {
      getScriptLock: () => ({
        tryLock: () => (locked ? false : ((locked = true), true)),
        releaseLock: () => {
          locked = false;
        },
      }),
    },
    Utilities: { sleep: (ms) => sleeps.push(ms) },
    ScriptApp: {
      getProjectTriggers: () => triggers.slice(),
      deleteTrigger: (t) => triggers.splice(triggers.indexOf(t), 1),
      newTrigger: (fn) => {
        const b = {
          timeBased: () => b,
          everyMinutes: (n) => ((b.minutes = n), b),
          create: () => triggers.push({ getHandlerFunction: () => fn, minutes: b.minutes }),
        };
        return b;
      },
    },
  };
  vm.createContext(ctx);
  vm.runInContext(SOURCE, ctx);
  return { ctx, calls, triggers, sleeps };
}

const person = (id, callMs, extra = {}) => ({
  id,
  email_address: `p${id}@example.com`,
  state: 'active',
  fields: { booking_time_date_raw: callMs === null ? null : typeof callMs === 'string' ? callMs : iso(callMs) },
  ...extra,
});
const posts = (calls) => calls.filter((c) => c.method === 'post').map((c) => ({ tag: Number(c.url.match(/tags\/(\d+)/)[1]), email: c.body.email }));
const run = (s, dry = false) => s.ctx.runReminders_({ dryRun: dry, now: NOW });

/* ---------- parsing ---------- */
{
  const { ctx } = sandbox({});
  const p = ctx.parseBookingTime_;
  eq(p('2026-10-09T12:30:00.000000Z'), Date.UTC(2026, 9, 9, 12, 30), 'parse: TidyCal 6-decimal UTC');
  eq(p('2026-10-09T12:30:00Z'), Date.UTC(2026, 9, 9, 12, 30), 'parse: no decimals');
  eq(p('2026-10-09T12:30:00.5Z'), Date.UTC(2026, 9, 9, 12, 30, 0, 500), 'parse: 1 decimal = 500ms');
  eq(p('2026-10-09T12:30Z'), Date.UTC(2026, 9, 9, 12, 30), 'parse: no seconds');
  eq(p('2026-10-09T12:30:00+00:00'), Date.UTC(2026, 9, 9, 12, 30), 'parse: +00:00');
  eq(p('  2026-10-09T12:30:00.000000Z '), Date.UTC(2026, 9, 9, 12, 30), 'parse: trims spaces');
  eq(p('2026-10-09T12:30:00'), null, 'parse: no time zone → refused');
  eq(p('2026-10-09T12:30:00+05:00'), null, 'parse: non-UTC offset → refused');
  eq(p('Oct 9, 12:30 PM'), null, 'parse: free text → refused');
  eq(p('2026-02-31T10:00:00Z'), null, 'parse: impossible date → refused');
  eq(p(''), null, 'parse: empty → null');
}

/* ---------- decision logic at the boundaries ---------- */
{
  const { ctx } = sandbox({});
  const plan = (callMs, tagged = {}) => ctx.planReminders_([person(7, callMs)], { 48: {}, 24: {}, 1: {}, ...tagged }, NOW);
  const hoursOf = (r) => r.actions.map((a) => a.reminder.hours);
  eq(hoursOf(plan(NOW + 49 * H)), [], '49h away → nothing');
  eq(hoursOf(plan(NOW + 48 * H + 60000)), [], '48h01m → nothing yet');
  eq(hoursOf(plan(NOW + 48 * H)), [48], 'exactly 48h → 48h reminder');
  eq(hoursOf(plan(NOW + 47.9 * H)), [48], '47h54m → 48h reminder');
  eq(hoursOf(plan(NOW + 47.9 * H, { 48: { 7: true } })), [], '48h already tagged → nothing');
  eq(hoursOf(plan(NOW + 24 * H, { 48: { 7: true } })), [24], 'exactly 24h → 24h reminder');
  eq(hoursOf(plan(NOW + 1 * H, { 48: { 7: true }, 24: { 7: true } })), [1], 'exactly 1h → 1h reminder');
  eq(hoursOf(plan(NOW + 0.1 * H, { 48: { 7: true }, 24: { 7: true }, 1: { 7: true } })), [], 'all sent → nothing');
  eq(hoursOf(plan(NOW - 60000)), [], 'call passed → nothing');
  eq(hoursOf(plan(NOW)), [], 'call starting now → nothing');
  // late bookings: closest only
  eq(hoursOf(plan(NOW + 30 * H)), [48], 'booked 30h ahead → 48h (only one due)');
  eq(hoursOf(plan(NOW + 20 * H)), [24], 'booked 20h ahead → 24h only, never 48h');
  eq(hoursOf(plan(NOW + 0.8 * H)), [1], 'booked 50 min ahead → 1h only');
  eq(hoursOf(plan(NOW + 0.8 * H, { 24: { 7: true } })), [1], 'had 24h, now 50 min → 1h');
  // a later run after a late booking never sends the skipped 48h
  eq(hoursOf(plan(NOW + 19 * H, { 24: { 7: true } })), [], 'late booker: 48h stays skipped');
  // missed runs (script down): only the closest is sent
  eq(hoursOf(plan(NOW + 0.5 * H, { 48: { 7: true } })), [1], 'missed the 24h moment → only 1h sent');
}

/* ---------- bad data + inactive ---------- */
{
  const { ctx } = sandbox({});
  const r = ctx.planReminders_(
    [
      person(1, null),
      person(2, 'next friday'),
      person(3, NOW + 10 * H, { state: 'cancelled' }),
      { id: 4, email_address: 'p4@example.com', state: 'active' }, // no fields at all
      person(5, NOW + 10 * H),
    ],
    { 48: {}, 24: {}, 1: {} },
    NOW
  );
  eq(r.actions.map((a) => a.email), ['p5@example.com'], 'only the valid active person is tagged');
  ok(r.notes.some((n) => n.includes('p1@example.com') && n.includes('empty')), 'empty field is logged');
  ok(r.notes.some((n) => n.includes('p2@example.com') && n.includes('not understood')), 'bad value is logged');
}

/* ---------- full run against fake Kit ---------- */
{
  const s = sandbox({
    members: {
      1: [person(1, NOW + 47 * H), person(2, NOW + 23 * H), person(3, NOW + 0.5 * H), person(4, NOW + 100 * H), person(5, NOW - 5 * H)],
      48: [person(2, NOW + 23 * H), person(3, NOW + 0.5 * H)],
      24: [person(3, NOW + 0.5 * H)],
    },
  });
  const res = run(s);
  eq(
    posts(s.calls),
    [
      { tag: 48, email: 'p1@example.com' },
      { tag: 24, email: 'p2@example.com' },
      { tag: 2, email: 'p3@example.com' },
    ],
    'run: right tag for each person'
  );
  ok(res.added === 3 && res.booked === 5, 'run: summary counts');
  const post = s.calls.find((c) => c.method === 'post');
  ok(post.body.api_secret === 'test-secret' && post.body.email === 'p1@example.com', 'run: subscribe body = secret + email');
  ok(s.calls.filter((c) => c.method === 'get').every((c) => c.url.includes('subscriber_state=active') || !c.url.includes('/subscriptions')), 'run: lists active subscribers only');

  // second run straight after (tags now in Kit) adds nothing
  const s2 = sandbox({
    members: {
      1: [person(1, NOW + 47 * H)],
      48: [person(1, NOW + 47 * H)],
    },
  });
  run(s2);
  eq(posts(s2.calls), [], 'run: already-tagged person not tagged again');
}

/* ---------- dry run adds nothing ---------- */
{
  const s = sandbox({ members: { 1: [person(1, NOW + 47 * H)] } });
  const res = run(s, true);
  eq(posts(s.calls), [], 'dry run: no tags added');
  ok(res.actions.length === 1 && res.dryRun === true, 'dry run: still reports what it would do');
}

/* ---------- pagination (120 people = 3 pages) ---------- */
{
  const many = Array.from({ length: 120 }, (_, i) => person(i + 1, NOW + 47 * H));
  const s = sandbox({ members: { 1: many } });
  run(s);
  ok(posts(s.calls).length === 120, 'pagination: all 120 people across 3 pages tagged');
  ok(s.calls.filter((c) => c.url.includes('/tags/1/subscriptions')).length === 3, 'pagination: 3 page requests');
}

/* ---------- retries ---------- */
{
  let n = 0;
  const s = sandbox({
    members: { 1: [person(1, NOW + 47 * H)] },
    fail: (url, method) => (method === 'post' && n++ < 2 ? 429 : null),
  });
  run(s);
  ok(posts(s.calls).length === 3, '429 twice → retried, third try works');
  eq(s.sleeps, [1000, 2000], 'retry waits 1s then 2s');
}
{
  const s = sandbox({
    members: { 1: [person(1, NOW + 47 * H), person(2, NOW + 23 * H)] },
    fail: (url, method) => (method === 'post' && url.includes('/tags/48/') ? 400 : null),
  });
  let thrown = null;
  try {
    run(s);
  } catch (e) {
    thrown = e;
  }
  ok(thrown && /Some reminder tags failed/.test(thrown.message), 'failed tag → run throws (Google emails owner)');
  ok(!thrown.message.includes('test-secret'), 'error message never contains the secret');
  ok(posts(s.calls).some((p) => p.tag === 24), 'one failure does not stop the others');
}

/* ---------- missing tag / secret / lock ---------- */
{
  const s = sandbox({ tags: TAGS.filter((t) => t.id !== 2) });
  assert.throws(() => run(s), /not found.*Quiz Call 01 hour reminder/);
  passed += 1;
  ok(!s.calls.some((c) => c.method === 'post'), 'missing tag: nothing created or added');
}
{
  const s = sandbox({}, { props: { KIT_API_SECRET: '' } });
  assert.throws(() => run(s), /Missing Script Property KIT_API_SECRET/);
  passed += 1;
}
{
  const s = sandbox({ members: { 1: [person(1, NOW + 47 * H)] } }, { locked: true });
  const res = run(s);
  ok(res.skipped === true && s.calls.length === 0, 'lock held by another run → skip, no calls');
}
{
  const s = sandbox({ tags: TAGS.map((t) => (t.id === 2 ? { ...t, name: ' quiz call 01 HOUR reminder ' } : t)), members: { 1: [person(1, NOW + 0.5 * H)] } });
  run(s);
  eq(posts(s.calls), [{ tag: 2, email: 'p1@example.com' }], 'tag names match ignoring case/spaces');
}

/* ---------- setup / stop ---------- */
{
  const old = { getHandlerFunction: () => 'runReminders' };
  const other = { getHandlerFunction: () => 'somethingElse' };
  const s = sandbox({}, { triggers: [old, other] });
  s.ctx.setup();
  const mine = s.triggers.filter((t) => t.getHandlerFunction() === 'runReminders');
  ok(mine.length === 1 && mine[0] !== old && mine[0].minutes === 15, 'setup: one fresh 15-minute trigger');
  ok(s.triggers.includes(other), 'setup: other triggers untouched');
  s.ctx.stop();
  ok(!s.triggers.some((t) => t.getHandlerFunction() === 'runReminders'), 'stop: trigger removed');
}

console.log(`booking reminders: ${passed} checks passed`);
