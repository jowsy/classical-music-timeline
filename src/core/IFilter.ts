import { ISessionContext } from "./ISessionContext";
import { TimeLineBase } from "./TimeLineBase";

export interface IFilter {
    id: string;
    session:ISessionContext;
    isActive: boolean;
    Apply(instance: TimeLineBase):boolean;
    Activate(): void;
    Deactivate(): void;
}