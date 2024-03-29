
import { IColorGenerator, 
         IColor, 
         ParameterDefinition,
         TimeLineBase,
         ISessionContext,
         ParameterType,
         ParameterGroup } from "./";

export class ColorManager {

    session: ISessionContext;
    colorGenerator : IColorGenerator;
    private currentParameterDefinition: ParameterDefinition;
    private currentColorScheme: string | undefined;
    private colorSchemes:Map<string,Array<IColor>> = new Map<string,Array<IColor>>();

    private parameterGroupValues : Array<string>;
    private mapTable : Map<number,number>;
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
            case ParameterType.String:{

                // NOTE: Sort based on x value in geometry instance
                // The first item in the group represent the group's total x-value (problems???)
                let parameterGroups : Array<ParameterGroup<string>> = this.groupBy(this.session.elements, 
                                            entity => entity.getParameterByDefinition(this.currentParameterDefinition)
                                            .asString())
                                            .sort((a, b) => {
                                                return a.getXValues()[0] > b.getXValues()[0] ? 1 : -1;});

                

                this.parameterGroupValues = parameterGroups.map(t => t.key);
                
                this.mapTable = new Map<number,number>();

                for (let index = 0; index < parameterGroups.length; index++) {
                  
                    for (let index2 = 0; index2 <  parameterGroups[index].items.length; index2++) {
                        const p = parameterGroups[index].items[index2];
                        if (p.internalId == undefined) throw Error("Element must have ID assigned!");
                        this.mapTable.set(p.internalId, index);                
                    }
                }
                break;
            }
            case ParameterType.Number:{
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
            case ParameterType.String:{         
                var index = this.mapTable.get(element.internalId)

                if (index==null ||colors.length<index)
                    return this.defaultColor;

                return colors[index];
            } 
            case ParameterType.Number:{
                const n = element.getParameterByDefinition(this.currentParameterDefinition).asNumber();
                if (n==undefined) return this.defaultColor;
                if (this.colorGenMinMax[0]==n) return colors[0];
                if (this.colorGenMinMax[1]==n) return colors[colors.length-1];
                const colorSchemeIndex = this.colorGenRanges.findIndex(r => n > r[0] && n < r[1])
                return colors[colorSchemeIndex];
             }
        }

    }

    getCurrentColorMap() : Map<string,IColor>{
        var arrayOfColorMappings = new Map<string,IColor>();
        if (this.currentColorScheme == undefined) return arrayOfColorMappings;
        var colorScheme = this.colorSchemes.get(this.currentColorScheme);
        

        switch(this.currentParameterDefinition.parameterType){
            case ParameterType.String:{
                if (this.parameterGroupValues == undefined) return arrayOfColorMappings;
                this.parameterGroupValues.forEach(str => {
                    var indexInList = this.parameterGroupValues.indexOf(str);
                    var color =  colorScheme![indexInList];
                    if (color!=undefined)
                        arrayOfColorMappings.set(str,color);

                });
                break;
            }
            case ParameterType.Number:{
                if (colorScheme != undefined) {
                this.colorGenRanges.forEach(range => {
                        var indexInList = this.colorGenRanges.indexOf(range);
                         var label = Math.round(range[0]).toString()+"-"+Math.round(range[1]).toString();
                         arrayOfColorMappings.set(label,colorScheme![indexInList]);
                });
                }
               break;
            }
        }
        return arrayOfColorMappings;
    }

    refresh(){
        this.remap();
    }

    
    groupBy = function<K extends keyof any>(arrayOfSomething:TimeLineBase[], getKey: (item:TimeLineBase) => K) : Array<ParameterGroup<K>>{
        var records = arrayOfSomething.reduce( (prev, current) => {
            const group = getKey(current);
            if (!prev[group]) prev[group] = [];
            prev[group].push(current);
            return prev;
        }, {} as Record<K,TimeLineBase[]>);
        var result : Array<ParameterGroup<K>> = new Array<ParameterGroup<K>>();
        var recordValues = Object.keys(records) as K[];

        for (let index = 0; index < recordValues.length; index++) {
            var key = recordValues[index];
            var items = records[key] as TimeLineBase[];          
            result.push(new ParameterGroup<K>(recordValues[index], items));            
        }
        return result;
    };

}

