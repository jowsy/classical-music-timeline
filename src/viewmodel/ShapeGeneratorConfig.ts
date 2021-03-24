import { SvgDimensions } from "./SvgDimensions";

export class ShapeGeneratorConfig {
    minDate:Date;
    maxDate:Date;
    svgDimensions:SvgDimensions;
    tickTimeInterval : number = 10; //years
    horizontalBarHeight: number;

}