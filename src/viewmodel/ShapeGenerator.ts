import { IShapeGenerator } from "@/core/IShapeGenerator";
import { TimeLineGeometry } from "@/core/TimeLineGeometry";

export class ShapeGenerator implements IShapeGenerator {
    generateShapes(geometryInstances: TimeLineGeometry[]): void {
        throw new Error("Method not implemented.");
    }

}