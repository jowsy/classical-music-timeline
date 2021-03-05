import { LogicalOperatorFilter } from "./LogicalOperatorFilter";
export class AndFilter extends LogicalOperatorFilter {
    Apply(instance) {
        return this.filters
            .filter(f => f.isActive)
            .map(f => f.Apply(instance))
            .every(x => x == true);
    }
}
//# sourceMappingURL=AndFilterTest.js.map