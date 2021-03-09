import { Parameter } from "./Parameter";
export class TimeLineBase {
    constructor() {
        this._parameters = new Array();
    }
    getParameterByName(paramName) {
        var param = this._parameters.find(p => p.definition.name == paramName);
        if (param != null) {
            return param;
        }
        if (this.session == null)
            throw new Error('session is not set.');
        let paramDef = this.session.configuration.parameterDefinitions.find(p => p.name == paramName);
        let newParam = new Parameter(paramDef);
        this._parameters.push(newParam);
        return newParam;
    }
    getParameterByDefinition(ParameterDefinition) {
        var param = this._parameters.find(p => p.definition == ParameterDefinition);
        if (param != null) {
            return param;
        }
        if (this.session == null)
            throw new Error('session is not set.');
        let newParam = new Parameter(ParameterDefinition);
        this._parameters.push(newParam);
        return newParam;
    }
}
//# sourceMappingURL=TimeLineBase.js.map