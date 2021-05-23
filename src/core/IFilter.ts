import { WorkspaceBase } from "./WorkspaceBase";
import { TimeLineBase } from "./TimeLineBase";

export interface IFilter {
    id: string;
    session:WorkspaceBase;
    isActive: boolean;
    Apply(instance: TimeLineBase):boolean;
    Activate(): void;
    Deactivate(): void;
}