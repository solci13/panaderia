// Productos dinámicos
const productos = [
  { id: 1, nombre: "Pan de harina de Almendras", precio: 3600 },
  // { id: 2, nombre: "Pan integral", precio: 500 },
];

// Carrito
let carrito = [];

// Mostrar productos
function mostrarProductos() {
  const contenedor = document.querySelector(".productos");
  contenedor.innerHTML = "";

  productos.forEach((prod) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <h2>${prod.nombre}</h2>
      <p>1 bolsa (contiene 10 panes)</p>
      <span class="precio">$${prod.precio}</span>
      <div class="cantidad">
        <label for="cant-pan-${prod.id}">Bolsas:</label>
        <input type="number" id="cant-pan-${prod.id}" min="1" value="0" />
        <p id="cantidad-seleccionada-${prod.id}">Cantidad seleccionada: 0</p>
      </div>
      <button id="btn-agregar-${prod.id}" disabled>Agregar al carrito</button>
    `;
    contenedor.appendChild(div);

    const inputCantidad = div.querySelector(`#cant-pan-${prod.id}`);
    const btnAgregar = div.querySelector(`#btn-agregar-${prod.id}`);

    inputCantidad.addEventListener("change", () => {
      actualizarCantidadSeleccionada(prod.id);
    });

    btnAgregar.addEventListener("click", () => {
      const cantidad = parseInt(inputCantidad.value);
      agregarAlCarrito(prod.nombre, prod.precio, cantidad);
    });
  });
}

// Actualizar cantidad seleccionada
function actualizarCantidadSeleccionada(id) {
  const cantidadInput = document.getElementById(`cant-pan-${id}`);
  const cantidad = parseInt(cantidadInput.value) || 0;
  const textoCantidad = document.getElementById(`cantidad-seleccionada-${id}`);
  const btnAgregar = document.getElementById(`btn-agregar-${id}`);

  textoCantidad.textContent = `Cantidad seleccionada: ${cantidad}`;
  btnAgregar.disabled = cantidad < 1;
}

// Agregar producto al carrito
function agregarAlCarrito(nombre, precio, cantidad = 1) {
  if (isNaN(cantidad) || cantidad < 1) {
    alert("Por favor, ingresa una cantidad válida.");
    return;
  }

  const existente = carrito.find(
    (item) => item.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
  );

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ nombre, precio, cantidad });
  }

  actualizarCarrito();

  const producto = productos.find(p => p.nombre === nombre);
  if (producto) {
    const cantidadInput = document.getElementById(`cant-pan-${producto.id}`);
    const textoCantidad = document.getElementById(`cantidad-seleccionada-${producto.id}`);
    const btnAgregar = document.getElementById(`btn-agregar-${producto.id}`);

    cantidadInput.value = 0;
    textoCantidad.textContent = "Cantidad seleccionada: 0";
    btnAgregar.disabled = true;
  }
}

// Calcular total del carrito
function calcularTotal() {
  return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

// Actualizar carrito
function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const total = document.getElementById("total");
  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = "<li>Tu carrito está vacío.</li>";
    total.textContent = "$0";
    return;
  }

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.nombre}</strong><br>
      <input type="number" min="1" value="${item.cantidad}" id="cantidad-${index}" style="width: 60px; margin-top: 5px;" />
      <span> x $${Math.round(item.precio)} = $${Math.round(item.precio * item.cantidad)}</span><br>
      <button class="btn-accion" style="margin-top: 5px; display: none; background-color: rgb(9 20 127);width:50%;" id="btn-actualizar-${index}">
        Actualizar
      </button>
      <button class="btn-accion" style="margin-top: 5px;" id="btn-eliminar-${index}">Eliminar</button>
    `;
    lista.appendChild(li);

    li.querySelector(`#cantidad-${index}`).addEventListener("input", () => {
      mostrarBotonActualizar(index);
    });

    li.querySelector(`#btn-actualizar-${index}`).addEventListener("click", () => {
      confirmarCambioCantidad(index);
    });

    li.querySelector(`#btn-eliminar-${index}`).addEventListener("click", () => {
      eliminarDelCarrito(index);
    });
  });

  const totalCompra = calcularTotal();
  total.textContent = totalCompra.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

  guardarCarrito();
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

// LocalStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const guardado = localStorage.getItem("carrito");
  if (guardado) {
    carrito = JSON.parse(guardado);
  }
  actualizarCarrito();
}

// ✅ Fecha mínima corregida (sin desfase UTC)
function configurarFechaMinima() {
  const fechaInput = document.getElementById("fecha-pedido");
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 1);

  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");

  const fechaMinima = `${año}-${mes}-${dia}`;
  fechaInput.min = fechaMinima;
  fechaInput.value = fechaMinima; // Selecciona mañana como predeterminada
}

// Formatear fecha sin desfase por zona horaria
function formatearFecha(fechaISO) {
  // fechaISO: "YYYY-MM-DD"
  // Crear objeto Date interpretando la fecha como local (evita desfase UTC)
  const partes = fechaISO.split("-");
  const fecha = new Date(partes[0], partes[1] - 1, partes[2]);

  return fecha.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Enviar pedido por WhatsApp
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

  const total = calcularTotal();

  let mensaje = `*Pedido*\n\n`;
  mensaje += `*Productos:*\n${pedidoTexto}\n\n`;
  mensaje += `*Total:* ${total.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  })}\n\n`;
  mensaje += `*Fecha estimada de entrega:* ${formatearFecha(fechaInput)}\n`;
  mensaje += "*Retiro:* El pedido se retira en mi domicilio.\n";
  mensaje += `*Método de pago:* ${metodoPago}\n`;

  if (metodoPago === "Transferencia")
    mensaje += `\nAlias: SIMPLEMENTE.LEAL.DNI`;

  const numeroWhatsApp = "5492235789055";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

  mostrarModalGracias();

  setTimeout(() => {
    window.open(url, "_blank");
    vaciarCarrito();
  }, 500);
}

function mostrarModalGracias() {
  const modal = document.getElementById("modal-gracias");
  modal.style.display = "flex";

  document.getElementById("cerrar-modal").addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Vaciar carrito
function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  actualizarCarrito();
}

// Inicializar
window.addEventListener("DOMContentLoaded", () => {
  configurarFechaMinima();
  cargarCarrito();
  mostrarProductos();
  document.querySelector(".enviar-pedido").addEventListener("click", enviarPedido);

  // Mover listener aquí para que el elemento exista
  document.getElementById("metodo-pago").addEventListener("change", () => {
    const alias = document.getElementById("alias-transferencia");
    const metodo = document.getElementById("metodo-pago").value;
    alias.style.display = metodo === "Transferencia" ? "block" : "none";
  });
});

  const botonTema = document.getElementById('boton-tema');
  const body = document.body;

  // Aplicar el tema guardado al cargar
  const temaGuardado = localStorage.getItem('tema');
  if (temaGuardado === 'oscuro') {
    body.classList.add('modo-oscuro');
    botonTema.textContent = '☀️';
  } else {
    botonTema.textContent = '🌙';
  }

  // Toggle de tema al hacer clic
  botonTema.addEventListener('click', () => {
    body.classList.toggle('modo-oscuro');
    const modoOscuroActivo = body.classList.contains('modo-oscuro');

    // Cambiar ícono
    botonTema.textContent = modoOscuroActivo ? '☀️' : '🌙';

    // Guardar en localStorage
    localStorage.setItem('tema', modoOscuroActivo ? 'oscuro' : 'claro');
  });