import { Ticket } from "./ticket";

export class ticketControl {

    tickets: Ticket[] = [];
    hoy: number = new Date().getDay();

    constructor(){}

    
    getMarcadores() {
        return this.tickets;
    }
    
    getUltimoTicket() {
        let ultimo = this.tickets[0];
        // this.tickets.shift();
        console.log(ultimo);

        return ultimo;    
    }

    getUltimos4() {
        return this.tickets.slice(0, 4);
    }

    añadirNuevo( ticket: Ticket ){
        // const ultimo += 1;
        let nuevoticket = new Ticket (ticket.numero , ticket.escritorio);
        this.tickets.push(nuevoticket);
        console.log('lista de tickets al añadir uno nuevo....' , this.tickets);
        console.log('nuevo ticket....' , nuevoticket);
        //LLamar funcion para guardar cambios
        this.guardarCambios();
        return nuevoticket;
    }

    atenderTicket(){
        
        if (this.tickets.length === 0) {
            return `No hay tickets ===> ${this.tickets}`;
        }
        
        let ultimoTicket = this.getUltimoTicket();
        
        if(this.tickets.length > 4){
            this.tickets.splice( -1 , 1);
            console.log('Ultimos 4 Tickets  ' , this.tickets);
        }
        //LLamar funcion para guardar cambios
        this.guardarCambios();
        return ultimoTicket;
    }

    reiniciarConteoTickets(){

        this.tickets = [];
        //LLamar funcion para guardar cambios
        this.guardarCambios();

    }

    guardarCambios(){

        let cambioActual = {
            // ultimo: this.ultimo,
            tickets: this.tickets
        }
        // const cambioActual = window.localStorage.setItem('tickets-guardados' , JSON.stringify(objCambios));
        console.log(cambioActual);
        return cambioActual;
    }
}