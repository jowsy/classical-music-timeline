import { TimeLineBase } from "./TimeLineBase";
import { IDataGateway } from "./IDataGateway";
import { TimeSpan } from "./TimeSpan";
import { Event } from "./Event";
import { ParameterDefinition, ParamType } from "./Parameter";
import { Guid } from "./Guid";
import { IFilter } from "./IFilter";
import { AndFilter } from "./AndFilterTest";
import { Configuration } from "./Configuration";
import { ColorManager } from "./ColorManager";

export class Session {

    private _timeSpans: Array<TimeSpan> = new Array<TimeSpan>();
    public configuration:Configuration = new Configuration();
    public colorManager: ColorManager = new ColorManager();
    
    minDate : Date;
    maxDate : Date;
    public rootFilter: IFilter;
 
    constructor(){
        this.configuration.session = this;
        this.colorManager.session = this;   
    }
    get timeSpans(): Array<TimeSpan> {
        return this._timeSpans;
    }


    private setTimeSpans(value: Array<TimeSpan>) {
        
        this._timeSpans.push(...value);
        this.setExtents();
    }
    public setExtents():void {
        
        var list : Array<Date> = [];
        
        this.timeSpans
        .filter(obj => obj.visible == true)
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

        if (this.rootFilter!=null){

            this._timeSpans.forEach(tSpan => {
              var test = this.rootFilter.Apply(tSpan);
              tSpan.visible = test;
              tSpan.visibilityOverriden = !test;
            });      
        }   

        this.colorManager.refresh();
 
    }

    public PlugIn(dataGateway : IDataGateway) {
        dataGateway.SetSession(this);
        dataGateway.Prepare();
        this.setTimeSpans(dataGateway.getTimeSpans());
    }

}