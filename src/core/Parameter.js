export class ParamDefinition {
}
export class Parameter {
    constructor(def) {
        this.definition = def;
    }
    asString() {
        return this._stringValue;
    }
    asNumber() {
        return this._numberValue;
    }
    setString(val) {
        this._stringValue = val;
    }
    setNumber(val) {
        this._numberValue = val;
    }
}
export var ParamType;
(function (ParamType) {
    ParamType[ParamType["Number"] = 0] = "Number";
    ParamType[ParamType["String"] = 1] = "String";
})(ParamType || (ParamType = {}));
//# sourceMappingURL=Parameter.js.map