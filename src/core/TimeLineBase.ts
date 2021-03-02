import { ParamDefinition, Parameter } from "./Parameter";
import { Session } from "./Session";

export class TimeLineBase {

    session:Session;
    id: string;
    show : boolean;
    displayCaption : string;
    order : number;
    
    private _parameters : Array<Parameter> = new Array<Parameter>();

    getParameter(paramName:string) {
        var param = this._parameters.find(p => p.definition.name == paramName);
        if (param!= null){
            return param;
        }
        if (this.session==null) throw new Error('session is not set.');

        let paramDef : ParamDefinition = this.session.parameterDefs.find(p => p.name == paramName) as ParamDefinition;
        let newParam : Parameter = new Parameter(paramDef);
        this._parameters.push(newParam);

        return newParam;
    }

}
