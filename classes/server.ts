
import express from 'express';
import { SERVER_PORT } from '../global/enviorement';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/socket';



export default class Server {

    private static _intance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;


    private constructor() {

        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.escucharSockets();
    }

    public static get instance() {
        return this._intance || ( this._intance = new this() );
    }


    private escucharSockets() {

        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {

            //Tickets escuchar/emit numero de escritorio
            socket.escritorio(cliente , this.io);
            
            // Atender ticket
            socket.atiendeTicket(cliente , this.io);
            
            //Nuevo ticket
            socket.nuevoTicket(cliente , this.io);
            
            //Obten el ultimo ticket de la cola
            socket.ultimoTicket(cliente , this.io);

            // Mapas añadir marcador
            socket.marcadorNuevo(cliente);
            
            // Mapas borrar marcador
            socket.borrarMarcador(cliente);
            
            // Mapas mover marcador
            socket.marcadorMover(cliente);
            
            // Conectar cliente
            socket.conectarCliente( cliente, this.io );

            // Configurar usuario
            socket.configurarUsuario( cliente, this.io );

            // Obtener usuarios activos
            socket.obtenerUsuarios( cliente, this.io );

            // Mensajes
            socket.mensaje( cliente, this.io );

            // Desconectar
            socket.desconectar( cliente, this.io );    
            

        });

    }


    start( callback: Function ) {

        this.httpServer.listen( this.port, callback );

    }

}