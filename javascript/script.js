const canvas = document.getElementById("buscaminas");
const ctx = canvas.getContext("2d");
let cuadritos;
let columnas;
let filas;
let escala;
let xpos;
let ypos;
let bombas;
let nBanderas;
let minasRestantes;

let tiempo;
let temporizador = window.setInterval(relojOn, 1000);

// banderita, marcada en morado con un circulo
function marcarMina(x, y, r) {
  ctx.beginPath();
  ctx.arc(x,y,r, 0, 2 * Math.PI, true);
  ctx.fill();
  ctx.closePath();

}

function setNivel(menu) {
  var menuNivel = document.getElementById("nivel");
  var nivel = menuNivel.menuElegido;
  switch (nivel) {
    case 0:
      columnas = 9
      filas = 9
      bombas = 10
      escala = 40
      break;
    case 1:
      columnas = 16
      filas = 16
      bombas = 40
      escala = 40
      break;
    case 2:
      columnas = 30
      filas = 16
      bombas = 99
      escala = 40
      break;
    default:
      columnas = 8
      filas = 8
      escala = 40
      bombas = 7
  }
  setReloj();
  menu();
}
// config del juego mantiene etiqueta del html oculta por el momento
function configuracion() {
  nBanderas = 0;
  document.getElementById("conteoBanderas").innerHTML = bombas;
  document.getElementById("derrota").style.visibility = "hidden";
  document.getElementById("victoria").style.visibility = "hidden";

// calcula altura y ancho del canvas entero 
// escala se refiere a las coordenadas
  ctx.canvas.width = columnas * escala;
  ctx.canvas.height = filas * escala;
  cuadritos = arrayBidimensional(columnas, filas);
  for (var i = 0; i < columnas; i++) {
    for (var j = 0; j < filas; j++) {
      cuadritos[i][j] = new cuadrito(i, j);

    }
  }


  // BUCLE PARA BUSCAR LAS BOMBAS.
  var lugar = [];
  for (var i = 0; i < columnas; i++) {
    for (var j = 0; j < filas; j++) {
      lugar.push([i, j]);
    }
  }

// coloca minas en lugares random
  for (var n = 0; n < bombas; n++) {
    var index = Math.floor(Math.random() * lugar.length);
    var opcion = lugar[index];
    var i = opcion[0];
    var j = opcion[1];
    // quita la opción de elegir casilla si ya está detectada como mina.
    lugar.splice(index, 1);
    cuadritos[i][j].esBomba = true;
  }

  // detecta bomba y las cuenta
  for (var i = 0; i < columnas; i++) {
    for (var j = 0; j < filas; j++) {
      cuadritos[i][j].contadorBombas();
    }
  }

  // detecta casilla que ya es marcada
  for (var i = 0; i < columnas; i++) {
    for (var j = 0; j < filas; j++) {
      cuadritos[i][j].pintarTablero();
      if (cuadritos[i][j].casillaMarcada && !cuadritos[i][j].esClickada) {
        ctx.fillStyle = "red"
        marcarMina(cuadritos[i][j].x + cuadritos[i][j].w * 0.5, cuadritos[i][j].y + cuadritos[i][j].w * 0.5, cuadritos[i][j].w * 0.5);
      }
    }
  }
}

// comienza el contador del temporizador
function setReloj() {
  tiempo = 0;
  window.clearInterval(temporizador);
  temporizador = window.setInterval(relojOn, 1000);
}
// detiene el reloj
function relojOff() {
  window.clearInterval(temporizador);
}
// mantiene el reloj activo
function relojOn() {
  tiempo++;
  actualizarReloj();
}
// actualiza el reloj
function actualizarReloj() {
  document.getElementById("temporizador").innerHTML = tiempo;
}

// crea el array y lo recorre
function arrayBidimensional(columnas, filas) {
  var arr = new Array(columnas);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(filas);
  }
  return arr;
}

// carita keanu reeves pérdida
function neoDerrota() {
  var carita = document.getElementById("carita");
  carita.classList.add("neo2");
  document.getElementById("victoria").style.visibility = "hidden";
  document.getElementById("buscaminas").style.visibility = "visible";
  setNivel(configuracion);
}
// carita keanu reeves si se gana
function neoVictoria() {
  var carita = document.getElementById("carita");
  document.getElementById("victoria").style.visibility = "hidden";
  carita.classList.remove("neo2");
  carita.classList.remove("neo4");
  carita.classList.remove("neohappy");
  carita.classList.remove("neosad");
}
// colocar botón con la carita de neo en el juego
function caritaVictoria() {
  var carita = document.getElementById("carita");
  document.getElementById("victoria").style.visibility = "visible";
  document.getElementById("buscaminas").style.visibility = "hidden";
  carita.classList.add("neohappy");
}
// colocar carita en el botón si se pierde
function caritaDerrota() {
  var carita = document.getElementById("carita");
  carita.classList.add("neosad");
}

// detectar dónde está el ratón en la pagina web
function getPosicionRaton(canvas, evnt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evnt.clientX - rect.left,
    y: evnt.clientY - rect.top
  };
}

// dibuja banderita morada en el canvas
window.addEventListener("mouseup", dibujaBanderita);
function dibujaBanderita(e) {
  var raton = getPosicionRaton(canvas, e);
  for (var i = 0; i < columnas; i++) {
    for (var j = 0; j < filas; j++) {
      cuadritos[i][j].pintarTablero();
      if (cuadritos[i][j].casillaMarcada && !cuadritos[i][j].esClickada) {
        ctx.fillStyle = "purple";
        marcarMina(cuadritos[i][j].x + cuadritos[i][j].w * 0.5, cuadritos[i][j].y + cuadritos[i][j].w * 0.5, cuadritos[i][j].w * 0.5);
      }
    }
  }
}

// esta funcion sirve cuando se quita una bandera ya
// colocada, se muestra un segundo del click en blanco, y sino
// actúa el clic como tal y pues abre la casilla normal
window.addEventListener("mousedown", clickDerechoYNormal);
function clickDerechoYNormal(e) {
  var raton = getPosicionRaton(canvas, e);

  for (var i = 0; i < columnas; i++) {
    for (var j = 0; j < filas; j++) {
      //desmarcar banderita
      if (e.button === 2 && cuadritos[i][j].dentro(raton)) {
        if (cuadritos[i][j].casillaMarcada) {
          cuadritos[i][j].casillaMarcada = false;
          nBanderas--;
          ctx.fillStyle = "white";
          ctx.fillRect(cuadritos[i][j].x, cuadritos[i][j].y, cuadritos[i][j].w, cuadritos[i][j].w);
          break;
        }
        nBanderas++;
        // hace que en el html aparezca en el span los datos que se van actualizando segun se juega si se marca banderita que esté
        // donde una mina, ya que entonces sería si hay 10 minas y se coloca una bandera encima, queda una mina menos por descubrir,
        // así que el conteo de minas se actualiza y las minas decrementan
        if (cuadritos[i][j].esBomba) {
          minasRestantes = (bombas - nBanderas);
          document.getElementById("conteoBanderas").innerHTML = minasRestantes;
        }

        cuadritos[i][j].casillaMarcada = true;
      }
      //hace que si el raton hace clic normal
      // detecte que tiene que abrir el cuadrito
      // no poner bandera, descubrirlo solo
      else if (e.button === 0) {
        if (cuadritos[i][j].dentro(raton)) {
          if (cuadritos[i][j].casillaMarcada) {
            break;
          }
          cuadritos[i][j].descubrirCasilla();
          if (cuadritos[i][j].esBomba) {
            esDerrota();
            break;
          }
          esVictoria();
        }
      }
    }
  }
}

// si el juego es derrota, hace visible la foto de neo sad
// y para el temporizador
function esDerrota() {
  for (var i = 0; i < columnas; i++) {
    for (var j = 0; j < filas; j++) {
      cuadritos[i][j].esClickada = true;
    }
  }
  relojOff();
  document.getElementById("derrota").style.visibility = "visible";
  caritaDerrota();
}
// si es victoria nuestra la foto de neo ganador y detiene el reloj
function esVictoria() {
  contadorVictorias = 0;
  for (var i = 0; i < columnas; i++) {
    for (var j = 0; j < filas; j++) {
      if (cuadritos[i][j].esClickada && !cuadritos[i][j].esBomba) {
        contadorVictorias++;
        if (contadorVictorias === ((columnas * filas) - bombas)) {
          relojOff();
          caritaVictoria();
        }
      }
    }
  }
}

// clase casilla, inicializacion de variables
class cuadrito {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.w = 40;
    this.h = 40;
    this.x = i * this.w;
    this.y = j * this.w;
    this.nBombasAdyacentes = 0;
    this.casillaMarcada = false;
    this.esBomba = false;
    this.esClickada = false;

    // canvas para el tablero dentro de funcion
    this.pintarTablero = function () {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.w, this.h);
      ctx.fillStyle = "#4bc924";
      ctx.fill();
      ctx.lineWidth = "1.2";
      ctx.strokeStyle = "black";
      ctx.stroke();

      // si detecta bomba, pinta roja
      if (this.esClickada) {
        if (this.esBomba) {
          ctx.fillStyle = "red";
          marcarMina(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w * 0.5);
        } else {
          // mina descubierta vacía y el fondo debajo
          ctx.beginPath();
          ctx.fillStyle = "#83d4bc";
          ctx.fillRect(this.x, this.y, this.w, this.w);
          // si las minas son más de 0, empieza a colocar los numeritos de minas vecinas
          if (this.nBombasAdyacentes > 0) {
            ctx.textAlign = "center";
            ctx.font = "25px Tahoma";
            // del 1 al 4
            switch (this.nBombasAdyacentes) {
              case 1:
                ctx.fillStyle = "#004c78";
                ctx.fillText(this.nBombasAdyacentes, this.x + this.w * 0.5, this.y + this.w - 6);
                break;
              case 2:
                ctx.fillStyle = "#4a0078";
                ctx.fillText(this.nBombasAdyacentes, this.x + this.w * 0.5, this.y + this.w - 6);
                break;
              case 3:
                ctx.fillStyle = "#c98a3c";
                ctx.fillText(this.nBombasAdyacentes, this.x + this.w * 0.5, this.y + this.w - 6);
                break;
              case 4:
                ctx.fillStyle = "#f2384e";
                ctx.fillText(this.nBombasAdyacentes, this.x + this.w * 0.5, this.y + this.w - 6);
                break;
              

            }
          }
        }
      }
    };
    // detección estado del raton con posiciones en el canvas
    this.dentro = function (raton) {  
      if (raton.x > this.x && raton.x < this.x + this.w && raton.y > this.y && raton.y < this.y + this.h) {
        return true;
      } else {
        return false;
      }
    };
    // descubre casillas normales que no tengan nada adyacente, ni mina ni nada, deja posibilidad de que haya 
    // 0 minas adyacentes así que no pinta nada, solo se descubre y ya
    this.descubrirCasilla = function () {
      this.esClickada = true;
      if (this.nBombasAdyacentes == 0) {
        this.reaccionaCasillas();
      }
    };
    // hace que funcione lo de arriba, reaccionan las casillas con los numeritos
    // según si son clickadas y lo que haya dentro, para poner si es adyacente a alguna
    // o si no
    this.reaccionaCasillas = function () {
      for (var x1 = -1; x1 <= 1; x1++) {
        var i = this.i + x1;
        if (i < 0 || i >= columnas)
          continue;

        for (var y1 = -1; y1 <= 1; y1++) {
          var j = this.j + y1;
          if (j < 0 || j >= filas)
            continue;

          var casillaAdyacente = cuadritos[i][j];
          if (!casillaAdyacente.esClickada) {
            casillaAdyacente.descubrirCasilla();
          }
        }
      }
    };
    // recuenta las bombas así puede hacer el conteo bien de las minas adyacentes,
    // y si detecta una, suma uno al contador revisando las casillas de alrededor en cuanto a posicion
    // usando variables (x1,y1) como una versión de x y la y pero doble
    this.contadorBombas = function () {
      if (this.esBomba) {
        this.nBombasAdyacentes = -1;
        return;
      }
      var total = 0;
      for (var x1 = -1; x1 <= 1; x1++) {
        var i = this.i + x1;
        if (i < 0 || i >= columnas)
          continue;

        for (var y1 = -1; y1 <= 1; y1++) {
          var j = this.j + y1;
          if (j < 0 || j >= filas)
            continue;

          var casillaAdyacente = cuadritos[i][j];
          if (casillaAdyacente.esBomba) {
            total++;
          }
        }
      }
      this.nBombasAdyacentes = total;
    };
  }
}
// listener que hace que cuando le clicke a una casilla con click derecho no salga el cuadrito de
// guardar como, nada más se ejecute
canvas.addEventListener("contextmenu", function (event) {
  event.preventDefault();
})
