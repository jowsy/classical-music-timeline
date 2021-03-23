import { TimeLineGeometry } from "./TimeLineGeometry";

export interface IShapeGenerator {
    generateShapes(geometryInstances:TimeLineGeometry[]):void;
}