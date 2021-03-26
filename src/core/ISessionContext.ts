import { Color } from "d3-color";
import { ColorManager } from "./ColorManager";
import { Composer } from "./Composer";
import { Configuration } from "./Configuration";
import { IShapeGenerator } from "./IShapeGenerator";
import { TimeLineBase } from "./TimeLineBase";

export interface ISessionContext {
    elements : Array<TimeLineBase>;
    composers : Array<Composer>;  
    configuration: Configuration;
    colorManager: ColorManager;
    shapeGenerator: IShapeGenerator;

}