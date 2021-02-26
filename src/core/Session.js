import { TimeSpan } from "./TimeSpan";
import { Event } from "./Event";
export class Session {
    get objects() {
        return this.TimeLineBases;
    }
    set objects(value) {
        this.TimeLineBases = value;
        this.setExtents();
    }
    setExtents() {
        var list = [];
        this.objects.map(obj => {
            if (obj instanceof TimeSpan) {
                list.push(obj.startDate);
                list.push(obj.endDate);
            }
            else if ((obj instanceof Event)) {
                list.push(obj.date);
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
        session.objects = dataGateway.getObjects();
        return session;
    }
}
//# sourceMappingURL=Session.js.map