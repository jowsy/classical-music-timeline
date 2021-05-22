import { basePlacements } from "@popperjs/core";
import { ClassType } from "./ClassType";
import { Occupation } from "./Occupation";
import { TimeLineGeometry } from "./TimeLineGeometry";

export class Person extends TimeLineGeometry {
    constructor(){
        super();
        this.classType = ClassType.Person;
    }
    birth:Date;
    death:Date;
    birthPlace:string;
    deathPlace:string;
    fullName:string;
    occupation:Occupation;
    get displayCaption() : string{
        return this.fullName;
    }
    /* true if person has been/is an important figure from an epoch to another, for example Beethoven (Classical -> Romantic)   */
    transitional:boolean;

    isInsideTimeSpan(startYear:number, endYear:number){
        if (this.birth == undefined || this.death == undefined) return false;
        const checkBirth = this.birth.getFullYear()>=startYear;
        var death = this.death;
        if (death==null || death==undefined) death = new Date();
        return checkBirth && death.getFullYear()<=endYear;
    }
}