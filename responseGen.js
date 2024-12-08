/*global chrome*/

function contarPalabrasContenidas(cadenaA, cadenaB) {
    // Convertir ambas cadenas a minúsculas para hacer la comparación insensible a mayúsculas y minúsculas
    cadenaA = cadenaA.toLowerCase();
    cadenaB = cadenaB.toLowerCase();

    // Dividir las cadenas en palabras
    var palabrasA = cadenaA.split(/\s+/);
    var palabrasB = cadenaB.split(/\s+/);

    // Inicializar contador
    var contador = 0;

    // Iterar sobre las palabras de la cadena A
    palabrasA.forEach(function (palabra) {
        // Verificar si la palabra está contenida en la cadena B
        if (palabrasB.includes(palabra)) {
            contador++;
        }
    });
    return contador;
}

function obtenerNodosDeTextoRecursivosComoCadena(elemento) {
    var textNodes = Array.from(elemento.childNodes)
        .flatMap(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                return [node.textContent.trim()];
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                return obtenerNodosDeTextoRecursivosComoCadena(node);
            } else {
                return [];
            }
        });

    return textNodes.join(' ');
}

function elementoConRespuestaCorrecta(arrayElementos, respuesta) {
    var elementoAMarcar;
    var maxPContenidas = 0;
    for (var i = 0; i < arrayElementos.length; i++) {
        const textoElem = obtenerNodosDeTextoRecursivosComoCadena(arrayElementos[i]);
        const palCont = contarPalabrasContenidas(respuesta, textoElem);
        //console.log("Palabras contenidas por " + textoElem +" = " + palCont);
        if (palCont >= maxPContenidas) {
            maxPContenidas = palCont;
            elementoAMarcar = arrayElementos[i];
        }
    }
    return elementoAMarcar;
}

function marcarRadioEnPadre(elemento) {
    // Verifica que se proporcionó un elemento como parámetro
    if (elemento) {
        // Obtén el elemento padre del elemento proporcionado
        var padre = elemento.parentElement;

        // Busca el elemento input de tipo radio dentro del padre
        var radioInput = padre.querySelector('input[type="radio"]');

        // Marca el elemento radio si se encuentra
        if (radioInput) {
            radioInput.checked = true;
        }
    }
}

function extractElementsByDataRegion(parentElement) {
    // Utiliza querySelectorAll para obtener todos los elementos hijos que cumplen el criterio
    var elements = parentElement.querySelectorAll('[data-region="answer-label"]');
    // Convierte la NodeList resultante en un array para mayor flexibilidad
    var elementsArray = Array.from(elements);

    return elementsArray;
}

function marcarRespuestaCorrecta(contenedorPadre, respuesta) {
    const elementosRespuesta = extractElementsByDataRegion(contenedorPadre);
    //console.log(elementosRespuesta);
    const elementoCorrecto = elementoConRespuestaCorrecta(elementosRespuesta, respuesta);
    marcarRadioEnPadre(elementoCorrecto);
}


function insertarContenedorConAnimacion(contenedorPadre, answer) {
    try {
        marcarRespuestaCorrecta(contenedorPadre, answer);
    } catch (e) { }
    // Crear el div con el texto y añadirlo al contenedor padre
    var nuevoDiv = document.createElement("div");
    var nuevoDivFlex = document.createElement("div");
    var nuevoDivTexto = document.createElement("div");
    // Crear un elemento de imagen
    var imgElement = document.createElement("img");

    // Establecer la ruta de la imagen
    imgElement.src = chrome.runtime.getURL("geco2.png");

    imgElement.alt = "Texto alternativo"
    // Establecer el ancho de la imagen en 30 píxeles
    imgElement.width = 27;
    imgElement.height = 27;
    imgElement.style.marginRight = "10px";
    nuevoDivTexto.style.marginTop = "4px";
    nuevoDivTexto.style.textAlign = "justify";
    nuevoDiv.style.marginRight = "15px";
    nuevoDivFlex.style.display = 'flex';

    // Agregar la imagen al cuerpo del documento
    nuevoDivFlex.appendChild(imgElement);
    nuevoDivTexto.textContent = answer;
    nuevoDivFlex.appendChild(nuevoDivTexto);
    nuevoDiv.appendChild(nuevoDivFlex);
    nuevoDiv.className = "animacion-contenedorEXT35"; // Clase para aplicar la animación

    contenedorPadre.insertAdjacentElement('afterend', nuevoDiv);

    // Añadir la clase de animación después de un breve retraso para activarla
    setTimeout(function () {
        nuevoDiv.classList.add("aparecer");
    }, 600);
}
// Función para manejar la aparición y desaparición con animación

document.addEventListener('keydown', function (event) {
    // Verificar si la tecla presionada es "H" y si la tecla Shift también está presionada
    if (event.key === 'S' && event.shiftKey) {
        toggleVisibility();
    }
});

function toggleVisibility() {
    // Obtener todos los elementos con la clase animacion-contenedor
    var contenedores = document.querySelectorAll('.animacion-contenedorEXT35');

    // Iterar sobre los elementos y cambiar su visibilidad (agregar/eliminar clase)
    if (contenedoresOcultosExt == true) {
        contenedoresOcultosExt = false
    } else {
        contenedoresOcultosExt = true
    }
    contenedores.forEach(function (contenedor) {
        if (contenedoresOcultosExt == true) {
            contenedor.classList.add('oculto');

        } else {
            contenedor.classList.remove('oculto');

        }
    });
}

var contenedoresOcultosExt = false;


// Función para manejar el paso de respuestas de syncAnswers.js e insertar contenedores
//const divFormsExt = document.getElementsByClassName("formulation clearfix");

const chargeEnt2 = async () => {



    divFormsExt = document.getElementsByClassName("formulation clearfix");


}
var divFormsExt;
chrome.runtime.onMessage.addListener(function (answer, sender, sendResponse) {
    //console.log("mensaje recibido en responseGen");
    if (answer.tipo == "AnswerGen") {
        divFormsExt[answer.num].scrollIntoView({ behavior: 'smooth', block: 'center' });
        insertarContenedorConAnimacion(divFormsExt[answer.num], answer.data);
    }
    if (answer.cargar = "cargarCuestionario" && answer.tipo != "AnswerGen") {

        try { chargeEnt2(); } catch (err) { console.error(err) };

    }
});

