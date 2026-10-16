// Estado General del Juego
let gameState = {
    mes: 1,
    nivel: 1,
    dinero: 25000,
    honor: 100,
    personal: 1,
    gastosBase: 1000,
    bonificacionExito: 0,
    dilemaPendiente: false
};

// Datos de los Nivel
const nivelesData = {
    1: {
        titulo: "Nivel 1: Logística de Harina de Pescado",
        desc: "Empaquetado y despacho marítimo. Cuidado con las grietas de la bodega.",
        gananciaContrato: 6000,
        dilema: {
            titulo: "⚠️ Fuga detectada en el contenedor",
            desc: "¿Deseas contratar reparación urgente ($3,000) o taparlo temporalmente echando la culpa al transportista?",
            opcionA: "Pagar reparación urgente (-$3,000 | +10 Honor)",
            opcionB: "Ocultar la fuga (-20 Honor | $0)"
        }
    },
    2: {
        titulo: "Nivel 2: Ensamblaje de Componentes de PC",
        desc: "Taller de precisión electrónica y montaje de placas.",
        gananciaContrato: 12000,
        dilema: {
            titulo: "⚠️ Pines doblados en lote de CPUs",
            desc: "Se detectaron procesadores defectuosos. ¿Cómo manejar el incidente?",
            opcionA: "Reemplazar lote dañado (-$4,000 | +15 Honor)",
            opcionB: "Culpar al equipo técnico (-25 Honor | $0)"
        }
    },
    3: {
        titulo: "Nivel 3: Gran Cadena de Supermercados",
        desc: "Góndolas, logística masiva y cobro en cajas registradoras.",
        gananciaContrato: 20000,
        dilema: {
            titulo: "⚠️ Productos vencidos en el inventario",
            desc: "Se halló mercadería caducada en los pasillos principales.",
            opcionA: "Retirar y desechar lote (-$5,000 | +15 Honor)",
            opcionB: "Rematarlos con descuento (-30 Honor | +$2,000)"
        }
    }
};

// Actualizar la interfaz gráfica
function actualizarUI() {
    document.getElementById("mes-actual").textContent = gameState.mes;
    document.getElementById("nivel-actual").textContent = gameState.nivel;
    document.getElementById("dinero").textContent = gameState.dinero.toLocaleString();
    document.getElementById("honor").textContent = gameState.honor;
    document.getElementById("personal").textContent = gameState.personal;

    // Actualizar barra de honor
    const honorBar = document.getElementById("honor-bar");
    honorBar.style.width = gameState.honor + "%";
    
    if (gameState.honor > 60) {
        honorBar.style.backgroundColor = "#4caf50";
    } else if (gameState.honor > 30) {
        honorBar.style.backgroundColor = "#ff9800";
    } else {
        honorBar.style.backgroundColor = "#f44336";
    }

    // Actualizar información del nivel
    const dataNivel = nivelesData[gameState.nivel];
    document.getElementById("titulo-nivel").textContent = dataNivel.titulo;
    document.getElementById("desc-nivel").textContent = dataNivel.desc;
}

// Mostrar alertas dinámicas con desvanecimiento
function mostrarAlerta(mensaje) {
    const box = document.getElementById("alerta-box");
    box.textContent = mensaje;
    box.classList.remove("hidden");
    box.style.opacity = "1";

    setTimeout(() => {
        box.style.opacity = "0";
        setTimeout(() => box.classList.add("hidden"), 1000);
    }, 3000);
}

// Acciones principales
function firmarContrato() {
    const dataNivel = nivelesData[gameState.nivel];
    let ganancia = dataNivel.gananciaContrato + (gameState.bonificacionExito * 1000);
    gameState.dinero += ganancia;
    mostrarAlerta(`Contrato firmado. Ganancia recibida: +$${ganancia.toLocaleString()}`);
    actualizarUI();
}

function contratarPersonal() {
    if (gameState.dinero < 1000) {
        mostrarAlerta("Sin fondos suficientes para contratar operarios.");
        return;
    }
    gameState.personal++;
    gameState.dinero -= 1000;
    mostrarAlerta("Nuevo operario contratado. Producción aumentada.");
    actualizarUI();
}

// Control del flujo mensual y niveles
function avanzarMes() {
    // Pagar salarios
    let costoNomina = gameState.personal * gameState.gastosBase;
    gameState.dinero -= costoNomina;

    // Verificar Bancarrota por dinero
    if (gameState.dinero <= 2000) {
        finalizarJuego("dinero");
        return;
    }

    gameState.mes++;

    // Subir de nivel cada 4 meses
    if (gameState.mes === 5) gameState.nivel = 2;
    if (gameState.mes === 9) gameState.nivel = 3;

    // Detonar dilema crítico del nivel
    if (gameState.mes === 3 || gameState.mes === 7 || gameState.mes === 11) {
        lanzarDilema();
    } else {
        mostrarAlerta(`Avanzaste al mes ${gameState.mes}. Nómina pagada: -$${costoNomina}`);
    }

    // Comprobar Victoria al llegar al mes 12
    if (gameState.mes > 12) {
        finalizarJuego("victoria");
        return;
    }

    actualizarUI();
}

// Dilemas Morales (Estilo RDR2)
function lanzarDilema() {
    gameState.dilemaPendiente = true;
    const dataNivel = nivelesData[gameState.nivel];
    const dilemaCard = document.getElementById("seccion-dilema");
    
    document.getElementById("dilema-titulo").textContent = dataNivel.dilema.titulo;
    document.getElementById("dilema-desc").textContent = dataNivel.dilema.desc;
    document.getElementById("btn-opcion-a").textContent = dataNivel.dilema.opcionA;
    document.getElementById("btn-opcion-b").textContent = dataNivel.dilema.opcionB;

    dilemaCard.classList.remove("hidden");
}

function resolverDilema(opcion) {
    if (gameState.nivel === 1) {
        if (opcion === 'a') {
            gameState.dinero -= 3000;
            gameState.honor = Math.min(100, gameState.honor + 10);
            gameState.bonificacionExito += 2;
        } else {
            gameState.honor -= 20;
            gameState.bonificacionExito = 0;
        }
    } else if (gameState.nivel === 2) {
        if (opcion === 'a') {
            gameState.dinero -= 4000;
            gameState.honor = Math.min(100, gameState.honor + 15);
        } else {
            gameState.honor -= 25;
        }
    } else if (gameState.nivel === 3) {
        if (opcion === 'a') {
            gameState.dinero -= 5000;
            gameState.honor = Math.min(100, gameState.honor + 15);
        } else {
            gameState.dinero += 2000;
            gameState.honor -= 30;
        }
    }

    document.getElementById("seccion-dilema").classList.add("hidden");
    gameState.dilemaPendiente = false;

    // Verificar derrota por honor
    if (gameState.honor < 25) {
        finalizarJuego("honor");
        return;
    }

    actualizarUI();
}

// Pantallas Finales
function finalizarJuego(causa) {
    const pantallaFinal = document.getElementById("pantalla-final");
    const titulo = document.getElementById("final-titulo");
    const desc = document.getElementById("final-desc");
    const img = document.getElementById("final-img");

    pantallaFinal.classList.remove("hidden");

    if (causa === "victoria") {
        titulo.textContent = "🏆 ¡VICTORIA EMPRESARIAL!";
        desc.textContent = "Lograste completar los 12 meses gestionando tus empresas con éxito.";
        img.src = "victoria.jpg";
    } else if (causa === "dinero") {
        titulo.textContent = "💥 BANCARROTA FINANCIERA";
        desc.textContent = "Tu capital cayó por debajo del límite mínimo ($2,000). La empresa ha quebrado.";
        img.src = "derrota_dinero.jpg";
    } else if (causa === "honor") {
        titulo.textContent = "⚖️ BANCARROTA MORAL";
        desc.textContent = "Tu honor cayó por debajo del 25%. Perdiste la confianza de socios y clientes.";
        img.src = "derrota_honor.jpg";
    }
}

function reiniciarJuego() {
    location.reload();
}

// Inicializar al cargar
window.onload = actualizarUI;
