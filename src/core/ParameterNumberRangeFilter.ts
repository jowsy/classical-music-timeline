import { Guid } from "./Guid";
import { IFilter } from "./IFilter";
import { ISessionContext } from "./ISessionContext";
import { ParameterDefinition } from "./Parameter";
import { TimeLineBase } from "./TimeLineBase";

export class ParameterNumberRangeFilter implements IFilter{
    id: string;
    session: ISessionContext;
    parameterDefinition:ParameterDefinition;

    min : number;
    max : number;

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

    constructor(parameterDefinition:ParameterDefinition, min:number, max:number){
        this.parameterDefinition = parameterDefinition;
        this.min = min;
        this.max = max;
        this.id = Guid.MakeNew().ToString();
    }
 
    Apply(instance: TimeLineBase): boolean {
        var pDef = instance.getParameterByDefinition(this.parameterDefinition);
        if (pDef==null) return false;
        var n = pDef.asNumber();
        if (n==undefined) return false;
        return n >= this.min && n<=this.max;
    }
}