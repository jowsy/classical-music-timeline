import { TimeLineGeometry } from "./TimeLineGeometry";

export class Person extends TimeLineGeometry {
    birth:Date;
    death:Date;
    birthPlace:string;
    deathPlace:string;
    fullName:string;
    get displayCaption() : string{
        return this.fullName;
    }
}