"use strict";
const registro = document.querySelector("#registro");
const nombre1 = document.querySelector("#nombre1");
const nombre2 = document.querySelector("#nombre2");
const juego = document.querySelector("#juego");
const participantes = document.querySelector("#participantes");
const turno = document.querySelector("#turno");
const celdas = [...document.querySelectorAll(".celda")];
const resultado = document.querySelector("#resultado");
const mensajeResultado = document.querySelector("#mensajeResultado");
let jugadores = { X: "", O: "" };
let tablero = Array(9).fill("");
let jugadorActual = "X";
let partidaActiva = false;
// AGREGADO: recuerda quién empieza como X para alternar los roles al terminar cada partida
let jugadorInicial = "X";
const combinaciones = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Filas
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columnas
    [0, 4, 8],
    [2, 4, 6],
    // Diagonales
];

function renderizar() {
    celdas.forEach((celda, indice) => {
        const simbolo = tablero[indice];
        celda.textContent = simbolo;
        celda.disabled = !partidaActiva || simbolo !== "";
        celda.classList.toggle("x", simbolo === "X");
        celda.classList.toggle("o", simbolo === "O");
        celda.setAttribute(
            "aria-label",
            `Casilla ${indice + 1}: ${simbolo || "vacía"}`,
        );
    });
    if (partidaActiva) {
        turno.textContent = `Turno de ${jugadores[jugadorActual]} (${jugadorActual})`;
    }
}

function buscarLineaGanadora() {
    return combinaciones.find(
        ([a, b, c]) =>
            tablero[a] !== "" &&
            tablero[a] === tablero[b] &&
            tablero[a] === tablero[c],
    );
}

function finalizarPartida(linea) {
    partidaActiva = false;
    let mensaje;
    if (linea) {
        const simbolo = tablero[linea[0]];
        mensaje = `¡Ganó ${jugadores[simbolo]} (${simbolo})!`;
        linea.forEach((indice) => {
            celdas[indice].classList.add("ganadora");
        });
    } else {
        mensaje = "¡Empate! No quedan casillas disponibles.";
    }
    turno.textContent = mensaje;
    mensajeResultado.textContent = mensaje;
    renderizar();
    resultado.showModal();
    // AGREGADO: al finalizar la partida se invierten los roles para la próxima
    jugadorInicial = jugadorInicial === "X" ? "O" : "X";
}

function jugar(evento) {
    const indice = Number(evento.currentTarget.dataset.indice);
    if (!partidaActiva || tablero[indice] !== "") return;
    tablero[indice] = jugadorActual;
    const linea = buscarLineaGanadora();
    if (linea) {
        finalizarPartida(linea);
        return;
    }
    if (tablero.every((casilla) => casilla !== "")) {
        finalizarPartida(null);
        return;
    }
    jugadorActual = jugadorActual === "X" ? "O" : "X";
    renderizar();
}
celdas.forEach((celda) => {
    celda.addEventListener("click", jugar);
});

function reiniciarPartida() {
    if (resultado.open) resultado.close();
    tablero = Array(9).fill("");
    // AGREGADO: empieza el jugador que le corresponda según la alternancia
    jugadorActual = jugadorInicial;
    partidaActiva = true;
    celdas.forEach((celda) => celda.classList.remove("ganadora"));
    renderizar();
    celdas[0].focus();
}
registro.addEventListener("submit", (evento) => {
    evento.preventDefault();
    nombre1.setCustomValidity("");
    nombre2.setCustomValidity("");
    const n1 = nombre1.value.trim();
    const n2 = nombre2.value.trim();
    if (!n1) nombre1.setCustomValidity("Escribe un nombre válido.");
    if (!n2) nombre2.setCustomValidity("Escribe un nombre válido.");
    if (!registro.reportValidity()) return;
    jugadores = { X: n1, O: n2 };
    participantes.textContent = `${n1} (X) contra ${n2} (O)`;
    registro.hidden = true;
    juego.hidden = false;
    reiniciarPartida();
});

[nombre1, nombre2].forEach((campo) => {
    campo.addEventListener("input", () => campo.setCustomValidity(""));
});

document
    .querySelector("#reiniciar")
    .addEventListener("click", reiniciarPartida);
document.querySelector("#revancha").addEventListener("click", reiniciarPartida);
document
    .querySelector("#verTablero")
    .addEventListener("click", () => resultado.close());