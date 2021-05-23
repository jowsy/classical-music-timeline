import { SvgDimensions } from "./SvgDimensions";

export class ShapeGeneratorConfig {
    svgDimensions:SvgDimensions;
    tickTimeInterval : number = 10; //years
    horizontalBarHeight: number;
    layoutType:LayoutType = LayoutType.Optimize;
    rectangleMargin:number = 0.1; //Percent
}

export enum LayoutType {
    StackVertically = 0,
    Optimize = 1
}