let shaderEjecucion = [];
let p, p2;
let cual = "";
let cual_cual = "";
let shaderEditable;
let oculto = false;
let passes = [];
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);
  for (let i = 0; i < 7; i++) {
    passes.push(new ShaderConGraf(null, width, height, WEBGL));
  }
  let btnOcultar = document.getElementById("ocultar");
  btnOcultar.addEventListener("click", (event) => {
    oculto = !oculto;
    let srcCode = document.getElementById("source-code");
    srcCode.style.display = oculto ? "none" : "flex";
    btnOcultar.innerHTML = oculto ? "Mosstrar codigo" : "Ocultar codigo";
  });

  let select = document.getElementById("select");
  select.addEventListener("input", (event) => {
    cual = select.value;
    setOpciones();
  });

  cual = Object.keys(shaders)[0];
  select.value = cual;

  for (let d of Object.keys(shaders)) {
    let a = document.createElement("option");
    a.value = d;
    a.innerHTML = d;
    select.appendChild(a);
  }
  setOpciones();
  crearInput();
  p = createP("this is some text");
  p.style("font-size", "16px");
  p.style("color", "red");
  p.position(width - 50, 0);
}

function debounce(func, timeout) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const ejecutarCodigo = debounce(() => {
  // gl.getExtension("WEBGL_lose_context").loseContext();
  shaderEditable.recargarShader();
}, 500);

function setOpciones(primerSet = false) {
  let opciones = document.getElementById("opciones");
  opciones.innerHTML = "";
  let cont = 0;
  for (let i = 0; i < shaders[cual].length; i++) {
    //nom of Object.keys(shaders[cual])) {
    let nom = "" + i;
    let d = document.createElement("div");
    let input = document.createElement("input");
    input.type = "radio";
    input.value = nom;
    input.name = "opcion";
    if (cont == 0) {
      input.checked = "checked";
      cual_cual = nom;
      iniciar();
    }
    input.addEventListener("input", (event) => {
      cual_cual = input.value;
      iniciar();
    });
    let label = document.createElement("label");
    label.for = nom;
    label.innerHTML = shaders[cual][nom].nombre;
    label.style.color = "white";
    d.appendChild(input);
    d.appendChild(label);
    opciones.appendChild(d);
    cont++;
  }
  // cual_cual = Object.keys(shaders[cual])[0];
}

function draw() {
  dibujar();
  p.html(nf(frameRate(), 2, 2));
}

function textoCargado(data) {
  setEditorText(data);
}

function errorCargandoTexto(e) {
  console.error(e);
}

function iniciar() {
  shaderEjecucion = [];
  for (let i = 0; i < shaders[cual][cual_cual].archivos.length; i++) {
    let a = shaders[cual][cual_cual].archivos[i];
    // shaderEjecucion.push(new ShaderConGraf(`shaders/${cual}/${cual_cual}/${a}`, width, height, WEBGL));
    shaderEjecucion.push(passes[i]);
    shaderEjecucion[i].setShader(`shaders/${a}`);
    shaderEjecucion[i].inicializar();
    if (i == shaders[cual][cual_cual].archivos.length - 1) {
      shaderEjecucion.at(-1).cargarTexto(textoCargado, errorCargandoTexto);
      shaderEditable = shaderEjecucion.at(-1);
    }
  }
}

function dibujar() {
  dibujarInput();
  for (let i = 0; i < shaderEjecucion.length; i++) {
    if (shaderEjecucion[i].shaderCargado) {
      if (i == 0) {
        shaderEjecucion[i].setSampler("in_graf", grafIn);
      } else {
        shaderEjecucion[i].setSampler("in_graf", shaderEjecucion[i - 1].out());
      }
      shaderEjecucion[i].setResolution();
      shaderEjecucion[i].setTime(); // este shader tiene una animacion asi que agregamos el tiempo
      shaderEjecucion[i].actualizar();
    }
  }
  // textureMode(NORMAL);
  // image(shaderEjecucion[shaderEjecucion.length - 1].out(), 0, 0);
  texture(shaderEjecucion[shaderEjecucion.length - 1].out());
  rect(-width / 2, -height / 2, width, height);
}
