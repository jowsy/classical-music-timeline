import { ClassType } from "./ClassType";
import { ISessionContext } from "./ISessionContext";
import { ParameterDefinition, Parameter } from "./Parameter";

export abstract class TimeLineBase {

    session:ISessionContext;
    internalId: number;
    classType:ClassType;
    order : number;
    
    private _parameters : Array<Parameter> = new Array<Parameter>();

    getParameterByName(paramName:string) {
        var param = this._parameters.find(p =>  p.definition != undefined && p.definition.name == paramName);
        if (param!= null){
            return param;
        }
        if (this.session==null) throw new Error('session is not set.');

        let paramDef : ParameterDefinition = this.session.configuration.parameterDefinitions.find(p => p.name == paramName) as ParameterDefinition;
        let newParam : Parameter = new Parameter(paramDef);
        this._parameters.push(newParam);

        return newParam;
    }

    getParameterByDefinition(ParameterDefinition:ParameterDefinition) {
        var param = this._parameters.find(p => p.definition == ParameterDefinition);
        if (param!= null){
            return param;
        }
        if (this.session==null) throw new Error('session is not set.');

        let newParam : Parameter = new Parameter(ParameterDefinition);
        this._parameters.push(newParam);

        return newParam;
    }

}
