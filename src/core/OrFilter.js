import { LogicalOperatorFilter } from "./LogicalOperatorFilter";
export class OrFilter extends LogicalOperatorFilter {
    Apply(instance) {
        if (this.filters.length == 0)
            return false;
        for (let index = 0; index < this.filters.length; index++) {
            const element = this.filters[index];
            if (element.isActive) {
                if (element.Apply(instance))
                    return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=OrFilter.js.map