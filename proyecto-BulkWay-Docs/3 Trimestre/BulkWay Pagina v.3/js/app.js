/* ================= EMAILJS ================= */

emailjs.init("hBUuNfoLM8oMmvR-N");

let pedidoEditandoId = null;
let codigoGenerado = "";
let correoUsuario = "";
let productoActual = null;

/* ================= FUNCIONES AUXILIARES ================= */

function generarClaveAleatoria(){

    const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

    let clave = "";

    for(let i = 0; i < 10; i++){

        clave += caracteres.charAt(
            Math.floor(Math.random() * caracteres.length)
        );
    }

    return clave;
}

/* ================= MENU LOGIN ================= */

function mostrarLogin(){

    document.getElementById("registro").style.display = "none";
    document.getElementById("login").style.display = "flex";

    localStorage.setItem(
        "pantallaActual",
        "login"
    );
}

function mostrarRegistro(){

    document.getElementById("login").style.display = "none";
    document.getElementById("registro").style.display = "flex";

    localStorage.setItem(
        "pantallaActual",
        "registro"
    );
}

/* ================= CREAR CUENTA ================= */

function crearCuenta(){

    const nombre = document.getElementById("registroNombre").value;
    const correo = document.getElementById("registroCorreo").value;
    const tipoUsuario = document.getElementById("tipoUsuario").value;

    if(nombre === "" || correo === ""){

        alert("Completa todos los campos");
        return;
    }

    let usuarios =
    JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe =
    usuarios.find(u => u.correo === correo);

    if(existe){

        alert("Ese correo ya está registrado");
        return;
    }

    const claveGenerada =
    generarClaveAleatoria();

    const nuevoUsuario = {

        nombre: nombre,
        correo: correo,
        clave: claveGenerada,
        tipo: tipoUsuario
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

    emailjs.send(
        "service_oaa1ud6",
        "template_qo6r339",
        {
            to_email: correo,
            nombre: nombre,
            clave: claveGenerada
        }
    );

    alert("Cuenta creada correctamente ✔");

    document.getElementById("registro").style.display = "none";

    document.getElementById("login").style.display = "flex";

    document.getElementById("emailInput").value = correo;
}

/* ================= LOGIN ================= */

function validarIngreso(){

    const correo =
    document.getElementById("emailInput").value;

    const clave =
    document.getElementById("passInput").value;

    let usuarios =
    JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(u =>
        u.correo === correo &&
        u.clave === clave
    );

    if(usuario){

        localStorage.setItem(
            "sesionActiva",
            "true"
        );

        localStorage.setItem(
            "usuarioActual",
            correo
        );

        document.getElementById("login").style.display = "none";

        document.getElementById("registro").style.display = "none";

        document.getElementById("dashboard").style.display = "block";

        document.getElementById("panelConductor").style.display = "none";

    } else {

        document.getElementById("errorMsg").style.display = "block";
    }

    localStorage.setItem(
        "pantallaActual",
        "dashboard"
    );
}

/* ================= ENTRAR COMO CONDUCTOR ================= */

function entrarConductor(){

    localStorage.setItem(
        "pantallaActual",
        "panelConductor"
    );

    localStorage.setItem(
    "sesionConductor",
        "true"
    );

    document.getElementById("registro").style.display = "none";

    document.getElementById("login").style.display = "none";

    document.getElementById("dashboard").style.display = "none";

    document.getElementById("panelConductor").style.display = "block";

    mostrarPedidosConductor();

}

function abrirLoginConductor(){

    document.getElementById(
        "modalLoginConductor"
    ).style.display = "flex";
}

function validarConductor(){

    const correo =
    document.getElementById(
        "correoConductor"
    ).value;

    const clave =
    document.getElementById(
        "claveConductor"
    ).value;

    if(
        correo === "carlos@bulkway.com" &&
        clave === "123456"
    ){

        localStorage.setItem(
            "sesionConductor",
            "true"
        );

        localStorage.setItem(
            "nombreConductor",
            "Carlos Sierra"
        );

        cerrarModal(
            "modalLoginConductor"
        );

        entrarConductor();

        return;
    }

    let usuarios =
    JSON.parse(
        localStorage.getItem("usuarios")
    ) || [];

    const conductor =
    usuarios.find(u =>

        u.correo === correo &&
        u.clave === clave &&
        u.tipo === "conductor"

    );

    if(conductor){

        localStorage.setItem(
            "sesionConductor",
            "true"
        );

        localStorage.setItem(
            "nombreConductor",
            conductor.nombre
        );

        cerrarModal(
            "modalLoginConductor"
        );

        entrarConductor();

    }else{

        alert(
            "Correo o contraseña incorrectos"
        );
    }
}

function mostrarPedidosConductor(){

    navegarConductor("pedidosConductor");

    const contenedor =
    document.getElementById("listaPedidosConductor");

    contenedor.innerHTML = "";

    const pedidosBase = [

        {
            id: "BK-201",
            cliente: "Supermercado El Ahorro",
            direccion: "Calle 72 #20-15, Bogotá",
            cantRey: 80,
            cantLiquido: 15,
            total: 615500
        },

        {
            id: "BK-202",
            cliente: "Distribuciones La Economía",
            direccion: "Carrera 24 #68-40, Bogotá",
            cantRey: 60,
            cantLiquido: 10,
            total: 433000
        }
    ];

    pedidosBase.forEach(p => {

        contenedor.innerHTML += `

        <div class="card">

            <h3>${p.id}</h3>

            <p><strong>Cliente:</strong> ${p.cliente}</p>

            <p><strong>Dirección:</strong> ${p.direccion}</p>

            <p><strong>Estado:</strong> Pendiente 🚚</p>

        </div>

        `;

    });



    let pedidosGuardados =
    JSON.parse(localStorage.getItem("pedidos")) || [];

    let pedidos =
    [...pedidosBase, ...pedidosGuardados];

    

}

/* ================= DESPLEGABLES ================= */

function togglePedido(titulo){

    const contenido =
    titulo.nextElementSibling;

    if(
        contenido.style.display ===
        "block"
    ){

        contenido.style.display =
        "none";

    }else{

        contenido.style.display =
        "block";
    }
}

/* ================= ENTRAR COMO CLIENTE ================= */

function entrarCliente(){

    localStorage.setItem(
        "pantallaActual",
        "panelCliente"
    );

    localStorage.setItem(
    "sesionCliente",
        "true"
    );

    document.getElementById(
        "registro"
    ).style.display = "none";

    document.getElementById(
        "login"
    ).style.display = "none";

    document.getElementById(
        "dashboard"
    ).style.display = "none";

    document.getElementById(
        "panelConductor"
    ).style.display = "none";

    document.getElementById(
        "panelCliente"
    ).style.display = "block";
}

/* ================= NAVEGACION CONDUCTOR ================= */

function navegarConductor(id){

    document.querySelectorAll(
        "#panelConductor .section"
    ).forEach(s => {

        s.classList.remove(
            "active-section"
        );
    });

    document.getElementById(id)
    .classList.add("active-section");

    localStorage.setItem(
        "seccionConductor",
        id
    );
}

/* ================= NAVEGACION CLIENTE ================= */

function navegarCliente(id){

    document.querySelectorAll(
        "#panelCliente .section"
    ).forEach(s => {

        s.classList.remove(
            "active-section"
        );

    });

    document.getElementById(id)
    .classList.add(
        "active-section"
    );
}

/* ================= CERRAR SESION CONDUCTOR ================= */

function cerrarSesionConductor(){

    document.getElementById(
        "panelConductor"
    ).style.display = "none";

    document.getElementById(
        "registro"
    ).style.display = "flex";

    localStorage.removeItem("sesionConductor");
    localStorage.removeItem("seccionConductor");
    localStorage.removeItem("pantallaActual");

    location.reload();
}

/* ================= CERRAR SESION CLIENTE ================= */

function cerrarSesionCliente(){

    document.getElementById(
        "panelCliente"
    ).style.display = "none";

    document.getElementById(
        "registro"
    ).style.display = "flex";

    localStorage.removeItem("sesionCliente");
    localStorage.removeItem("seccionCliente");
    localStorage.removeItem("pantallaActual");

    location.reload();
}

/* ================= NAV ================= */

function navegar(id){

    document
    .querySelectorAll(".section")
    .forEach(seccion => {

        seccion.classList.remove(
            "active-section"
        );

    });

    document
    .getElementById(id)
    .classList.add(
        "active-section"
    );

    localStorage.setItem(
        "seccionActual",
        id
    );

    history.pushState(
        { seccion: id },
        "",
        "#" + id
    );
}

function toggleModulo(id){

    const modulo =
    document.getElementById(id);

    if(modulo.style.display === "block"){

        modulo.style.display = "none";

    }else{

        modulo.style.display = "block";
    }
}

/* ================= CERRAR SESION ================= */

function cerrarSesion(){

    localStorage.removeItem(
        "sesionActiva"
    );

    localStorage.removeItem(
        "usuarioActual"
    );

    document.getElementById(
        "dashboard"
    ).style.display = "none";

    document.getElementById(
        "login"
    ).style.display = "none";

    document.getElementById(
        "registro"
    ).style.display = "flex";

    document.getElementById(
        "emailInput"
    ).value = "";

    document.getElementById(
        "passInput"
    ).value = "";
}

/* ================= CRUD ================= */

function abrirCrearCarga(){

    document.getElementById(
        "modalCrearCarga"
    ).style.display = "flex";
}

/* ================= GUARDAR CARGA ================= */

function guardarCarga(){

    const cliente =
    document.getElementById("nuevoCliente").value;

    const direccion =
    document.getElementById("nuevaDireccion").value;

    const fecha = 
    document.getElementById("fechaPedido").value;

    if(cliente === "" || direccion === ""){

        alert("Completa todos los campos");
        return;
    }

    const cantRey =
    parseInt(
        document.getElementById("cantRey").value || 0
    );

    const cantLiquido =
    parseInt(
        document.getElementById("cantLiquido").value || 0
    );

    const precioRey = 3400;
    const precioLiquido = 22900;

    const total =
    (cantRey * precioRey) +
    (cantLiquido * precioLiquido);

    const pedido = {

        id: "BK-" + Date.now(),

        cliente,

        direccion,

        cantRey,

        cantLiquido,

        total,

        estado: "Borrador"
    };

    let pedidos =
    JSON.parse(localStorage.getItem("pedidos")) || [];

    pedidos.push(pedido);

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );

    mostrarPedidos();

    cerrarModal("modalCrearCarga");

    mostrar("Pedido agregado correctamente ✔");
}

/* ================= EDICION ================= */

function editarCarga(id){

    let pedidos =
    JSON.parse(localStorage.getItem("pedidos")) || [];

    const pedido =
    pedidos.find(p => p.id === id);

    if(!pedido){

        alert("Pedido no encontrado");
        return;
    }

    pedidoEditandoId = id;

    document.getElementById("editCliente").value =
    pedido.cliente;

    document.getElementById("editDireccion").value =
    pedido.direccion;

    document.getElementById("editRey").value =
    pedido.cantRey;

    document.getElementById("editLiquido").value =
    pedido.cantLiquido;

    document.getElementById("modalEditar").style.display =
    "flex";
}

/* ================= CONFIRMAR EDICION ================= */

function confirmarEdicion(){

    let pedidos =
    JSON.parse(localStorage.getItem("pedidos")) || [];

    const precioRey = 3400;
    const precioLiquido = 22900;

    pedidos = pedidos.map(p => {

        if(p.id === pedidoEditandoId){

            p.cliente =
            document.getElementById("editCliente").value;

            p.direccion =
            document.getElementById("editDireccion").value;

            p.cantRey =
            parseInt(
                document.getElementById("editRey").value || 0
            );

            p.cantLiquido =
            parseInt(
                document.getElementById("editLiquido").value || 0
            );

            p.total =
            (p.cantRey * precioRey) +
            (p.cantLiquido * precioLiquido);
        }

        return p;
    });

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );

    mostrarPedidos();

    cerrarModal("modalEditar");

    mostrar("Pedido actualizado ✔");
}

/* ================= ELIMINAR ================= */

function eliminarCarga(id){

    let pedidos =
    JSON.parse(localStorage.getItem("pedidos")) || [];

    pedidos =
    pedidos.filter(p => p.id !== id);

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );

    mostrarPedidos();

    mostrar("Pedido eliminado ✔");
}

/* ================= PUBLICAR ================= */

function publicarCarga(id){

    let pedidos =
    JSON.parse(localStorage.getItem("pedidos")) || [];

    pedidos = pedidos.map(p => {

        if(p.id === id){

            p.estado = "Publicado 🚚";
        }

        return p;
    });

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );

    mostrarPedidos();

    mostrar("Carga publicada 🚚");
}

/* ================= PRODUCTO ================= */

function mostrarFormularioProducto(){

    document.getElementById(
        "formularioProducto"
    ).style.display = "block";
}

function guardarProducto(){

    const nombre =
    document.getElementById(
        "nombreProducto"
    ).value;

    const cantidad =
    document.getElementById(
        "cantidadProducto"
    ).value;

    const precio =
    document.getElementById(
        "precioProducto"
    ).value;

    if(
        nombre === "" ||
        cantidad === "" ||
        precio === ""
    ){

        alert(
            "Completa todos los campos"
        );

        return;
    }

    const lista =
    document.getElementById(
        "listaProductos"
    );

    lista.innerHTML += `

        <div class="card">

            <h3 class="nombreProducto">
                ${nombre}
            </h3>

            <p
                class="stockProducto"
                data-stock="${cantidad}">

                Stock: ${cantidad}

            </p>

            <p
                class="precioProducto"
                data-precio="${precio}">

                Precio: $${precio}

            </p>

            <button
                class="btn"
                onclick="abrirModalEditarProducto(this)">

                ✏️ Modificar

            </button>

            <button
                class="btn"
                onclick="eliminarProducto(this)">

                🗑️ Eliminar

            </button>

        </div>

    `;

    document.getElementById(
        "nombreProducto"
    ).value = "";

    document.getElementById(
        "cantidadProducto"
    ).value = "";

    document.getElementById(
        "precioProducto"
    ).value = "";

    document.getElementById(
        "imagenProducto"
    ).value = "";

    document.getElementById(
        "formularioProducto"
    ).style.display = "none";
}

function editarProducto(boton){

    const card =
    boton.parentElement;

    const nombre =
    card.querySelector(".nombreProducto");

    const stock =
    card.querySelector(".stockProducto");

    const precio =
    card.querySelector(".precioProducto");

    const nuevoNombre =
    prompt("Nuevo nombre:", nombre.textContent);

    const nuevoStock =
    prompt("Nuevo stock:", stock.dataset.stock);

    const nuevoPrecio =
    prompt("Nuevo precio:", precio.dataset.precio);

    if(nuevoNombre)
        nombre.textContent = nuevoNombre;

    if(nuevoStock){
        stock.textContent =
        "Stock: " + nuevoStock;

        stock.dataset.stock =
        nuevoStock;
    }

    if(nuevoPrecio){
        precio.textContent =
        "Precio: $" + nuevoPrecio;

        precio.dataset.precio =
        nuevoPrecio;
    }
}

function eliminarProducto(boton){

    boton.parentElement.remove();
}

/* ================= EDITAR PRODUCTO ================= */

function abrirModalEditarProducto(boton){

    productoActual =
    boton.parentElement;

    document.getElementById(
        "editarNombreProducto"
    ).value =
    productoActual.querySelector(
        ".nombreProducto"
    ).textContent;

    document.getElementById(
        "editarStockProducto"
    ).value =
    productoActual.querySelector(
        ".stockProducto"
    ).dataset.stock;

    document.getElementById(
        "editarPrecioProducto"
    ).value =
    productoActual.querySelector(
        ".precioProducto"
    ).dataset.precio;

    abrirModal(
        "modalEditarProducto"
    );
}

function guardarEdicionProducto(){

    const nombre =
    document.getElementById(
        "editarNombreProducto"
    ).value;

    const stock =
    document.getElementById(
        "editarStockProducto"
    ).value;

    const precio =
    document.getElementById(
        "editarPrecioProducto"
    ).value;

    productoActual.querySelector(
        ".nombreProducto"
    ).textContent =
    nombre;

    productoActual.querySelector(
        ".stockProducto"
    ).textContent =
    "Stock: " + stock;

    productoActual.querySelector(
        ".stockProducto"
    ).dataset.stock =
    stock;

    productoActual.querySelector(
        ".precioProducto"
    ).textContent =
    "Precio: $" + precio;

    productoActual.querySelector(
        ".precioProducto"
    ).dataset.precio =
    precio;

    cerrarModal(
        "modalEditarProducto"
    );
}

function abrirModal(id){

    document.getElementById(id)
    .style.display = "flex";

}

/* ================= RUTAS ================= */

function abrirRuta(){

    const url =
    document.getElementById("linkMaps").value;

    if(url){

        window.open(url);
    }
}

/* ================= RUTAS DE CONDUCTOR ================= */

function abrirRutaCarlos(){

    const origen =
    "Full Clean, Cra 88D, Cl. 36 Sur #34A Bogotá";

    const parada1 =
    "Calle 72 #20-15 Bogotá";

    const parada2 =
    "Carrera 24 #68-40 Bogotá";

    const url =
    "https://www.google.com/maps/dir/Full+Clean+Cra+88D+Cl+36+Sur+%2334A+Bogot%C3%A1/Calle+72+%2320-15+Bogot%C3%A1/Carrera+24+%2368-40+Bogot%C3%A1";

    window.open(url, "_blank");

    localStorage.setItem(
        "pantallaActual",
        ""
    );
}

/* ================= NOTIFICACIONES ================= */

function mostrar(msg){

    const n =
    document.getElementById("notificacion");

    n.innerText = msg;

    n.style.display = "block";

    setTimeout(() => {

        n.style.display = "none";

    }, 2000);
}

function cerrarModal(id){

    document.getElementById(id).style.display =
    "none";
}

/* ================= INFO CONDUCTOR ================= */

function verInfoCarlos(){

    alert(

        `CONDUCTOR: Carlos Sierra

        CÉDULA: 1029384756

        TELÉFONO: 3204567890

        CORREO:
        carlos.sierra@bulkway.com

        LICENCIA:
        C2 Profesional

        VEHÍCULO:
        Camión NPR

        PLACA:
        KLM-204

        RUTA:
        Bogotá Norte

        ESTADO:
        Activo ✔`
    );
}

/* ================= CONDUCTORES ================= */

function abrirModalConductor(){

    document.getElementById(
        "modalConductor"
    ).style.display = "flex";
}

function guardarConductor(){

    const nombre =
    document.getElementById(
        "conductorNombre"
    ).value;

    const cedula =
    document.getElementById(
        "conductorCedula"
    ).value;

    const telefono =
    document.getElementById(
        "conductorTelefono"
    ).value;

    const correo =
    document.getElementById(
        "conductorCorreo"
    ).value;

    const zona =
    document.getElementById(
        "conductorZona"
    ).value;

    let conductores =
    JSON.parse(
        localStorage.getItem("conductores")
    ) || [];

    const clave =
    document.getElementById(
        "conductorClave"
    ).value;

    const nuevoConductor = {

        id: "COND-" + Date.now(),

        nombre,

        cedula,

        telefono,

        correo,

        zona
    };

    conductores.push(
        nuevoConductor
    );

    localStorage.setItem(
        "conductores",
        JSON.stringify(conductores)
    );

    mostrarConductores();

    cerrarModal("modalConductor");

    mostrar("Conductor agregado ✔");
}

function mostrarConductores(){

    const contenedor =
    document.getElementById(
        "listaConductores"
    );

    contenedor.innerHTML = "";

    let conductores =
    JSON.parse(
        localStorage.getItem("conductores")
    ) || [];

    conductores.forEach(c => {

        contenedor.innerHTML += `

        <div class="card">

            <h3>${c.nombre}</h3>

            <p>
                <strong>Cédula:</strong>
                ${c.cedula}
            </p>

            <p>
                <strong>Teléfono:</strong>
                ${c.telefono}
            </p>

            <p>
                <strong>Zona:</strong>
                ${c.zona}
            </p>

            <button
                class="btn"
                onclick="alert(
                'Correo: ${c.correo}\nZona: ${c.zona}'
                )"
            >
                Ver Información
            </button>

        </div>
        `;
    });
}

/* ================= RECUPERAR CONTRASEÑA ================= */

function mostrarRecuperacion(){

    document.getElementById(
        "modalRecuperar"
    ).style.display = "flex";
}

function enviarCodigo(){

    correoUsuario =
    document.getElementById(
        "correoRecuperacion"
    ).value;

    codigoGenerado =
    Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    emailjs.send(
        "service_oaa1ud6",
        "template_x4fl7ff",
        {
            to_email: correoUsuario,
            codigo: codigoGenerado
        }
    );

    document.getElementById(
        "pasoCorreo"
    ).style.display = "none";

    document.getElementById(
        "pasoCodigo"
    ).style.display = "block";
}

function verificarCodigo(){

    const c =
    document.getElementById(
        "codigoIngresado"
    ).value;

    if(c === codigoGenerado){

        document.getElementById(
            "pasoCodigo"
        ).style.display = "none";

        document.getElementById(
            "pasoNuevaClave"
        ).style.display = "block";
    }
}

function actualizarClave(){

    const nuevaClave =
    document.getElementById(
        "nuevaClave"
    ).value;

    let usuarios =
    JSON.parse(
        localStorage.getItem("usuarios")
    ) || [];

    usuarios = usuarios.map(usuario => {

        if(usuario.correo === correoUsuario){

            usuario.clave = nuevaClave;
        }

        return usuario;
    });

    localStorage.setItem(
    "usuarios",
        JSON.stringify(usuarios)
    );

    alert(
        "Contraseña actualizada correctamente ✔"
    );

    cerrarModal("modalRecuperar");
}

function continuarSinCambiar(){

    cerrarModal("modalRecuperar");

    mostrar("Proceso finalizado ✔");
}

/* ================= MOSTRAR PEDIDOS ================= */

function mostrarPedidos(){

    const contenedor =
    document.getElementById(
        "listaPedidos"
    );

    contenedor.innerHTML = "";

    const pedidosBase = [

        {
            id: "BK-201",
            cliente: "Supermercado El Ahorro",
            direccion: "Calle 72 #20-15, Bogotá",
            cantRey: 80,
            cantLiquido: 15,
            total: 615500,
            conductor: "Carlos Sierra",
            ruta: "Chapinero Norte",
            estado: "Pendiente 🚚"
        },

        {
            id: "BK-202",
            cliente: "Distribuciones La Economía",
            direccion: "Carrera 24 #68-40, Bogotá",
            cantRey: 60,
            cantLiquido: 10,
            total: 433000,
            conductor: "Carlos Sierra",
            ruta: "Chapinero Norte",
            estado: "Pendiente 🚚"
        }
    ];

    let pedidos =
    JSON.parse(
        localStorage.getItem("pedidos")
    ) || [];

    const todosLosPedidos =
    [...pedidosBase, ...pedidos];

    todosLosPedidos.forEach(p => {

        contenedor.innerHTML += `

        <div class="card">

            <h3>${p.id}</h3>

            <p>
                <strong>Cliente:</strong>
                ${p.cliente}
            </p>

            <p>
                <strong>Dirección:</strong>
                ${p.direccion}
            </p>

            <p>
                <strong>Jabón Rey:</strong>
                ${p.cantRey} unds
            </p>

            <p>
                <strong>Jabón Líquido:</strong>
                ${p.cantLiquido} unds
            </p>

            <p>
                <strong>Total:</strong>
                $${p.total.toLocaleString()}
            </p>

            <p>
                <strong>Conductor:</strong>
                ${p.conductor || "Carlos Sierra"}
            </p>

            <p>
                <strong>Ruta:</strong>
                ${p.ruta || "Bogotá"}
            </p>

            <p>
                <strong>Estado:</strong>
                ${p.estado}
            </p>

            <button
                class="btn"
                onclick="editarCarga('${p.id}')"
            >
                Editar
            </button>

            <button
                class="btn"
                onclick="eliminarCarga('${p.id}')"
            >
                Eliminar
            </button>

            <button
                class="btn"
                onclick="publicarCarga('${p.id}')"
            >
                Publicar
            </button>

        </div>
        `;
    });
}

/* ================= ESTADO DE PAGO ================= */

function cambiarEstado(id){

    const estado =
    prompt(
        "Escribe: Pagada, Pendiente o En Mora"
    );

    if(
        estado === null ||
        estado === ""
    ){
        return;
    }

    document.getElementById(id)
    .textContent = estado;
}

/* ================= FACTURA ================= */

function editarFactura(boton){

    const card = boton.parentElement;

    const cliente =
    card.querySelector(".clienteFactura");

    const total =
    card.querySelector(".totalFactura");

    if(boton.textContent.includes("Editar")){

        cliente.contentEditable = true;
        total.contentEditable = true;

        cliente.style.background =
        "#fff8dc";

        total.style.background =
        "#fff8dc";

        cliente.style.padding =
        "4px";

        total.style.padding =
        "4px";

        cliente.style.border =
        "1px solid #ccc";

        total.style.border =
        "1px solid #ccc";

        boton.textContent =
        "💾 Guardar";

    }else{

        cliente.contentEditable = false;
        total.contentEditable = false;

        cliente.style.background =
        "transparent";

        total.style.background =
        "transparent";

        cliente.style.border =
        "none";

        total.style.border =
        "none";

        boton.textContent =
        "✏️ Editar Factura";
    }
}

/* ================= FUNCIONES PAGINA ================= */

window.addEventListener(
    "scroll",
    function(){

        localStorage.setItem(
        "scrollPosition",
            window.scrollY
        );
    }
);

window.onload = function(){

    const pantallaActual =
    localStorage.getItem(
        "pantallaActual"
    );

    const seccionGuardada =
    localStorage.getItem(
        "seccionActual"
    );

    if(seccionGuardada){

        navegar(seccionGuardada);

    }else{

        navegar("pedidos");
    }

    const sesionActiva =
    localStorage.getItem(
        "sesionActiva"
    );

    const sesionConductor =
    localStorage.getItem(
        "sesionConductor"
    );

    if(sesionConductor === "true"){

        const contenedorLogin = document.getElementById("contenedorLogin");

        if(contenedorLogin) {
            contenedorLogin.style.display = "none";
        }

        document.getElementById(
            "registro"
        ).style.display = "none";

        document.getElementById(
            "login"
        ).style.display = "none";

        document.getElementById(
            "dashboard"
        ).style.display = "none";

        document.getElementById(
            "panelConductor"
        ).style.display = "block";

        const seccionConductor =
        localStorage.getItem(
            "seccionConductor"
        );

        if(seccionConductor === "pedidosConductor"){

            mostrarPedidosConductor();

        }else if(
            seccionConductor === "rutasConductor"
        ){

            navegarConductor(
                "rutasConductor"
            );
        }

    }


    if(sesionActiva === "true"){

        document.getElementById(
            "login"
        ).style.display = "none";

        document.getElementById(
            "registro"
        ).style.display = "none";

        document.getElementById(
            "dashboard"
        ).style.display = "block";

        mostrarPedidos();

        mostrarConductores();

        const seccionGuardada =
        localStorage.getItem(
            "seccionActual"
        );

        if(seccionGuardada){

            navegar(
                seccionGuardada
            );

        } else {

            navegar("pedidos");
        }

        const posicionScroll =
        localStorage.getItem(
            "scrollPosition"
        );

        if(posicionScroll){

            setTimeout(() => {

                window.scrollTo(
                    0,
                    parseInt(posicionScroll)
                );

            }, 50);
        }

    } else {

        const panelCond = document.getElementById("panelConductor");
        if (panelCond) {
            panelCond.style.display = "none";
        }

        if(pantallaActual === "login"){

            document.getElementById(
                "registro"
            ).style.display = "none";

            document.getElementById(
                "login"
            ).style.display = "flex";

        }else{

            document.getElementById(
                "registro"
            ).style.display = "flex";

            document.getElementById(
                "login"
            ).style.display = "none";
        }

        document.getElementById(
            "dashboard"
        ).style.display = "none";
    }
};