// Variables globales
let participants = [];
let prizes = [];
let winners = [];

// Función para agregar un participante
function addParticipant() {
    const nameInput = document.getElementById("participant-name");
    const name = nameInput.value.trim();
    if (name && !participants.includes(name)) {
        participants.push(name);
        updateParticipantList();
        nameInput.value = '';
    }
}

function updateParticipantList() {
    const list = document.getElementById("draw-list");
    list.innerHTML = participants.map((name, index) => `
        <li>${name} <button class="btn btn_eliminar" onclick="removeParticipant(${index})">Borrar</button></li>
    `).join('');
}

function removeParticipant(index) {
    participants.splice(index, 1);
    updateParticipantList();
}

// Función para borrar toda la lista de participantes
function clearParticipants() {
    participants = [];
    updateParticipantList();
}

// Importar participantes desde un archivo Excel
function importParticipantsFromExcel(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const names = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }).map(row => row[0]).filter(name => !!name);

        participants = [...new Set([...participants, ...names])];
        updateParticipantList();
    };
    
    reader.readAsArrayBuffer(file);
}

// Agregar premios
function addPrize() {
    const prizeInput = document.getElementById("prize-name");
    const prize = prizeInput.value.trim();
    if (prize && prizes.length < 8) {
        prizes.push(prize);
        updatePrizeList();
        prizeInput.value = '';
    }
}

function updatePrizeList() {
    const prizeList = document.getElementById("prize-list");
    prizeList.innerHTML = prizes.map((prize, index) => `<li>${prize}</li>`).join('');
}

// Función para resetear premios
function resetPrizes() {
    prizes = [];
    updatePrizeList();
    updateWinnersList();
}

function pickWinner() {
    const winnerElement = document.getElementById("winner");
    if (participants.length && prizes.length) {
        const winnerIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[winnerIndex];
        const prize = prizes.shift();

        winnerElement.textContent = `Felicitaciones!! Ganador/a: ${winner} - Premio: ${prize}`;
        winnerElement.style.display = 'block';

        // Añadir a la lista de ganadores y eliminar de participantes
        winners.push({ winner, prize });
        participants.splice(winnerIndex, 1);
        updateParticipantList();
        updatePrizeList();
        updateWinnersList();
    } else {
        winnerElement.textContent = '¡No hay participantes o premios disponibles!';
        winnerElement.style.display = 'block';
    }
}

function updateWinnersList() {
    const winnersList = document.getElementById("winners-list");
    winnersList.innerHTML = winners.map(entry => `<li>${entry.winner} - ${entry.prize}</li>`).join('');
}

function nextPrize() {
    document.getElementById("winner").style.display = 'none';
    document.getElementById("winner").textContent = '';
}