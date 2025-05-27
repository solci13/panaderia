let carrito = [];

window.addEventListener("DOMContentLoaded", function () {
  const fechaInput = document.getElementById("fecha-pedido");

  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 1); // 1 día de anticipación
  const fechaMinima = hoy.toISOString().split("T")[0];
  fechaInput.min = fechaMinima;

  actualizarCantidadSeleccionada();
});


actualizarCarrito();

function agregarAlCarrito(nombre, precio, cantidad = 1) {
  if (cantidad < 1) {
    alert("Por favor, ingresa una cantidad válida.");
    return;
  }

 const existente = carrito.find((item) => item.nombre.toLowerCase().trim() === nombre.toLowerCase().trim());

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
        style="margin-top: 5px; display: none;background-color:rgb(9 20 127);" 
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
  "Recordá que los pedidos se preparan con 1 día de anticipación. Si hacés tu pedido para hoy, estará sujeto a disponibilidad.\n\n¿Deseás continuar?"
);


  if (!confirmacion) return;

  const fechaInput = document.getElementById("fecha-pedido").value;
  if (!fechaInput) {
  alert("Por favor, seleccioná una fecha estimada de entrega.");
  return;
}

  const metodoPago = document.getElementById("metodo-pago").value;

  const pedidoTexto = carrito
    .map((item) => `- ${item.cantidad} x ${item.nombre}`)
    .join("\n");

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  let mensaje = `*Pedido*\n\n`;
  mensaje += `*Productos:*\n${pedidoTexto}\n\n`;
  mensaje += `*Total:* ${total.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  })}\n\n`;

  if (fechaInput) mensaje += `*Fecha estimada de entrega:* ${fechaInput}\n`;
  mensaje += "*Retiro:* El pedido se retira en mi domicilio.\n";
  mensaje += `*Método de pago:* ${metodoPago}\n`;
  if (metodoPago === "Transferencia")
    mensaje += `\nAlias para transferencia: LEALSOL.DNI`;

  const numeroWhatsApp = "5492235789055";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

document.getElementById("metodo-pago").addEventListener("change", function () {
  const alias = document.getElementById("alias-transferencia");
  alias.style.display = this.value === "Transferencia" ? "block" : "none";
});
