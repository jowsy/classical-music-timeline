import { IColor } from "./IColor";
import { ParameterDefinition, ParamType } from "./Parameter";
import { ParameterStringFilter } from "./ParameterFilter";
import { Session } from "./Session";
import { TimeLineBase } from "./TimeLineBase";

export class ColorManager {

    session: Session;
    private currentParameterDefinition: ParameterDefinition;
    private currentColorScheme: string;
    private colorSchemes:Map<string,Array<IColor>> = new Map<string,Array<IColor>>();

    private parameterGroupValues : Array<string>;
    private mapTable : Map<string,number>;
    private defaultColor : IColor;

    setDefaultColor(color: IColor){
        this.defaultColor = color;
    }

    mapColorsByParameter(parameterDefinition : ParameterDefinition, colorScheme:string){
        this.currentParameterDefinition = parameterDefinition;
        this.currentColorScheme = colorScheme;
    }
    addColorScheme(name:string, colors:IColor[]){
        this.colorSchemes.set(name,colors);
    }

    private remap(){

        if (this.currentParameterDefinition==null) return;
        if (this.currentColorScheme==null || this.currentColorScheme == "") return;

        var colors = this.colorSchemes.get(this.currentColorScheme);
        if (this.currentParameterDefinition.parameterType==ParamType.String){
        var parameterGroups = this.groupBy(this.session.timeSpans, 
                                           entity => entity.getParameterByDefinition(this.currentParameterDefinition)
                                           .asString());
        
        
        this.parameterGroupValues = Object.keys(parameterGroups);
        
        this.mapTable = new Map<string,number>();

        for (let index = 0; index < this.parameterGroupValues.length; index++) {
            const element = this.parameterGroupValues[index];
            parameterGroups[element].forEach(p => this.mapTable.set(p.id, index))
        }

        }
    }

    getColor(element:TimeLineBase, colorSchemeName:string) : IColor {

        if (this.colorSchemes.size==0 || this.mapTable==null) return this.defaultColor;
        var colors = this.colorSchemes.get(colorSchemeName);
        var index = this.mapTable.get(element.id);
        if (colors==null || index==null || colors.length<index)
            return this.defaultColor;
        return colors[index];
    }

    refresh(){
        this.remap();
    }

    
    groupBy = function<T, K extends keyof any>(arrayOfSomething:T[], getKey: (item:T) => K){
    return arrayOfSomething.reduce( (prev, current) => {
        const group = getKey(current);
        if (!prev[group]) prev[group] = [];
        prev[group].push(current);
        return prev;
    }, {} as Record<K,T[]>);

};

}