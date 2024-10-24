/////////////////////////////////////////////
//CREACION DEL DOM

let container = document.createElement("div");
container.setAttribute("id", "container");

let divParaMeterGastos = document.createElement("div");
divParaMeterGastos.setAttribute("id", "divParaMeterGastos");

let form = document.createElement("form");
form.setAttribute("id", "form");

let Usuario = document.createElement("select");
Usuario.setAttribute("id", "Usuario");

let option1 = document.createElement("option");
option1.value = "Usuario 1";
option1.textContent = "Usuario 1";
option1.img = "./img/user1.jpg";
Usuario.appendChild(option1);

let option2 = document.createElement("option");
option2.value = "Usuario 2";
option2.textContent = "Usuario 2";
option2.img = "./img/user2.png";
Usuario.appendChild(option2);

let option3 = document.createElement("option");
option3.value = "Usuario 3";
option3.textContent = "Usuario 3";
option3.img = "./img/user3.png";
Usuario.appendChild(option3);

let inputMotivoDelGasto = document.createElement("input");
inputMotivoDelGasto.setAttribute("id", "inputGasto");
inputMotivoDelGasto.setAttribute("placeholder", "Motivo del gasto");

let inputImporte = document.createElement("input");
inputImporte.setAttribute("id", "inputImporte");
inputImporte.setAttribute("placeholder", "00.00 ");

let inputFecha = document.createElement("input");
inputFecha.setAttribute("id", "inputFecha");
inputFecha.setAttribute("placeholder", "d/mm/aaaa");

let btnAñadirGasto = document.createElement("button");
btnAñadirGasto.setAttribute("id", "btn");
btnAñadirGasto.textContent = "Añadir Gasto";

form.appendChild(Usuario);
form.appendChild(inputMotivoDelGasto);
form.appendChild(inputImporte);
form.appendChild(inputFecha);
form.appendChild(btnAñadirGasto);

divParaMeterGastos.appendChild(form);
container.appendChild(divParaMeterGastos);
document.body.appendChild(container);

let resumenDePagosDiv = document.createElement("div");
resumenDePagosDiv.setAttribute("id", "balanceDiv");
resumenDePagosDiv.innerHTML = "<h3>Resumen de gastos y deudas</h3>";
container.appendChild(resumenDePagosDiv);




btnAñadirGasto.addEventListener("click", (event) => {
  event.preventDefault(); // Previene el envío del formulario y la recarga de la página
  if (comprobarCampos()) {
    let divParaVerGastos = document.createElement("div");
    divParaVerGastos.setAttribute("id", "divParaVerGastos");

    let imgUsuario = document.createElement("img");
    imgUsuario.src = obtenerImagenUsuario(Usuario.value); 
    imgUsuario.style.width = "50px";
    imgUsuario.style.height = "50px";
    imgUsuario.style.borderRadius = "50%";
    imgUsuario.style.alignSelf = "start"; 
    divParaVerGastos.appendChild(imgUsuario); 
    divParaVerGastos.append(` ${Usuario.value} pagó: ${inputImporte.value}€ el ${inputFecha.value}`);

    container.appendChild(divParaVerGastos);
    actualizarBalance(Usuario.value, parseFloat(inputImporte.value));

    resetearInputs();
  } else {
    alert("Faltan campos por rellenar");
  }
});



// Función para obtener la imagen del usuario
function obtenerImagenUsuario(usuario) {
  switch (usuario) {
    case "Usuario 1":
      return "img/user1.jpg"; 
    case "Usuario 2":
      return "img/user2.png"; 
    case "Usuario 3":
      return "img/user3.png";
    default:
      return "img/user.png"; 
  }
}
let gastos = {
  "Usuario 1": 0,
  "Usuario 2": 0,
  "Usuario 3": 0,
};
let gastosTotales = 0; 
 const numeroDeUsuarios = 3; 

/** Esta funcion actualiza lo que debe cada usuario o le deben segun el importe realizado por cada uno de ellos, le crea los divs con su informacion y actualiza las cantidadaes
 * en cada uso
*/
 function actualizarBalance(usuario, importe) {
  gastos[usuario] += importe;

  gastosTotales += importe;

  resumenDePagosDiv.innerHTML = "<h3>La segunda cifra indica lo que se debe pagar realmente, o si es negativa lo que se debe a quien pagó.</h3>";

  const deudaPorUsuario = (gastosTotales / numeroDeUsuarios).toFixed(2);

  // Creamos tantos divs coomo usuarios hayamos creado en el array gastos
  for (let usuarioEnArray in gastos) {
    let usuarioDiv = document.createElement("div");
    usuarioDiv.classList.add("usuario-balance");

    let imgUsuario = document.createElement("img");
    imgUsuario.src = obtenerImagenUsuario(usuarioEnArray);
    imgUsuario.style.width = "50px";
    imgUsuario.style.height = "50px";
    imgUsuario.style.borderRadius = "50%";

    let saldoUsuario = gastos[usuarioEnArray].toFixed(2);
    let deudaUsuario = (gastos[usuarioEnArray] - deudaPorUsuario).toFixed(2);
    let infoUsuario = document.createElement("p");

    // segun haya pagado mas o menos, se le debera o debera a los demas usuarios
    if (deudaUsuario < 0) {
      infoUsuario.innerHTML = `${usuarioEnArray}: ha pagado un total de ${saldoUsuario}€ | Debe: ${deudaUsuario}€`;
    } else if (deudaUsuario > 0) {
      infoUsuario.innerHTML = `${usuarioEnArray}: ha pagado un total de ${saldoUsuario}€ | Se le debe: ${deudaUsuario}€`;
    } else {
      infoUsuario.innerHTML = `${usuarioEnArray}: ha pagado un total de ${saldoUsuario}€ | Está al día.`;
    }

    usuarioDiv.appendChild(imgUsuario);
    usuarioDiv.appendChild(infoUsuario);

    resumenDePagosDiv.appendChild(usuarioDiv);
  }
}





/////////////////////////////////////////////

//REGEX

/*
- El campo fecha
    - Será de tipo texto.
    - Solamente permitirá introducir fechas con el formato dd/mm/yyyy.
    - No permitirá introducir fechas que no sean válidas. */
function comprobarFecha(element) {
  let regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
  if (regex.test(element.value)) {
    console.log("fecha valida dia mes año");
    element.classList.add("verde");

    element.style.borderColor = "green";
    return true;
  } else {
    console.log("incorrecto");
    element.style.borderColor = "red";
    return false;
  }
}

/** - El campo importe
    - Será de tipo texto.
    - Solamente admitirá número comprendidos entre 0.00 y 1000.00.
    - Será necesario introducir siempre la parte decimal entera, es decir los dos números.
    - El separador de la parte entera y la parte decimal será un "."
    */
function comprobarImporte(element) {
  let regex = /^(1000\.00|[0-9]{1,3}\.[0-9]{2})$/;
  if (regex.test(element.value)) {
    console.log("correcto");
    element.style.borderColor = "green";
    return true;
  } else {
    console.log("incorrecto");
    element.style.borderColor = "red";
    return false;
  }
}

/**- El campo título
    - Será de tipo texto.
    - Solamente permitirá que se introduzcan letras mayúsculas, letras minúsculas y números.
    - Su longitud será entre 1 y 20.
    */
function comprobarMotivo(element) {
  let regex = /^[a-zA-Z0-9]{1,20}$/;
  if (regex.test(element.value)) {
    console.log("correcto");
    element.style.borderColor = "green";
    return true;
  } else {
    console.log("incorrecto");
    element.style.borderColor = "red";
    return false;
  }
}

//Evento que se ejecuta cuando se pulse el boton enviar
function comprobarCampos() {
  let motivoValido = comprobarMotivo(inputMotivoDelGasto);
  let importeValido = comprobarImporte(inputImporte);
  let fechaValida = comprobarFecha(inputFecha);

  return motivoValido && importeValido && fechaValida;
}

function resetearInputs() {
  inputMotivoDelGasto.value = "";
  inputImporte.value = "";
  inputFecha.value = "";
}

