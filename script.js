let nivelDesbloqueado = 1;
let nivelActual = 1;
let dinero = 25000;
let reputacion = 300;
let honor = 100;
let mes = 1;
let mesLimite = 12;
let semanas = 4;
let personal = 1;
let contratos = 0;
let gastosMes = 1000;
let accionesEsteMes = 0;
let totalExitos = 0;
let exitosSeguidos = 0;
let falloEnElMes = false;
let bonifHonorExito = 0;
let dilemaRespondidoEsteCiclo = false;

window.onload = function() {
    mostrarMapa();
};

function mostrarMapa() {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const mapScreen = document.getElementById("map-screen");
    if (mapScreen) {
        mapScreen.classList.add("active");
        actualizarMapaUI();
    }
}

function actualizarMapaUI() {
    if (nivelDesbloqueado >= 2) {
        let btn2 = document.getElementById("btn-node-2");
        if (btn2) {
            btn2.classList.remove("locked");
            btn2.classList.add("unlocked");
            document.getElementById("txt-node-2").innerText = "📍 NIVEL 2: FÁBRICA DE COMPUTADORAS";
        }
    }
    if (nivelDesbloqueado >= 3) {
        let btn3 = document.getElementById("btn-node-3");
        if (btn3) {
            btn3.classList.remove("locked");
            btn3.classList.add("unlocked");
            document.getElementById("txt-node-3").innerText = "📍 NIVEL 3: GERENTE DE SUPERMERCADO";
        }
    }
}

function iniciarNivel(numNivel) {
    if (numNivel > nivelDesbloqueado) return;
    
    nivelActual = numNivel;
    dinero = 25000;
    reputacion = 300;
    honor = 100;
    mes = 1;
    semanas = 4;
    personal = 1;
    contratos = 0;
    accionesEsteMes = 0;
    totalExitos = 0;
    exitosSeguidos = 0;
    falloEnElMes = false;
    bonifHonorExito = 0;
    dilemaRespondidoEsteCiclo = false;

    const configs = {
        1: { 
            empresa: "NIVEL 1: LOGÍSTICA", 
            sub: "FASE 1: EXPORTACIÓN EN CAMIONES", 
            etiquetaPersonal: "👷 OPERARIOS",
            a1: "EMPAQUETAR CAMIÓN (2 SEM)", 
            a2: "BUSCAR CONTRATO (1 SEM)", 
            a3: "CONTRATAR OPERARIO (1 SEM)" 
        },
        2: { 
            empresa: "NIVEL 2: FÁBRICA DE PCs", 
            sub: "FASE 2: ENSAMBLE Y SOFTWARE", 
            etiquetaPersonal: "💻 TÉCNICOS",
            a1: "ENSAMBLAR PCs (2 SEM)", 
            a2: "CAMPAÑA SOFTWARE (1 SEM)", 
            a3: "CONTRATAR TÉCNICO (1 SEM)" 
        },
        3: { 
            empresa: "NIVEL 3: SUPERMERCADO", 
            sub: "FASE 3: GERENTE DE TIENDA", 
            etiquetaPersonal: "🛒 CAJEROS",
            a1: "SURTIR GÓNDOLAS (2 SEM)", 
            a2: "OFERTA MASIVA (1 SEM)", 
            a3: "CONTRATAR CAJERO (1 SEM)" 
        }
    };

    let cfg = configs[numNivel];
    document.getElementById("lbl-empresa").innerText = cfg.empresa;
    document.getElementById("lbl-subnivel").innerText = cfg.sub;
    document.getElementById("lbl-etiqueta-personal").innerText = cfg.etiquetaPersonal;
    document.getElementById("btn-act-1").innerText = cfg.a1;
    document.getElementById("btn-act-2").innerText = cfg.a2;
    document.getElementById("btn-act-3").innerText = cfg.a3;

    actualizarUI();
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("game-screen").classList.add("active");
    document.getElementById("tutorial-modal").style.display = "flex";
}

function cerrarTutorial() {
    document.getElementById("tutorial-modal").style.display = "none";
}

function actualizarUI() {
    document.getElementById("lbl-dinero").innerText = `K $${dinero.toLocaleString()}`;
    document.getElementById("lbl-honor").innerText = `🛡️ HONOR: ${honor}%`;
    document.getElementById("lbl-reputacion").innerText = `⭐ ${reputacion}`;
    document.getElementById("lbl-mes").innerText = `📅 MES: ${mes} / ${mesLimite}`;
    document.getElementById("lbl-semanas").innerText = `⚡ TIEMPO: ${semanas}/4 SEMANAS | ÉXITOS: ${totalExitos}`;
    
    document.getElementById("val-operarios").innerText = personal;
    document.getElementById("val-contratos").innerText = contratos;
    document.getElementById("val-nomina").innerText = `-$${(personal * gastosMes).toLocaleString()}`;

    let btnDilema = document.getElementById("btn-act-4");
    if (mes % 2 === 0 && !dilemaRespondidoEsteCiclo) {
        btnDilema.style.display = "block";
    } else {
        btnDilema.style.display = "none";
    }
}

function mostrarMeme(tipo) {
    const modal = document.getElementById("modal-popup");
    const img = document.getElementById("meme-img");
    if (modal && img) {
        img.src = tipo === "stonks" ? "stonks +.jpg" : "stonks -.jpg";
        modal.style.display = "flex";
        setTimeout(() => { modal.style.display = "none"; }, 2000);
    }
}

function mostrarAlertaHonor(cambio, consecuenciaTexto) {
    const banner = document.getElementById("rdr-honor-popup");
    const title = document.getElementById("rdr-honor-title");
    const desc = document.getElementById("rdr-honor-desc");
    const iconText = document.getElementById("rdr-honor-icon-text");
    
    const flashGain = document.getElementById("honor-flash-gain");
    const flashLoss = document.getElementById("honor-flash-loss");
    const vignette = document.getElementById("honor-vignette");

    if (!banner) return;

    banner.classList.remove("gain", "loss", "animate-banner");
    banner.style.display = "none";

    if (flashGain) {
        flashGain.classList.remove("animate-fade");
        flashGain.style.display = "none";
    }
    if (flashLoss) {
        flashLoss.classList.remove("animate-fade");
        flashLoss.style.display = "none";
    }
    if (vignette) {
        vignette.classList.remove("animate-fade");
        vignette.style.display = "none";
    }

    void banner.offsetWidth;

    if (cambio > 0) {
        title.innerText = `HONOR: ASCENSO MORAL (+${cambio}%)`;
        iconText.innerText = "⚜";
        banner.classList.add("gain");
        if (flashGain) {
            flashGain.style.display = "block";
            flashGain.classList.add("animate-fade");
        }
    } else {
        title.innerText = `HONOR: PÉRDIDA MORAL (${cambio}%)`;
        iconText.innerText = "⚔";
        banner.classList.add("loss");
        if (flashLoss) {
            flashLoss.style.display = "block";
            flashLoss.classList.add("animate-fade");
        }
    }

    desc.innerText = consecuenciaTexto;
    if (vignette) {
        vignette.style.display = "block";
        vignette.classList.add("animate-fade");
    }
    
    banner.classList.add("animate-banner");
    banner.style.display = "flex";

    setTimeout(() => {
        if (flashGain) flashGain.style.display = "none";
        if (flashLoss) flashLoss.style.display = "none";
        if (vignette) vignette.style.display = "none";
        banner.style.display = "none";
    }, 1350);
}

function registrarBuenaAccion() {
    totalExitos++;
    exitosSeguidos++;

    if (exitosSeguidos >= 2) {
        honor = Math.min(100, honor + 7);
        exitosSeguidos = 0;
        mostrarAlertaHonor(7, "¡Constancia moral! Has acumulado 2 buenas decisiones (+7% Honor).");
    }
}

function abrirDilemaMoral() {
    const modal = document.getElementById("dilema-modal");
    const texto = document.getElementById("dilema-texto");
    const btn1 = document.getElementById("btn-dilema-1");
    const btn2 = document.getElementById("btn-dilema-2");

    const problemas = {
        1: {
            desc: "¡Incidente en la ruta! Un camión de carga sufrió un fuerte choque debido a la falta de supervisión en los frenos.",
            b1: "Culpar formalmente al chofer por negligencia<br><small>(No pierdes dinero | -25% Honor)</small>",
            b2: "Asumir la falla gerencial y pagar los daños<br><small>(Pierdes $4,000 | +15% Honor y bonificación de éxito)</small>"
        },
        2: {
            desc: "¡Control de calidad fallido! Un lote entero de PCs salió con los pines del procesador doblados por un error en el banco de ensamblaje.",
            b1: "Sancionar y culpar a los técnicos en nómina<br><small>(No pierdes dinero | -25% Honor)</small>",
            b2: "Reemplazar los procesadores dañados de tu bolsillo<br><small>(Pierdes $4,000 | +15% Honor y bonificación de éxito)</small>"
        },
        3: {
            desc: "¡Reclamo sanitario crítico! Se descubrió un lote de productos lácteos vencidos en las góndolas principales del supermercado.",
            b1: "Echar la culpa a los reponedores y ocultar el reporte<br><small>(No pierdes dinero | -25% Honor)</small>",
            b2: "Retirar el producto y compensar públicamente<br><small>(Pierdes $4,000 | +15% Honor y bonificación de éxito)</small>"
        }
    };

    let p = problemas[nivelActual];
    texto.innerText = p.desc;
    btn1.innerHTML = p.b1;
    btn2.innerHTML = p.b2;
    modal.style.display = "flex";
}

function resolverDilema(opcion) {
    document.getElementById("dilema-modal").style.display = "none";
    dilemaRespondidoEsteCiclo = true;

    if (opcion === "echar_culpa") {
        honor = Math.max(0, honor - 25);
        bonifHonorExito = 0;
        mostrarAlertaHonor(-25, "¡Decisión injusta! Salvaste tus fondos, pero tus empleados sienten profunda desconfianza (-25% Honor).");
        document.getElementById("lbl-log").innerText = "⚠️ ¡CULPA AL PERSONAL! Te lavaste las manos ante el incidente. El dinero quedó intacto, pero el clima laboral se tornó hostil y frío.";
    } else if (opcion === "hacerse_cargo") {
        let costoReparacion = 4000;
        dinero -= costoReparacion;
        honor = Math.min(100, honor + 15);
        bonifHonorExito = 0.30;
        mostrarAlertaHonor(15, "¡Liderazgo ejemplar! Asumiste la responsabilidad económica y ganaste la lealtad de tu equipo (+15% Honor).");
        document.getElementById("lbl-log").innerText = `⚜️ ¡LIDERAZGO ÍNTEGRO! Invertiste $${costoReparacion.toLocaleString()} para solucionar el problema. Tu equipo confía en ti y las probabilidades de éxito aumentan.`;
    }

    if (dinero <= 2000) {
        mostrarGameOver("dinero");
        return;
    }
    if (honor < 25) {
        mostrarGameOver("honor_bajo");
        return;
    }

    actualizarUI();
}

const eventosExito = {
    1: [
        "🌟 Un convoy atraviesa la frontera sin inconvenientes. Tu decisión de revisar las unidades personalmente evitó pérdidas y generó un margen excelente de $8,500.",
        "🌟 La carga de camiones llegó en tiempo récord a la terminal norte. Los comerciantes elogian la puntualidad de tus choferes y pagan un bono especial.",
        "🌟 Un contrato de exportación de alta prioridad fue completado con éxito. Tus trabajadores celebran el triunfo y el negocio se afianza con fuerza."
    ],
    2: [
        "🌟 El lote de computadoras ensambladas pasó las pruebas de calidad con honores. El cliente tecnológico saluda tu eficiencia y premia tu gran entrega.",
        "🌟 Las placas base y componentes encajaron a la perfección. Tu línea de ensamble tecnológica opera con una rentabilidad asombrosa.",
        "🌟 El software optimizado fue entregado sin fallos. Tu reputación como fabricante de tecnología se dispara en el mercado digital."
    ],
    3: [
        "🌟 Las góndolas del supermercado lucen repletas y ordenadas. Los clientes abarrotan las cajas y las ventas superan todas las expectativas previstas.",
        "🌟 Una gran jornada de consumo masivo en el establecimiento. El control de stock funcionó impecable y la caja registradora no para de sumar.",
        "🌟 Excelente gestión de pasillos y atención al público. Los compradores recomiendan la tienda y tu negocio minorista brilla con fuerza."
    ]
};

const eventosFallo = {
    1: [
        "📉 Un camión sufrió una avería mecánica en la ruta montañosa. Para no retrasar el envío sobrecargaste a los choferes, provocando malestar en el equipo.",
        "📉 Hubo un problema con la documentación de la mercancía. Intentaste resolverlo apresuradamente, generando sospechas y un costo administrativo adicional.",
        "📉 Un lote de carga sufrió daños menores durante el traslado. La prisa por entregar te costó reclamos de los clientes y un desgaste en la moral del taller."
    ],
    2: [
        "📉 Un cortocircuito dañó varios procesadores en pleno ensamblaje. Los técnicos sufren retrasos y el costo de los componentes perdidos golpea tus finanzas.",
        "📉 Fallas imprevistas en el software de prueba obligan a reensamblar los equipos. El margen de ganancia se reduce por errores técnicos.",
        "📉 Un proveedor entregó piezas defectuosas que detuvieron tu línea de producción. Los plazos se vencen y la tensión en el taller aumenta."
    ],
    3: [
        "📉 Un error en la distribución de productos dejó vacías las góndolas principales. Los clientes se marchan molestos y las ventas caen este mes.",
        "📉 Problemas logísticos en el inventario de la tienda provocaron mermas y pérdidas inesperadas de mercancía perecedera.",
        "📉 Quejas masivas por desatención en las cajas registradoras dañaron la imagen comercial de tu supermercado frente a la comunidad."
    ]
};

function ejecutarAccion(tipo) {
    if (semanas <= 0) {
        document.getElementById("lbl-log").innerText = "❌ SIN TIEMPO ❌ Has agotado las 4 semanas de gestión mensual. Haz clic en PLAY para avanzar en la historia.";
        return;
    }

    const costos = { 1: 1500 * nivelActual, 2: 1000 * nivelActual, 3: 1500 * nivelActual };
    const costo = costos[tipo];

    if (dinero < costo) {
        document.getElementById("lbl-log").innerText = `❌ FONDOS INSUFICIENTES ❌ Tus arcas necesitan $${costo.toLocaleString()} para iniciar esta operación.`;
        return;
    }

    dinero -= costo;
    accionesEsteMes++;

    if (dinero <= 2000) {
        mostrarGameOver("dinero");
        return;
    }
    if (honor < 25) {
        mostrarGameOver("honor_bajo");
        return;
    }

    if (tipo === 1) {
        semanas -= 2;
        let bonusHonor = (honor >= 75 ? 0.15 : 0) + bonifHonorExito;
        let exito = Math.random() + (personal * 0.10) + bonusHonor;
        
        if (exito > 0.4) {
            dinero += costo + 8500;
            mostrarMeme("stonks");
            registrarBuenaAccion();
            let listaExito = eventosExito[nivelActual];
            document.getElementById("lbl-log").innerText = listaExito[Math.floor(Math.random() * listaExito.length)];
        } else {
            falloEnElMes = true;
            exitosSeguidos = 0;
            honor = Math.max(0, honor - 10);
            mostrarMeme("not_stonks");
            mostrarAlertaHonor(-10, "¡RETRASO EN OPERACIÓN! Pequeña penalización de honor (-10%).");
            let listaFallo = eventosFallo[nivelActual];
            document.getElementById("lbl-log").innerText = listaFallo[Math.floor(Math.random() * listaFallo.length)];
        }
    } else if (tipo === 2) {
        semanas -= 1;
        reputacion += 300;
        contratos++;
        registrarBuenaAccion();
        let msgsContrato = {
            1: `📢 Firmas acuerdos comerciales estratégicos. Has acumulado ${contratos} contrato(s) de exportación activos.`,
            2: `📢 Cierras alianzas con distribuidoras tecnológicas. Tienes ${contratos} contrato(s) corporativo(s) de software en marcha.`,
            3: `📢 Acuerdos con marcas de consumo masivo asegurados. Cartera con ${contratos} contrato(s) de abastecimiento activos.`
        };
        document.getElementById("lbl-log").innerText = msgsContrato[nivelActual];
    } else if (tipo === 3) {
        semanas -= 1;
        personal++;
        registrarBuenaAccion();
        let msgsPersonal = {
            1: `👥 Contratas operarios bajo condiciones justas. Tu plantilla asciende a ${personal} operario(s) en el taller.`,
            2: `👥 Incorporas ingenieros especialistas. Tu equipo tecnológico cuenta con ${personal} experto(s) laborando.`,
            3: `👥 Contratas cajeros y reponedores. Tu tienda cuenta con ${personal} empleado(s) atendiendo el negocio.`
        };
        document.getElementById("lbl-log").innerText = msgsPersonal[nivelActual];
    }

    if (dinero <= 2000) {
        mostrarGameOver("dinero");
        return;
    }
    if (honor < 25) {
        mostrarGameOver("honor_bajo");
        return;
    }

    actualizarUI();
}

function generarHistoriaMes() {
    let fragmento = "";

    if (honor >= 80) {
        if (!falloEnElMes) {
            fragmento = `📖 MES ${mes}: Tu empresa se consolida como un referente de trabajo justo y ético. Tus colaboradores muestran lealtad absoluta y los clientes confían plenamente en la calidad de tu gestión.`;
        } else {
            fragmento = `📖 MES ${mes}: A pesar de un contratiempo operativo, tu liderazgo íntegro mantiene unida a la empresa. Tu equipo respalda tus decisiones con total compromiso.`;
        }
    } else if (honor >= 50) {
        if (!falloEnElMes) {
            fragmento = `📖 MES ${mes}: Mantienes un equilibrio pragmático en las finanzas. La compañía crece con solidez mientras la comunidad observa tus siguientes pasos.`;
        } else {
            fragmento = `📖 MES ${mes}: Las tensiones empiezan a reflejarse en la rutina de trabajo. Algunos empleados manifiestan preocupación por las exigencias operativas.`;
        }
    } else {
        fragmento = `📖 MES ${mes}: Un ambiente de tensión y desconfianza rodea tu gestión. Las decisiones severas han erosionado el ánimo del personal y los murmullos crecen.`;
    }

    return fragmento;
}

function avanzarMes() {
    if (accionesEsteMes < 1) {
        document.getElementById("lbl-log").innerText = "❌ ACCIÓN REQUERIDA ❌ Debes tomar al menos una decisión gerencial antes de cerrar la bitácora mensual y pasar al siguiente mes.";
        return;
    }

    dinero -= (personal * gastosMes);
    mes++;
    semanas = 4;
    accionesEsteMes = 0;
    bonifHonorExito = 0;
    dilemaRespondidoEsteCiclo = false;

    if (dinero <= 2000) {
        mostrarGameOver("dinero");
        return;
    }
    if (honor < 25) {
        mostrarGameOver("honor_bajo");
        return;
    }

    if (mes > mesLimite) {
        if (totalExitos >= 8 && dinero > 2000) {
            if (honor < 25) {
                mostrarGameOver("honor_rico");
            } else {
                mostrarGameOver("victoria");
                if (nivelActual < 3) nivelDesbloqueado = Math.max(nivelDesbloqueado, nivelActual + 1);
            }
        } else {
            mostrarGameOver("dinero");
        }
        return;
    }

    let historia = generarHistoriaMes();
    falloEnElMes = false;

    actualizarUI();
    document.getElementById("lbl-log").innerText = `${historia}\n\n[Nómina mensual saldada. Ha dado inicio el Mes ${mes}].`;
}

function mostrarGameOver(causa) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const screen = document.getElementById("gameover-screen");
    const img = document.getElementById("gameover-img");
    const title = document.getElementById("gameover-title");
    const quote = document.getElementById("gameover-quote");

    if (!screen) return;

    if (causa === "dinero") {
        title.innerText = "BANCARROTA ABSOLUTA";
        img.src = "derrota_dinero.jpg";
        quote.innerText = "«Aplastaste tu futuro buscando un 'plan', pero en este juego no hay fe que te salve cuando la cobardía y la negligencia dejan tu cuenta tan vacía como tu alma. Las deudas devoraron tu imperio y tuviste que abandonar la ciudad al amparo de la noche.»";
    } else if (causa === "honor_bajo") {
        title.innerText = "DESTITUIDO POR INFAMIA";
        img.src = "derrota_honor.jpg";
        quote.innerText = "«Tu camino de avaricia y malos tratos provocó una rebelión implacable. Tus propios operarios y empleados confiscaron los bienes y te despojaron de todo cargo, manchando tu nombre para siempre.»";
    } else if (causa === "honor_rico") {
        title.innerText = "FORTUNA SIN ALMA";
        img.src = "derrota_honor.jpg";
        quote.innerText = "«Lograste acumular cofres llenos de oro, pero perdiste lo único que no se puede comprar con monedas. Terminarás tus días en una mansión solitaria, rodeado de riqueza pero despreciado por cada persona honrada del territorio.»";
    } else if (causa === "victoria") {
        title.innerText = "¡NIVEL SUPERADO CON HONOR!";
        img.src = "victoria.jpg";
        quote.innerText = "«Elegiste el honor sobre la avaricia; hoy tus acciones hablan por ti y el mundo entero se siente orgulloso del legado que construiste. Tu empresa prospera con firmeza y tus hombres te recuerdan no solo como un jefe millonario, sino como un verdadero líder.»";
    }

    screen.classList.add("active");
}
