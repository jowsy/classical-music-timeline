import { Guid } from "./Guid";
import { IFilter } from "./IFilter";
import { Session } from "./Session";
import { TimeLineBase } from "./TimeLineBase";

export class ParameterStringFilter implements IFilter{
    id: string;
    session: Session;
    parameterName:string;
    filterValue : string;
    private _isActive: boolean;
    public get isActive(): boolean {
        return this._isActive;
    }

    Activate(): void {
        this._isActive = true;
    }
    Deactivate(): void {
       this._isActive = false;
    }

    constructor(parameterName:string, filterValue:string){
        this.parameterName = parameterName;
        this.filterValue = filterValue;
        this.id = Guid.MakeNew().ToString();
    }
 
    Apply(instance: TimeLineBase): boolean {
        var pDef = instance.getParameterByName(this.parameterName);
        if (pDef==null) return false;
        if (pDef.asString()==this.filterValue) return true;
        return false;
    }
}