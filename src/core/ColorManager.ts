import { toHandlers } from "@vue/runtime-core";
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

    //Number parameters use generated color scheme
    private colorGenStepNumber : number = 10;
    private colorGenStartColor : IColor;
    private colorGenEndColor : IColor; 
    protected colorGenColorSchemeName : string = "colorGen";
    private colorGenRanges:Array<number[]>;
    private colorGenMinMax:Array<number>;

    setDefaultColor(color: IColor){
        this.defaultColor = color;
    }

    mapColorsByStringParameter(parameterDefinition : ParameterDefinition, colorScheme?:string){
        this.currentParameterDefinition = parameterDefinition;       
        this.currentColorScheme = colorScheme == undefined ? "default" : colorScheme;
    }

    mapColorsByNumberParameter(parameterDefinition : ParameterDefinition, steps:number, startColor:IColor, endColor:IColor){
        this.currentParameterDefinition = parameterDefinition;   
          
        if (this.generateColorScheme(this.colorGenColorSchemeName, steps, startColor, endColor))
            this.currentColorScheme = this.colorGenColorSchemeName; 
            
    }

    generateColorScheme(schemeName: string, steps: number, startColor: IColor, endColor: IColor) : boolean {
        this.colorGenStepNumber = steps;
        this.colorGenStartColor = startColor;
        this.colorGenEndColor = endColor;
        
        const numbers : number[] = this.session.elements.map(t => t.getParameterByDefinition(this.currentParameterDefinition).asNumber()).filter(n => n!=undefined);
        
        if (numbers.length==0) return false;

        const max = numbers.reduce(function(prev, current) {
            return (prev > current) ? prev : current
        });

        const min = numbers.reduce(function(prev, current) {
            return (prev < current) ? prev : current
        });

      
        this.colorGenRanges = new Array<number[]>();

        var listOfColors = new Array<IColor>();

        const stepSize = (max-min)/this.colorGenStepNumber;
        var start = min;

        for (let index = 0; index < this.colorGenStepNumber; index++) {
            const range = [start,start+stepSize];
            this.colorGenRanges.push(range);
            const colorToAdd = this.colorGenerator.GetGradientColor(this.colorGenStartColor, this.colorGenEndColor, (index+1)/this.colorGenStepNumber);
            listOfColors.push(colorToAdd);
            start += stepSize;
        }
        this.colorGenMinMax = [min, max];
        this.addColorScheme(this.colorGenColorSchemeName, listOfColors);
        return true;
    }
    

    addColorScheme(name:string, colors:IColor[]){
        this.colorSchemes.set(name,colors);
    }

    private remap()
    {
        if (this.currentParameterDefinition==null) return;
        if (this.currentColorScheme==null || this.currentColorScheme == "") return;

        var colors = this.colorSchemes.get(this.currentColorScheme);
        
        switch(this.currentParameterDefinition.parameterType){
            case ParamType.String:{
                var parameterGroups = this.groupBy(this.session.elements, 
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
                break;
            }
            case ParamType.Number:{
               this.generateColorScheme(this.colorGenColorSchemeName, 
                                        this.colorGenStepNumber, 
                                        this.colorGenStartColor,
                                        this.colorGenEndColor);
               break;
            }
        }
    }

    getColor(element:TimeLineBase) : IColor {

        if (this.colorSchemes.size==0 || this.currentColorScheme==undefined) return this.defaultColor;
        var colors = this.colorSchemes.get(this.currentColorScheme);
        if (colors==null )
            return this.defaultColor;

        switch(this.currentParameterDefinition.parameterType){
            case ParamType.String:{         
                var index = this.mapTable.get(element.id)

                if (index==null ||colors.length<index)
                    return this.defaultColor;

                return colors[index];
            } 
            case ParamType.Number:{
                const n = element.getParameterByDefinition(this.currentParameterDefinition).asNumber();
                if (n==undefined) return this.defaultColor;
                if (this.colorGenMinMax[0]==n) return colors[0];
                if (this.colorGenMinMax[1]==n) return colors[colors.length-1];
                const colorSchemeIndex = this.colorGenRanges.findIndex(r => n > r[0] && n < r[1])
                return colors[colorSchemeIndex];
             }
        }

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

