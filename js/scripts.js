// Variables globales
let participants = [];
let originalParticipants = []; // Guardar los participantes originales
let prizes = [];
let originalPrizes = []; // Guardar los premios originales
let winners = [];

window.onload = function() {
    // Cargar participantes del HTML
    const participantElements = document.querySelectorAll("#draw-list li");
    participants = Array.from(participantElements).map(element => {
        // Obtiene el texto del participante, excluyendo el botón
        return element.childNodes[0].textContent.trim();
    });

    // Guardar la lista de participantes originales
    originalParticipants = [...participants]; 

    // Cargar premios del HTML
    const prizeElements = document.querySelectorAll("#prize-list li");
    prizes = Array.from(prizeElements).map(element => element.textContent.trim());

    // Guardar la lista de premios originales
    originalPrizes = [...prizes]; 

    // Actualizar las listas de participantes y premios
    updateParticipantList();
    updatePrizeList();
};

// Función para agregar un participante (sin cambios)
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

// Función para importar participantes desde un archivo Excel (sin cambios)
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

// Función para resetear premios y participantes a su estado original
function resetDraw() {
    // Restauramos tanto los premios como los participantes originales
    prizes = [...originalPrizes]; // Restauramos los premios
    participants = [...originalParticipants]; // Restauramos los participantes
    winners = []; // Reiniciamos los ganadores
    updatePrizeList();
    updateParticipantList();
    updateWinnersList();

    // Limpiar el mensaje del ganador actual (si lo hubiera)
    const winnerElement = document.getElementById("winner");
    winnerElement.textContent = '';
    winnerElement.style.display = 'none';
}

// Función para borrar todos los premios (sin afectar los premios originales)
function deletePrizes() {
    prizes = [];
    updatePrizeList();

    // Limpiar la lista de ganadores
    winners = [];
    updateWinnersList();

    // Ocultar el mensaje del ganador actual
    const winnerElement = document.getElementById("winner");
    winnerElement.style.display = 'none';
    winnerElement.textContent = '';
}

// Función para agregar un premio (sin cambios)
function addPrize() {
    const prizeInput = document.getElementById("prize-name");
    const prize = prizeInput.value.trim();
    prizes.push(prize);
    updatePrizeList();
    prizeInput.value = '';
    originalPrizes.push(prize); // Guardamos el nuevo premio en los premios originales
}

// Función para seleccionar un ganador
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

// Función para actualizar la lista de premios en el HTML
function updatePrizeList() {
    const prizeList = document.getElementById("prize-list");
    prizeList.innerHTML = prizes.map((prize, index) => `
        <li><span class="icon">🎁</span> ${prize} <button class="btn btn_eliminar" onclick="removePrize(${index})">Borrar</button></li>
    `).join('');
}

// Función para remover un premio de la lista
function removePrize(index) {
    prizes.splice(index, 1);
    updatePrizeList();
}

// Función para actualizar la lista de ganadores
function updateWinnersList() {
    const winnersList = document.getElementById("winners-list");
    winnersList.innerHTML = winners.map(entry => `
        <li><span class="winner-name">${entry.winner}</span> - <span class="prize-name">${entry.prize}</span></li>
    `).join('');
}

// Botón "Reiniciar Sorteo de Premios"
document.getElementById("reset-draw").addEventListener("click", resetDraw);
