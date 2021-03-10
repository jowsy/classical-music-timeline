
import {IComposer} from './OpenOpus'

export class Composer implements IComposer {
    
    id: string;
    name: string;
    complete_name: string;
    birth: string;
    death: string;
    epoch: string;
    portrait: string;
    popular: number;

    isChecked: boolean;

    constructor() {
        this.id = "";
        this.name = "";
        this.birth = "";
        this.death = "";
        this.epoch = "";
        this.portrait = "";
        this.complete_name ="";
        this.isChecked = true;
        this.popular = 0;
      }
    getBirthDate() {
        return new Date(this.birth);
    }
    getDeathDate(){
        if (this.death == null) return new Date(); //if alive use today date
        else return new Date(this.death);
    }

}