export class ParameterDefinition {

    name:string;
    id:string;
    parameterType:ParamType;
    filterable:boolean;
    isFilterEnabled:boolean;
}

export class Parameter {
    definition: ParameterDefinition;
    private _numberValue:number;
    private _stringValue:string;

    constructor(def:ParameterDefinition){
        this.definition=def;
    }

    asString() : string {
        return this._stringValue;
    }

    asNumber() : number {
        return this._numberValue;
    }

    //Typescript doesn't do overloading so we need to this:
    set(val:any) : void {
        if (typeof val == "string")
        this._stringValue = val;
        else if (typeof val == "number")
        this._numberValue = val;
    }   
}

export enum ParamType {
    Number,
    String
}