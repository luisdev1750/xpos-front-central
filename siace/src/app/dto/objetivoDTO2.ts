export class ObjetivoDTO2 {
    objId!: number;
    objTisId?: number | null;
    objNombre?: string | null;
    objDescripcion?: string | null;
    objFormato?: string | null;
  
    constructor(data?: any) {
      if (data) {
        this.objId = data.objId !== undefined ? data.objId : null;
        this.objTisId = data.objTisId !== undefined ? data.objTisId : null;
        this.objNombre = data.objNombre !== undefined ? data.objNombre : null;
        this.objDescripcion = data.objDescripcion !== undefined ? data.objDescripcion : null;
        this.objFormato = data.objFormato !== undefined ? data.objFormato : null;
      }
    }
  
    static fromJS(data: any): ObjetivoDTO2 {
      data = typeof data === 'object' ? data : {};
      return new ObjetivoDTO2(data);
    }
  
    toJSON() {
      const data: any = {};
      data["objId"] = this.objId;
      data["objTisId"] = this.objTisId;
      data["objNombre"] = this.objNombre;
      data["objDescripcion"] = this.objDescripcion;
      data["objFormato"] = this.objFormato;
      return data;
    }
  }
  