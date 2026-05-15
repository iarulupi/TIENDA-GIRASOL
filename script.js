let total = 0;
let carrito = [];
let recibido = 0;
let menuOriginal = "";

function actualizar() {
    document.getElementById("total").textContent = total;

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

    <p>$${p.precio}</p>
`;

    lista.appendChild(div);
});

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

function pagarEfectivo() {

    recibido = 0;

    document.querySelector(".modal-contenido").innerHTML = `

        <h2>EFECTIVO</h2>

        <p><strong>TOTAL:</strong> $${total}</p>

        <p><strong>¿QUÉ BILLETES TE DIERON?</strong></p>

        <div class="billetes">

            <img src="https://images3.cgb.fr/images/billets/b97/b97_3808a.jpg"
                 onclick="agregarBillete(100)">

            <img src="https://images3.cgb.fr/images/billets/b91/b91_6875a.jpg"
                 onclick="agregarBillete(200)">

            <img src="https://banknotenews.com/wp-content/uploads/2016/07/Argentina_BCRA_500_pesos_2016.06.30_B421a_P365_A_00000101_f-1536x632.jpg"
                 onclick="agregarBillete(500)">


            <img src="https://images3.cgb.fr/images/billets/b87/b87_0586a.jpg"
                 onclick="agregarBillete(1000)">

            <img src="https://storage.lacapitalmdp.com/2023/05/billete-2000pesos.jpg"
                 onclick="agregarBillete(2000)">

            <img src="https://platform.keesingtechnologies.com/wp-content/uploads/2024/05/AR083R.jpg"
                 onclick="agregarBillete(10000)">

            <img src="https://buenosairesherald.com/wp-content/uploads/2024/11/20000_pesos_bill_banknote_billete_Alberdi.jpg"
                 onclick="agregarBillete(20000)">

        </div>

       <h3 id="recibido">
    TOTAL RECIBIDO: $0
</h3>

<h3 id="vuelto">
</h3>

<button onclick="calcularVuelto()">
    COBRAR
</button>

<button onclick="cerrarModal()">
    VOLVER
</button>

    `;
}

function pagarTransferencia() {

    document.querySelector(".modal-contenido").innerHTML = `

        <h2>TRANSFERENCIA</h2>

        <p><strong>TOTAL:</strong> $${total}</p>

        <p><strong>ALIAS:</strong></p>

        <p class="alias">GIRASOL.FD</p>

        <button onclick="confirmarPago()">
            PAGÓ
        </button>

    `;
}

function confirmarPago() {

    total = 0;

    carrito = [];

    actualizar();

    cerrarModal();
}

function agregarBillete(valor) {

    recibido += valor;

    document.getElementById("recibido").textContent =
        "TOTAL RECIBIDO: $" + recibido;
}

function calcularVuelto() {

    let vuelto = recibido - total;

    if (vuelto < 0) {

        document.getElementById("vuelto").textContent =
            "FALTAN $" + Math.abs(vuelto);

        return;
    }

    document.getElementById("vuelto").innerHTML = `

        VUELTO: $${vuelto}

        <br><br>

        <button onclick="finalizarCompra()">
            PAGÓ
        </button>
    `;
}

function finalizarCompra() {

    total = 0;

    carrito = [];

    recibido = 0;

    actualizar();

    cerrarModal();
}

window.onload = function() {

    menuOriginal =
        document.querySelector(".modal-contenido").innerHTML;
}