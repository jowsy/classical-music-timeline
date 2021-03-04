import { Session } from "./Session";
import { TimeLineBase } from "./TimeLineBase";

export interface IFilter {
    id: string;
    session:Session;
    Apply(instance: TimeLineBase):boolean;
}