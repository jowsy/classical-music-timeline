import { ISessionContext } from ".";
import { TimeLineGeometry } from "./TimeLineGeometry";

export interface IShapeGenerator {
    session:ISessionContext;
    generateShapes(geometryInstances:TimeLineGeometry[]):void;
}