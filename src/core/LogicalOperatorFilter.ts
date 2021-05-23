import { Guid } from "./Guid";
import { IFilter } from "./IFilter";
import { WorkspaceBase } from "./WorkspaceBase";
import { TimeLineBase } from "./TimeLineBase";

export class LogicalOperatorFilter implements IFilter{
    protected filters : Array<IFilter> = new Array<IFilter>();
    id: string;
    session: WorkspaceBase;
    protected _isActive: boolean;
    public get isActive(): boolean {
        return this._isActive;
    }

    Activate(): void {
        this._isActive = true;
    }
    Deactivate(): void {
       this._isActive = false;
    }
    constructor(){
      this.id = Guid.MakeNew().ToString();     
    }
    

    Apply(instance: TimeLineBase): boolean {
        throw new Error("This class is meant to act as a base for other classes.");
    }

    addFilter(filter:IFilter) : string {
        this.filters.push(filter);
        return filter.id;
    }

    removeFilter(id:string) : boolean{
        var index = this.filters.findIndex(f => f.id == id);
        if (index == -1) return false;
        this.filters.splice(index,1);
        return true;
    }

    getFilter(id:string) : IFilter{
        return this.filters.find(f => f.id == id) as IFilter;
    }

    getCount() : number{
        return this.filters.length;
    }
}