import { Guid } from "./Guid";
export class ParameterStringFilter {
    constructor(parameterName, filterValue) {
        this.parameterName = parameterName;
        this.filterValue = filterValue;
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
        var pDef = instance.getParameterByName(this.parameterName);
        if (pDef == null)
            return false;
        if (pDef.asString() == this.filterValue)
            return true;
        return false;
    }
}
//# sourceMappingURL=ParameterFilter.js.map