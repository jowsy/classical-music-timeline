   export interface Status {
        version: string;
        success: string;
        source: string;
        rows: number;
        processingtime: number;
        api: string;
    }
   export interface Request {
        type: string;
        item: string;
    }
   export interface IComposer {
        id: string;
        name: string;
        complete_name: string;
        birth: string;
        death: string;
        epoch: string;
        portrait: string;
    }
  
    export class Composer implements IComposer {
    id: string;
    name: string;
    complete_name: string;
    birth: string;
    death: string;
    epoch: string;
    portrait: string;
    
    
    getBirthDate() {
        return new Date(this.birth);
    }
    getDeathDate(){
        if (this.death == null) return new Date(); //if alive use today date
        else return new Date(this.death);
    } 
}
   export interface RootObject {
        status: Status;
        request: Request;
        composers: IComposer[];
    }
