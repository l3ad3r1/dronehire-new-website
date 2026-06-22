/**
 * DroneHire — Google Sheets backend (Apps Script Web App)
 * ---------------------------------------------------------
 * One spreadsheet, three tabs: Pilots, Quotes, Bookings.
 *
 *   doGet(?type=pilots)  -> JSON list of ACTIVE pilots  (booking page reads this)
 *   doPost({formType})   -> appends a row:
 *                             "quote"   -> Quotes tab
 *                             "booking" -> Bookings tab
 *                             "pilot"   -> Pilots tab  (signups auto-added here)
 *
 * SETUP (one time):
 *   1. Create a Google Sheet, open Extensions > Apps Script, paste this file.
 *   2. Run setup() once (authorise when prompted) to create tabs + seed pilots.
 *   3. Deploy > New deployment > Web app:
 *        Execute as: Me
 *        Who has access: Anyone
 *      Copy the /exec URL into src/lib/config.ts (APPS_SCRIPT_URL).
 *   After changing this script, Deploy > Manage deployments > Edit > New version.
 */

// First block (id..busyUntil) is what the booking page uses; the rest is the raw
// application data captured from the signup form, kept for vetting.
var PILOT_HEADERS   = ["id","name","phone","initials","color","rating","reviews","lat","lng","certs","status","createdAt","busyUntil","areas","dgca","experience","drone","shootTypes","notes"];
var QUOTE_HEADERS   = ["createdAt","shootType","location","date"];
var BOOKING_HEADERS = ["createdAt","customerName","phone","service","location","date","pilot","zone"];

var PILOT_COLORS = ["#2563eb","#7c3aed","#0891b2","#db2777","#ea580c","#059669","#d97706","#4f46e5"];

// Hyderabad metro centre — new signups get coords near here so they show on the map.
var HYD_LAT = 17.385, HYD_LNG = 78.486;

// ── HTTP entry points ────────────────────────────────────────────────────────

function doGet(e) {
  var type = (e && e.parameter && e.parameter.type) || "pilots";
  if (type === "pilots") {
    return json(getActivePilots());
  }
  return json({ ok: false, error: "unknown type" });
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || "{}");
    var now = new Date();
    switch (body.formType) {
      case "pilot":
        appendPilot(body, now);
        break;
      case "booking":
        sheet("Bookings", BOOKING_HEADERS).appendRow([
          now, body.customerName || "", body.phone || "", body.service || "",
          body.location || "", body.date || "", body.pilot || "", body.zone || "",
        ]);
        // Mark the assigned pilot unavailable until the shoot date passes.
        assignPilot(body.pilotId, body.pilot, body.date);
        break;
      case "quote":
      default:
        sheet("Quotes", QUOTE_HEADERS).appendRow([
          now, body.shootType || "", body.location || "", body.date || "",
        ]);
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// ── Pilots ─────────────────────────────────────────────────────────────────--

function getActivePilots() {
  var sh = pilotSheet();
  var rows = sh.getDataRange().getValues();
  var head = rows.shift();
  var idx = {};
  head.forEach(function (h, i) { idx[h] = i; });
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  return rows
    .filter(function (r) {
      if (String(r[idx.status]).toLowerCase() !== "active") return false;   // must be approved
      var busyUntil = toDateStr(r[idx.busyUntil]);
      return !busyUntil || busyUntil < today;                              // free once the job date passes
    })
    .map(function (r) {
      return {
        id: String(r[idx.id]),
        name: String(r[idx.name]),
        initials: String(r[idx.initials]),
        color: String(r[idx.color]),
        rating: Number(r[idx.rating]) || 5.0,
        reviews: Number(r[idx.reviews]) || 0,
        lat: Number(r[idx.lat]),
        lng: Number(r[idx.lng]),
        certs: String(r[idx.certs]).split(",").map(function (s) { return s.trim(); }).filter(Boolean),
      };
    });
}

function appendPilot(body, now) {
  var sh = pilotSheet();
  var name = body.name || "New Pilot";
  var certs = ["DGCA RPC", "NPNT Enabled"];
  if (body.shootTypes) certs.push(body.shootTypes);
  // Derive real coordinates from the pilot's stated service area; fall back to a
  // random point near the city centre only if geocoding fails.
  var geo = geocodeArea(body.areas);
  var lat = geo ? geo.lat : HYD_LAT + (Math.random() - 0.5) * 0.08;
  var lng = geo ? geo.lng : HYD_LNG + (Math.random() - 0.5) * 0.08;
  sh.appendRow([
    "p" + now.getTime(),
    name,
    body.whatsapp || body.phone || "",
    initials(name),
    PILOT_COLORS[sh.getLastRow() % PILOT_COLORS.length],
    5.0,
    0,
    lat,
    lng,
    certs.join(", "),
    "pending",         // signups start pending — flip to "active" in the sheet to approve
    now,
    "",                // busyUntil (set when a job is assigned)
    // raw application data (for vetting; not shown to customers)
    body.areas || "",
    body.dgca || "",
    body.experience || "",
    body.drone || "",
    body.shootTypes || "",
    body.notes || "",
  ]);
}

/** Geocode a free-text Hyderabad area to {lat,lng}, or null if it can't be resolved. */
function geocodeArea(areas) {
  if (!areas) return null;
  try {
    var res = Maps.newGeocoder().setRegion("in").geocode(areas + ", Hyderabad, India");
    if (res && res.results && res.results.length) {
      var loc = res.results[0].geometry.location;
      if (loc) return { lat: loc.lat, lng: loc.lng };
    }
  } catch (e) { /* quota or lookup failure → fall back to random */ }
  return null;
}

/** Mark a pilot unavailable until the given shoot date (keeps the later date if already booked). */
function assignPilot(pilotId, pilotName, date) {
  if (!date) return;
  var sh = pilotSheet();
  var data = sh.getDataRange().getValues();
  var head = data[0];
  var idIdx = head.indexOf("id");
  var nameIdx = head.indexOf("name");
  var buIdx = head.indexOf("busyUntil");
  var newDate = String(date).slice(0, 10);
  for (var i = 1; i < data.length; i++) {
    var match = (pilotId && String(data[i][idIdx]) === String(pilotId)) ||
                (!pilotId && pilotName && String(data[i][nameIdx]) === String(pilotName));
    if (match) {
      var existing = toDateStr(data[i][buIdx]);
      var until = (existing && existing > newDate) ? existing : newDate;
      sh.getRange(i + 1, buIdx + 1).setValue(until);
      return;
    }
  }
}

function initials(name) {
  var parts = String(name).trim().split(/\s+/);
  return ((parts[0] || "")[0] || "") + ((parts[1] || "")[0] || "");
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function sheet(tabName, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(tabName);
  if (!sh) {
    sh = ss.insertSheet(tabName);
    sh.appendRow(headers);
  }
  return sh;
}

/** Pilots sheet, appending any missing PILOT_HEADERS columns (migrates older sheets). */
function pilotSheet() {
  var sh = sheet("Pilots", PILOT_HEADERS);
  var lastCol = sh.getLastColumn();
  var header = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  PILOT_HEADERS.forEach(function (h) {
    if (header.indexOf(h) === -1) {
      lastCol += 1;
      sh.getRange(1, lastCol).setValue(h);
      header.push(h);
    }
  });
  return sh;
}

/** Normalise a cell (Date object or text) to a "yyyy-MM-dd" string. */
function toDateStr(v) {
  if (!v) return "";
  if (Object.prototype.toString.call(v) === "[object Date]") {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(v).slice(0, 10);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Run once to create tabs + seed the starter pilots ──────────────────────────

function setup() {
  sheet("Quotes", QUOTE_HEADERS);
  sheet("Bookings", BOOKING_HEADERS);
  var sh = pilotSheet();
  if (sh.getLastRow() <= 1) {
    var now = new Date();
    var seed = [
      ["p1","Arjun Reddy","","AR","#2563eb",4.8,142,17.412,78.491,"DGCA RPC, NPNT Enabled","active",now,"","","","","","",""],
      ["p2","Priya Sharma","","PS","#7c3aed",4.9,89, 17.368,78.472,"DGCA RPC, NPNT Enabled, Night Ops","active",now,"","","","","","",""],
      ["p3","Kiran Naidu", "","KN","#0891b2",4.7,204,17.395,78.512,"DGCA RPC","active",now,"","","","","","",""],
    ];
    seed.forEach(function (r) { sh.appendRow(r); });
  }
}
