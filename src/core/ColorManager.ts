import { IColorGenerator, 
         IColor, 
         ParameterDefinition,
         TimeLineBase,
         ISessionContext,
         ParamType } from "./";

export class ColorManager {

    session: ISessionContext;
    colorGenerator : IColorGenerator;
    private currentParameterDefinition: ParameterDefinition;
    private currentColorScheme: string | undefined;
    private colorSchemes:Map<string,Array<IColor>> = new Map<string,Array<IColor>>();

    private parameterGroupValues : Array<string>;
    private mapTable : Map<string,number>;
    private defaultColor : IColor;

    private colorGenStepNumber : number = 10;
    private colorGenStartColor : IColor;
    private colorGenEndColor : IColor; 
    protected colorGenColorSchemeName : string = "colorGen";

    setDefaultColor(color: IColor){
        this.defaultColor = color;
    }

    mapColorsByStringParameter(parameterDefinition : ParameterDefinition, colorScheme?:string){
            this.currentParameterDefinition = parameterDefinition;       
            this.currentColorScheme = colorScheme == undefined ? "default" : colorScheme;
    }

    mapColorsByNumberParameter(parameterDefinition : ParameterDefinition, steps:number, startColor:IColor, endColor:IColor){
            this.currentParameterDefinition = parameterDefinition;       
            this.GenerateColorScheme(this.colorGenColorSchemeName, steps, startColor, endColor);
            this.currentColorScheme = this.colorGenColorSchemeName;
    }

    GenerateColorScheme(schemeName: string, steps: number, startColor: IColor, endColor: IColor) {
        throw new Error("Function not implemented.");
    }
    

    addColorScheme(name:string, colors:IColor[]){
        this.colorSchemes.set(name,colors);
    }

    private remap()
    {
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
                for (let index2 = 0; index2 <  parameterGroups[element].length; index2++) {
                    const p = parameterGroups[element][index2];
                    if (p.id == "") throw Error("Element must have ID assigned!");
                    this.mapTable.set(p.id, index);                
                }
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

