import { Marcador } from "./marcador";

export class Mapa {
    public marcadores: Marcador[] = [];
    
    constructor() {}
    
    getMarcadores() {
        return this.marcadores;
    }
    agregarMarcador (marcador: Marcador) {
        this.marcadores.push(marcador);
    }
    moverMarcador (marcador: Marcador){
        for( const i in this.marcadores){
            if ( this.marcadores[i].id === marcador.id){
                this.marcadores[i].lat = marcador.lat;
                this.marcadores[i].lng = marcador.lng;
                break;
            }
        }
    }
    borrarMarcador (id: string){
        this.marcadores = this.marcadores.filter( mrk => mrk.id !== id );
        return this.marcadores;
    }

}