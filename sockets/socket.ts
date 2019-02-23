import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';
import { Marcador } from '../classes/marcador';
import { mapa } from '../routes/router';
import { TicketControl } from '../classes/ticket-control';
import { Ticket } from '../classes/ticket';


export const usuariosConectados = new UsuariosLista();

const ticketControl = new TicketControl();

// Sistema de tickets
// Siguiente ticket socket-io
export const siguienteTicket = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('siguiente', (ticket: TicketControl , callback: Function  ) => {
        let siguiente = ticket.obtenerSiguiente();
        callback(siguiente);
        io.emit ('siguiente' , {actual: ticketControl.getUltimoTicket() , ultimos4: ticketControl.getUltimos4()});
    });
    // cliente.broadcast.emit('estado-actual' , {actual : ticketControl.getUltimoTicket() , ultimos4: ticketControl.getUltimos4()});

}

// Atender ticket socket-io
export const atenderTicket = ( cliente: Socket , io: socketIO.Server ) => {
    cliente.on('atender' , ( ticket:Ticket , callback: Function) => {
        let escritorio = ticket.escritorio;
        if ( !ticket.escritorio ) {
            return 'El escritorio del ticket es obligatorio';
        }
        console.log(escritorio);
        let atenderTicket = ticketControl.atenderTicket(escritorio);
        console.log(atenderTicket);
        callback(atenderTicket);

        io.emit('atender' , {ultimos4: ticketControl.getUltimos4()});
    });
    // cliente.broadcast.emit('ultimos-cuatro' , { ultimos4 : ticketControl.getUltimos4()});
}

// Socket Escritorio
export const escritorio = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('escritorio', (  payload: { escritorio: number }  ) => {

        console.log('Escritorio recibido', payload );

        io.emit('escritorio', payload );

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
