
import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';
import { GraficaData } from '../classes/grafica';
import { Mapa } from '../classes/mapa';
import { Ticket } from '../classes/ticket';
import { ticketControl } from '../classes/ticket-control';


const router = Router();
const grafica = new GraficaData();
export const mapa = new Mapa();
export const controlTicket = new ticketControl()


const lugares = [{
    id:'1',
    nombre: 'Txurdinaga',
    lat: 43.2574332,
    lng: -2.9142822
},
{
    id: '2',
    nombre: 'Miribilla',
    lat: 43.2535788,
    lng: -2.9355099
},
{
    id: '3',
    nombre: 'Ripa',
    lat: 43.2618299,
    lng: -2.9266752
}];

 const ticketsInitial = [
     { numero : 1 , escritorio: 'mesa 1'},
     { numero : 2 , escritorio: 'mesa 1'},
     { numero : 3 , escritorio: 'mesa 2'},
     { numero : 4 , escritorio: 'mesa 3'},
     { numero : 5 , escritorio: 'mesa 4'
    }];

mapa.marcadores.push(...lugares);
controlTicket.tickets.push(...ticketsInitial);

// GET todos los tickets ultimos 4
router.get('/tickets/ultimos' , (req:Request , res: Response)=>{
    res.json( controlTicket.getUltimos4());
});
// Obtener el ultimo ticket
router.get('/tickets/ultimo-ticket' , ( req: Request , res: Response)=>{
    res.json( controlTicket.getUltimoTicket());
})

//GET tickets guardados
router.get('/tickets' , (req: Request , res: Response)=>{
    res.json( controlTicket.guardarCambios());
});

// POST de numero escritorio
router.post('/tickets/:id' , (req: Request , res: Response)=>{
    const escritorio = req.params.escritorio;
    const payload = {
        escritorio
    }
    const server = Server.instance;
    server.io.emit('escritorio' , payload);
    res.json({
        ok: true,
        escritorio
    });

});

// GET - todos los marcadores
router.get('/mapa' , (req: Request , res: Response)=>{
    res.json( mapa.getMarcadores());
});

// Graficas
router.get('/grafica', ( req: Request, res: Response  ) => {

    res.json( grafica.getDatosGrafica());

});

router.post('/grafica', ( req: Request, res: Response  ) => {

    const mes = req.body.mes;
    const valores = Number( req.body.valores );

    const server = Server.instance;

    server.io.emit( 'cambio-grafica' , grafica.getDatosGrafica() );
    grafica.aumentaValor( mes , valores);

    res.json(
        grafica.getDatosGrafica()
    );

});

router.post('/mensajes', ( req: Request, res: Response  ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;

    const payload = { cuerpo, de };

    const server = Server.instance;
    server.io.emit('mensaje-nuevo', payload );


    res.json({
        ok: true,
        cuerpo,
        de
    });

});


router.post('/mensajes/:id', ( req: Request, res: Response  ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id;

    const payload = {
        de,
        cuerpo
    }


    const server = Server.instance;

    server.io.in( id ).emit( 'mensaje-privado', payload );


    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });

});


// Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', (  req: Request, res: Response ) => {

    const server = Server.instance;

    server.io.clients( ( err: any, clientes: string[] ) => {

        if ( err ) {
            return res.json({
                ok: false,
                err
            })
        }


        res.json({
            ok: true,
            clientes
        });


    });

});

// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', (  req: Request, res: Response ) => {


    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });

    
});




export default router;


