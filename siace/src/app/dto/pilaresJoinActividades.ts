export interface IPilaresNested {
    id: number|undefined;
    Descripcion: string;
    hijos?: IPilaresNested[];
  }
  
  export class PilaresNested implements IPilaresNested {
    id: number | undefined;
    Descripcion: string;
    hijos: PilaresNested[];
  
    constructor(id: number | undefined = undefined,
      Descripcion: string = '',
      hijos: PilaresNested[] = []) {

      this.id = id;
      this.Descripcion = Descripcion;
      this.hijos = hijos;
    }

    isFather(): boolean {
      return this.hijos.length > 1;
    }
  }
  
  export interface PilaresJoinSesionesActividades {
    parentId: number;
    parentDescription: string | null;
    childId: number;
    childDescription: string;
    pilDescription: string;
    pilId: number;
  }