class ShaderConGraf {
  constructor(archivo, w, h, render) {
    this.graf = createGraphics(w, h, render);
    this.archivo = archivo;
    this.shaderCargado = false;
    this.fragShad = null;
    this.vertShad = null;
  }

  recargarShader() {
    this.shaderCargado = false;
    this.fragShad = editor.value;
    this.crearShader();
  }

  crearShader() {
    this.shader = this.graf.createShader(this.vertShad, this.fragShad);
    this.graf.shader(this.shader);
    this.shaderCargado = true;
    document.getElementById("line-numbers").style.background = "black";
  }

  setShader(archivo) {
    this.archivo = archivo;
  }

  inicializar() {
    this.shaderCargado = false;
    this.fragShad = null;
    this.vertShad = null;
    loadStrings(
      this.archivo,
      (data) => {
        this.fragShad = data.join("\n");
        if (this.vertShad) {
          this.crearShader();
        }
      },
      (e) => {
        console.error(e);
      }
    );
    loadStrings(
      "shader.vert",
      (data) => {
        this.vertShad = data.join("\n");
        if (this.fragShad) {
          this.crearShader();
        }
      },
      (e) => {
        console.error(e);
      }
    );
  }

  actualizar() {
    if (this.shaderCargado) {
      try {
        this.graf.quad(-1, -1, 1, -1, 1, 1, -1, 1);
      } catch (e) {
        document.getElementById("line-numbers").style.background = "red";
        console.error(e);
        console.log("Error inesperado");
        this.shaderCargado = false;
      }
    } else {
      console.log("b");
      this.graf.background(0);
      this.graf.fill(255);
      this.graf.text("cargando...", 0, 0);
    }
  }

  cargarTexto(func, err) {
    loadStrings(
      this.archivo,
      (data) => {
        func(data.join("\n"));
      },
      err
    );
  }

  out() {
    return this.graf;
  }

  setResolution() {
    this.setV2("u_resolution", float(this.graf.width), float(this.graf.height));
  }

  setTime() {
    this.setF("u_time", millis() / 1000.0);
  }

  setMouse() {
    this.setV2("u_mouse", float(mouseX) / width, float(mouseY) / height);
  }

  setV2(nombre, x, y) {
    this.shader.setUniform(nombre, [x, y]);
  }

  setF(nombre, f) {
    this.shader.setUniform(nombre, f);
  }

  setSampler(nombre, img) {
    this.shader.setUniform(nombre, img);
  }
}
