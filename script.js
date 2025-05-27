let carrito = [];

actualizarCantidadSeleccionada();
actualizarCarrito();

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

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.nombre}</strong><br>
      <input 
        type="number" min="1" value="${item.cantidad}" id="cantidad-${index}" 
        style="width: 60px; margin-top: 5px;" 
        oninput="mostrarBotonActualizar(${index})"
      >
      <span> x $${Math.round(item.precio)} = $${Math.round(item.precio * item.cantidad)}</span><br>
      <button 
        onclick="confirmarCambioCantidad(${index})" 
        class="btn-accion" 
        style="margin-top: 5px; display: none;" 
        id="btn-actualizar-${index}"
      >
        Actualizar
      </button>
      <button 
        onclick="eliminarDelCarrito(${index})" 
        class="btn-accion" 
        style="margin-top: 5px;"
      >
        Eliminar
      </button>
    `;
    lista.appendChild(li);
    totalCompra += item.precio * item.cantidad;
  });

  total.textContent = totalCompra.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });
}

function mostrarBotonActualizar(index) {
  const botonActualizar = document.getElementById(`btn-actualizar-${index}`);
  botonActualizar.style.display = "inline-block";
}

function confirmarCambioCantidad(index) {
  const input = document.getElementById(`cantidad-${index}`);
  const nuevaCantidad = parseInt(input.value);

  if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
    alert("Cantidad no válida.");
    return;
  }

  carrito[index].cantidad = nuevaCantidad;
  actualizarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function actualizarCantidadSeleccionada() {
  const cantidadInput = document.getElementById("cant-pan");
  const cantidad = parseInt(cantidadInput.value) || 0;
  const textoCantidad = document.getElementById("cantidad-seleccionada");
  const btnAgregar = document.getElementById("btn-agregar");

  textoCantidad.textContent = `Cantidad seleccionada: ${cantidad}`;
  btnAgregar.disabled = cantidad < 1;
}

function enviarPedido() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const confirmacion = confirm(
    "Recuerda que el pedido debe hacerse con anticipación. Sino estará sujeto a la disponibilidad de la panadería.\n\n¿Deseas continuar?"
  );
  if (!confirmacion) return;

  const fechaInput = document.getElementById("fecha-pedido").value;
  const retiro = document.getElementById("retiro-pedido").checked;
  const metodoPago = document.getElementById("metodo-pago").value;

  const pedidoTexto = carrito
    .map((item) => `- ${item.cantidad} x ${item.nombre}`)
    .join("\n");

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  let mensaje = `*Pedido Panadería*\n\n`;
  mensaje += `*Productos:*\n${pedidoTexto}\n\n`;
  mensaje += `*Total:* ${total.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  })}\n\n`;

  if (fechaInput) mensaje += `*Fecha estimada de entrega:* ${fechaInput}\n`;
  mensaje += retiro ? `*Retiro:* Pasaré a retirar el pedido.\n` : "";
  mensaje += `*Método de pago:* ${metodoPago}\n`;
  if (metodoPago === "Transferencia")
    mensaje += `\nAlias para transferencia: LEALSOL.DNI`;

  const numeroWhatsApp = "5492235789055";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}


// Establecer fecha mínima al cargar
window.addEventListener("DOMContentLoaded", function () {
  const fechaInput = document.getElementById("fecha-pedido");
  const hoy = new Date().toISOString().split("T")[0];
  fechaInput.min = hoy;
});
