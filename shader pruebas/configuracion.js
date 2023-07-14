let shaders = {
  basicos: {
    1: {
      nombre: "Leer textura",
      archivos: ["1_identidad.frag"],
    },
    2: {
      nombre: "Paleta: a + b*cos(TAU*(c*t+d))",
      archivos: ["paleta.frag"],
    },
    3: {
      nombre: "Blur",
      archivos: ["blur.frag"],
    },
    4: {
      nombre: "Sobel para Optical flow",
      archivos: ["sobelFlow.frag"],
    },
    5: {
      nombre: "Deteccion borde",
      archivos: ["borde.frag"],
    },
    6: {
      nombre: "Sharp",
      archivos: ["sharp.frag"],
    },
    7: {
      nombre: "Operador gausiano",
      archivos: ["gauss.frag"],
    },
    8: {
      nombre: "0.2/brillo (neon o bloom)",
      archivos: ["1_identidad.frag"],
    },
    9: {
      nombre: "Gaussin blur",
      archivos: ["gblur.frag"],
    },
  },
  voronoi_simple: {
    1: {
      nombre: "voronoi",
      archivos: ["1_identidad.frag", "voronoi_simple.frag"],
    },
    2: {
      nombre: "sqrt(voronoi)",
      archivos: ["1_identidad.frag", "voronoi_simple.frag"],
    },
    3: {
      nombre: "0.02/voronoi",
      archivos: ["1_identidad.frag", "voronoi_simple.frag"],
    },
    4: {
      nombre: "pow(voronoi,1/10)",
      archivos: ["1_identidad.frag", "voronoi_simple.frag"],
    },
    5: {
      nombre: "pow(voronoi,3.)",
      archivos: ["1_identidad.frag", "voronoi_simple.frag"],
    },
  },
  fractales: {
    1: {
      nombre: "Conjunto de julia",
      archivos: ["cJulia.frag"],
    },
  },
};
