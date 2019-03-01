import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';
import { Marcador } from '../classes/marcador';
import { mapa } from '../routes/router';
import { Ticket } from '../classes/ticket';
import { ticketControl } from '../classes/ticket-control';


export const usuariosConectados = new UsuariosLista();


// Sistema de tickets
// Socket  Emito el numero de Escritorio via sockets
export const escritorio = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('escritorio', (  payload: { escritorio: number }  ) => {
        io.emit('escritorio', payload );

    });

}
// Nuevo Ticket con sockets
export const nuevoTicket = ( cliente: Socket , io: socketIO.Server) => {
    // console.log('nuevo ticket' , cliente);
    cliente.on('nuevo-ticket' , (ticket: ticketControl)=>{
        console.log('cliente on en nuevo ticket ', ticket);
        io.emit('nuevo-ticket' , ticket);
    });
}
//Atender ticket con sockets
export const atiendeTicket = (cliente: Socket , io: socketIO.Server) => {
    // console.log('atiendo ticket' , cliente);
    cliente.on('atiendo-ticket' , (ticket: ticketControl)=>{
        console.log('cliente on en atiendo ticket ', ticket);
        io.emit('atiendo-ticket' , ticket);
    });
    

}
//Emitir el ultimo ticket para atenderlo via socket
export const ultimoTicket = (cliente: Socket , io: socketIO.Server) => {
    // console.log('nuevo ticket' , cliente);
    cliente.on('ultimo' , (ticket: ticketControl )=>{
        console.log('cliente on en ultimo ticket ', ticket);
        // ticket.getUltimoTicket();
        io.emit('ultimo' , ticket);
    });
    
}

// Mapas añadir marcador nuevo
export const marcadorNuevo = ( cliente: Socket) => {
   cliente.on('marcador-nuevo' , (marcador: Marcador) => {
        console.log(marcador);
        mapa.agregarMarcador(marcador);
        // io.emit('marcador-nuevo' , marcador);
        // Emitir a todos excepto al usuario que ha añadido el nuevo marcador en el mapa
        cliente.broadcast.emit('marcador-nuevo', marcador);
   });

}

// Mapas borrar marcador 
export const borrarMarcador = ( cliente: Socket) => {
    cliente.on('marcador-borrar' , (id: string) => {
         console.log(id);
         mapa.borrarMarcador(id);
         // Emitir a todos excepto al usuario que ha añadido el nuevo marcador en el mapa
         cliente.broadcast.emit('marcador-borrar', id);
    });
 
 }

 // Mapas mover marcador
 export const marcadorMover = ( cliente: Socket ) => {

    cliente.on( 'marcador-mover', ( marcador ) => {
        mapa.moverMarcador( marcador );
        cliente.broadcast.emit( 'marcador-mover', marcador );
    });
}

// Cliente sockets conectado
export const conectarCliente = ( cliente: Socket, io: socketIO.Server ) => {

    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );

}

// Cliente sockets desconectado
export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');

        usuariosConectados.borrarUsuario( cliente.id );

        io.emit('usuarios-activos', usuariosConectados.getLista()  );

    });

}


// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('mensaje', (  payload: { de: string, cuerpo: string }  ) => {

        console.log('Mensaje recibido', payload );

        io.emit('mensaje-nuevo', payload );

    });

}

// Configurar usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario', (  payload: { nombre: string }, callback: Function  ) => {

        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );

        io.emit('usuarios-activos', usuariosConectados.getLista()  );

        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        });
    });

}


// Obtener Usuarios
export const obtenerUsuarios = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('obtener-usuarios', () => {

        io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista()  );
        
    });

}
