let grafIn;
let fondo;
let degrade;

function crearInput() {
  grafIn = createGraphics(width, height, WEBGL);
  fondo = createImage(width, height);
  degrade = createImage(200, 200);
  fondo.loadPixels();
  for (let i = 0; i < fondo.width; i++) {
    for (let j = 0; j < fondo.height; j++) {
      let c = map(i, 0, fondo.width, 0, 255);
      fondo.set(i, j, [c, c, c, 255]);
    }
  }
  fondo.updatePixels();
  degrade.loadPixels();
  for (let i = 0; i < degrade.width; i++) {
    for (let j = 0; j < degrade.height; j++) {
      let d = dist(i, j, degrade.width / 2, degrade.height / 2);
      if (d < degrade.height / 2) {
        let c = max(map(d, 0, degrade.height / 2, 0, 255), 0);
        degrade.set(i, j, [c, c, c, 255]);
      } else {
        degrade.set(i, j, [0, 0, 0, 0]);
      }
    }
  }
  degrade.updatePixels();
}

function dibujarInput() {
  grafIn.image(fondo, -grafIn.width / 2, -grafIn.height / 2);
  grafIn.noStroke();
  for (let i = 0; i < 10; i++) {
    grafIn.fill(noise(i * 150, 0) * 255);
    let x = -grafIn.width / 2 + noise(i * 70 + millis() * 0.0001, 0) * width * 1;
    let y = -grafIn.height / 2 + noise(0, i * 40 + millis() * 0.0001) * height * 1;
    if (noise(i * 458) < 0.4) {
      grafIn.image(degrade, x, y);
    } else {
      grafIn.ellipse(x, y, noise(i * 70) * 100 + 110, noise(i * 70) * 100 + 110);
    }
  }
}
