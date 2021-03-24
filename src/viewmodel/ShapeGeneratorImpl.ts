import { Composer } from "@/core/Composer";
import { IShapeGenerator } from "@/core/IShapeGenerator";
import { TimeLineGeometry } from "@/core/TimeLineGeometry";
import { TimeLineRectangle } from "@/core/TimeLineShapes";
import { ShapeGeneratorConfig } from "./ShapeGeneratorConfig";
import * as d3 from 'd3';

export class ShapeGeneratorImpl implements IShapeGenerator {

    config:ShapeGeneratorConfig;

    //private scale:d3.ScaleTime<number,number,never>;

    construct(generatorConfig:ShapeGeneratorConfig)
    {
        this.config = generatorConfig;
    }

    generateShapes(geometryInstances: TimeLineGeometry[]): void {
        const scale = this.createScale();

        let dateInterval = d3.timeYear.every(this.config.tickTimeInterval);
        let xAxis = d3.axisTop(scale).ticks(dateInterval); //Date ticks

        for (let index = 0; index < geometryInstances.length; index++) {
            const element = geometryInstances[index];
            if (element instanceof Composer){
                this.createComposerShape(element as Composer, scale);
            }
        }
    }

    private createComposerShape(composer:Composer, scale:d3.ScaleTime<number,number,never>){
        const rectangle = new TimeLineRectangle();
        rectangle.x = scale(new Date(composer.birth));
        if (composer.death==undefined) composer.death = new Date();
        rectangle.width = scale(composer.death)-scale(composer.birth);
        composer.shape = rectangle;
    }

    private createScale() : d3.ScaleTime<number,number,never> {
        const scale = d3.scaleTime()
        .domain(
            [this.config.minDate, 
             this.config.maxDate])
            .range([0, this.config.svgDimensions.width]);
            return scale;
    }

}
