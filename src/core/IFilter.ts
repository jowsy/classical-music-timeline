import { Session } from "./Session";
import { TimeLineBase } from "./TimeLineBase";

export interface IFilter {
    id: string;
    session:Session;
    isActive: boolean;
    Apply(instance: TimeLineBase):boolean;
    Activate(): void;
    Deactivate(): void;
}