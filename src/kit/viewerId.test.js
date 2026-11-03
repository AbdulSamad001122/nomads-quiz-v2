/**
 * Workshop-link viewer id — run with:  node src/kit/viewerId.test.js
 * Checks the hash matches what api/workshop-progress.js verifies, and that
 * only nomadsmarketing.co/workshop links get the two Kit parameters.
 */
import assert from 'node:assert';
import { createHash } from 'node:crypto';
import { saveKitViewer, readKitViewer, withKitViewer } from './viewerId.js';

let passed = 0;
const ok = (c, label) => {
  assert.ok(c, label);
  passed += 1;
};
const mem = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
};

const store = mem();
ok(readKitViewer(store) === null, 'nothing saved yet');
await saveKitViewer('  Viewer@Example.com ', 4338103015, store);
const v = readKitViewer(store);
ok(v && v.id === '4338103015', 'id saved as text');
ok(v.sh === createHash('sha256').update('viewer@example.com').digest('hex'), 'sh = SHA-256 of the trimmed, lower-cased email');

const base = 'https://nomadsmarketing.co/workshop';
const tagged = new URL(withKitViewer(base, v));
ok(tagged.searchParams.get('ck_subscriber_id') === '4338103015' && tagged.searchParams.get('sh_kit') === v.sh, 'workshop link gets both parameters');
ok(!tagged.href.includes('example.com') && !tagged.href.includes('%40'), 'the email itself is never in the link');
ok(new URL(withKitViewer('https://www.nomadsmarketing.co/workshop?utm_source=quiz', v)).searchParams.get('utm_source') === 'quiz', 'existing parameters kept (www. too)');
ok(withKitViewer('https://nomadsmarketing.co/', v) === 'https://nomadsmarketing.co/', 'other pages untouched');
ok(withKitViewer('https://calendly.com/x', v) === 'https://calendly.com/x', 'other sites untouched');
ok(withKitViewer(base, null) === base, 'no viewer → link unchanged');
ok(withKitViewer('not a url', v) === 'not a url', 'bad href unchanged');

const broken = mem();
broken.setItem('rpv_kit_viewer', '{"id":"x","sh":"nope"}');
ok(readKitViewer(broken) === null, 'a damaged saved value is ignored');

console.log(`viewerId: all ${passed} checks passed ✓`);
