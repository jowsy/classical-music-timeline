import { TimeSpan } from "../core/TimeSpan";
import { Configuration } from "../core/Configuration";
import { ColorManager } from "../core/ColorManager";
export class SessionVm {
    constructor() {
        this._timeSpans = new Array();
        this.configuration = new Configuration();
        this.colorManager = new ColorManager();
        this.colorManager.session = this;
    }
    get timeSpans() {
        return this._timeSpans;
    }
    setTimeSpans(value) {
        this._timeSpans.push(...value);
    }
    setExtents() {
        var list = [];
        this.timeSpans
            .filter(obj => obj.visible == true)
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
    Refresh() {
        if (this.rootFilter != null) {
            this._timeSpans.forEach(tSpan => {
                var test = this.rootFilter.Apply(tSpan);
                tSpan.visible = test;
                tSpan.visibilityOverriden = !test;
            });
        }
        this.colorManager.refresh();
    }
    PlugIn(dataGateway) {
        dataGateway.SetSession(this);
        dataGateway.Prepare();
        this.setTimeSpans(dataGateway.getTimeSpans());
    }
}
//# sourceMappingURL=SessionVm.js.map