import { TimeLineBase } from "./TimeLineBase";

export interface ITransformer {
    transform(objects:Array<TimeLineBase>):void;
}