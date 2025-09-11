import {
  Emprendedore,
  Sesione,
} from './dtoBusiness';


class TableContent extends Sesione {
  public emprendedorName: string;

  constructor(session:Sesione, emprededoreName:string){
    super(session);
    this.emprendedorName=emprededoreName
  }
}

export { TableContent };