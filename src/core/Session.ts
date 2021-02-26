import { TimeLineBase } from "./TimeLineBase";
import { DataGateway } from "./DataGateway";
import { TimeSpan } from "./TimeSpan";
import { Event } from "./Event";


export class Session {

    minDate : Date;
    maxDate : Date;

    private _timeSpans: Array<TimeSpan>;

    get timeSpans(): Array<TimeSpan> {
        return this._timeSpans;
    }

    set timeSpans(value: Array<TimeSpan>) {
        this._timeSpans = value;
        this.setExtents();
    }

    public setExtents():void {
        
        var list : Array<Date> = [];
        
        this.timeSpans
        .filter(obj => obj.show == true)
        .map(obj => {
            if (obj instanceof TimeSpan)
            {
                list.push((obj as TimeSpan).startDate);
                list.push((obj as TimeSpan).endDate);
            }
        });

        list.sort((a: Date, b: Date) => {
            return a.getTime() - b.getTime();
        });

        this.minDate = list[0];
        this.maxDate = list[list.length-1]
    }

    static Create(dataGateway : DataGateway) : Session{
        let session = new Session;
        session.timeSpans = dataGateway.getTimeSpans();
        return session;
    }
    

}