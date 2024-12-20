$(document).ready(function () {
    // Leer los datos de sessionStorage
    const puntos = sessionStorage.getItem("puntos");
    const tiempoUsado = sessionStorage.getItem("tiempoUsado");


    $("#puntos-total").text(puntos || "0");
    $("#tiempo-empleado").text(tiempoUsado || "0");

     // Reiniciar Juego
     $("#reiniciar").click(function () {
      sessionStorage.clear(); 
      window.location.href = "inicio.html";
    });

    // Manejar el botón "Salir"
    $("#salir").click(function () {
      sessionStorage.clear(); 
      window.location.href = "index.html";
    });
  });