import { geoAlbers } from "d3";
import { Guid } from "./Guid";
import { IFilter } from "./IFilter";
import { Session } from "./Session";
import { TimeLineBase } from "./TimeLineBase";

export class OrFilter implements IFilter {
    id: string;
    session: Session;

    constructor(){
        this.id = Guid.MakeNew().ToString(); 
    }
    Apply(instance: TimeLineBase): boolean {
        if (this.filters.length == 0) return false;

        for (let index = 0; index < this.filters.length; index++) {
            const element = this.filters[index];
            if (element.Apply(instance)) return true;
        }
        return false;
    
    }

    private filters : Array<IFilter> = new Array<IFilter>();

    addFilter(filter:IFilter) : string {
        this.filters.push(filter);
        return filter.id;
    }

    removeFilter(id:string) : boolean{
        var index = this.filters.findIndex(f => f.id == id);
        if (index == -1) return false;
        this.filters.splice(index,1);
        return true;
    }

    getCount() : number{
        return this.filters.length;
    }
}