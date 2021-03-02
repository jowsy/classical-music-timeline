import { TimeLineBase } from "./TimeLineBase";
import { DataGateway } from "./DataGateway";
import { TimeSpan } from "./TimeSpan";
import { Event } from "./Event";
import { ParamDefinition, ParamType } from "./Parameter";
import { Guid } from "./Guid";

export class Session {

    constructor(){
        this._parameterDefs = new Array<ParamDefinition>();
    }

    minDate : Date;
    maxDate : Date;

    private _timeSpans: Array<TimeSpan>;

    get timeSpans(): Array<TimeSpan> {
        return this._timeSpans;
    }

    private setTimeSpans(value: Array<TimeSpan>) {
        this._timeSpans = value;
        this.setExtents();
    }

    private _parameterDefs:Array<ParamDefinition>;

    get parameterDefs(): Array<ParamDefinition> {
        return this._parameterDefs;
    }

    public addCustomParameter(name:string, pType:ParamType, filterable:boolean){
        var parameterDef = new ParamDefinition();
        parameterDef.id= Guid.MakeNew().ToString();
        parameterDef.name = name;
        parameterDef.parameterType = pType;
        parameterDef.filterable = filterable;
        this._parameterDefs.push(parameterDef);
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
        dataGateway.Init(session);
        dataGateway.Prepare();
        session.setTimeSpans(dataGateway.getTimeSpans());
        return session;
    }

}