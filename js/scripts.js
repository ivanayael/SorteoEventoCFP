
    // Draw Section Logic
    const participants = [];

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



    function pickWinner() {
        const winnerElement = document.getElementById("winner");
        if (participants.length) {
            const winner = participants[Math.floor(Math.random() * participants.length)];
            winnerElement.textContent = `Felicitaciones!! Ganador/a: ${winner}`;
            winnerElement.style.display = 'block'; // Muestra la alerta
        } else {
            winnerElement.textContent = '¡No hay participantes en la lista!';
            winnerElement.style.display = 'block';
        }
    }
