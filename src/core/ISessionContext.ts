import { Color } from "d3-color";
import { ColorManager } from "./ColorManager";
import { Configuration } from "./Configuration";
import { IShapeGenerator } from "./IShapeGenerator";
import { TimeLineBase } from "./TimeLineBase";

export interface ISessionContext {
    timeSpans : Array<TimeLineBase>;
    configuration: Configuration;
    colorManager: ColorManager;
    shapeGenerator: IShapeGenerator;
}