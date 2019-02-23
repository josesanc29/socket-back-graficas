export class Ticket {
    
    numero: number;
    escritorio: string;
    ultimo: number;
    hoy: number;

    constructor( numero: number , escritorio: string , ultimo: number, hoy: number){
        this.numero = numero;
        this.escritorio = escritorio;
        this.ultimo = ultimo;
        this.hoy = hoy;
    }

}