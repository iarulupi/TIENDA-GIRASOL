let total = 0;
let carrito = [];
let recibido = 0;
let menuOriginal = "";
let billetesRecibidos = [];
let historial = [];
let totalDia = 0;
let metodoPago = "";

function actualizarBilletes() {
    const contenedor = document.getElementById("bandeja-billetes");
    contenedor.innerHTML = "";

    billetesRecibidos.forEach((b, index) => {
        const div = document.createElement("div");
        div.className = "billete-item";

        div.innerHTML = `
            <img src="${b.img}" alt="billete">

            <div class="borrar-btn" onclick="eliminarBillete(${index})">
    ✖
</div>
        `;

        contenedor.appendChild(div);
    });
}

function actualizar() {
    document.getElementById("total").textContent =
    formatearDinero(total);
    
    let lista = document.getElementById("lista-carrito");
    lista.innerHTML = "";

    carrito.forEach((p, index) => {

    let div = document.createElement("div");
    div.className = "item-carrito";

    div.innerHTML = `

    <div class="borrar-btn" onclick="eliminarProducto(${index})">
        ✖
    </div>

    <img src="${p.imagen}" alt="${p.nombre}">

    <p>${p.nombre}</p>

    <p>$${formatearDinero(p.precio)}</p>
`;

    lista.appendChild(div);
});

}

function eliminarBillete(index) {
    recibido -= billetesRecibidos[index].valor;

    billetesRecibidos.splice(index, 1);

    actualizarBilletes();

    document.getElementById("recibido").textContent =
        "TOTAL RECIBIDO: $" +
formatearDinero(recibido);
}

function agregar(nombre, precio, imagen) {

    total += precio;

    carrito.push({
        nombre,
        precio,
        imagen
    });

    actualizar();
}

function restar(nombre, precio) {
    let i = carrito.findIndex(p => p.nombre === nombre);
    if (i !== -1) {
        carrito.splice(i, 1);
        total -= precio;
        actualizar();
    }
}

function cobrar() {

    document.getElementById("modal-pago").style.display = "flex";
}

function eliminarProducto(index) {

    total -= carrito[index].precio;

    carrito.splice(index, 1);

    actualizar();
}

function cerrarModal() {

    document.getElementById("modal-pago").style.display = "none";

    document.querySelector(".modal-contenido").innerHTML =
        menuOriginal;
}

// Regresa al selector de método sin cerrar el modal ni perder el carrito.
function volverMetodoPago() {
    document.querySelector("#modal-pago .modal-contenido").innerHTML = menuOriginal;
}

function pagarEfectivo(conservarSeleccion = false) {

metodoPago = "EFECTIVO";

    if (!conservarSeleccion) { recibido = 0; billetesRecibidos = []; }

    document.querySelector(".modal-contenido").innerHTML = `

        <button type="button" class="boton-volver-flecha" onclick="volverMetodoPago()" aria-label="Volver" title="Volver">←</button>
        <h2>EFECTIVO</h2>

        <p><strong>TOTAL:</strong> $${formatoPesos(total)}</p>

        <p><strong>¿QUÉ BILLETES TE DIERON?</strong></p>

        <div class="billetes billetes-cobro">
          <div class="fila-billetes-cobro">

            <img src="https://images3.cgb.fr/images/billets/b97/b97_3808a.jpg"
                 onclick="agregarBillete(100, 'https://images3.cgb.fr/images/billets/b97/b97_3808a.jpg')">

            <img src="https://images3.cgb.fr/images/billets/b91/b91_6875a.jpg"
                 onclick="agregarBillete(200, 'https://images3.cgb.fr/images/billets/b91/b91_6875a.jpg')">

            <img src="https://banknotenews.com/wp-content/uploads/2016/07/Argentina_BCRA_500_pesos_2016.06.30_B421a_P365_A_00000101_f-1536x632.jpg"
                 onclick="agregarBillete(500, 'https://banknotenews.com/wp-content/uploads/2016/07/Argentina_BCRA_500_pesos_2016.06.30_B421a_P365_A_00000101_f-1536x632.jpg')">


          </div>
          <div class="fila-billetes-cobro">
            <img src="https://images3.cgb.fr/images/billets/b87/b87_0586a.jpg"
                 onclick="agregarBillete(1000, 'https://images3.cgb.fr/images/billets/b87/b87_0586a.jpg')">

            <img src="https://storage.lacapitalmdp.com/2023/05/billete-2000pesos.jpg"
                 onclick="agregarBillete(2000, 'https://storage.lacapitalmdp.com/2023/05/billete-2000pesos.jpg')">

            <img src="https://platform.keesingtechnologies.com/wp-content/uploads/2024/05/AR083R.jpg"
                 onclick="agregarBillete(10000, 'https://platform.keesingtechnologies.com/wp-content/uploads/2024/05/AR083R.jpg')">

            <img src="https://buenosairesherald.com/wp-content/uploads/2024/11/20000_pesos_bill_banknote_billete_Alberdi.jpg"
                 onclick="agregarBillete(20000, 'https://buenosairesherald.com/wp-content/uploads/2024/11/20000_pesos_bill_banknote_billete_Alberdi.jpg')">

          </div>
        </div>

       <h3 id="recibido">
    TOTAL RECIBIDO: $${formatearDinero(recibido)}
</h3>

<div id="bandeja-billetes"></div>
<button onclick="calcularVuelto()">
    COBRAR
</button>

    `;
    if (conservarSeleccion) actualizarBilletes();
}

function pagarTransferencia() {

metodoPago = "TRANSFERENCIA";

    document.querySelector(".modal-contenido").innerHTML = `

        <button type="button" class="boton-volver-flecha" onclick="volverMetodoPago()" aria-label="Volver" title="Volver">←</button>
        <h2>TRANSFERENCIA</h2>

        <p><strong>TOTAL:</strong> $${formatoPesos(total)}</p>

        <p><strong>ALIAS:</strong></p>

        <p class="alias">GIRASOL.FD</p>

        <button onclick="confirmarPago()">
            PAGÓ
        </button>

    `;
}

function confirmarPago() {

guardarVenta();

    total = 0;

    carrito = [];

    actualizar();

    cerrarModal();
}


// VUELTO VISUAL: reutiliza las imágenes y denominaciones del cobro en efectivo.
const DENOMINACIONES_VUELTO = [
    { valor: 20000, img: "https://buenosairesherald.com/wp-content/uploads/2024/11/20000_pesos_bill_banknote_billete_Alberdi.jpg" },
    { valor: 10000, img: "https://platform.keesingtechnologies.com/wp-content/uploads/2024/05/AR083R.jpg" },
    { valor: 2000, img: "https://storage.lacapitalmdp.com/2023/05/billete-2000pesos.jpg" },
    { valor: 1000, img: "https://images3.cgb.fr/images/billets/b87/b87_0586a.jpg" },
    { valor: 500, img: "https://banknotenews.com/wp-content/uploads/2016/07/Argentina_BCRA_500_pesos_2016.06.30_B421a_P365_A_00000101_f-1536x632.jpg" },
    { valor: 200, img: "https://images3.cgb.fr/images/billets/b91/b91_6875a.jpg" },
    { valor: 100, img: "https://images3.cgb.fr/images/billets/b97/b97_3808a.jpg" }
];
let alternativasVuelto = [];
let indiceAlternativaVuelto = 0;

// Busca combinaciones únicas ordenadas por cantidad total de billetes (menor primero).
// Genera hasta 120 alternativas para evitar bloquear la interfaz en vueltos grandes.
function generarAlternativasVuelto(monto, limite = 120) {
    if (!Number.isSafeInteger(monto) || monto < 0 || monto % 100 !== 0) return [];
    if (monto === 0) return [[]];
    const valores = DENOMINACIONES_VUELTO.map(b => b.valor);
    const combinaciones = [];
    const seleccion = Array(valores.length).fill(0);
    const minimo = Math.ceil(monto / valores[0]);
    const maxBilletes = Math.floor(monto / valores[valores.length - 1]);

    function buscar(pos, restante, cantidad) {
        if (combinaciones.length >= limite) return;
        const valor = valores[pos];
        if (pos === valores.length - 1) {
            if (restante === cantidad * valor) {
                seleccion[pos] = cantidad;
                const combinacion = [];
                seleccion.forEach((n, i) => {
                    for (let j = 0; j < n; j++) combinacion.push(i);
                });
                combinaciones.push(combinacion);
            }
            return;
        }
        const siguienteMayor = valores[pos + 1];
        const max = Math.min(cantidad, Math.floor(restante / valor));
        for (let n = max; n >= 0 && combinaciones.length < limite; n--) {
            const resto = restante - n * valor;
            const faltan = cantidad - n;
            if (resto < faltan * valores[valores.length - 1] || resto > faltan * siguienteMayor) continue;
            seleccion[pos] = n;
            buscar(pos + 1, resto, faltan);
        }
        seleccion[pos] = 0;
    }
    for (let cantidad = minimo; cantidad <= maxBilletes && combinaciones.length < limite; cantidad++) {
        buscar(0, monto, cantidad);
    }
    return combinaciones;
}

function mostrarAlternativaVuelto() {
    const contenedor = document.getElementById("billetes-vuelto-visual");
    if (!contenedor) return;
    const alternativa = alternativasVuelto[indiceAlternativaVuelto] || [];
    contenedor.replaceChildren();
    alternativa.forEach(indice => {
        const billete = DENOMINACIONES_VUELTO[indice];
        const imagen = document.createElement("img");
        imagen.src = billete.img;
        imagen.alt = "Billete de $" + formatearDinero(billete.valor);
        imagen.title = imagen.alt;
        imagen.loading = "lazy";
        imagen.onerror = function () {
            this.style.display = "none";
            const texto = document.createElement("span");
            texto.className = "billete-vuelto-sin-imagen";
            texto.textContent = "$" + formatearDinero(billete.valor);
            this.parentElement.appendChild(texto);
        };
        const marco = document.createElement("div");
        marco.className = "billete-vuelto-item";
        marco.appendChild(imagen);
        contenedor.appendChild(marco);
    });
    const boton = document.getElementById("otra-forma-vuelto");
    if (boton) {
        boton.disabled = alternativasVuelto.length <= 1;
        boton.textContent = alternativasVuelto.length <= 1 ? "NO HAY OTRA FORMA" : "↻ BUSCAR OTRA FORMA";
    }
}

function buscarOtraFormaVuelto() {
    if (alternativasVuelto.length <= 1) return;
    indiceAlternativaVuelto = (indiceAlternativaVuelto + 1) % alternativasVuelto.length;
    mostrarAlternativaVuelto();
}

function calcularVuelto() {
    const vuelto = recibido - total;
    if (vuelto < 0) {
        document.getElementById("vuelto").textContent =
            "FALTAN $" + formatearDinero(Math.abs(vuelto));
        return;
    }

    alternativasVuelto = generarAlternativasVuelto(vuelto);
    indiceAlternativaVuelto = 0;
    // Al cobrar, reemplazar la selección de billetes recibidos por la pantalla de vuelto.
    const vista = document.querySelector(".modal-contenido");
    vista.innerHTML = `
        <div class="vuelto-visual">
            <button type="button" class="boton-volver-flecha" onclick="pagarEfectivo(true)" aria-label="Volver a los billetes recibidos" title="Volver">←</button>
            <h2>VUELTO: $${formatearDinero(vuelto)}</h2>
            ${vuelto > 0 ? `
                <p><strong>BUSCÁ ESTOS BILLETES</strong></p>
                <div id="billetes-vuelto-visual" aria-label="Billetes para entregar de vuelto"></div>
                <button type="button" id="otra-forma-vuelto" onclick="buscarOtraFormaVuelto()">↻ BUSCAR OTRA FORMA</button>
            ` : `<p>NO HAY VUELTO PARA ENTREGAR</p>`}
            <button type="button" class="boton-pago-vuelto" onclick="finalizarCompra()">PAGÓ</button>
        </div>
    `;
    if (vuelto > 0) {
        if (alternativasVuelto.length) mostrarAlternativaVuelto();
        else vista.querySelector(".vuelto-visual").insertAdjacentHTML("beforeend", "<p>NO SE PUEDE FORMAR ESTE VUELTO CON LOS BILLETES DISPONIBLES.</p>");
    }
}

function finalizarCompra() {

guardarVenta();

    total = 0;

    carrito = [];

    recibido = 0;

    billetesRecibidos = []; // 👈 ESTE ES EL FIX

    actualizar();

    cerrarModal();
}

window.onload = function() {

    menuOriginal =
        document.querySelector(".modal-contenido").innerHTML;
}

function mover(valor) {
    document.getElementById("productos").scrollBy({
        left: valor,
        behavior: "smooth"
    });
}

function agregarBillete(valor, img) {

    recibido += valor;

    billetesRecibidos.push({ valor, img });

    actualizarBilletes();

    document.getElementById("recibido").textContent =
        "TOTAL RECIBIDO: $" +
formatearDinero(recibido);
}

const slider = document.getElementById("productos");

let presionado = false;
let inicioX;
let scrollInicial;

slider.addEventListener("mousedown", (e) => {
    presionado = true;

    slider.style.cursor = "grabbing";

    inicioX = e.pageX - slider.offsetLeft;

    scrollInicial = slider.scrollLeft;
});

slider.addEventListener("mouseleave", () => {
    presionado = false;

    slider.style.cursor = "grab";
});

slider.addEventListener("mouseup", () => {
    presionado = false;

    slider.style.cursor = "grab";
});

slider.addEventListener("mousemove", (e) => {

    if (!presionado) return;

    e.preventDefault();

    const x = e.pageX - slider.offsetLeft;

    const mover = (x - inicioX) * 2;

    slider.scrollLeft = scrollInicial - mover;
});

function pantallaCompleta() {

    const boton =
        document.querySelector(".fullscreen-btn");

    if (!document.fullscreenElement) {

        document.documentElement.requestFullscreen();

        boton.style.display = "none";
    }
}

function guardarVenta() {

    const ahora = new Date();

    const hora =
        ahora.getHours().toString().padStart(2, "0")
        + ":" +
        ahora.getMinutes().toString().padStart(2, "0");

    historial.push({
    hora: hora,
    total: total,
    metodo: metodoPago
});

    totalDia += total;

    actualizarHistorial();
}

function actualizarHistorial() {

    const lista =
        document.getElementById("lista-historial");

    lista.innerHTML = "";

    historial.forEach(v => {

        const item =
            document.createElement("p");

        item.textContent =
    `${v.hora} - ${v.metodo} - $${v.total}`;

        lista.appendChild(item);
    });

    document.getElementById("total-dia").textContent =
        "TOTAL DEL DÍA: $" +
formatearDinero(totalDia);
}

document.addEventListener("fullscreenchange", () => {

    const boton =
        document.querySelector(".fullscreen-btn");

    if (!document.fullscreenElement) {

        boton.style.display = "block";
    }
});

function abrirHistorial() {

    document.getElementById("modal-historial")
        .style.display = "flex";
}

function cerrarHistorial() {

    document.getElementById("modal-historial")
        .style.display = "none";
}

function descargarHistorial() {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    const fecha =
        new Date().toLocaleDateString("es-AR");

    const logo = new Image();

    logo.crossOrigin = "anonymous";

    logo.src = "https://i.ibb.co/1fht26XT/Chat-GPT-Image-14-may-2026-08-58-26-p-m.png";

    logo.onload = function() {

        pdf.addImage(
    logo,
    "PNG",
    165,
    10,
    30,
    30
);

        generarPDF();
    };

    logo.onerror = function() {

        generarPDF();
    };

    function generarPDF() {

        pdf.setFont(
    "helvetica",
    "bold"
);

pdf.setFontSize(22);

pdf.text(
    "TIENDA GIRASOL",
    105,
    20,
    { align: "center" }
);

pdf.setFont(
    "helvetica",
    "italic"
);

pdf.setFontSize(16);

pdf.setFont(
    "helvetica",
    "bold"
);

pdf.text(
    "Historial del día",
    105,
    30,
    { align: "center" }
);

pdf.setFont(
    "helvetica",
    "normal"
);

pdf.setFontSize(12);

pdf.text(
    "Fecha: " + fecha,
    20,
    45
);

        let y = 60;

        historial.forEach((venta, i) => {

            pdf.text(
                `${i + 1}. ${venta.metodo} - $${venta.total}`,
                20,
                y
            );

            y += 10;
        });

        y += 10;


        pdf.save(
            `historial_tienda_girasol_${fecha}.pdf`
        );
    }
}

function formatearDinero(numero) {
    return numero.toLocaleString("es-AR");
}

function formatoPesos(numero) {
    return numero.toLocaleString("es-AR");
}
