import { SvgDimensions } from "./SvgDimensions";

export class ShapeGeneratorConfig {
    minDate:Date;
    maxDate:Date;
    svgDimensions:SvgDimensions;
    tickTimeInterval : number = 10; //years
    horizontalBarHeight: number;
    layoutType:LayoutType = LayoutType.StackVertically;
}

export enum LayoutType {
    StackVertically = 0,
    Optimize = 1
}