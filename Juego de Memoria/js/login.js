$(document).ready(function(){
    cargarUsuarios();
    $('#formulario').on('submit', function(event){
        event.preventDefault();
        const user = $('#user').val();
        const password = $('#password').val();
        const mensaje = $('#mensaje-error');

        //Expresion Regular 
        const expReg = /^[a-zA-Z0-9]+$/;

        mensaje.hide(); 

        //Recuperamos los usuarios de localStorage
        const usuarios = JSON.parse(localStorage.getItem('usuarios'));
        const usuarioValido = usuarios.find(u => u.usuario === user);

        if (!usuarioValido) {
            mensaje.text('Usuario no registrado.').show();
            return;
        }

        if(!expReg.test(password)){
            mensaje.text("La contraseña debe ser alfanúmerica").show();
            return;
        }

        if(usuarioValido.contraseña === password){
            mensaje.text('');
            sessionStorage.setItem('sesionActiva', 'true');
            window.location.href = 'inicio.html';
        }else {
            mensaje.text('Contraseña incorrecta').show();
        }
    });
});

function cargarUsuarios(){
    $.getJSON('../data/usuarios.json', function(usuarios){
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        console.log(usuarios)
        
    }).fail(function() {
        console.error('Error al cargar el archivo usuarios.json');
    });
}
