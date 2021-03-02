export class ParamDefinition {
    name:string;
    id:string;
    parameterType:ParamType;
    filterable:boolean;
}

export class Parameter {
    definition: ParamDefinition;
    private _numberValue:number;
    private _stringValue:string;

    constructor(def:ParamDefinition){
        this.definition=def;
    }

    asString() : string {
        return this._stringValue;
    }

    asNumber() : number {
        return this._numberValue;
    }

    setString(val:string){
        this._stringValue = val;
    }
    
    setNumber(val:number){
        this._numberValue = val;
    }
}

export enum ParamType {
    Number,
    String
}