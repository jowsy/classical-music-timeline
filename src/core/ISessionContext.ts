import { Color } from "d3-color";
import { IDataGateway } from ".";
import { ColorManager } from "./ColorManager";
import { Composer } from "./Composer";
import { Configuration } from "./Configuration";
import { DataSet } from "./DataSet";
import { IShapeGenerator } from "./IShapeGenerator";
import { TimeLineBase } from "./TimeLineBase";

export interface ISessionContext {
    elements : Array<TimeLineBase>;
    composers : Array<Composer>;  
    configuration: Configuration;
    colorManager: ColorManager;
    shapeGenerator: IShapeGenerator;
    addDataSet(name:string, description:string,dataGateway:IDataGateway):number;
    loadData():Promise<void>;
    setExtents():void;

}