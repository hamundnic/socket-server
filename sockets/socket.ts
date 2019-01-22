import { Socket } from 'socket.io';
import Server from '../classes/server';
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuario-lista';
import { Usuario } from '../classes/usuario';


export const usuariosConectados= new UsuarioLista();

export const conectarCliente=(cliente:Socket,io:SocketIO.Server)=>{
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
    
}

export const desconectar = (cliente: Socket,io:SocketIO.Server) => {
cliente.on('disconnect' ,()=>{
console.log('Cliente desconectado');
usuariosConectados.borrarUsuarios(cliente.id); 
io.emit('usuarios-activos',usuariosConectados.getLista());   
});
}



// Escuchar mensaje 
export const mensaje =(cliente:Socket,io:SocketIO.Server)=>{

    cliente.on('mensaje',(payload:{de:string,cuerpo:string})=>{
        console.log('Mensaje recibido',payload);
       io.emit('mensaje-nuevo',payload);
    });

}

//configurar usuario
export const configurarUsuario =(cliente:Socket,io:SocketIO.Server)=>{

    cliente.on('configurar-usuario',(payload:{nombre:string},callback:Function)=>{
       // console.log('Configurando Usuario',payload.nombre);

       usuariosConectados.actualizarNombre(cliente.id,payload.nombre);
       io.emit('usuarios-activos',usuariosConectados.getLista());
        callback({
            ok:true,
            mensaje:`Usuario ${payload.nombre}, cofigurado`
        })

      // io.emit('mensaje-nuevo',payload);

    });

}
export const obtenerUsuarios =(cliente:Socket,io:SocketIO.Server)=>{

    cliente.on('obtener-usuarios',()=>{
       // console.log('Configurando Usuario',payload.nombre);

       io.to(cliente.id).emit('usuarios-activos',usuariosConectados.getLista());
       
    });

}