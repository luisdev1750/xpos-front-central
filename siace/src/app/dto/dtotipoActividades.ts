import { TiposActividade } from "./dtoBusiness";

export interface selfJoinResponse{
  parentId: number;
  parentDescription: null | string;
  id: number;
  description: string;
}

 class  Padre{
   hijos:TiposActividade[]=[];
    padreTitle: string='';
    padreId?: number;
}

export class TipoActivadesEstructurado{
  
  public padres: { [key: number]: Padre } = {};
  
  
  constructor(response:selfJoinResponse[]){
    for (const iterator of response) {
      if(iterator.parentId == 0){
        this.agregarPadre(iterator);
      }
      else{
        this.agregarHijo(iterator);
      }
    }
  }

  public agregarPadre(response:selfJoinResponse):void{
    let padre = new Padre();
    padre.padreTitle = response.description;
    padre.padreId = response.id;
    this.padres[response.id] = padre;
  }

  public agregarHijo(response:selfJoinResponse):void{
    const newHijo = new TiposActividade();
    newHijo.actId = response.id;
    newHijo.actDescription = response.description;
    this.padres[response.parentId].hijos.push(newHijo);
  }

  get padresArray():Padre[]{
    return Object.values(this.padres);
  }
}