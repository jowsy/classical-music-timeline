import { LogicalOperatorFilter } from "./LogicalOperatorFilter";
import { Session } from "./Session";
import { TimeLineBase } from "./TimeLineBase";

export class AndFilter extends LogicalOperatorFilter{
    id: string;
    session: Session;

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