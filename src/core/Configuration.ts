import { Guid } from "./Guid";
import { ParameterDefinition, ParamType } from "./Parameter";

export class Configuration{
    parameterDefinitions: ParameterDefinition[] = new Array<ParameterDefinition>();
    colorByParameterDefinition:ParameterDefinition;

    public addParameter(name:string, pType:ParamType, filterable:boolean) : ParameterDefinition{
        var parameterDef = new ParameterDefinition();
        parameterDef.id= Guid.MakeNew().ToString();
        parameterDef.name = name;
        parameterDef.parameterType = pType;
        parameterDef.filterable = filterable;
        this.parameterDefinitions.push(parameterDef);
        return parameterDef;
    }
}