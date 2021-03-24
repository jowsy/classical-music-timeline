import { TimeLineBase } from "./TimeLineBase";
import { TimeLineShape } from "./TimeLineShapes";

export abstract class TimeLineGeometry extends TimeLineBase {
    shape : TimeLineShape;
    visible : boolean;
    visibilityOverriden : boolean;
    displayCaption : string;
}