import { TimeLineBase } from "./TimeLineBase";
import { DataGateway } from "./DataGateway";
import { TimeSpan } from "./TimeSpan";
import { Event } from "./Event";
import { ParamDefinition, ParamType } from "./Parameter";
import { Guid } from "./Guid";
import { IFilter } from "./IFilter";

export class Session {

    constructor(){
        this._parameterDefs = new Array<ParamDefinition>();
    }

    minDate : Date;
    maxDate : Date;
    private _filters: Array<IFilter>;
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

    public addFilter(filter:IFilter){
        if (this._filters==null) this._filters = new Array<IFilter>();
        this._filters.push(filter);
    }

    removeFilter(id:string) : boolean{
        var index = this._filters.findIndex(f => f.id == id);
        if (index == -1) return false;
        this._filters.splice(index,1);
        return true;
    }

    public getFilter(parameterDefId:string){
        return this._filters.find(f => f.id == parameterDefId);
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

    public Refresh(){

        /*
        * APPLY FILTERS
        * Test TimeLineBase object against filters       
        * */

        if (this._filters!=null){

            this._timeSpans.forEach(tSpan => {
            if (this._filters.length > 0){
                if (this._filters
                .map(f=>f.Apply(tSpan))
                .every(x => x == true))
                    tSpan.show=true;
                else
                    tSpan.show=false;
                }else{
                    tSpan.show=true;
                }
                
            });
         
        }
    }

    static Create(dataGateway : DataGateway) : Session{
        let session = new Session;
        dataGateway.Init(session);
        dataGateway.Prepare();
        session.setTimeSpans(dataGateway.getTimeSpans());
        return session;
    }

}