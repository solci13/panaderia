let carrito = [];

actualizarCantidadSeleccionada();

function agregarAlCarrito(nombre, precio, cantidad = 1) {
  if (cantidad < 1) {
    alert("Por favor, ingresa una cantidad válida.");
    return;
  }

  const existente = carrito.find((item) => item.nombre === nombre);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ nombre, precio, cantidad });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const total = document.getElementById("total");
  lista.innerHTML = "";
  let totalCompra = 0;

  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.cantidad} x ${item.nombre} - $${(item.precio * item.cantidad).toFixed(2)}`;
    lista.appendChild(li);
    totalCompra += item.precio * item.cantidad;
  });

  total.textContent = totalCompra.toFixed(2);
}

function actualizarCantidadSeleccionada() {
  const cantidad = document.getElementById("cant-pan").value;
  const textoCantidad = document.getElementById("cantidad-seleccionada");
  textoCantidad.textContent = `Cantidad seleccionada: ${cantidad}`;
}

function enviarPedido() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const confirmacion = confirm(
    "Recuerda que el pedido debe hacerse con anticipación y está sujeto a la disponibilidad de la panadería.\n\n¿Deseas continuar?"
  );
  if (!confirmacion) return;

  const fechaInput = document.getElementById("fecha-pedido").value;
  const retiro = document.getElementById("retiro-pedido").checked;
  const metodoPago = document.getElementById("metodo-pago").value;

  // Construir texto con saltos y separadores
  const pedidoTexto = carrito
    .map((item) => `- ${item.cantidad} x ${item.nombre}`)
    .join("%0A");

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  let mensaje = `*Pedido Panadería *%0A%0A`;
  mensaje += `*Productos:*%0A${pedidoTexto}%0A%0A`;
  mensaje += `*Total:* $${total.toFixed(2)}%0A%0A`;
  if (fechaInput) mensaje += `*Fecha estimada de entrega:* ${fechaInput}%0A`;
  mensaje += retiro ? `*Retiro:* Pasaré a retirar el pedido.%0A` : "";
  mensaje += `*Método de pago:* ${metodoPago}%0A`;
  if (metodoPago === "Transferencia")
    mensaje += `%0AAlias para transferencia: panaderiaceleste.alias%0A`;

  const numeroWhatsApp = "5492235789055"; // Cambia por tu número real
  const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
  window.open(url, "_blank");
}

// Mostrar/ocultar alias de transferencia según selección de método de pago
document.getElementById("metodo-pago").addEventListener("change", function () {
  const alias = document.getElementById("alias-transferencia");
  if (this.value === "Transferencia") {
    alias.style.display = "block";
  } else {
    alias.style.display = "none";
  }
});
