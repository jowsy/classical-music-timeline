import { ISessionContext } from "./ISessionContext";
import { LogicalOperatorFilter } from "./LogicalOperatorFilter";
import { TimeLineBase } from "./TimeLineBase";

export class AndFilter extends LogicalOperatorFilter{
    id: string;
    session: ISessionContext;

    public get isActive(): boolean {
        return this._isActive;
    }

    Activate(): void {
        this._isActive = true;
    }
    Deactivate(): void {
       this._isActive = false;
    }

    Apply(instance: TimeLineBase): boolean {

        return this.filters
                .filter(f => f.isActive)
                .map(f=>f.Apply(instance))
                .every(x => x == true)
    }
    
}