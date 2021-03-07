import { LogicalOperatorFilter } from "./LogicalOperatorFilter";
export class AndFilter extends LogicalOperatorFilter {
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
        return this.filters
            .filter(f => f.isActive)
            .map(f => f.Apply(instance))
            .every(x => x == true);
    }
}
//# sourceMappingURL=AndFilterTest.js.map