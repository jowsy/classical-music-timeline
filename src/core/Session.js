import { TimeSpan } from "./TimeSpan";
import { ParamDefinition } from "./Parameter";
import { Guid } from "./Guid";
export class Session {
    constructor() {
        this._parameterDefs = new Array();
    }
    get timeSpans() {
        return this._timeSpans;
    }
    setTimeSpans(value) {
        this._timeSpans = value;
        this.setExtents();
    }
    get parameterDefs() {
        return this._parameterDefs;
    }
    addCustomParameter(name, pType, filterable) {
        var parameterDef = new ParamDefinition();
        parameterDef.id = Guid.MakeNew().ToString();
        parameterDef.name = name;
        parameterDef.parameterType = pType;
        parameterDef.filterable = filterable;
        this._parameterDefs.push(parameterDef);
    }
    setExtents() {
        var list = [];
        this.timeSpans
            .filter(obj => obj.show == true)
            .map(obj => {
            if (obj instanceof TimeSpan) {
                list.push(obj.startDate);
                list.push(obj.endDate);
            }
        });
        list.sort((a, b) => {
            return a.getTime() - b.getTime();
        });
        this.minDate = list[0];
        this.maxDate = list[list.length - 1];
    }
    static Create(dataGateway) {
        let session = new Session;
        dataGateway.Init(session);
        dataGateway.Prepare();
        session.setTimeSpans(dataGateway.getTimeSpans());
        return session;
    }
}
//# sourceMappingURL=Session.js.map