export class GraficaData {
    private meses: string [] = ['enero' , 'febrero' , 'marzo' , 'abril'];
    private valores: number[] = [0 , 0 , 0 , 0]; 

    constructor(){

    }

    getDatosGrafica(){
        return [
            { data: this.valores , label: this.meses}
        ];
    }

    aumentaValor( mes: string , valor: number){

        mes = mes.toLocaleLowerCase().trim();
        for (const i in this.meses) {
            if (this.meses[i] === mes) {
                this.valores[i] += valor;
            }
        }
        return this.getDatosGrafica();
    }
}