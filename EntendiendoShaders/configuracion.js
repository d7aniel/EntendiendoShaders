let shaders = {
  basicos: [
    {
      nombre: "Leer textura",
      archivos: ["1_identidad.frag"],
    },
    {
      nombre: "Paleta: a + b*cos(TAU*(c*t+d))",
      archivos: ["paleta.frag"],
    },
    {
      nombre: "Blur",
      archivos: ["blur.frag"],
    },
    {
      nombre: "Sobel para Optical flow",
      archivos: ["sobelFlow.frag"],
    },
    {
      nombre: "Deteccion borde",
      archivos: ["borde.frag"],
    },
    {
      nombre: "Sharp",
      archivos: ["sharp.frag"],
    },
    {
      nombre: "Operador gausiano",
      archivos: ["gauss.frag"],
    },
    {
      nombre: "0.2/brillo (neon o bloom)",
      archivos: ["neon_identidad.frag"],
    },
    {
      nombre: "Gaussin blur",
      archivos: ["gblur.frag"],
    },
  ],
  voronoi_simple: [
    {
      nombre: "voronoi",
      archivos: ["1_identidad.frag", "voronoi/voronoi_simple.frag"],
    },
    {
      nombre: "sqrt(voronoi)",
      archivos: ["1_identidad.frag", "voronoi/voronoi_sqrt.frag"],
    },
    {
      nombre: "0.02/voronoi",
      archivos: ["1_identidad.frag", "voronoi/1_div_voronoi.frag"],
    },
    {
      nombre: "pow(voronoi,1/10)",
      archivos: ["1_identidad.frag", "voronoi/pow_of_voronoi.frag"],
    },
  ],
  fractales: [
    {
      nombre: "Conjunto de julia",
      archivos: ["cJulia.frag"],
    },
  ],
};
