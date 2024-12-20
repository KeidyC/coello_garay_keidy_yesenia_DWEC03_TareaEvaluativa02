$(document).ready(function () {
  let secuencia = [];
  let usuarioSecuencia = [];
  let puntos = 0;
  let temporizador;
  let tiempoRestante = 0;
  let rondasJugadas = 0;
  const totalRondas = 3;
  const reduccionTiempo = 10;
  let dimensiones = 0;

  //Sesion activa
  let tiempoSesion = 100;
  let temporizadorSesion = setInterval(() => {
    tiempoSesion--;
    $("#temporizador-sesion").text(tiempoSesion);
    if (tiempoSesion <= 0) {
      clearInterval(temporizadorSesion);
      alert("La sesión ha expirado. Serás redirigido al login.");
      window.location.href = "index.html"; // Página de login o inicio
    }
  }, 1000);

  const nivel = sessionStorage.getItem("nivelSeleccionado");
  if (!nivel) {
    alert("Por favor, selecciona un nivel en la página de inicio.");
    window.location.href = "inicio.html";
    return;
  }

  actualizarNivelTexto(nivel);
  $(`.btn-juego[data-nivel="${nivel}"]`).addClass("seleccionado");
  iniciarJuego(nivel);

  // Funciones para los niveles
  $(".btn-juego").click(function () {
    $(".btn-juego").removeClass("seleccionado");
    $(this).addClass("seleccionado");
    const nuevoNivel = $(this).data("nivel");
    sessionStorage.setItem("nivelSeleccionado", nuevoNivel);

    if (temporizador) {
      clearInterval(temporizador);
    }

    rondasJugadas = 0; // Reiniciar las rondas al cambiar de nivel
    puntos = 0; // Reiniciar los puntos

    // Actualizar visualmente
    $("#puntos").text("0");

    actualizarNivelTexto(nuevoNivel);
    iniciarJuego(nuevoNivel);
  });

  // Funcion actualizar el texto
  function actualizarNivelTexto(nivel) {
    let textoNivel = "";
    switch (nivel) {
      case "facil":
        textoNivel = "Principiante";
        break;
      case "medio":
        textoNivel = "Intermedio";
        break;
      case "dificil":
        textoNivel = "Avanzado";
        break;
      default:
        textoNivel = "Nivel Desconocido";
    }
    $("#nivel-actual").text(textoNivel);
  }

  //   Funcion de Iniciar Juego
  function iniciarJuego(nivel) {
    let secuenciaLongitud = 0;

    switch (nivel) {
      case "facil":
        dimensiones = 4;
        secuenciaLongitud = 3;
        tiempoRestante = 90;
        break;
      case "medio":
        dimensiones = 6;
        secuenciaLongitud = 4;
        tiempoRestante = 60;
        break;
      case "dificil":
        dimensiones = 8;
        secuenciaLongitud = 6;
        tiempoRestante = 40;
        break;
      default:
        console.error("Nivel desconocido:", nivel);
        return;
    }

    rondasJugadas = 0; 
    puntos = 0; 
    $("#puntos").text(puntos); 
    prepararRonda(secuenciaLongitud);
  }

  // Funcion para preparar la ronda
  function prepararRonda(secuenciaLongitud) {
    if (rondasJugadas >= totalRondas) {
      finalizarJuego(true);
      return;
    }

    if (rondasJugadas > 0) {
      tiempoRestante -= reduccionTiempo;
      if (tiempoRestante <= 0) {
        finalizarJuego(false);
        return;
      }
    }
    rondasJugadas++;
    actualizarTiempo(tiempoRestante);
    generarTablero(dimensiones);

    secuencia = generarSecuenciaAleatoria(
      dimensiones * dimensiones,
      secuenciaLongitud
    );
    mostrarSecuencia();
    iniciarTemporizador();
  }

  // Funcion para actualizar el tiempo
  function actualizarTiempo(tiempo) {
    let minutos = Math.floor(tiempo / 60);
    let segundos = tiempo % 60;
    if (segundos < 10) segundos = "0" + segundos;
    $("#tiempo").text(minutos + ":" + segundos);
  }

  // Funcion genera tablero
  function generarTablero(dimensiones) {
    $(".tablero")
      .empty()
      .css("grid-template-columns", `repeat(${dimensiones}, 1fr)`);
    for (let i = 0; i < dimensiones * dimensiones; i++) {
      $(".tablero").append(`<div class="casilla" data-index="${i}"></div>`);
    }

    $(".casilla").click(function () {
      const index = parseInt($(this).attr("data-index"));
      verificarCasilla(index);
    });
  }

  // Funcion generar secuencia aleatoria
  function generarSecuenciaAleatoria(max, longitud) {
    let secuencia = [];
    for (let i = 0; i < longitud; i++) {
      secuencia.push(Math.floor(Math.random() * max));
    }
    return secuencia;
  }

  // Mostar Secuencia
  function mostrarSecuencia() {
    let i = 0;
    const intervalo = setInterval(() => {
      if (i < secuencia.length) {
        const casilla = $(`.casilla[data-index="${secuencia[i]}"]`);
        casilla.addClass("resaltada");
        setTimeout(() => casilla.removeClass("resaltada"), 500);
        i++;
      } else {
        clearInterval(intervalo);
        usuarioSecuencia = [];
      }
    }, 1000);
  }

  // Iniciar el temporizador
  function iniciarTemporizador() {
    temporizador = setInterval(() => {
      tiempoRestante--;
      actualizarTiempo(tiempoRestante);
      if (tiempoRestante <= 0) {
        clearInterval(temporizador);
        alert("Tiempo agotado");
        finalizarJuego(false);
      }
    }, 1000);
  }

  // Verificar casilla
  function verificarCasilla(index) {
    if (index === secuencia[usuarioSecuencia.length]) {
      usuarioSecuencia.push(index);
      puntos++;
      $("#puntos").text(puntos);

      if (usuarioSecuencia.length === secuencia.length) {
        clearInterval(temporizador);
        prepararRonda(secuencia.length); 
      }
    } else {
      const casillaIncorrecta = $(`.casilla[data-index="${index}"]`);
      casillaIncorrecta.addClass("incorrecta");

      $("#mensaje-juego").text("¡Fallaste!").fadeIn();
      setTimeout(() => {
        casillaIncorrecta.removeClass("incorrecta");
        $("#mensaje-juego").fadeOut();

        setTimeout(() => {
          finalizarJuego(false);
        }, 800); 
      }, 600); 
    }
  }

  // Finalizar el juego
  function finalizarJuego(ganaste) {
    clearInterval(temporizador);

    const tiempoInicial = nivel === "facil" ? 90 : nivel === "medio" ? 60 : 40;
    const tiempoUsado = tiempoInicial - tiempoRestante;

    sessionStorage.setItem("puntos", puntos);
    sessionStorage.setItem("tiempoUsado", tiempoUsado);

    if (ganaste) {
      window.location.href = "ganaste.html";
    } else {
      window.location.href = "perdiste.html";
    }
  }
  
});
