import { Guid } from "./Guid";
import { ParameterDefinition, ParameterType } from "./Parameter";

export class Configuration{
    parameterDefinitions: ParameterDefinition[] = new Array<ParameterDefinition>();
    colorByParameterDefinition:ParameterDefinition;

    public addParameter(name:string, 
                        displayCaption:string,
                        pType:ParameterType, 
                        filterable:boolean,
                        description?:string) : ParameterDefinition{
        var parameterDef = new ParameterDefinition();
        parameterDef.id= Guid.MakeNew().ToString();
        parameterDef.name = name;
        parameterDef.displayCaption = displayCaption;
        parameterDef.parameterType = pType;
        parameterDef.filterable = filterable;
        parameterDef.description = description!;
        this.parameterDefinitions.push(parameterDef);
        return parameterDef;
    }

    public getParameterByName(name:string) : ParameterDefinition | undefined {
        const index = this.parameterDefinitions.findIndex(p => p.name==name);
        if (index==-1) return undefined;
        return this.parameterDefinitions[index];
    }
}