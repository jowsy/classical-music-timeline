import { Composer } from "@/core/Composer";
import { IShapeGenerator } from "@/core/IShapeGenerator";
import { TimeLineGeometry } from "@/core/TimeLineGeometry";
import { TimeLineRectangle } from "@/core/TimeLineShapes";
import { LayoutType, ShapeGeneratorConfig } from "./ShapeGeneratorConfig";
import * as d3 from 'd3';
import { ISessionContext } from "@/core";

export class ShapeGeneratorImpl implements IShapeGenerator {

    config:ShapeGeneratorConfig;

    session:ISessionContext;

    private maxBarHeight = 70;
    //private scale:d3.ScaleTime<number,number,never>;

    get svgCanvasHeight(){
        var sideMenuDomObject = document.getElementById("sidebarMenu");
        if (sideMenuDomObject==null) throw Error("Can't computer canvas height. Sidebar menu dom-object not found.");
        return sideMenuDomObject.clientHeight-this.config.svgDimensions.marginTop-this.config.svgDimensions.marginBottom;
    }

    get svgCanvasWidth(){
        var sideMenuDomObject = document.getElementById("sidebarMenu");
        if (sideMenuDomObject==null) throw Error("Can't computer canvas height. Sidebar menu dom-object not found.");
        var topMenuDomObject = document.getElementById("topMenu");
        if (topMenuDomObject==null) throw Error("Can't computer canvas height. top menu dom-object not found.");
        return topMenuDomObject.clientWidth 
                - sideMenuDomObject.clientWidth 
                - this.config.svgDimensions.marginLeft 
                - this.config.svgDimensions.marginRight;
    }

    public get drawingAreaHeight(){
        return this.svgCanvasHeight - this.config.svgDimensions.topAxisHeight - this.config.svgDimensions.marginBottom - this.config.svgDimensions.marginTop;
    }

    private GetMaximumBarHeight(length:number){
        return Math.min(this.drawingAreaHeight/length,this.maxBarHeight);
    }

    construct(generatorConfig:ShapeGeneratorConfig)
    {
        this.config = generatorConfig;
    }

    generateShapes(): void {
        const scale = this.createScale();
        let dateInterval = d3.timeYear.every(this.config.tickTimeInterval);
        let xAxis = d3.axisTop(scale).ticks(dateInterval); //Date ticks
        
     
        var composers = this.session.composers;
        const barHeight = this.GetMaximumBarHeight(composers.length);
        var sortComposerList = [...composers].sort((a, b) => {
            return a.birth > b.birth ? 1 : -1;});
         
        if (composers.length > 0){
            switch (this.config.layoutType) {
                case LayoutType.StackVertically:
                    {
                        for (let index = 0; index < sortComposerList.length; index++) {
                            const element = sortComposerList[index];
                            if (element instanceof Composer){
                                this.createComposerShape(element as Composer, index, scale, barHeight);
                            }
                        }
                    
                    break;
                    }
                case LayoutType.Optimize:{
                    //IMPLEMENT!!   

                    let composerIdShapeCreated : number[] = [];
                    
                    this.recursiveCreateShape(sortComposerList, 0, 1, composerIdShapeCreated, scale, barHeight);

                }
            }
        }
    }
        
    private recursiveCreateShape(list:Composer[],
                                currentIndex:number, 
                                yRow:number,
                                takenIndexes: number[], 
                                scale:d3.ScaleTime<number,number,never>, 
                                rectangleHeight:number){
    
        var composer = list[currentIndex];
        const rectangle = new TimeLineRectangle();
        rectangle.x = scale(composer.birth);
        rectangle.y = ((yRow * rectangleHeight) + this.config.svgDimensions.topAxisHeight);
        var endDate = composer.death;
        if (endDate==undefined)
            endDate = new Date();  
        rectangle.width = scale(endDate)-scale(composer.birth);
        rectangle.height = rectangleHeight;
        composer.shape = rectangle;
        takenIndexes.push(list.indexOf(composer));
        takenIndexes.sort((a, b) => {
            return a > b ? 1 : -1;});
        //Get composer next to current
        var query = list.filter(c => takenIndexes.findIndex(indx => indx==list.indexOf(c))==-1)
                        .filter(c => scale(c.birth)>composer.shape.x+rectangle.width);
        
        if (query.length!=0){
        const nextIndex = list.indexOf(query[0]);
        this.recursiveCreateShape(list, nextIndex, yRow, takenIndexes, scale, rectangleHeight);
        }else{
            if (takenIndexes.length!=list.length){
                yRow++;
                var nextIndex = 0;
                for (let index = 0; index < takenIndexes.length; index++) {
                    if (takenIndexes[index]!=index){
                        nextIndex = index;
                        break;
                    }
                    
                }
                this.recursiveCreateShape(list, nextIndex, yRow, takenIndexes, scale, rectangleHeight);
            }
        }
    }

    private createComposerShape(composer:Composer, index:number, scale:d3.ScaleTime<number,number,never>, rectangleHeight:number){
        const rectangle = new TimeLineRectangle();
        rectangle.x = scale(composer.birth);
        rectangle.y = ((index * rectangleHeight) + this.config.svgDimensions.topAxisHeight);
        var endDate = composer.death;
        if (endDate==undefined)
            endDate = new Date();  
        rectangle.width = scale(endDate)-scale(composer.birth);
        rectangle.height = rectangleHeight;
        composer.shape = rectangle;
    }

    private createScale() : d3.ScaleTime<number,number,never> {
        const scale = d3.scaleTime()
        .domain(
            [this.config.minDate, 
             this.config.maxDate])
            .range([0, this.svgCanvasWidth]);
            return scale;
    }

}
