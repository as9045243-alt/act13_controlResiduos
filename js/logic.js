

class ResiduoRPBI {
    constructor(area, tipo, peso) {
        this.id = Date.now();
        this.area = area;
        this.tipo = tipo;
        this.peso = parseFloat(peso);
        this.fecha = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// Referencias a los elementos del DOM 
const inputArea = document.getElementById('areaHosp');
const selectTipo = document.getElementById('tipoRPBI');
const inputPeso = document.getElementById('pesoKg');
const btnAgregar = document.getElementById('btnAgregarResiduo');
const listaResiduos = document.getElementById('listaResiduos');
const spanTotPunzo = document.getElementById('totPunzo');
const spanTotPato = document.getElementById('totPato');

// Clave para LocalStorage
const STORAGE_KEY = 'manifiesto_rpbi_registros';

// Obtener registros guardados o iniciar arreglo vacío
let registrosRPBI = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// 2. Función para recorrer el array, calcular totales y actualizar DOM
function actualizarInterfaz() {
    if (!listaResiduos) return; // Validación por seguridad
    
    listaResiduos.innerHTML = '';

    let totalPunzocortantes = 0;
    let totalPatologicos = 0;

    registrosRPBI.forEach((residuo) => {
        if (residuo.tipo === 'punzocortante') {
            totalPunzocortantes += residuo.peso;
        } else if (residuo.tipo === 'patologico') {
            totalPatologicos += residuo.peso;
        }

        const esPunzo = residuo.tipo === 'punzocortante';
        const badgeColor = esPunzo ? 'bg-danger' : 'bg-warning text-dark';
        const etiquetaTipo = esPunzo ? 'Punzocortante (Rojo)' : 'Patológico (Amarillo)';

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        li.innerHTML = `
            <div>
                <span class="badge ${badgeColor} me-2">${etiquetaTipo}</span>
                <strong>${residuo.area}</strong>
                <small class="text-muted ms-2">(${residuo.fecha})</small>
            </div>
            <div>
                <span class="badge bg-secondary rounded-pill fs-6 me-2">${residuo.peso.toFixed(2)} kg</span>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarResiduo(${residuo.id})" title="Eliminar registro">✕</button>
            </div>
        `;

        listaResiduos.appendChild(li);
    });

    if (registrosRPBI.length === 0) {
        listaResiduos.innerHTML = `
            <li class="list-group-item text-center text-muted py-4">
                No hay bolsas o recipientes registrados todavía.
            </li>
        `;
    }

    spanTotPunzo.textContent = totalPunzocortantes.toFixed(2);
    spanTotPato.textContent = totalPatologicos.toFixed(2);
}

// Guardar en LocalStorage
function guardarEnStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrosRPBI));
}

// 3. Evento para registrar nuevo desecho
if (btnAgregar) {
    btnAgregar.addEventListener('click', () => {
        const area = inputArea.value.trim();
        const tipo = selectTipo.value;
        const peso = parseFloat(inputPeso.value);

        if (!area) {
            alert('Por favor, ingresa el área hospitalaria.');
            inputArea.focus();
            return;
        }

        if (isNaN(peso) || peso <= 0) {
            alert('Por favor, ingresa un peso válido mayor a 0 kg.');
            inputPeso.focus();
            return;
        }

        const nuevoResiduo = new ResiduoRPBI(area, tipo, peso);

        registrosRPBI.push(nuevoResiduo);
        guardarEnStorage();
        actualizarInterfaz();

        inputArea.value = '';
        inputPeso.value = '';
        inputArea.focus();
    });
}

// eliminar registros
window.eliminarResiduo = function(id) {
    registrosRPBI = registrosRPBI.filter(item => item.id !== id);
    guardarEnStorage();
    actualizarInterfaz();
};

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', actualizarInterfaz);