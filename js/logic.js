// 1. Clase ResiduoRPBI
class ResiduoRPBI {
    constructor(area, tipo, peso) {
        this.id = registrosRPBI.length > 0 ? Math.max(...registrosRPBI.map(r => r.id)) + 1 : 1;
        this.area = area;
        this.tipo = tipo;
        this.peso = parseFloat(peso);
        this.fecha = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// Referencias del DOM
const inputArea = document.getElementById('areaHosp');
const selectTipo = document.getElementById('tipoRPBI');
const inputPeso = document.getElementById('pesoKg');
const btnAgregar = document.getElementById('btnAgregarResiduo');
const listaResiduos = document.getElementById('listaResiduos');
const spanTotPunzo = document.getElementById('totPunzo');
const spanTotPato = document.getElementById('totPato');

const STORAGE_KEY = 'manifiesto_rpbi_registros';
let registrosRPBI = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

//-----------------LOCAL-STORAGE

// Guardar los cambios
function guardarEnStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrosRPBI));
    actualizarInterfaz();
}
// Agregar nuevo residuo
function agregarResiduo(area, tipo, peso) {
    const nuevo = new ResiduoRPBI(area, tipo, peso);
    registrosRPBI.push(nuevo);
    guardarEnStorage();
}
// Eliminar residuo
window.eliminarResiduo = function(id) {
    registrosRPBI = registrosRPBI.filter(r => r.id !== id);
    guardarEnStorage();
};
//INTERFAZ-----------

function actualizarInterfaz() {
    listaResiduos.innerHTML = '';
    let totalPunzo = 0;
    let totalPato = 0;

    registrosRPBI.forEach(r => {
        if (r.tipo === 'punzocortante') totalPunzo += r.peso;
        if (r.tipo === 'patologico') totalPato += r.peso;

        const esPunzo = r.tipo === 'punzocortante';
        const color = esPunzo ? 'bg-danger' : 'bg-warning text-dark';
        const textoTipo = esPunzo ? 'Punzocortante (Rojo)' : 'Patológico (Amarillo)';

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <span class="badge ${color} me-2">${textoTipo}</span>
                <strong>${r.area}</strong>
                <small class="text-muted ms-2">(${r.fecha})</small>
            </div>
            <div>
                <span class="badge bg-secondary rounded-pill me-2">${r.peso.toFixed(2)} kg</span>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarResiduo(${r.id})">✕</button>
            </div>
        `;
        listaResiduos.appendChild(li);
    });

    if (registrosRPBI.length === 0) {
        listaResiduos.innerHTML = `<li class="list-group-item text-center text-muted py-3">No hay registros todavía.</li>`;
    }

    spanTotPunzo.textContent = totalPunzo.toFixed(2);
    spanTotPato.textContent = totalPato.toFixed(2);
}

// Evento del botón de registro
btnAgregar.addEventListener('click', () => {
    const area = inputArea.value.trim();
    const tipo = selectTipo.value;
    const peso = parseFloat(inputPeso.value);

    if (!area || isNaN(peso) || peso <= 0) {
        alert('Ingresa un área válida y un peso mayor a 0.');
        return;
    }

    // Llama a la función que mete el dato y actualiza todo
    agregarResiduo(area, tipo, peso);

    inputArea.value = '';
    inputPeso.value = '';
    inputArea.focus();
});

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', actualizarInterfaz);
