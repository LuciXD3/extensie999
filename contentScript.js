/*global chrome*/


function obtenerNodosDeTextoRecursivos(elemento) {
    var textNodes = Array.from(elemento.childNodes)
        .flatMap(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                return [node.textContent.trim()];
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                return obtenerNodosDeTextoRecursivos(node);
            } else {
                return [];
            }
        });

    return textNodes;
}

const loadData = (key) => {

    try {
        // Load data from Chrome extension storage
        return chrome.storage.local.get(key).then((data) => data[key]);
    } catch (error) {
        console.error("Error loading from local state");
        console.error(error);
    }

};
const saveData = (key, data) => {
    try {
        // Save data to Chrome extension storage
        chrome.storage.local.set({ [key]: data });
    } catch (error) {
        console.error("Error saving to local state");
        console.error(error);
    }

};



function insertarBoton(contenedor) { //contenedor = div donde se añade el boton

    // Crear el botón
    var boton = document.createElement("button");
    boton.innerHTML = "Generate answer";
    boton.setAttribute("type", "button");
    boton.classList.add("botongenerar");
    boton.addEventListener("click", (e) => {
        generarPregunta(e);
    });

    // Insertar el botón al final del contenedor
    contenedor.appendChild(boton);
}
const generarPregunta = (e) => {
    //console.log("Generando pregunta...");
    //console.log(e.target.parentNode);
    formQuestion = e.target.parentNode;
    questions = formQuestion.getElementsByClassName("qtext");
    answers = formQuestion.getElementsByClassName("answer");
    try {
        var textNodes = obtenerNodosDeTextoRecursivos(answers[0]);
        var textoCompleto = "Pregunta :\n" + questions[0].textContent + " \nPosibles respuestas:\n" + textNodes.join(' ');
        saveData("Pregunta", textoCompleto);
    } catch (err) {
        console.log("Error Invalid QUESTION TYPE");
        console.log(err);
    }
}
function cargarContenidoEXT35() {
    var formularios;

    formularios = document.getElementsByClassName("formulation clearfix");
    var arrayFormularios = [];
    const convertirArrayTexto = () => {
        for (var i = 0; i < formularios.length; i++) {
            questions = formularios[i].getElementsByClassName("qtext");
            answers = formularios[i].getElementsByClassName("answer");
            //console.log("Preguntas en content");
            //console.log(questions);
            try {
                var textNodes = obtenerNodosDeTextoRecursivos(answers[0]);
                var textoCompleto = "Pregunta :\n" + questions[0].textContent + " \nPosibles respuestas:\n" + textNodes.join(' ');
                var objQuestion = { num: i, data2: textoCompleto }; //Guardamos el número y el texto de la pregunta
                //para luego poder asignar la respuesta teniendo en cuenta aquellas que dan error por invalid question type 
                console.log(objQuestion);
                arrayFormularios.push(objQuestion);
            } catch (err) {
                console.log("Error Invalid QUESTION TYPE");
                console.log(err);
            }

        }
    }
    convertirArrayTexto();
    chrome.storage.local.remove("questionsArray");
    saveData("questionsArray", (arrayFormularios));

    const guardarURL = () => {
        const urlGEN = window.location.toString();
        //console.log("Se muestra: "+ window.location.toString());
        saveData("urlContent", urlGEN);
        // console.log("URL guardada");
    };
    guardarURL();
}

const chargeEnt = async () => {


        
        cargarContenidoEXT35();
      
    
}

//chargeEnt();

//Mensaje.data debe contener un entorno, no el array de entornos. la búsqueda del entorno que se va a usar se hace en otro módulo
chrome.runtime.onMessage.addListener(function (mensaje, sender, sendResponse) {
    if (mensaje.cargar = "cargarCuestionario" && mensaje.tipo != "AnswerGen") {
        //console.log('Respuesta recibida en el content script:');
        try { chargeEnt(); } catch (err) { console.error(err) };

    }
});