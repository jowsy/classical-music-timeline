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
import { ShapeGeneratorImpl } from "./ShapeGeneratorImpl";
import { Composer } from "@/core/Composer";
import { Work } from "@/core/Work";
import { TimeLineGeometry } from "@/core/TimeLineGeometry";

export class SessionVm implements ISessionContext {
    private _elements: Array<TimeLineBase> = new Array<TimeLineBase>();
    public configuration:Configuration = new Configuration();
    public colorManager: ColorManager = new ColorManager();
    public shapeGenerator: ShapeGeneratorImpl = new ShapeGeneratorImpl();

    minDate : Date;
    maxDate : Date;
    timeExtents : timeLineExtents = new timeLineExtents();
    public rootFilter: IFilter;
 
    constructor(){
        this.colorManager.session = this;   
    }

    get elements(): Array<TimeLineBase> {
        return this._elements;
    }

    get composers() : Array<Composer> {
        return this._elements.filter(el => el instanceof Composer) as Array<Composer>;
    }


    protected setElements(value: Array<TimeLineBase>) {
        this._elements.push(...value);
        this.setExtents();
    }
    protected setExtents():void {
   
        var list : Array<Date> = [];
        
        this.composers
        .filter(obj => obj.visible)
        .map(obj => {
                list.push(obj.birth);
                list.push(obj.death);
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

            this._elements.forEach(geometry => {
              if (geometry instanceof TimeLineGeometry){
                var test = this.rootFilter.Apply(geometry);
                geometry.visible = test;
                geometry.visibilityOverriden = !test;
              }
            });      
        }   

        this.colorManager.refresh();
 
    }

    public PlugIn(dataGateway : IDataGateway) {
        dataGateway.SetSession(this);
        dataGateway.Prepare();
        this.setElements(dataGateway.getElements());
    }

}