import { TimeLineBase } from ".";
import { TimeLineGeometry } from "./TimeLineGeometry";

export class ParameterGroup<T> {
    key:T;
    items:TimeLineBase[];

    constructor(key:T, items:TimeLineBase[]){
        this.key = key;
        this.items = items;
    }
    
    getXValues() : number[] {
        var initial : number[] = [];
        this.items.forEach(item => {
            if (item instanceof TimeLineGeometry){
                initial.push(item.shape.x);
            }
        });
        return initial;
    }

}