/**
 * Booking reminder tags: Google Apps Script (runs on the Nomads Google account)
 * =============================================================================
 * Every 15 minutes:
 *   1. Get everyone in Kit with the tag "Quiz Booked a Call".
 *   2. Read their booking time from the Kit field "Booking Time & Date Raw"
 *      (booking_time_date_raw, UTC, e.g. 2026-10-09T12:30:00.000000Z).
 *   3. When their call is 48h / 24h / 1h away, add the matching reminder tag.
 *      Kit's automations (Nomads' side) send the email when the tag lands.
 *
 * Rules (agreed with Nomads / Samad, Nov 6-7 2026):
 *   - A reminder tag already on the person = already sent, so it's never added twice.
 *   - Late bookings: if more than one reminder is due at once, only the CLOSEST
 *     one is added (booked 20h ahead → 24h reminder now, 1h later; never the 48h).
 *   - Up to 15 minutes late is fine (the trigger runs every 15 minutes).
 *   - Cancellations and reschedules are out of scope for now.
 *
 * Setup: see "Booking reminders - setup guide.html" in this folder.
 * The Kit v3 secret lives ONLY in Script Properties (KIT_API_SECRET), never here.
 */

var KIT_API = 'https://api.convertkit.com/v3';

var CONFIG = {
  watchTag: 'Quiz Booked a Call',
  bookingField: 'booking_time_date_raw',
  // Order doesn't matter; "closest" = smallest hours.
  reminders: [
    { hours: 48, tag: 'Quiz Call 48 hour reminder' },
    { hours: 24, tag: 'Quiz Call 24 hour reminder' },
    { hours: 1, tag: 'Quiz Call 01 hour reminder' },
  ],
  triggerMinutes: 15,
  maxRetries: 3,
  maxPages: 400, // 50 per page → safety stop at 20,000 people
};

var HOUR_MS = 60 * 60 * 1000;

/* ------------------------------------------------------------------ */
/*  Public functions (pick these in the Apps Script "Run" menu)        */
/* ------------------------------------------------------------------ */

/** The real job. The 15-minute trigger runs this. */
function runReminders() {
  return runReminders_({ dryRun: false });
}

/** Does everything EXCEPT add tags; logs what it would do. Safe to run anytime. */
function dryRun() {
  return runReminders_({ dryRun: true });
}

/** Checks the secret + all 4 tag names, then installs the 15-minute trigger. */
function setup() {
  var secret = getSecret_();
  var account = kitRequest_('get', '/account', { api_secret: secret });
  console.log('Kit account OK: ' + (account.name || '(no name)'));
  findTagIds_(secret); // throws if any tag name is missing
  console.log('All 4 tags found.');
  removeTriggers_();
  ScriptApp.newTrigger('runReminders').timeBased().everyMinutes(CONFIG.triggerMinutes).create();
  console.log('Trigger installed: runReminders every ' + CONFIG.triggerMinutes + ' minutes.');
}

/** Switches the reminders off (removes the trigger). */
function stop() {
  var n = removeTriggers_();
  console.log('Removed ' + n + ' trigger(s). Reminders are OFF.');
}

/* ------------------------------------------------------------------ */
/*  Core                                                               */
/* ------------------------------------------------------------------ */

function runReminders_(opts) {
  opts = opts || {};
  var dry = !!opts.dryRun;
  var now = typeof opts.now === 'number' ? opts.now : Date.now();

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    console.log('Another run is still going, skipping this one.');
    return { skipped: true };
  }
  try {
    var secret = getSecret_();
    var tagIds = findTagIds_(secret);

    var booked = listTagSubscribers_(secret, tagIds[CONFIG.watchTag]);

    // Who already has each reminder tag (by subscriber id)
    var tagged = {};
    CONFIG.reminders.forEach(function (r) {
      var ids = {};
      listTagSubscribers_(secret, tagIds[r.tag]).forEach(function (s) {
        ids[s.id] = true;
      });
      tagged[r.hours] = ids;
    });

    var plan = planReminders_(booked, tagged, now);
    plan.notes.forEach(function (n) {
      console.log(n);
    });

    var added = 0;
    var errors = [];
    plan.actions.forEach(function (a) {
      var line =
        (dry ? '[DRY RUN] would add ' : 'Adding ') + '"' + a.reminder.tag + '" → ' + a.email +
        ' (call ' + a.callIso + ', ' + a.hoursLeft.toFixed(2) + 'h left)';
      if (dry) {
        console.log(line);
        return;
      }
      try {
        var body = { api_secret: secret, email: a.email };
        kitRequest_('post', '/tags/' + tagIds[a.reminder.tag] + '/subscribe', null, body);
        added += 1;
        console.log(line + ': done');
      } catch (err) {
        errors.push(a.email + ' / ' + a.reminder.tag + ': ' + err.message);
        console.error(line + ': FAILED: ' + err.message);
      }
    });

    console.log(
      'Summary: ' + booked.length + ' booked, ' + plan.actions.length + ' due, ' +
        (dry ? 'dry run (nothing added)' : added + ' tag(s) added') +
        (errors.length ? ', ' + errors.length + ' error(s)' : '')
    );
    if (errors.length) {
      // Throwing makes Google email the script owner about the failed run.
      throw new Error('Some reminder tags failed:\n' + errors.join('\n'));
    }
    return { booked: booked.length, actions: plan.actions, added: added, dryRun: dry };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Pure decision logic (no network), so it can be tested.
 * subscribers: [{id, email_address, state, fields:{...}}]
 * tagged: {48:{id:true}, 24:{...}, 1:{...}}
 */
function planReminders_(subscribers, tagged, now) {
  var actions = [];
  var notes = [];
  var byClosest = CONFIG.reminders.slice().sort(function (a, b) {
    return a.hours - b.hours;
  });

  subscribers.forEach(function (s) {
    var email = s.email_address;
    if (s.state && s.state !== 'active') return;
    var raw = s.fields ? s.fields[CONFIG.bookingField] : null;
    if (raw === null || raw === undefined || String(raw).trim() === '') {
      notes.push('Skip ' + email + ': booking time field is empty.');
      return;
    }
    var callMs = parseBookingTime_(raw);
    if (callMs === null) {
      notes.push('Skip ' + email + ': booking time not understood: "' + raw + '"');
      return;
    }
    var hoursLeft = (callMs - now) / HOUR_MS;
    if (hoursLeft <= 0) return; // call already started/passed

    // Closest reminder whose moment has arrived
    var closest = null;
    for (var i = 0; i < byClosest.length; i++) {
      if (hoursLeft <= byClosest[i].hours) {
        closest = byClosest[i];
        break;
      }
    }
    if (!closest) return; // more than 48h away
    if (tagged[closest.hours] && tagged[closest.hours][s.id]) return; // already sent

    actions.push({
      subscriberId: s.id,
      email: email,
      reminder: closest,
      hoursLeft: hoursLeft,
      callIso: new Date(callMs).toISOString(),
    });
  });

  return { actions: actions, notes: notes };
}

/**
 * Strict UTC parse. Accepts "2026-10-09T12:30:00.000000Z" (any number of
 * decimals), "2026-10-09T12:30:00Z", "2026-10-09T12:30Z" or "+00:00".
 * Anything without an explicit UTC marker returns null (never guess a time zone).
 */
function parseBookingTime_(raw) {
  var m = String(raw)
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?(Z|\+00:?00)$/i);
  if (!m) return null;
  var ms = m[7] ? Number((m[7] + '00').slice(0, 3)) : 0;
  var t = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], m[6] ? +m[6] : 0, ms);
  var d = new Date(t);
  // Reject impossible dates like 2026-02-31
  if (d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) return null;
  return t;
}

/* ------------------------------------------------------------------ */
/*  Kit API (v3, same API as the quiz's api/kit-subscribe.js)          */
/* ------------------------------------------------------------------ */

function getSecret_() {
  var s = PropertiesService.getScriptProperties().getProperty('KIT_API_SECRET');
  if (!s) throw new Error('Missing Script Property KIT_API_SECRET (Project Settings → Script Properties).');
  return s;
}

/** Tag names → ids. Looks up only, NEVER creates (a typo must not make a stray tag). */
function findTagIds_(secret) {
  var list = kitRequest_('get', '/tags', { api_secret: secret });
  var tags = (list && list.tags) || [];
  var wanted = [CONFIG.watchTag].concat(
    CONFIG.reminders.map(function (r) {
      return r.tag;
    })
  );
  var ids = {};
  var missing = [];
  wanted.forEach(function (name) {
    var hit = tags.filter(function (t) {
      return String(t.name).trim().toLowerCase() === name.toLowerCase();
    })[0];
    if (hit) ids[name] = hit.id;
    else missing.push(name);
  });
  if (missing.length) throw new Error('These Kit tags were not found (check exact names): ' + missing.join(', '));
  return ids;
}

/** Every ACTIVE subscriber with a tag (all pages). Each item includes .fields. */
function listTagSubscribers_(secret, tagId) {
  var out = [];
  var page = 1;
  var totalPages = 1;
  do {
    var res = kitRequest_('get', '/tags/' + tagId + '/subscriptions', {
      api_secret: secret,
      subscriber_state: 'active',
      page: page,
    });
    (res.subscriptions || []).forEach(function (sub) {
      if (sub && sub.subscriber) out.push(sub.subscriber);
    });
    totalPages = Number(res.total_pages) || 1;
    page += 1;
  } while (page <= totalPages && page <= CONFIG.maxPages);
  return out;
}

/** UrlFetchApp wrapper: JSON in/out, retries 429 + 5xx with a growing wait. */
function kitRequest_(method, path, query, body) {
  var url = KIT_API + path;
  if (query) {
    var qs = Object.keys(query)
      .map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(query[k]);
      })
      .join('&');
    url += '?' + qs;
  }
  var params = { method: method, muteHttpExceptions: true, headers: { Accept: 'application/json' } };
  if (body) {
    params.contentType = 'application/json';
    params.payload = JSON.stringify(body);
  }
  for (var attempt = 0; ; attempt++) {
    var resp = UrlFetchApp.fetch(url, params);
    var code = resp.getResponseCode();
    if ((code === 429 || code >= 500) && attempt < CONFIG.maxRetries) {
      Utilities.sleep(1000 * Math.pow(2, attempt)); // 1s, 2s, 4s
      continue;
    }
    var text = resp.getContentText() || '';
    var data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = {};
    }
    if (code < 200 || code >= 300) {
      // Never put the URL in the message: it contains the secret.
      var err = new Error('Kit ' + code + ' on ' + method.toUpperCase() + ' ' + path + ': ' + (data.message || data.error || text.slice(0, 200)));
      err.status = code;
      throw err;
    }
    return data;
  }
}

function removeTriggers_() {
  var n = 0;
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'runReminders') {
      ScriptApp.deleteTrigger(t);
      n += 1;
    }
  });
  return n;
}
