$(document).ready(function(){
    $('.btn-inicio').on('click', function(){
        const nivel = $(this).data('nivel');
        sessionStorage.setItem('nivelSeleccionado', nivel);
        window.location.href = 'juego.html';
    })
});

