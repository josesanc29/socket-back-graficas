import Server from "./clases/server";
import { SERVER_PORT } from "./global/enviorement";
import router from "./routes/router";
import bodyParser from "body-parser";
import cors from "cors";

// Nueva instancia de server
const server = Server.instance;
//Config del bodyParser
server.app.use( bodyParser.urlencoded( { extended: true } ));
server.app.use( bodyParser.json() );
//CORS configuracion
server.app.use( cors({ origin: true , credentials: true }) );

//Rutas de servicios REST
server.app.use('/', router);

server.start(()=>{
    console.log(`Servidor run en el puerto ${SERVER_PORT}`);
});