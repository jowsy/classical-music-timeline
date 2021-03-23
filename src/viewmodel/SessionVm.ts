import { TimeLineBase } from "../core/TimeLineBase";
import { IDataGateway } from "../core/IDataGateway";
import { TimeSpan } from "../core/TimeSpan";
import { Event } from "../core/Event";
import { ParameterDefinition, ParamType } from "../core/Parameter";
import { Guid } from "../core/Guid";
import { IFilter } from "../core/IFilter";
import { AndFilter } from "../core/AndFilterTest";
import { Configuration } from "../core/Configuration";
import { ColorManager } from "../core/ColorManager";
import { timeLineExtents } from "./timeLineExtents";
import { ISessionContext } from "@/core/ISessionContext";
import { IShapeGenerator } from "@/core/IShapeGenerator";
import { ShapeGenerator } from "./ShapeGenerator";

export class SessionVm implements ISessionContext {
    private _timeSpans: Array<TimeSpan> = new Array<TimeSpan>();
    public configuration:Configuration = new Configuration();
    public colorManager: ColorManager = new ColorManager();
    public shapeGenerator: IShapeGenerator = new ShapeGenerator();

    minDate : Date;
    maxDate : Date;
    timeExtents : timeLineExtents = new timeLineExtents();
    public rootFilter: IFilter;
 
    constructor(){
        this.colorManager.session = this;   
    }

    get timeSpans(): Array<TimeSpan> {
        return this._timeSpans;
    }

    protected setTimeSpans(value: Array<TimeSpan>) {
        this._timeSpans.push(...value);
        this.setExtents();
    }
    protected setExtents():void {
   
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

        this.timeExtents = new timeLineExtents();
        const minYear=this.minDate.getFullYear();
        const maxYear=this.maxDate.getFullYear();

        this.timeExtents.value =  [minYear,maxYear];
        this.timeExtents.min = minYear;
        this.timeExtents.max = maxYear;
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