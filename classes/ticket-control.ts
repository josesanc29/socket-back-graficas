import { Ticket } from "./ticket";


export class TicketControl {

    tickets: Ticket[] = [];
    escritorios: number[] = [];
    ultimos4: Ticket[] = [];
    ultimo: number;
    hoy: number;
    datos: any = { 
                     "ultimo":11,
                     "hoy":23,
                     "tickets":[
                         {"numero":5,"escritorio":"1"},
                         {"numero":6,"escritorio":"1"},
                         {"numero":7,"escritorio":"1"},
                         {"numero":8,"escritorio":"1"},
                         {"numero":9,"escritorio":"2"},
                         {"numero":10,"escritorio":"3"},
                         {"numero":11,"escritorio":"3"}],
                         "ultimos4":[
                             {"numero":4,"escritorio":"2"},
                             {"numero":3,"escritorio":"2"},
                             {"numero":2,"escritorio":"2"},
                             {"numero":1,"escritorio":"3"}
                    ]}
        
    constructor(){ 

        // if( this.datos.hoy ) {

            this.tickets = this.datos.tickets;
            this.ultimos4 = this.datos.ultimos4;
            this.ultimo = this.datos.ultimo;
            this.hoy = this.datos.hoy
        // } else {
        //     //Llamar a funcion que reinicie todo el conteo de tickets
        //     this.reiniciarConteoTickets();
        // }
    }

    getUltimoTicket() {
        return `Ticket ${ this.ultimo }`;
    }

    getUltimos4() {
        return this.ultimos4;
    }
    
    obtenerSiguiente(){
        this.ultimo += 1;
        let ticket = new Ticket ( this.ultimo , 'ticket-siguiente' , this.ultimo , this.hoy );
        this.tickets.push(ticket);
        console.log('obtengo siguiente en array tickets' , this.tickets);
        console.log('siguiente' , ticket);
        //LLamar funcion para guardar cambios
        this.guardarCambios();
        return ticket;
    }

    atenderTicket( escritorio: string){
        if (this.tickets.length === 0) {
            return `No hay tickets ===> ${this.tickets}`;
        }
        
        let numeroTicket = this.tickets[0].numero;
        this.tickets.shift();

        let atenderTicket = new Ticket (numeroTicket , escritorio , this.ultimo , this.hoy);
        this.ultimos4.unshift(atenderTicket);
        
        if (this.ultimos4.length > 4){
            this.ultimos4.splice( -1 , 1);
            console.log('Ultimos 4 Tickets  ' , this.ultimos4);
        }
        //LLamar funcion para guardar cambios
        this.guardarCambios();
        return atenderTicket;
    }
    reiniciarConteoTickets(){
        this.tickets = [];
        this.ultimos4 = [];
        this.ultimo = 0;

        //LLamar funcion para guardar cambios
        this.guardarCambios();

    }

    guardarCambios(){
        let cambioActual = {
            ultimo: this.ultimo,
            tickets: this.tickets,
            ultimos: this.ultimos4
        }
        // const cambioActual = window.localStorage.setItem('tickets-guardados' , JSON.stringify(objCambios));
        console.log(cambioActual);
        return cambioActual;
    }
}