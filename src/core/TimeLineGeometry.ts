import { TimeLineBase } from "./TimeLineBase";
import { TimeLineShape } from "./TimeLineShapes";

export abstract class TimeLineGeometry extends TimeLineBase {
    public Shape : TimeLineShape;
    visible : boolean;
    visibilityOverriden : boolean;
    displayCaption : string;
}