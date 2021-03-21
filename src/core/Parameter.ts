import { parse } from "papaparse";

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
    //TODO: could this be done in a more elegant way??
    set(val:any) : void {
        if (typeof val == "string"){
            if (this.definition.parameterType==ParamType.Number) 
                throw Error("Can't assign parameter of type number to a string");
            this._stringValue = val;
        }
        else if (typeof val == "number"){
            if (this.definition.parameterType==ParamType.String) 
                throw Error("Can't assign parameter of type string to a number");
            this._numberValue = val;
        }
    }   
}

export enum ParamType {
    Number,
    String
}