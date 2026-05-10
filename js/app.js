// State variables
let route = [];
let currentShip;
let currentDrive;

// Map Viewport State
let mapScale = 5;
let mapOffsetX = 0;
let mapOffsetY = 0;
let isDragging = false;
let startDragX = 0;
let startDragY = 0;

// Initialize once data is loaded
window.onload = () => {
    // 1. Initial State
    currentShip = shipData[0];
    
    // 2. Populate Dropdowns
    initMenus();

    // 3. Setup Listeners
    document.getElementById('ship-select').addEventListener('change', (e) => {
        currentShip = shipData[e.target.value];
        updateDriveOptions();
        updateUI();
    });

    document.getElementById('drive-select').addEventListener('change', (e) => {
        currentDrive = quantumDrives.find(d => d.name === e.target.value);
        updateUI();
    });

    document.getElementById('add-stop-btn').addEventListener('click', () => {
        const locSelect = document.getElementById('location-select');
        route.push(db[locSelect.value]);
        updateUI();
    });

    document.getElementById('clear-route-btn').addEventListener('click', () => {
        route = [];
        updateUI();
    });

    // --- MAP ZOOM & PAN LISTENERS ---
    const canvas = document.getElementById('mapCanvas');
    
    // Mouse Wheel Zoom
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomAmount = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out or in
        mapScale *= zoomAmount;
        mapScale = Math.max(0.5, Math.min(mapScale, 30)); // Limit zoom bounds
        drawMap();
    });

    // Mouse Drag to Pan
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        startDragX = e.clientX - mapOffsetX;
        startDragY = e.clientY - mapOffsetY;
        canvas.style.cursor = 'grabbing';
    });
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            mapOffsetX = e.clientX - startDragX;
            mapOffsetY = e.clientY - startDragY;
            drawMap();
        }
    });
    canvas.addEventListener('mouseup', () => { isDragging = false; canvas.style.cursor = 'default'; });
    canvas.addEventListener('mouseleave', () => { isDragging = false; canvas.style.cursor = 'default'; });

    // Touch support for mobile Map Panning
    canvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        startDragX = e.touches[0].clientX - mapOffsetX;
        startDragY = e.touches[0].clientY - mapOffsetY;
    }, {passive: true});
    canvas.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault(); // Stop mobile screen scroll
            mapOffsetX = e.touches[0].clientX - startDragX;
            mapOffsetY = e.touches[0].clientY - startDragY;
            drawMap();
        }
    }, {passive: false});
    canvas.addEventListener('touchend', () => isDragging = false);

    // Start System Clock
    setInterval(updateClock, 1000);
    
    updateDriveOptions();
    updateUI();
};

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
    route.splice(index, 1);
    updateUI();
};

function updateUI() {
    const listDiv = document.getElementById('route-list');
    const warningDiv = document.getElementById('route-warnings');
    listDiv.innerHTML = '';
    warningDiv.innerHTML = '';
    
    let totalDistance = 0;
    let totalTimeSec = 0;
    let totalRefuelTimeMin = 0; // Track total refueling time
    let currentFuel = currentShip.fuelCapacitySCU;
    let isImpossible = false;

    const buffers = { "S1": 1, "S2": 3, "S3": 5 };
    const bufferMin = buffers[currentShip.driveSize] || 0;

    route.forEach((stop, i) => {
        let legDist = 0;
        let legTimeMin = 0;
        let fuelNeeded = 0;

        if (i > 0) {
            legDist = calcDist(route[i-1], stop);
            totalDistance += legDist;
            fuelNeeded = (legDist * currentDrive.fuelRequirementMSCUperGm) / 1000;
            
            if (fuelNeeded > currentShip.fuelCapacitySCU) isImpossible = true;
            
            // Refuel Check
            if (fuelNeeded > currentFuel) {
                // ADD 2 MINUTES TO TRACKING
                totalRefuelTimeMin += 2;
                totalTimeSec += 120; // 2 minutes in seconds

                const refuelDiv = document.createElement('div');
                refuelDiv.className = 'route-stop refuel-step';
                // Added "2 MIN" to the warning label
                refuelDiv.innerHTML = `[!] MANDATORY REFUEL AT ${route[i-1].name.toUpperCase()} [+2 MIN] [!]`;
                listDiv.appendChild(refuelDiv);
                
                currentFuel = currentShip.fuelCapacitySCU; 
            }
            
            currentFuel -= fuelNeeded;
            const legTimeSec = (legDist * 1000000) / currentDrive.maxSpeedKmS;
            legTimeMin = (legTimeSec / 60) + bufferMin;
            totalTimeSec += (legTimeSec + (bufferMin * 60));
        }

        const div = document.createElement('div');
        div.className = 'route-stop';
        div.innerHTML = `
            <div>
                <div style="font-weight: bold;">${i+1}. ${stop.name}</div>
                <div class="dist">${i === 0 ? 'ORIGIN' : '+ ' + legDist.toFixed(2) + ' Gm | ' + legTimeMin.toFixed(1) + ' MIN'}</div>
            </div>
            <button class="del-btn" onclick="removeStop(${i})">X</button>
        `;
        listDiv.appendChild(div);
    });

    const fuelPercent = Math.max(0, (currentFuel / currentShip.fuelCapacitySCU) * 100);
    document.getElementById('fuel-bar-fill').style.width = fuelPercent + '%';
    document.getElementById('fuel-percent').innerText = fuelPercent.toFixed(0) + '%';

    if (isImpossible) {
        warningDiv.innerHTML = `<div class="warning-text">!! HAZARD: DISTANCE EXCEEDS TANK CAPACITY !!</div>`;
    }

    const totalMin = (totalTimeSec / 60).toFixed(1);
    
    // Updated display with new refuelling time line
    document.getElementById('total-dist').innerHTML = `
        TOTAL: ${totalDistance.toFixed(2)} Gm<br>
        <span style="font-size: 0.9rem; color: #fff;">EST. TIME: ${totalMin} MIN</span><br>
        <span class="buffer-highlight">+ INCLUDES ${bufferMin} min NAV-BUFFER</span><br>
        <span class="buffer-highlight">+ INCLUDES ${totalRefuelTimeMin} min REF-BUFFER</span>
    `;
    
    drawMap();
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

        ctx.beginPath(); 
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2); 
        ctx.fill();
        ctx.shadowBlur = 0; 
        
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
}