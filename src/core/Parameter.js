export class ParameterDefinition {
    setColorMap(colorMap) {
        this.colorMap = colorMap;
    }
    getColor(value) {
        if (this.colorMap == null)
            return "";
        return this.colorMap.get(value);
    }
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
    //Typescript doesn't do overloading so we need to this:
    set(val) {
        if (typeof val == "string")
            this._stringValue = val;
        else if (typeof val == "number")
            this._numberValue = val;
    }
}
export var ParamType;
(function (ParamType) {
    ParamType[ParamType["Number"] = 0] = "Number";
    ParamType[ParamType["String"] = 1] = "String";
})(ParamType || (ParamType = {}));
//# sourceMappingURL=Parameter.js.map