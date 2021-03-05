import { Guid } from "./Guid";
export class LogicalOperatorFilter {
    constructor() {
        this.filters = new Array();
        this.id = Guid.MakeNew().ToString();
    }
    get isActive() {
        return this._isActive;
    }
    Activate() {
        this._isActive = true;
    }
    Deactivate() {
        this._isActive = false;
    }
    Apply(instance) {
        throw new Error("This class is meant to act as a base for other classes.");
    }
    addFilter(filter) {
        this.filters.push(filter);
        return filter.id;
    }
    removeFilter(id) {
        var index = this.filters.findIndex(f => f.id == id);
        if (index == -1)
            return false;
        this.filters.splice(index, 1);
        return true;
    }
    getFilter(id) {
        return this.filters.find(f => f.id == id);
    }
    getCount() {
        return this.filters.length;
    }
}
//# sourceMappingURL=LogicalOperatorFilter.js.map