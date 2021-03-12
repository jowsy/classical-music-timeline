import { basePlacements } from "@popperjs/core";
import { geoAlbers } from "d3";
import { Guid } from "./Guid";
import { IFilter } from "./IFilter";
import { ISessionContext } from "./ISessionContext";
import { LogicalOperatorFilter } from "./LogicalOperatorFilter";
import { TimeLineBase } from "./TimeLineBase";

export class OrFilter extends LogicalOperatorFilter {
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
        
        if (this.filters.length == 0) return false;

        for (let index = 0; index < this.filters.length; index++) {
            const element = this.filters[index];
            if (element.isActive){
            if (element.Apply(instance)) return true;
            }
        }
        return false;
    
    }
}