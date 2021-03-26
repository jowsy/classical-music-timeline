import { Person } from "./Person";

export class Composer extends Person {
    /* true if composer has been an important figure from an epoch to another, for example Beethoven (Classical -> Romantic)   */
    transitional:boolean;

    isInsideTimeSpan(startYear:number, endYear:number){
        const checkBirth = this.birth.getFullYear()>=startYear;
        var death = this.death;
        if (death==null) death = new Date();
        return checkBirth && death.getFullYear()<=endYear;
    }
}