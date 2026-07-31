// State variables

let route = []; // stops for the currently ACTIVE route (see Route Manager below)

let currentShip;

let currentDrive;


// ============================================================

//  ROUTE MANAGER
//  Multiple named routes can be defined, each with its own ship, drive,
//  and stop list (e.g. a mining run on a small ship, and a separate
//  hauler delivery run) - `route`/`currentShip`/`currentDrive` above
//  always represent whichever one is currently active.
// ============================================================

let savedRoutes = []; // [{ id, name, shipName, driveName, stops }]

let activeRouteId = null;

let routeCounter = 0; // monotonically increasing, used only for default names


// Flight Simulation State

let simRunning = false;

let sim = null; // { legs, stopIndex, phase, phaseStart, phaseDuration, pos, angle, icons }

let simRafId = null;


// Map Viewport State

let mapScale = 5;

let mapOffsetX = 0;

let mapOffsetY = 0;

let isDragging = false;

let dragMoved = false;

let startDragX = 0;

let startDragY = 0;

let mouseDownClientX = 0;

let mouseDownClientY = 0;

let touchStartClientX = 0;

let touchStartClientY = 0;


const CLICK_MOVE_THRESHOLD = 5; // px of movement before a press counts as a drag, not a click

const MAP_MIN_SCALE = 0.5;

const MAP_MAX_SCALE = 800; // high enough to frame tightly-packed moons when focused on a planet


// Click/tap hit radii for the "zoom in on a planet" trigger. These are

// defined in world-space Gm, not screen pixels, so the clickable area

// scales naturally with zoom - exactly like everything else on the map -

// instead of staying a fixed blob of pixels regardless of how zoomed in

// or out you are. Pixel min/max clamps keep it usable at either extreme.

const PLANET_HIT_RADIUS_GM = 2.2;

const PLANET_HIT_RADIUS_MIN_PX = 60;

const PLANET_HIT_RADIUS_MAX_PX = 240;


// Moons and stations that orbit a planet (see locations.js `parent`) also

// trigger that planet's zoom when clicked/tapped near them, using a smaller

// version of the same scaling radius.

const SATELLITE_HIT_RADIUS_GM = 1.2;

const SATELLITE_HIT_RADIUS_MIN_PX = 28;

const SATELLITE_HIT_RADIUS_MAX_PX = 140;


const DEFAULT_HIT_RADIUS = 14; // the star, gateways, and anything with no planet parent


// Planet Focus / Camera Animation State

let focusedPlanet = null; // name of the planet currently focused on, or null for the system view

let preZoomCamera = null; // { scale, offsetX, offsetY } to restore when backing out

let cameraAnim = null; // { fromScale, fromOffsetX, fromOffsetY, toScale, toOffsetX, toOffsetY, start, duration }

let cameraRafId = null;


// Initialize once data is loaded

window.onload = () => {

    // 1. Initial State

    currentShip = shipData[0];


    // Start with a single default route ("ROUTE 1"), which `route` above

    // already represents (it starts empty).

    routeCounter = 1;

    const initialRoute = {

        id: `route-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,

        name: `ROUTE ${routeCounter}`,

        shipName: currentShip.ship,

        driveName: null,

        stops: []

    };

    savedRoutes = [initialRoute];

    activeRouteId = initialRoute.id;

   

    // 2. Populate Dropdowns

    initMenus();


    // 3. Setup Listeners

    document.getElementById('route-select').addEventListener('change', (e) => {

        switchToRoute(e.target.value);

    });


    document.getElementById('new-route-btn').addEventListener('click', () => {

        createNewRoute();

    });


    document.getElementById('delete-route-btn').addEventListener('click', () => {

        deleteRoute(activeRouteId);

    });


    document.getElementById('route-name-input').addEventListener('input', (e) => {

        renameActiveRoute(e.target.value);

    });


    document.getElementById('ship-select').addEventListener('change', (e) => {

        stopSimulation();

        currentShip = shipData[e.target.value];

        updateDriveOptions();

        updateUI();

    });


    document.getElementById('drive-select').addEventListener('change', (e) => {

        stopSimulation();

        currentDrive = quantumDrives.find(d => d.name === e.target.value);

        updateUI();

    });


    document.getElementById('add-stop-btn').addEventListener('click', () => {

        stopSimulation();

        const locSelect = document.getElementById('location-select');

        // Push a shallow copy so per-stop data (action/note) doesn't leak

        // back into the shared location database, even if the same

        // location is added to the route more than once.

        route.push({ ...db[locSelect.value], action: '', note: '', loadSize: 'medium', unloadSize: 'medium' });

        updateUI();

    });


    document.getElementById('clear-route-btn').addEventListener('click', () => {

        stopSimulation();

        route = [];

        updateUI();

    });


    document.getElementById('sim-btn').addEventListener('click', () => {

        toggleSimulation();

    });


    // --- MAP ZOOM & PAN LISTENERS ---

    const canvas = document.getElementById('mapCanvas');

   

    // Mouse Wheel Zoom

    canvas.addEventListener('wheel', (e) => {

        e.preventDefault();

        const zoomAmount = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out or in

        mapScale *= zoomAmount;

        mapScale = Math.max(MAP_MIN_SCALE, Math.min(mapScale, MAP_MAX_SCALE)); // Limit zoom bounds

        drawMap();

    });


    // Mouse Drag to Pan (a mouseup with negligible movement is treated as a click)

    canvas.addEventListener('mousedown', (e) => {

        isDragging = true;

        dragMoved = false;

        mouseDownClientX = e.clientX;

        mouseDownClientY = e.clientY;

        startDragX = e.clientX - mapOffsetX;

        startDragY = e.clientY - mapOffsetY;

        canvas.style.cursor = 'grabbing';

    });

    canvas.addEventListener('mousemove', (e) => {

        if (isDragging) {

            if (Math.hypot(e.clientX - mouseDownClientX, e.clientY - mouseDownClientY) > CLICK_MOVE_THRESHOLD) {

                dragMoved = true;

            }

            mapOffsetX = e.clientX - startDragX;

            mapOffsetY = e.clientY - startDragY;

            drawMap();

        } else {

            // Not dragging: give hover feedback so it's clear this spot will

            // zoom to a planet (pointer/hand cursor) - whether hovering the

            // planet itself or one of its moons/stations - vs. the map just

            // being pannable (grab cursor) everywhere else.

            const hoveredPlanet = resolveClickedPlanet(e.clientX, e.clientY);

            canvas.style.cursor = hoveredPlanet ? 'pointer' : 'grab';

        }

    });

    canvas.addEventListener('mouseup', (e) => {

        if (isDragging && !dragMoved) {

            handleMapClick(e.clientX, e.clientY);

        }

        isDragging = false;

        const hoveredPlanet = resolveClickedPlanet(e.clientX, e.clientY);

        canvas.style.cursor = hoveredPlanet ? 'pointer' : 'grab';

    });

    canvas.addEventListener('mouseleave', () => { isDragging = false; canvas.style.cursor = 'grab'; });


    // Touch support for mobile Map Panning (a tap with negligible movement is a click)

    canvas.addEventListener('touchstart', (e) => {

        isDragging = true;

        dragMoved = false;

        const t = e.touches[0];

        touchStartClientX = t.clientX;

        touchStartClientY = t.clientY;

        startDragX = t.clientX - mapOffsetX;

        startDragY = t.clientY - mapOffsetY;

    }, {passive: true});

    canvas.addEventListener('touchmove', (e) => {

        if (isDragging) {

            e.preventDefault(); // Stop mobile screen scroll

            const t = e.touches[0];

            if (Math.hypot(t.clientX - touchStartClientX, t.clientY - touchStartClientY) > CLICK_MOVE_THRESHOLD) {

                dragMoved = true;

            }

            mapOffsetX = t.clientX - startDragX;

            mapOffsetY = t.clientY - startDragY;

            drawMap();

        }

    }, {passive: false});

    canvas.addEventListener('touchend', (e) => {

        if (isDragging && !dragMoved) {

            const t = e.changedTouches[0];

            handleMapClick(t.clientX, t.clientY);

        }

        isDragging = false;

    });


    document.getElementById('back-to-map-btn').addEventListener('click', backToSystemMap);


    // Start System Clock

    setInterval(updateClock, 1000);

   

    updateDriveOptions();

    updateUI();

    renderRouteSelect();

    initAmbientPanels();

    updateFocusUI();

};


// ============================================================

//  AMBIENT FLAVOR SCREENS
//  Two purely decorative CRT readouts: a scanning/status feed (top-right,
//  in the spirit of an old ship computer quietly running diagnostics) and
//  a Stanton system news ticker (bottom-right) mixing the in-universe
//  megacorps with a general "something's not quite right out there" vibe -
//  isolation, cosmic dread, first-contact wonder. Nothing here references
//  any specific film, book, or character - just the flavor of that genre.
// ============================================================

const AMBIENT_SCAN_LINES = [

    "SECTOR SCAN...", "WAITING...", "CLEAR.", "NO IMMEDIATE DANGER.",

    "SIGNAL: NOMINAL", "THERMAL: NOMINAL", "PROXIMITY: NONE DETECTED",

    "RUNNING DIAGNOSTIC...", "UPLINK: STABLE", "SCANNING DEBRIS FIELD...",

    "NO LIFE SIGNS DETECTED", "AUX SENSOR SWEEP...", "ANOMALY: NONE",

    "RE-CALIBRATING ARRAY...", "HULL INTEGRITY: 100%", "MOTION: NEGATIVE",

    "STANDBY.", "AWAITING NEXT CYCLE...", "SUBSPACE: QUIET", "COMMS: OPEN",

    "TRACE ELEMENT DETECTED. LOGGING.", "UNIDENTIFIED ECHO. RE-SCANNING.",

    "RE-SCAN COMPLETE. FALSE POSITIVE.", "DEEP FIELD NOISE. IGNORING.",

    "RADIATION: BACKGROUND LEVELS ONLY", "NOTHING ON LONG RANGE.",

    "PATTERN NOT RECOGNIZED. ARCHIVING.", "ALL SYSTEMS GREEN."

];


const AMBIENT_NEWS_LINES = [

    "HURSTON DYNAMICS DENIES REPORTS OF UNSCHEDULED FACILITY LOCKDOWN",

    "MICROTECH RESEARCH TEAM REPORTS ANOMALOUS READINGS BENEATH POLAR ICE",

    "ARCCORP EXPANDS INDUSTRIAL LICENSE INTO CONTESTED SECTOR",

    "CRUSADER INDUSTRIES UNVEILS NEW LUXURY LINER, CITES 'UNMATCHED SAFETY'",

    "RSI SHAREHOLDERS QUESTION SILENCE ON MISSING SURVEY VESSEL",

    "RECORD SILENCE FROM DEEP SPACE OUTPOST FOR THIRD CONSECUTIVE CYCLE",

    "MINING CREW REPORTS 'SOMETHING BENEATH THE ICE', CORP DECLINES COMMENT",

    "HURSTON SECURITY DEPLOYED AFTER 'CONTAINMENT INCIDENT', DETAILS WITHHELD",

    "LONE SALVAGER RETURNS FROM DERELICT, REFUSES TO DISCLOSE FINDINGS",

    "SCIENTISTS CELEBRATE FIRST-CONTACT DRILL, CALL IT 'A NEW DAWN'",

    "ISOLATED OUTPOST CREW ROTATION DELAYED, CORP CITES 'LOGISTICAL REASONS'",

    "DEEP-ICE DRILLING PROJECT HALTED AFTER 'EQUIPMENT MALFUNCTION'",

    "ARCCORP LAB ANNOUNCES BREAKTHROUGH, DECLINES TO NAME SOURCE MATERIAL",

    "CRUSADER SECURITY WARNS AGAINST APPROACHING UNCHARTED WRECKAGE",

    "MICROTECH WHISTLEBLOWER CLAIMS RESEARCH STATION 'WENT DARK' FOR 40 HOURS",

    "OLD EARTH RELIC RECOVERED IN DEEP FIELD, RESEARCHERS CALL IT 'IMPOSSIBLE'",

    "HURSTON MINERS REPORT STRANGE CHANTING OVER OPEN COMMS, CORP BLAMES INTERFERENCE",

    "STANTON EXPRESS DELAYED AFTER CREW REPORTS 'UNEXPLAINED VISITOR' ONBOARD",

    "AI RESEARCH DIVISION PROMISES 'A SAFER STANTON', DETAILS CLASSIFIED",

    "AGED PROBE RETURNS WITH DECADES-OLD DISTRESS SIGNAL, ORIGIN UNKNOWN",

    "RSI ANNOUNCES NEW COLONY CHARTER, PROMISES 'ROOM FOR EVERYONE'",

    "RESEARCH VESSEL LOGS FINAL ENTRY: 'IT WASN'T ON ANY CHART'",

    "MICROTECH: ICE CORE SAMPLES 'OLDER THAN EXPECTED', FURTHER STUDY PENDING"

];


// Starts a self-perpetuating typewriter log in the given container: types

// out a random line, waits a random interval, then adds the next one,

// scrolling old lines off once the log gets too long.

function startAmbientFeed(containerId, lines, opts) {

    const container = document.getElementById(containerId);

    if (!container) return;


    const maxLines = (opts && opts.maxLines) || 6;

    const minDelay = (opts && opts.minDelay) || 2200;

    const maxDelay = (opts && opts.maxDelay) || 4200;

    const typeSpeedMs = (opts && opts.typeSpeedMs) || 16;


    function ensureCursorAtEnd() {

        let cursor = container.querySelector('.ambient-cursor');

        if (!cursor) {

            cursor = document.createElement('span');

            cursor.className = 'ambient-cursor';

        }

        container.appendChild(cursor); // (re)appending moves it to the end

    }


    function addLine() {

        const cursor = container.querySelector('.ambient-cursor');

        if (cursor) cursor.remove();


        const prevLatest = container.querySelector('.line.latest');

        if (prevLatest) prevLatest.classList.remove('latest');


        const lineEl = document.createElement('div');

        lineEl.className = 'line latest';

        container.appendChild(lineEl);


        const text = lines[Math.floor(Math.random() * lines.length)];

        let i = 0;


        function typeChar() {

            if (i <= text.length) {

                lineEl.textContent = text.slice(0, i);

                i++;

                container.scrollTop = container.scrollHeight;

                setTimeout(typeChar, typeSpeedMs);

            } else {

                ensureCursorAtEnd();


                while (container.querySelectorAll('.line').length > maxLines) {

                    const oldest = container.querySelector('.line');

                    if (oldest) oldest.remove();

                }


                container.scrollTop = container.scrollHeight;


                const delay = minDelay + Math.random() * (maxDelay - minDelay);

                setTimeout(addLine, delay);

            }

        }


        typeChar();

    }


    addLine();

}


// ============================================================

//  BOUNTY / THREAT BOARD
//  A third ambient screen, stacked directly above the news feed, that
//  alternates between a made-up "wanted" entry (a person or a ship,
//  silhouette-only, fixed 30,000 aUEC bounty) and a rarer multi-ship
//  "pirates sighted near X" alert. All names/ships/charges are randomly
//  generated - nothing here represents a real or specific fictional person.
// ============================================================

const BOUNTY_FIRST_NAMES = [

    "Kaelen", "Vashti", "Draven", "Yusra", "Tomas", "Nadia", "Boone", "Ilsa",

    "Reza", "Callum", "Petra", "Osric", "Mira", "Talon", "Sable", "Jorek"

];


const BOUNTY_LAST_NAMES = [

    "Marek", "Okoye", "Vance", "Delgado", "Skarsen", "Voss", "Ilyanov",

    "Reyes", "Kade", "Novak", "Hollis", "Zheng", "Brantt", "Ferro", "Aldane"

];


const BOUNTY_CHARGES = [

    "PIRACY", "GRAND THEFT (VESSEL)", "SMUGGLING", "ARMED ROBBERY",

    "ASSAULT ON CIVILIAN CONVOY", "UNLICENSED SALVAGE", "EXTORTION",

    "CARGO HIJACKING", "ILLEGAL BOARDING", "EVADING SECURITY FORCES"

];


const BOUNTY_SHIP_NAMES = [

    "Widow's Debt", "Black Hollow", "Second Chance", "No Quarter",

    "Rustbucket", "Last Rites", "Iron Vow", "Dead Reckoning",

    "Void Kiss", "Salt & Ash", "Long Silence", "Nine Lives Gone"

];


const PIRATE_SIGHTING_LOCATIONS = ["HURSTON", "CRUSADER", "ARCCORP", "MICROTECH"];


function pickRandom(arr) {

    return arr[Math.floor(Math.random() * arr.length)];

}


// Generic, non-representational silhouettes - a head-and-shoulders bust and

// an abstract dart-shaped vessel. Deliberately featureless so they read as

// "wanted poster" iconography rather than any specific person or ship.

function personSilhouetteSvg(size) {

    return `<svg viewBox="0 0 60 70" width="${size}" height="${Math.round(size * 70 / 60)}"><circle cx="30" cy="20" r="14" fill="currentColor"/><path d="M8,68 C8,45 16,36 30,36 C44,36 52,45 52,68 Z" fill="currentColor"/></svg>`;

}


function shipSilhouetteSvg(size) {

    return `<svg viewBox="0 0 70 50" width="${size}" height="${Math.round(size * 50 / 70)}"><path d="M35,2 L45,20 L60,26 L60,32 L45,30 L38,46 L32,46 L28,30 L10,32 L10,26 L25,20 Z" fill="currentColor"/></svg>`;

}


function generateBountyEntry() {

    const isPerson = Math.random() < 0.5;

    return {

        kind: isPerson ? 'person' : 'ship',

        name: isPerson ? `${pickRandom(BOUNTY_FIRST_NAMES)} ${pickRandom(BOUNTY_LAST_NAMES)}` : pickRandom(BOUNTY_SHIP_NAMES),

        charge: pickRandom(BOUNTY_CHARGES)

    };

}


function renderBountyEntryHtml(entry) {

    const silhouette = entry.kind === 'person' ? personSilhouetteSvg(48) : shipSilhouetteSvg(56);

    return `

        <div class="bounty-silhouette">${silhouette}</div>

        <div class="bounty-info">

            <div class="bounty-label">WANTED</div>

            <div class="bounty-name">${escapeAttr(entry.name)}</div>

            <div class="bounty-charge">${escapeAttr(entry.charge)}</div>

            <div class="bounty-reward">BOUNTY: 30,000 aUEC</div>

        </div>

    `;

}


function renderPirateSightingHtml(location) {

    return `

        <div class="pirate-ships">${shipSilhouetteSvg(30)}${shipSilhouetteSvg(30)}${shipSilhouetteSvg(30)}</div>

        <div class="pirate-alert-text">⚠ PIRATES SIGHTED NEAR ${escapeAttr(location)}</div>

    `;

}


// Alternates between bounty entries and (rarer) pirate sighting alerts, with

// a brief flicker on each swap so it reads as a screen refreshing rather

// than content just popping in.

function startBountyBoard(containerId, opts) {

    const container = document.getElementById(containerId);

    if (!container) return;


    const minDelay = (opts && opts.minDelay) || 6000;

    const maxDelay = (opts && opts.maxDelay) || 11000;

    const flickerMs = (opts && opts.flickerMs) || 220;

    const pirateChance = (opts && opts.pirateChance != null) ? opts.pirateChance : 0.3;


    function scheduleNext() {

        const delay = minDelay + Math.random() * (maxDelay - minDelay);

        setTimeout(showNext, delay);

    }


    function showNext() {

        container.classList.add('bounty-flicker');

        setTimeout(() => {

            if (Math.random() < pirateChance) {

                container.innerHTML = renderPirateSightingHtml(pickRandom(PIRATE_SIGHTING_LOCATIONS));

                container.className = 'ambient-bounty-body mode-pirate';

            } else {

                container.innerHTML = renderBountyEntryHtml(generateBountyEntry());

                container.className = 'ambient-bounty-body mode-bounty';

            }

            container.classList.remove('bounty-flicker');

            scheduleNext();

        }, flickerMs);

    }


    showNext();

}


// ============================================================

//  SCAN WAVEFORM DISPLAY
//  A small always-moving oscilloscope-style readout beneath the scan feed:
//  a calm sine wave (the baseline signal) overlaid with a jagged, erratic
//  "distressed" wave (built from summed sines at different frequencies/
//  speeds rather than per-frame randomness, so it looks organically
//  chaotic without flickering frame to frame).
// ============================================================

let scanWaveformTimerId = null;


function distressedWaveValue(x, t) {

    // Time coefficients are deliberately small relative to the ~40ms frame

    // interval, so each redraw is a small, smooth step rather than a large

    // jump - "erratic-looking" comes from the mismatched frequencies beating

    // against each other, not from fast per-frame jitter.

    return Math.sin(x * 0.15 + t * 0.0015) * 0.5 +

           Math.sin(x * 0.37 + t * 0.0032) * 0.3 +

           Math.sin(x * 0.71 - t * 0.0022) * 0.2;

}


function drawScanWaveform(ctx, width, height, t) {

    ctx.clearRect(0, 0, width, height);

    const midY = height / 2;


    // Center baseline

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';

    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.moveTo(0, midY);

    ctx.lineTo(width, midY);

    ctx.stroke();


    // Calm sine wave - the steady baseline signal

    ctx.strokeStyle = 'rgba(255, 115, 0, 0.85)';

    ctx.lineWidth = 1.4;

    ctx.beginPath();

    for (let x = 0; x <= width; x += 2) {

        const y = midY + Math.sin(x * 0.05 + t * 0.0022) * (height * 0.24);

        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);

    }

    ctx.stroke();


    // Distressed wave - jagged, erratic amplitude, in a warning color

    ctx.strokeStyle = 'rgba(255, 51, 51, 0.85)';

    ctx.lineWidth = 1.2;

    ctx.beginPath();

    for (let x = 0; x <= width; x += 2) {

        const y = midY + distressedWaveValue(x, t) * (height * 0.32);

        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);

    }

    ctx.stroke();

}


function startScanWaveform(canvasId) {

    const canvas = document.getElementById(canvasId);

    if (!canvas) return;


    const ctx = canvas.getContext('2d');

    canvas.width = canvas.clientWidth || 260;

    canvas.height = canvas.clientHeight || 72;


    if (scanWaveformTimerId) clearTimeout(scanWaveformTimerId);


    // Throttled via setTimeout rather than a raw requestAnimationFrame loop:

    // ~25fps is plenty smooth for this small ambient decoration, uses much

    // less CPU than redrawing on every display refresh, and (unlike RAF,

    // which has no guaranteed minimum delay) setTimeout gives a real,

    // predictable gap between frames so this can never monopolize the

    // event loop or starve other timers on the page.

    const frameIntervalMs = 40;


    function tick() {

        drawScanWaveform(ctx, canvas.width, canvas.height, performance.now());

        scanWaveformTimerId = setTimeout(tick, frameIntervalMs);

    }


    tick();

}


// Mobile boxes are much smaller and hard-fixed in size (see the ≤850px

// CSS), so old lines are pruned earlier here rather than letting a big

// backlog build up and rely on overflow-clipping to hide it.

function getAmbientFeedConfig() {

    const isMobileViewport = window.innerWidth <= 850;

    return {

        isMobileViewport,

        scanMaxLines: isMobileViewport ? 3 : 6,

        newsMaxLines: isMobileViewport ? 3 : 12

    };

}


function initAmbientPanels() {

    const { scanMaxLines, newsMaxLines } = getAmbientFeedConfig();


    startAmbientFeed('scan-panel-body', AMBIENT_SCAN_LINES, { minDelay: 1800, maxDelay: 3600, maxLines: scanMaxLines });

    startAmbientFeed('news-panel-body', AMBIENT_NEWS_LINES, { minDelay: 6000, maxDelay: 11000, maxLines: newsMaxLines, typeSpeedMs: 14 });

    startBountyBoard('bounty-panel-body', { minDelay: 6000, maxDelay: 11000, pirateChance: 0.3 });

    startScanWaveform('scan-waveform-canvas');

}


function updateClock() {

    const now = new Date();

    const timeStr = now.toTimeString().split(' ')[0];

    document.getElementById('sys-time').innerText = `SYS_CLK: ${timeStr}`;

}


function initMenus() {

    const shipSelect = document.getElementById('ship-select');

    shipData.forEach((ship, index) => {

        let opt = document.createElement('option');

        opt.value = index;

        opt.innerHTML = ship.ship;

        shipSelect.appendChild(opt);

    });


    const locSelect = document.getElementById('location-select');

    [...db].sort((a, b) => a.name.localeCompare(b.name)).forEach((loc) => {

        const originalIndex = db.findIndex(l => l.name === loc.name);

        let opt = document.createElement('option');

        opt.value = originalIndex;

        opt.innerHTML = `[${loc.type.substring(0,3)}] ${loc.name}`;

        locSelect.appendChild(opt);

    });

}


function updateDriveOptions() {

    const driveSelect = document.getElementById('drive-select');

    driveSelect.innerHTML = '';

    const compatibleDrives = quantumDrives.filter(d => d.size === currentShip.driveSize);

   

    compatibleDrives.forEach(drive => {

        let opt = document.createElement('option');

        opt.value = drive.name;

        opt.innerHTML = `${drive.name} (${drive.maxSpeedKmS} km/s)`;

        if (drive.name === currentShip.defaultDrive) opt.selected = true;

        driveSelect.appendChild(opt);

    });

    currentDrive = quantumDrives.find(d => d.name === driveSelect.value);

}


function calcDist(p1, p2) {

    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

}


window.removeStop = (index) => {

    stopSimulation();

    route.splice(index, 1);

    updateUI();

};


// Escapes text for safe use inside an HTML attribute (e.g. an input's value="...")

function escapeAttr(str) {

    return String(str)

        .replace(/&/g, '&amp;')

        .replace(/"/g, '&quot;')

        .replace(/</g, '&lt;')

        .replace(/>/g, '&gt;');

}


// ============================================================

//  STOP ACTION ICONS
//  Small hand-drawn vector glyphs (not platform emoji) so they stay
//  monochrome and on-theme with the amber CRT look, both in the route
//  list (as inline SVG) and on the canvas map / flight sim overlay.
// ============================================================

const ICON_COLORS = {

    load: '#ff7300',    // primary orange

    unload: '#e9b941',  // highlight amber

    refuel: '#ffb700',  // fuel-warning amber (matches .refuel-step)

    note: '#aaaaaa',     // dim grey

    mining: '#5ec9c0',    // mineral teal

    refining: '#5b9bd5',  // processing blue

    salvaging: '#e05c5c'  // rust/scrap red

};


// Visual scale multiplier for load/unload icons based on cargo size, so a

// LARGE haul reads as visibly bigger than a SMALL one at a glance. Not

// meaningful for refuel/note icons, which always render at 'medium'.

const CARGO_SIZE_SCALE = { small: 0.75, medium: 1, large: 1.35 };


// Inline SVG markup for the route-list badges. viewBox is -10..10 on both

// axes so the same coordinate language maps cleanly onto the canvas version.

function stopIconSvg(kind) {

    const attrs = 'viewBox="-10 -10 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"';


    switch (kind) {

        case 'load':

            return `<svg ${attrs}><line x1="-6" y1="4" x2="6" y2="4"/><line x1="0" y1="-6" x2="0" y2="2"/><polyline points="-3,-1 0,3 3,-1"/></svg>`;

        case 'unload':

            return `<svg ${attrs}><line x1="-6" y1="4" x2="6" y2="4"/><line x1="0" y1="2" x2="0" y2="-6"/><polyline points="-3,-3 0,-7 3,-3"/></svg>`;

        case 'refuel':

            return `<svg ${attrs}><path d="M0,-7 C4,-2 3.5,6 0,6.5 C-3.5,6 -4,-2 0,-7 Z"/></svg>`;

        case 'note':

            return `<svg ${attrs}><path d="M-5,-6 L3,-6 L7,0 L3,6 L-5,6 Z"/><circle cx="-1.5" cy="0" r="1.2" fill="currentColor" stroke="none"/></svg>`;

        case 'mining':

            return `<svg ${attrs}><polygon points="0,-7 5,-2 3,7 -3,7 -5,-2"/><line x1="-5" y1="-2" x2="5" y2="-2"/><line x1="0" y1="-7" x2="0" y2="7"/></svg>`;

        case 'refining':

            return `<svg ${attrs}><polygon points="0,-9 7.8,-4.5 7.8,4.5 0,9 -7.8,4.5 -7.8,-4.5"/><polygon points="0,-3.6 3.1,-1.8 3.1,1.8 0,3.6 -3.1,1.8 -3.1,-1.8"/></svg>`;

        case 'salvaging':

            return `<svg ${attrs}><path d="M-5,-6 L-5,1 A5,5 0 0 0 5,1 L5,-6"/><line x1="-5" y1="-6" x2="-2" y2="-6"/><line x1="5" y1="-6" x2="2" y2="-6"/></svg>`;

        default:

            return '';

    }

}


function renderStopIconsHtml(icons) {

    return icons.map(ic => {

        const scale = CARGO_SIZE_SCALE[ic.size] || 1;

        const sizeLabel = (ic.kind === 'load' || ic.kind === 'unload') ? ` (${(ic.size || 'medium').toUpperCase()})` : '';

        return `<span class="stop-icon icon-${ic.kind}" title="${ic.kind.toUpperCase()}${sizeLabel}" style="transform: scale(${scale});">${stopIconSvg(ic.kind)}</span>`;

    }).join('');

}


// Canvas equivalent of stopIconSvg(), used on the map and the flight sim

// overlay. Draws centered at (x, y) with the given pixel size.

function drawStopIcon(ctx, kind, x, y, size) {

    const s = size / 2;

    const color = ICON_COLORS[kind] || '#fff';


    ctx.save();

    ctx.translate(x, y);

    ctx.strokeStyle = color;

    ctx.fillStyle = color;

    ctx.lineWidth = Math.max(1, size * 0.14);

    ctx.lineCap = 'round';

    ctx.lineJoin = 'round';


    if (kind === 'load') {

        ctx.beginPath(); ctx.moveTo(-s * 0.8, s * 0.4); ctx.lineTo(s * 0.8, s * 0.4); ctx.stroke();

        ctx.beginPath(); ctx.moveTo(0, -s * 0.6); ctx.lineTo(0, s * 0.2); ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(-s * 0.4, -s * 0.1);

        ctx.lineTo(0, s * 0.3);

        ctx.lineTo(s * 0.4, -s * 0.1);

        ctx.stroke();

    } else if (kind === 'unload') {

        ctx.beginPath(); ctx.moveTo(-s * 0.8, s * 0.4); ctx.lineTo(s * 0.8, s * 0.4); ctx.stroke();

        ctx.beginPath(); ctx.moveTo(0, s * 0.2); ctx.lineTo(0, -s * 0.6); ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(-s * 0.4, -s * 0.3);

        ctx.lineTo(0, -s * 0.7);

        ctx.lineTo(s * 0.4, -s * 0.3);

        ctx.stroke();

    } else if (kind === 'refuel') {

        ctx.beginPath();

        ctx.moveTo(0, -s * 0.7);

        ctx.bezierCurveTo(s * 0.7, -s * 0.05, s * 0.6, s * 0.65, 0, s * 0.7);

        ctx.bezierCurveTo(-s * 0.6, s * 0.65, -s * 0.7, -s * 0.05, 0, -s * 0.7);

        ctx.closePath();

        ctx.stroke();

    } else if (kind === 'note') {

        ctx.beginPath();

        ctx.moveTo(-s * 0.55, -s * 0.6);

        ctx.lineTo(s * 0.3, -s * 0.6);

        ctx.lineTo(s * 0.75, 0);

        ctx.lineTo(s * 0.3, s * 0.6);

        ctx.lineTo(-s * 0.55, s * 0.6);

        ctx.closePath();

        ctx.stroke();

        ctx.beginPath();

        ctx.arc(-s * 0.15, 0, s * 0.12, 0, Math.PI * 2);

        ctx.fill();

    } else if (kind === 'mining') {

        ctx.beginPath();

        ctx.moveTo(0, -s * 0.7);

        ctx.lineTo(s * 0.5, -s * 0.2);

        ctx.lineTo(s * 0.3, s * 0.7);

        ctx.lineTo(-s * 0.3, s * 0.7);

        ctx.lineTo(-s * 0.5, -s * 0.2);

        ctx.closePath();

        ctx.stroke();

        ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 0.2); ctx.lineTo(s * 0.5, -s * 0.2); ctx.stroke();

        ctx.beginPath(); ctx.moveTo(0, -s * 0.7); ctx.lineTo(0, s * 0.7); ctx.stroke();

    } else if (kind === 'refining') {

        ctx.beginPath();

        ctx.moveTo(0, -s * 0.9);

        ctx.lineTo(s * 0.78, -s * 0.45);

        ctx.lineTo(s * 0.78, s * 0.45);

        ctx.lineTo(0, s * 0.9);

        ctx.lineTo(-s * 0.78, s * 0.45);

        ctx.lineTo(-s * 0.78, -s * 0.45);

        ctx.closePath();

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(0, -s * 0.36);

        ctx.lineTo(s * 0.31, -s * 0.18);

        ctx.lineTo(s * 0.31, s * 0.18);

        ctx.lineTo(0, s * 0.36);

        ctx.lineTo(-s * 0.31, s * 0.18);

        ctx.lineTo(-s * 0.31, -s * 0.18);

        ctx.closePath();

        ctx.stroke();

    } else if (kind === 'salvaging') {

        ctx.beginPath();

        ctx.moveTo(-s * 0.5, -s * 0.6);

        ctx.lineTo(-s * 0.5, s * 0.1);

        ctx.arc(0, s * 0.1, s * 0.5, Math.PI, 2 * Math.PI, false);

        ctx.lineTo(s * 0.5, -s * 0.6);

        ctx.stroke();

        ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 0.6); ctx.lineTo(-s * 0.2, -s * 0.6); ctx.stroke();

        ctx.beginPath(); ctx.moveTo(s * 0.5, -s * 0.6); ctx.lineTo(s * 0.2, -s * 0.6); ctx.stroke();

    }


    ctx.restore();

}


// Recomputes the leg-by-leg breakdown of the current route: distance, travel

// time (incl. nav-buffer), fuel used, and whether a mandatory refuel happens

// at the START of that leg. Both the route list and the flight simulation

// pull from this single source of truth so they can never drift out of sync.

// ============================================================

//  ATMOSPHERE ENTRY/EXIT PENALTY
//  Surface locations (landing on a planet or moon directly, rather than
//  an orbital station) require dropping out of/into atmosphere to reach
//  quantum speed - an extra delay on top of the jump itself. The penalty
//  scales with ship size (proxied by drive size, since bigger ships need
//  bigger drives) and is halved for moons vs. full planets.
// ============================================================

const ATMO_PENALTY_MIN_BY_DRIVE_SIZE = {

    S1: 2, // small ships

    S2: 4, // medium ships

    S3: 6, // large ships

    S4: 8  // even bigger / capital-class ships

};


// Minutes of atmo penalty for a single transition (either the exit at

// departure or the entry at arrival) at a body of the given type.

function atmoPenaltyMinutesFor(bodyType) {

    if (!currentShip || !bodyType) return 0;

    const base = ATMO_PENALTY_MIN_BY_DRIVE_SIZE[currentShip.driveSize] || 0;

    return bodyType === 'moon' ? base / 2 : base;

}


// If `loc` is a surface location sitting directly on a planet or moon,

// returns that body's type ('planet' or 'moon'); otherwise null. Locations

// not yet added (orbital stations, gateways, etc.) simply return null, so

// this stays a no-op until surface-type locations exist in the database.

function surfaceBodyType(loc) {

    if (!loc || loc.type !== 'surface' || !loc.parent) return null;

    const parent = db.find(l => l.name === loc.parent);

    if (!parent) return null;

    return (parent.type === 'planet' || parent.type === 'moon') ? parent.type : null;

}


// ============================================================

//  ON-SITE ACTIVITY TIME (mining / refining / salvaging)
//  Unlike load/unload/refuel, these actions represent real time spent
//  working a stop before departing, so they add directly to the route's
//  estimated total time. Mining and salvaging have a selectable duration
//  within their range; refining is a fixed 5 minutes.
// ============================================================

const ACTIVITY_DURATION_OPTIONS_MIN = {

    mining: [20, 25, 30],

    salvaging: [10, 12.5, 15]

};


const REFINING_DURATION_MIN = 5;


function getStopActivityMinutes(stop) {

    if (!stop) return 0;

    if (stop.action === 'mining') return stop.activityDurationMin || ACTIVITY_DURATION_OPTIONS_MIN.mining[1];

    if (stop.action === 'salvaging') return stop.activityDurationMin || ACTIVITY_DURATION_OPTIONS_MIN.salvaging[1];

    if (stop.action === 'refining') return REFINING_DURATION_MIN;

    return 0;

}


function computeRouteLegs() {

    const buffers = { "S1": 1, "S2": 3, "S3": 5 };

    const bufferMin = currentShip ? (buffers[currentShip.driveSize] || 0) : 0;


    const result = {

        legs: [],

        totalDistance: 0,

        totalTimeSec: 0,

        totalRefuelTimeMin: 0,

        totalAtmoTimeMin: 0,

        totalActivityTimeMin: 0,

        finalFuel: currentShip ? currentShip.fuelCapacitySCU : 0,

        isImpossible: false,

        bufferMin

    };


    // Activity time (mining/refining/salvaging) doesn't depend on fuel or

    // drive math, so it's tallied for every stop even if the route is

    // otherwise too short to compute legs from (e.g. a single stop).

    route.forEach(stop => {

        result.totalActivityTimeMin += getStopActivityMinutes(stop);

    });

    result.totalTimeSec += result.totalActivityTimeMin * 60;


    if (!currentShip || !currentDrive || route.length < 2) return result;


    let currentFuel = currentShip.fuelCapacitySCU;


    for (let i = 1; i < route.length; i++) {

        const legDist = calcDist(route[i-1], route[i]);

        result.totalDistance += legDist;


        const fuelNeeded = (legDist * currentDrive.fuelRequirementMSCUperGm) / 1000;

        if (fuelNeeded > currentShip.fuelCapacitySCU) result.isImpossible = true;


        // AUTOMATIC REFUEL: if the tank would run out before completing this

        // leg, a refuel is inserted at the previous stop automatically -

        // no manual action is required for this to happen.

        let refueledHere = false;

        if (fuelNeeded > currentFuel) {

            refueledHere = true;

            result.totalRefuelTimeMin += 2;

            result.totalTimeSec += 120; // 2 minutes in seconds

            currentFuel = currentShip.fuelCapacitySCU;

        }


        currentFuel -= fuelNeeded;

        const legTimeSec = (legDist * 1000000) / currentDrive.maxSpeedKmS;


        // ATMOSPHERE PENALTY: exiting atmo at a surface departure point,

        // and/or entering atmo at a surface arrival point. A leg between

        // two surface locations pays both; a leg with an orbital station

        // at either end only pays for the surface side.

        const originBody = surfaceBodyType(route[i-1]);

        const destBody = surfaceBodyType(route[i]);

        const atmoPenaltyMin = atmoPenaltyMinutesFor(originBody) + atmoPenaltyMinutesFor(destBody);

        result.totalAtmoTimeMin += atmoPenaltyMin;


        const legTimeMin = (legTimeSec / 60) + bufferMin + atmoPenaltyMin;

        result.totalTimeSec += (legTimeSec + (bufferMin * 60) + (atmoPenaltyMin * 60));


        result.legs.push({

            from: route[i-1],

            to: route[i],

            legDist,

            legTimeMin,

            fuelNeeded,

            refueledHere,

            atmoPenaltyMin,

            originBody,

            destBody

        });

    }


    result.finalFuel = currentFuel;

    return result;

}


// Works out which icon "kinds" apply to a given stop index: whatever the

// player picked from the action dropdown, plus an automatic refuel icon

// whenever the fuel math requires one there - regardless of what (if

// anything) was manually selected. Each icon carries its cargo size

// ('small'/'medium'/'large') so load/unload icons can render at a scale

// that matches - refuel/note icons always use 'medium' (no size concept).

function getStopIcons(stopIndex, legs) {

    const icons = [];

    const stop = route[stopIndex];

    if (!stop) return icons;


    switch (stop.action) {

        case 'load':

            icons.push({ kind: 'load', size: stop.loadSize || 'medium' });

            break;

        case 'unload':

            icons.push({ kind: 'unload', size: stop.unloadSize || 'medium' });

            break;

        case 'trade':

            icons.push({ kind: 'unload', size: stop.unloadSize || 'medium' });

            icons.push({ kind: 'load', size: stop.loadSize || 'medium' });

            break;

        case 'refuel':

            icons.push({ kind: 'refuel', size: 'medium' });

            break;

        case 'note':

            icons.push({ kind: 'note', size: 'medium' });

            break;

        case 'mining':

            icons.push({ kind: 'mining', size: 'medium' });

            break;

        case 'refining':

            icons.push({ kind: 'refining', size: 'medium' });

            break;

        case 'salvaging':

            icons.push({ kind: 'salvaging', size: 'medium' });

            break;

        default:

            break;

    }


    const autoRefuel = stopIndex < legs.length && legs[stopIndex].refueledHere;

    if (autoRefuel && !icons.some(ic => ic.kind === 'refuel')) {

        icons.push({ kind: 'refuel', size: 'medium' });

    }


    return icons;

}


// Builds the markup for the cargo-size selector(s) shown under the action

// dropdown - one dropdown for LOAD or UNLOAD, two (unload + load) for

// TRADE, and nothing for the other action types.

function cargoSizeOptions(selected) {

    const opts = ['small', 'medium', 'large'];

    return opts.map(s => `<option value="${s}"${selected === s ? ' selected' : ''}>${s.toUpperCase()}</option>`).join('');

}


function renderStopSizeRowHtml(index, stop) {

    if (stop.action === 'load') {

        return `<div class="stop-size-row">

            <label class="size-label">LOAD SIZE:</label>

            <select class="size-select" onchange="updateStopLoadSize(${index}, this.value)">${cargoSizeOptions(stop.loadSize || 'medium')}</select>

        </div>`;

    }

    if (stop.action === 'unload') {

        return `<div class="stop-size-row">

            <label class="size-label">UNLOAD SIZE:</label>

            <select class="size-select" onchange="updateStopUnloadSize(${index}, this.value)">${cargoSizeOptions(stop.unloadSize || 'medium')}</select>

        </div>`;

    }

    if (stop.action === 'trade') {

        return `<div class="stop-size-row">

            <label class="size-label">UNLOADING:</label>

            <select class="size-select" onchange="updateStopUnloadSize(${index}, this.value)">${cargoSizeOptions(stop.unloadSize || 'medium')}</select>

            <label class="size-label">LOADING:</label>

            <select class="size-select" onchange="updateStopLoadSize(${index}, this.value)">${cargoSizeOptions(stop.loadSize || 'medium')}</select>

        </div>`;

    }

    if (stop.action === 'mining' || stop.action === 'salvaging') {

        const options = ACTIVITY_DURATION_OPTIONS_MIN[stop.action];

        const current = stop.activityDurationMin || options[1];

        const label = stop.action === 'mining' ? 'MINING TIME:' : 'SALVAGE TIME:';

        const optionHtml = options.map((m, idx) => {

            const tag = idx === 0 ? ' (QUICK)' : (idx === options.length - 1 ? ' (THOROUGH)' : ' (AVG)');

            const selected = Math.abs(current - m) < 0.001 ? ' selected' : '';

            return `<option value="${m}"${selected}>${m} MIN${tag}</option>`;

        }).join('');

        return `<div class="stop-size-row">

            <label class="size-label">${label}</label>

            <select class="size-select" onchange="updateStopActivityDuration(${index}, this.value)">${optionHtml}</select>

        </div>`;

    }

    if (stop.action === 'refining') {

        return `<div class="stop-size-row">

            <label class="size-label">REFINING TIME:</label>

            <span class="fixed-duration-note">${REFINING_DURATION_MIN} MIN (FIXED)</span>

        </div>`;

    }

    return '';

}


// Refreshes just one stop's icon badge without rebuilding the whole list

// (which would steal focus from whatever the player is interacting with).

function refreshStopIcons(index) {

    const { legs } = computeRouteLegs();

    const icons = getStopIcons(index, legs);

    const badge = document.getElementById(`stop-icons-${index}`);

    if (badge) badge.innerHTML = renderStopIconsHtml(icons);

    refreshTotals();

    drawMap();

}


window.updateStopAction = (index, value) => {

    if (!route[index]) return;

    const previousAction = route[index].action;

    route[index].action = value;

    if (value !== previousAction) {

        // A duration picked for a previous action (e.g. mining's 30 min)

        // isn't necessarily valid for a different one (e.g. salvaging's

        // 10/12.5/15 range), so clear it and let the default midpoint apply.

        delete route[index].activityDurationMin;

    }

    refreshStopIcons(index);

    // The size selector(s) shown depend on the action, so re-render just

    // that wrapper rather than the whole list.

    const sizeRowWrapper = document.getElementById(`stop-size-row-${index}`);

    if (sizeRowWrapper) sizeRowWrapper.innerHTML = renderStopSizeRowHtml(index, route[index]);

};


window.updateStopLoadSize = (index, value) => {

    if (!route[index]) return;

    route[index].loadSize = value;

    refreshStopIcons(index);

};


window.updateStopUnloadSize = (index, value) => {

    if (!route[index]) return;

    route[index].unloadSize = value;

    refreshStopIcons(index);

};


window.updateStopActivityDuration = (index, value) => {

    if (!route[index]) return;

    route[index].activityDurationMin = parseFloat(value);

    refreshStopIcons(index);

};


window.updateStopNote = (index, value) => {

    if (!route[index]) return;

    route[index].note = value;

    // Free-text note is flavor/detail only - it doesn't drive icon choice,

    // so no need to touch the map or icon badge here.

};


// Recomputes and redraws the fuel bar, hazard warning, and total-time
// summary from the current route state - without touching the per-stop
// list markup. Used both by the full updateUI() rebuild and by lighter
// per-stop updates (action/size/duration changes) that shouldn't steal
// focus by rebuilding the whole list.

// ============================================================

//  ROUTE MANAGER FUNCTIONS
//  Save/switch/create/delete/rename the named routes defined above. Only
//  `route`/`currentShip`/`currentDrive` are "live" at any moment; everything
//  else lives in `savedRoutes` and gets synced in on switch.
// ============================================================

// Persists the currently active working state (route/ship/drive) back into

// its slot in savedRoutes. Called right before switching away from it, so

// in-progress edits are never lost.

function saveActiveRoute() {

    if (activeRouteId === null) return;

    const slot = savedRoutes.find(r => r.id === activeRouteId);

    if (!slot) return;

    slot.shipName = currentShip ? currentShip.ship : null;

    slot.driveName = currentDrive ? currentDrive.name : null;

    slot.stops = JSON.parse(JSON.stringify(route));

}


function switchToRoute(id) {

    if (id === activeRouteId) return;

    const target = savedRoutes.find(r => r.id === id);

    if (!target) return;


    stopSimulation();

    saveActiveRoute();


    activeRouteId = target.id;

    route = JSON.parse(JSON.stringify(target.stops));

    currentShip = shipData.find(s => s.ship === target.shipName) || shipData[0];

    updateDriveOptions(); // rebuilds drive-select for currentShip and defaults currentDrive


    if (target.driveName) {

        const wantedDrive = quantumDrives.find(d => d.name === target.driveName && d.size === currentShip.driveSize);

        if (wantedDrive) {

            currentDrive = wantedDrive;

            const driveSelect = document.getElementById('drive-select');

            if (driveSelect) driveSelect.value = wantedDrive.name;

        }

    }


    const shipSelect = document.getElementById('ship-select');

    if (shipSelect) {

        const shipIdx = shipData.indexOf(currentShip);

        if (shipIdx >= 0) shipSelect.value = shipIdx;

    }


    updateUI();

    renderRouteSelect();

}


function createNewRoute() {

    stopSimulation();

    saveActiveRoute();


    routeCounter++;

    const newRoute = {

        id: `route-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,

        name: `ROUTE ${routeCounter}`,

        shipName: shipData[0].ship,

        driveName: null,

        stops: []

    };

    savedRoutes.push(newRoute);


    activeRouteId = newRoute.id;

    route = [];

    currentShip = shipData[0];

    updateDriveOptions();


    const shipSelect = document.getElementById('ship-select');

    if (shipSelect) shipSelect.value = 0;


    updateUI();

    renderRouteSelect();

}


function deleteRoute(id) {

    if (savedRoutes.length <= 1) return; // always keep at least one route

    const idx = savedRoutes.findIndex(r => r.id === id);

    if (idx === -1) return;


    stopSimulation();

    savedRoutes.splice(idx, 1);


    if (activeRouteId === id) {

        // Don't let switchToRoute() try to save the slot we just deleted.

        activeRouteId = null;

        const next = savedRoutes[Math.max(0, idx - 1)];

        switchToRoute(next.id);

    } else {

        renderRouteSelect();

    }

}


function renameActiveRoute(newName) {

    const target = savedRoutes.find(r => r.id === activeRouteId);

    if (!target) return;

    target.name = newName;


    // Update just this option's label in place, rather than rebuilding the

    // whole select, so the rename input doesn't lose focus mid-typing.

    const opt = document.querySelector(`#route-select option[value="${target.id}"]`);

    if (opt) opt.textContent = newName || '(UNNAMED ROUTE)';


    const activeLabel = document.getElementById('active-route-label');

    if (activeLabel) activeLabel.textContent = newName || '(UNNAMED ROUTE)';

}


function renderRouteSelect() {

    const select = document.getElementById('route-select');

    if (select) {

        select.innerHTML = savedRoutes.map(r =>

            `<option value="${r.id}"${r.id === activeRouteId ? ' selected' : ''}>${escapeAttr(r.name || '(UNNAMED ROUTE)')}</option>`

        ).join('');

    }


    const active = savedRoutes.find(r => r.id === activeRouteId);


    const nameInput = document.getElementById('route-name-input');

    if (nameInput) nameInput.value = active ? active.name : '';


    const activeLabel = document.getElementById('active-route-label');

    if (activeLabel) activeLabel.textContent = active ? active.name : '';


    const deleteBtn = document.getElementById('delete-route-btn');

    if (deleteBtn) deleteBtn.disabled = savedRoutes.length <= 1;

}


function refreshTotals() {

    const warningDiv = document.getElementById('route-warnings');

    warningDiv.innerHTML = '';


    const { totalDistance, totalTimeSec, totalRefuelTimeMin, totalAtmoTimeMin, totalActivityTimeMin, finalFuel, isImpossible, bufferMin } = computeRouteLegs();


    const fuelPercent = currentShip ? Math.max(0, (finalFuel / currentShip.fuelCapacitySCU) * 100) : 0;

    document.getElementById('fuel-bar-fill').style.width = fuelPercent + '%';

    document.getElementById('fuel-percent').innerText = fuelPercent.toFixed(0) + '%';


    if (isImpossible) {

        warningDiv.innerHTML = `<div class="warning-text">!! HAZARD: DISTANCE EXCEEDS TANK CAPACITY !!</div>`;

    }


    const totalMin = (totalTimeSec / 60).toFixed(1);


    document.getElementById('total-dist').innerHTML = `

        TOTAL: ${totalDistance.toFixed(2)} Gm<br>

        <span style="font-size: 0.9rem; color: #fff;">EST. TIME: ${totalMin} MIN</span><br>

        <span class="buffer-highlight">+ INCLUDES ${bufferMin} min NAV-BUFFER</span><br>

        <span class="buffer-highlight">+ INCLUDES ${totalRefuelTimeMin} min REF-BUFFER (AUTO)</span><br>

        <span class="buffer-highlight">+ INCLUDES ${totalAtmoTimeMin.toFixed(1)} min ATMO-BUFFER (AUTO)</span><br>

        <span class="buffer-highlight">+ INCLUDES ${totalActivityTimeMin.toFixed(1)} min ACTIVITY TIME (MINING/REFINING/SALVAGE)</span>

    `;

}


function updateUI() {

    const listDiv = document.getElementById('route-list');

    listDiv.innerHTML = '';


    const { legs } = computeRouteLegs();


    route.forEach((stop, i) => {

        const leg = i > 0 ? legs[i-1] : null; // the leg that brought us to this stop

        const icons = getStopIcons(i, legs);

        const action = stop.action || '';

        const activityMin = getStopActivityMinutes(stop);


        const div = document.createElement('div');

        div.className = 'route-stop';

        div.innerHTML = `

            <div class="stop-top-row">

                <div>

                    <div style="font-weight: bold;">${i+1}. ${stop.name}</div>

                    <div class="dist">${i === 0 ? 'ORIGIN' : '+ ' + leg.legDist.toFixed(2) + ' Gm | ' + leg.legTimeMin.toFixed(1) + ' MIN' + (leg.atmoPenaltyMin > 0 ? ' (incl. ' + leg.atmoPenaltyMin.toFixed(1) + ' MIN ATMO)' : '')}</div>

                    ${activityMin > 0 ? `<div class="dist activity-time-note">⏱ ${activityMin} MIN ON-SITE</div>` : ''}

                </div>

                <button class="del-btn" onclick="removeStop(${i})">X</button>

            </div>

            <div class="stop-action-row">

                <select class="action-select" onchange="updateStopAction(${i}, this.value)">

                    <option value=""${action === '' ? ' selected' : ''}>-- NO ACTION --</option>

                    <option value="load"${action === 'load' ? ' selected' : ''}>LOAD CARGO</option>

                    <option value="unload"${action === 'unload' ? ' selected' : ''}>UNLOAD CARGO</option>

                    <option value="trade"${action === 'trade' ? ' selected' : ''}>TRADE (LOAD + UNLOAD)</option>

                    <option value="mining"${action === 'mining' ? ' selected' : ''}>MINING</option>

                    <option value="refining"${action === 'refining' ? ' selected' : ''}>REFINING</option>

                    <option value="salvaging"${action === 'salvaging' ? ' selected' : ''}>SALVAGING</option>

                    <option value="refuel"${action === 'refuel' ? ' selected' : ''}>REFUEL</option>

                    <option value="note"${action === 'note' ? ' selected' : ''}>CUSTOM NOTE</option>

                </select>

                <span class="stop-icons" id="stop-icons-${i}">${renderStopIconsHtml(icons)}</span>

            </div>

            <div id="stop-size-row-${i}">${renderStopSizeRowHtml(i, stop)}</div>

            <div class="stop-note-row">

                <input type="text" class="activity-input" placeholder="OPTIONAL NOTE (E.G. 320 SCU MEDS)" value="${escapeAttr(stop.note || '')}" oninput="updateStopNote(${i}, this.value)">

            </div>

        `;

        listDiv.appendChild(div);


        // Mandatory (automatic) refuel happens AT this stop, before departing on the next leg

        if (i < legs.length && legs[i].refueledHere) {

            const refuelDiv = document.createElement('div');

            refuelDiv.className = 'route-stop refuel-step';

            refuelDiv.innerHTML = `[!] AUTO-REFUEL AT ${stop.name.toUpperCase()} [+2 MIN] [!]`;

            listDiv.appendChild(refuelDiv);

        }

    });


    refreshTotals();

    updateSimButton();

    drawMap();

}


// ============================================================

//  FLIGHT SIMULATION
//  Animates a small arrow flying leg-by-leg along the current
//  route, pausing briefly at stops that have a refuel and/or
//  a planned action, showing the relevant icon(s) while parked.
// ============================================================

function toggleSimulation() {

    if (simRunning) {

        stopSimulation();

    } else {

        startSimulation();

    }

}


function startSimulation() {

    if (route.length < 2 || !currentShip || !currentDrive) return;


    const { legs, isImpossible } = computeRouteLegs();

    if (isImpossible) return; // can't simulate a route that can't be flown


    simRunning = true;

    sim = { legs, stopIndex: 0, phase: 'pause', angle: 0 };

    updateSimButton();

    beginStopPause(0);


    if (simRafId) cancelAnimationFrame(simRafId);

    simRafId = requestAnimationFrame(simTick);

}


function stopSimulation() {

    simRunning = false;

    sim = null;

    if (simRafId) {

        cancelAnimationFrame(simRafId);

        simRafId = null;

    }

    updateSimButton();

    drawMap();

}


function finishSimulation() {

    simRunning = false;

    sim = null;

    if (simRafId) {

        cancelAnimationFrame(simRafId);

        simRafId = null;

    }

    updateSimButton();

    drawMap();

}


function updateSimButton() {

    const btn = document.getElementById('sim-btn');

    if (!btn) return;


    if (simRunning) {

        btn.innerText = '[ ■ STOP SIMULATION ]';

        btn.classList.add('danger');

    } else {

        btn.innerText = '[ ▶ SIMULATE FLIGHT ]';

        btn.classList.remove('danger');

        btn.disabled = route.length < 2;

    }

}


function beginStopPause(stopIndex) {

    const icons = getStopIcons(stopIndex, sim.legs);

    const hasActivity = icons.length > 0;


    sim.phase = 'pause';

    sim.stopIndex = stopIndex;

    sim.phaseStart = performance.now();

    sim.phaseDuration = hasActivity ? 1200 + icons.length * 1400 : 900;

    sim.icons = icons;

    sim.pos = { x: route[stopIndex].x, y: route[stopIndex].y };


    // Point the arrow toward the next leg, if there is one, so it looks

    // "ready to depart" while parked.

    if (stopIndex < sim.legs.length) {

        const from = route[stopIndex];

        const to = route[stopIndex + 1];

        sim.angle = Math.atan2(to.y - from.y, to.x - from.x);

    }

}


function beginLegFlight(stopIndex) {

    sim.phase = 'fly';

    sim.stopIndex = stopIndex;

    sim.phaseStart = performance.now();

    sim.icons = [];


    const leg = sim.legs[stopIndex];

    // Scale animation duration with distance, clamped to a watchable range.

    sim.phaseDuration = Math.max(1000, Math.min(6000, leg.legDist * 130));


    const from = route[stopIndex];

    const to = route[stopIndex + 1];

    sim.angle = Math.atan2(to.y - from.y, to.x - from.x);

}


function simTick(ts) {

    if (!simRunning || !sim) return;


    const elapsed = ts - sim.phaseStart;

    const t = Math.min(1, elapsed / sim.phaseDuration);


    if (sim.phase === 'pause') {

        sim.pos = { x: route[sim.stopIndex].x, y: route[sim.stopIndex].y };


        if (t >= 1) {

            if (sim.stopIndex < sim.legs.length) {

                beginLegFlight(sim.stopIndex);

            } else {

                finishSimulation();

                return;

            }

        }

    } else if (sim.phase === 'fly') {

        const from = route[sim.stopIndex];

        const to = route[sim.stopIndex + 1];

        sim.pos = {

            x: from.x + (to.x - from.x) * t,

            y: from.y + (to.y - from.y) * t

        };


        if (t >= 1) {

            beginStopPause(sim.stopIndex + 1);

        }

    }


    drawMap();

    simRafId = requestAnimationFrame(simTick);

}


// ============================================================

//  PLANET FOCUS / CAMERA ZOOM
//  Clicking a planet on the system map smoothly zooms the camera in
//  close enough to see its moons; a "back" button restores the exact
//  view you were on before, with a CRT-style flicker on each cut.
// ============================================================

function clamp(value, min, max) {

    return Math.max(min, Math.min(max, value));

}


// The parent planet a location's click should zoom to, or null if it isn't

// part of the "click to zoom" system at all (the star, gateways, or a

// moon/station with no planet parent).

function planetTargetFor(loc) {

    if (!loc) return null;

    if (loc.type === 'planet') return loc;

    if ((loc.type === 'moon' || loc.type === 'station') && loc.parent) {

        const parent = db.find(l => l.name === loc.parent && l.type === 'planet');

        if (parent) return parent;

    }

    return null;

}


// World-space hit radius (converted to screen pixels via the current zoom)

// for a given location: bigger for planets themselves, a bit smaller for

// their moons/stations, and a small flat default for everything else.

function hitRadiusPxFor(loc) {

    if (loc.type === 'planet') {

        return clamp(PLANET_HIT_RADIUS_GM * mapScale, PLANET_HIT_RADIUS_MIN_PX, PLANET_HIT_RADIUS_MAX_PX);

    }

    if (planetTargetFor(loc)) {

        return clamp(SATELLITE_HIT_RADIUS_GM * mapScale, SATELLITE_HIT_RADIUS_MIN_PX, SATELLITE_HIT_RADIUS_MAX_PX);

    }

    return DEFAULT_HIT_RADIUS;

}


// Finds the location (if any) under a given screen point, using the same

// world-to-screen transform as drawMap().

function findClickedLocation(clientX, clientY) {

    const canvas = document.getElementById('mapCanvas');

    const rect = canvas.getBoundingClientRect();

    const mx = clientX - rect.left;

    const my = clientY - rect.top;


    const centerX = (canvas.width / 2) + mapOffsetX;

    const centerY = (canvas.height / 2) + mapOffsetY;


    let closest = null;

    let closestDist = Infinity;


    db.forEach(loc => {

        const x = centerX + (loc.x * mapScale);

        const y = centerY + (loc.y * mapScale);

        const d = Math.hypot(mx - x, my - y);

        const hitRadius = hitRadiusPxFor(loc);

        if (d < hitRadius && d < closestDist) {

            closestDist = d;

            closest = loc;

        }

    });


    return closest;

}


// Resolves a screen point to the planet it should focus, whether the click

// landed on the planet itself or on one of its moons/stations.

function resolveClickedPlanet(clientX, clientY) {

    const hit = findClickedLocation(clientX, clientY);

    const target = planetTargetFor(hit);

    return target ? target.name : null;

}


function handleMapClick(clientX, clientY) {

    const planetName = resolveClickedPlanet(clientX, clientY);

    if (planetName) {

        focusOnPlanet(planetName);

    }

}


function focusOnPlanet(name) {

    if (focusedPlanet === name && !cameraAnim) return; // already there, nothing to do


    const planet = db.find(l => l.type === 'planet' && l.name === name);

    if (!planet) return;


    // Only snapshot the pre-zoom camera the first time we zoom in, so

    // hopping between planets doesn't overwrite the true system view.

    if (!focusedPlanet) {

        preZoomCamera = { scale: mapScale, offsetX: mapOffsetX, offsetY: mapOffsetY };

    }

    focusedPlanet = name;


    const moons = db.filter(l => l.type === 'moon' && l.parent === name);

    let maxDist = 0;

    moons.forEach(m => { maxDist = Math.max(maxDist, calcDist(planet, m)); });

    if (maxDist < 0.05) maxDist = 2; // fallback framing when there are no moons to fit

    maxDist *= 1.12; // light padding so the outermost moon isn't glued to the edge


    const canvas = document.getElementById('mapCanvas');

    const minDim = Math.min(canvas.width, canvas.height);

    let targetScale = minDim / (1.3 * maxDist);

    targetScale = Math.max(25, Math.min(MAP_MAX_SCALE, targetScale));


    const targetOffsetX = -planet.x * targetScale;

    const targetOffsetY = -planet.y * targetScale;


    startCameraAnimation(targetScale, targetOffsetX, targetOffsetY);

    triggerFlicker();

    updateFocusUI();

}


function backToSystemMap() {

    if (!focusedPlanet) return;


    const target = preZoomCamera || { scale: 5, offsetX: 0, offsetY: 0 };

    focusedPlanet = null;

    preZoomCamera = null;


    startCameraAnimation(target.scale, target.offsetX, target.offsetY);

    triggerFlicker();

    updateFocusUI();

}


function updateFocusUI() {

    const btn = document.getElementById('back-to-map-btn');

    const label = document.getElementById('focus-label');

    if (!btn || !label) return;


    // Always visible now (it's a toolbar row, not a conditional overlay) -

    // greyed out via the disabled state when not zoomed into a planet,

    // rather than hidden entirely.

    btn.disabled = !focusedPlanet;

    label.innerText = focusedPlanet ? `FOCUS: ${focusedPlanet.toUpperCase()}` : 'FOCUS: —';

}


function easeInOutQuad(t) {

    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

}


function startCameraAnimation(toScale, toOffsetX, toOffsetY) {

    if (cameraRafId) cancelAnimationFrame(cameraRafId);


    cameraAnim = {

        fromScale: mapScale,

        fromOffsetX: mapOffsetX,

        fromOffsetY: mapOffsetY,

        toScale,

        toOffsetX,

        toOffsetY,

        start: performance.now(),

        duration: 700

    };


    cameraRafId = requestAnimationFrame(cameraTick);

}


function cameraTick(ts) {

    if (!cameraAnim) return;


    const t = Math.min(1, (ts - cameraAnim.start) / cameraAnim.duration);

    const e = easeInOutQuad(t);


    mapScale = cameraAnim.fromScale + (cameraAnim.toScale - cameraAnim.fromScale) * e;

    mapOffsetX = cameraAnim.fromOffsetX + (cameraAnim.toOffsetX - cameraAnim.fromOffsetX) * e;

    mapOffsetY = cameraAnim.fromOffsetY + (cameraAnim.toOffsetY - cameraAnim.fromOffsetY) * e;


    drawMap();


    if (t < 1) {

        cameraRafId = requestAnimationFrame(cameraTick);

    } else {

        cameraAnim = null;

        cameraRafId = null;

    }

}


// A short CRT-style brightness/static flicker over the map, timed to the

// camera cut, evocative of old sci-fi terminal screens snapping to a new feed.

function triggerFlicker() {

    const overlay = document.getElementById('flicker-overlay');

    const canvas = document.getElementById('mapCanvas');

    if (!overlay || !canvas) return;


    overlay.classList.remove('active');

    canvas.classList.remove('crt-glitching');

    // Force a reflow so re-triggering the animation (e.g. rapid planet

    // clicks) restarts it instead of being a no-op.

    void overlay.offsetWidth;


    overlay.classList.add('active');

    canvas.classList.add('crt-glitching');


    setTimeout(() => {

        overlay.classList.remove('active');

        canvas.classList.remove('crt-glitching');

    }, 550);

}


function drawMap() {

    const canvas = document.getElementById('mapCanvas');

    const ctx = canvas.getContext('2d');

   

    // Set Canvas size to match container

    canvas.width = canvas.parentElement.clientWidth;

    canvas.height = canvas.parentElement.clientHeight;


    // Apply scaling and panning offset to center coordinates

    // (Assuming mapOffsetX, mapOffsetY, and mapScale are part of your global state)

    const centerX = (canvas.width / 2) + (typeof mapOffsetX !== 'undefined' ? mapOffsetX : 0);

    const centerY = (canvas.height / 2) + (typeof mapOffsetY !== 'undefined' ? mapOffsetY : 0);

    const scale = typeof mapScale !== 'undefined' ? mapScale : 5;


    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // 1. Draw Grid Lines

    ctx.strokeStyle = '#221100';

    ctx.lineWidth = 1;

    const gridSize = 50;

    for(let i = 0; i < canvas.width; i += gridSize) {

        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();

    }

    for(let i = 0; i < canvas.height; i += gridSize) {

        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();

    }


    // 1.5 Draw Orbit Rings (bigger rings for planets around the star,

    // tiny rings for moons around their parent planet)

    ctx.setLineDash([]);


    // Big rings: planets orbiting the star

    const star = db.find(l => l.type === 'star');

    if (star) {

        const starX = centerX + (star.x * scale);

        const starY = centerY + (star.y * scale);


        db.filter(l => l.type === 'planet').forEach(planet => {

            const orbitRadius = calcDist(star, planet) * scale;

            if (orbitRadius < 1) return;

            ctx.beginPath();

            ctx.strokeStyle = 'rgba(255, 115, 0, 0.18)';

            ctx.lineWidth = 1;

            ctx.arc(starX, starY, orbitRadius, 0, Math.PI * 2);

            ctx.stroke();

        });

    }


    // Tiny rings: moons orbiting their parent planet

    db.forEach(loc => {

        if (loc.type !== 'moon' || !loc.parent) return;

        const parent = db.find(l => l.name === loc.parent);

        if (!parent || parent.type !== 'planet') return;


        const parentX = centerX + (parent.x * scale);

        const parentY = centerY + (parent.y * scale);

        const orbitRadius = calcDist(parent, loc) * scale;

        if (orbitRadius < 1) return;


        ctx.beginPath();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';

        ctx.lineWidth = 0.5;

        ctx.arc(parentX, parentY, orbitRadius, 0, Math.PI * 2);

        ctx.stroke();

    });


    // 2. Draw Connections (The Route)

    if (route.length > 1) {

        ctx.setLineDash([5, 5]);

        ctx.strokeStyle = '#ff7300'; // Match route color

        ctx.lineWidth = 2;

        ctx.beginPath();

        route.forEach((stop, i) => {

            const x = centerX + (stop.x * scale);

            const y = centerY + (stop.y * scale);

            if (i === 0) ctx.moveTo(x, y);

            else ctx.lineTo(x, y);

        });

        ctx.stroke();

        ctx.setLineDash([]);

    }


    // 3. Draw All Locations from DB

    const labels = [];


    db.forEach(loc => {

        const x = centerX + (loc.x * scale);

        const y = centerY + (loc.y * scale);


        // Cull points off-screen for performance

        if(x < -100 || x > canvas.width + 100 || y < -100 || y > canvas.height + 100) return;


        // Check if this specific location is part of the current route

        const isAtStop = route.some(r => r.name === loc.name);


        // The stop currently being "worked" during the flight simulation

        // (paused there with a planned action) gets a stronger highlight

        // than a normal route stop.

        const isSimActiveStop = !!(sim && sim.phase === 'pause' && sim.icons && sim.icons.length &&

            route[sim.stopIndex] && route[sim.stopIndex].name === loc.name);

       

        let dotRadius;

        if (loc.type === 'star') {

            dotRadius = Math.max(4, Math.min(12, scale * 1.2));

            // Stanton now turns Orange if added to the route

            ctx.fillStyle = isAtStop ? '#ff7300' : '#fff';

            ctx.shadowBlur = 15;

            ctx.shadowColor = ctx.fillStyle;

        } else {

            // Dots also scale dynamically based on zoom

            dotRadius = isAtStop ? Math.max(3, Math.min(8, scale * 0.8)) : Math.max(1, Math.min(5, scale * 0.4));

            ctx.fillStyle = isAtStop ? '#ff7300' : '#ffffff9d';

        }


        if (isSimActiveStop) {

            const pulse = (Math.sin(performance.now() / 220) + 1) / 2; // 0..1

            dotRadius = dotRadius * (1.6 + pulse * 0.5);

            ctx.fillStyle = '#e9b941'; // highlight amber, stands out from the normal route orange

            ctx.shadowBlur = 22;

            ctx.shadowColor = '#e9b941';

        }


        ctx.beginPath();

        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);

        ctx.fill();

        ctx.shadowBlur = 0;


        // Pulsing highlight ring around the active stop, so it reads clearly

        // even when zoomed out or surrounded by other dots.

        if (isSimActiveStop) {

            const pulse = (Math.sin(performance.now() / 220) + 1) / 2; // 0..1

            const ringRadius = dotRadius + 8 + pulse * 8;

            ctx.save();

            ctx.strokeStyle = `rgba(233, 185, 65, ${0.25 + pulse * 0.45})`;

            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.arc(x, y, ringRadius, 0, Math.PI * 2);

            ctx.stroke();

            ctx.restore();

        }

       

        // --- LABEL RENDERING ---

        if (loc.type === 'planet' || loc.type === 'star' || isAtStop) {

            const fontSize = Math.max(8, Math.min(24, scale * 1.5));

            ctx.font = `${fontSize}px 'Share Tech Mono'`;

           

            const textWidth = ctx.measureText(loc.name).width;

            const textHeight = fontSize;

           

            let labelX = x + dotRadius + 5;

            let labelY = y + (textHeight / 3);


            // Smart Collision Logic:

            // Only move the label if it overlaps a DIFFERENT name.

            // If the name is the same (e.g. overlapping route stops), allow the overlay.

            while (labels.some(l =>

                l.name !== loc.name &&

                Math.abs(l.x - labelX) < textWidth &&

                Math.abs(l.y - labelY) < textHeight

            )) {

                labelY += textHeight + 2;

            }


            labels.push({ name: loc.name, x: labelX, y: labelY, w: textWidth, h: textHeight });

           

            // Set text color to match the route color (#ff7300) if it's a stop

            ctx.fillStyle = isAtStop ? '#ff7300' : '#fff';

            ctx.fillText(loc.name, labelX, labelY);

        }

    });


    // 4. Flight Simulation Overlay (arrow + icons while paused)

    if (sim && sim.pos) {

        const simX = centerX + (sim.pos.x * scale);

        const simY = centerY + (sim.pos.y * scale);


        // Arrow, drawn as a small triangle rotated to face the direction of travel

        ctx.save();

        ctx.translate(simX, simY);

        ctx.rotate(sim.angle || 0);

        ctx.fillStyle = '#e9b941';

        ctx.shadowBlur = 12;

        ctx.shadowColor = '#e9b941';

        ctx.beginPath();

        ctx.moveTo(10, 0);

        ctx.lineTo(-6, 6);

        ctx.lineTo(-6, -6);

        ctx.closePath();

        ctx.fill();

        ctx.restore();

        ctx.shadowBlur = 0;


        // Icons while parked at a stop (refuel/load/unload/note), with a

        // small bob animation so they read as "active" rather than static.

        // Size scales with the cargo size selected for load/unload actions.

        if (sim.icons && sim.icons.length) {

            const bob = Math.sin(performance.now() / 200) * 4;

            const iconSize = 28;

            const spacing = 36;

            sim.icons.forEach((ic, idx) => {

                const cargoScale = CARGO_SIZE_SCALE[ic.size] || 1;

                const ix = simX + (idx - (sim.icons.length - 1) / 2) * spacing;

                drawStopIcon(ctx, ic.kind, ix, simY - 30 + bob, iconSize * cargoScale);

            });

        }

    }

}
