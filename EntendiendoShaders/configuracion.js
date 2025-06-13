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
  voronoi: [
    {
      nombre: "voronoi",
      archivos: ["voronoi/voronoi_simple.frag"],
    },
    {
      nombre: "voronoi bloom)",
      archivos: ["voronoi/voronoi_bloom.frag"],
    },
    {
      nombre: "voronoi borde econ.",
      archivos: ["voronoi/voronoi_borde_light.frag"],
    },
    {
      nombre: "voronoi borde mejorado",
      archivos: ["voronoi/voronoi_borde_proj.frag"],
    },
    {
      nombre: "voronoi borde pro",
      archivos: ["voronoi/voronoi_borde_proj_pro.frag"],
    },
    {
      nombre: "voronoi ID",
      archivos: ["voronoi/voronoi_id.frag"],
    },
    {
      nombre: "voronoi filtro",
      archivos: ["1_identidad.frag", "voronoi/voronoi_filtro.frag"],
    },
  ],
  fractales: [
    {
      nombre: "Conjunto de julia",
      archivos: ["cJulia.frag"],
    },
  ],
  noise: [
    {
      nombre: "Noise de valor",
      archivos: ["noise_value.frag"],
    },
  ],
};
