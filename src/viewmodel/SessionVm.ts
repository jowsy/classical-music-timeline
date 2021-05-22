import { TimeLineBase } from "../core/TimeLineBase";
import { IDataGateway } from "../core/IDataGateway";
import { IFilter } from "../core/IFilter";
import { AndFilter } from "../core/AndFilterTest";
import { Configuration } from "../core/Configuration";
import { ColorManager } from "../core/ColorManager";
import { timeLineExtents } from "./timeLineExtents";
import { ISessionContext } from "@/core/ISessionContext";
import { ShapeGeneratorImpl } from "./ShapeGeneratorImpl";
import { Person } from "@/core/Person";
import { TimeLineGeometry } from "@/core/TimeLineGeometry";
import { DataSet } from "@/core";
import { ClassType } from "@/core/ClassType";

export class SessionVm implements ISessionContext {

    private _elements: Array<TimeLineBase> = new Array<TimeLineBase>();
    public configuration:Configuration = new Configuration();
    public colorManager: ColorManager = new ColorManager();
    public shapeGenerator: ShapeGeneratorImpl = new ShapeGeneratorImpl();
    
    public dataChangedTick : number = 0; //This is used by components to react on changes done to the underlying data

    
    private _selection:number[]=[];
    selected:Person;
    get selection(){
        return this._selection;
    }
    set selection(value){
        this._selection = value;
        var c = this.composers.find(comp => comp.internalId == value[0]);
        if (c!=undefined)
            this.selected = c;
    }

    minDate : Date;
    maxDate : Date;
    timeExtents : timeLineExtents = new timeLineExtents();

    public rootFilter: IFilter;
 
    constructor(){
        this.colorManager.session = this;   
        this.shapeGenerator.session = this;
        this.dataSets = new Array<DataSet>();
    }

    addDataSet(name: string, description: string, dataGateway: IDataGateway): number {
        var dataSet = new DataSet();
        dataSet.name = name;
        dataSet.description = description;
        dataSet.dataGateway = dataGateway;
        dataSet.id = this.dataSets.length+1;
        this.dataSets.push(dataSet);
        return dataSet.id;
    }

    dataSets: DataSet[];

    loadData(): Promise<void> {
    return new Promise((resolve, reject) => {    
        var arrayOfPromises = new Array<Promise<Boolean>>();
        try {
        this.dataSets.forEach(dataSet => {
            arrayOfPromises.push(dataSet.dataGateway.Load(this));
        });
        }catch(Error){
            console.log("loadData: data failed to load: "+Error.message);
            reject();
        }
        Promise.all(arrayOfPromises).then( fulfilled => {
            console.debug("Load fulfilled:"+fulfilled);
            resolve();
        })
    });

    }

    get elements(): Array<TimeLineBase> {
        return this._elements;
    }

    get composers() : Array<Person> {
        return this._elements.filter(el => el.classType == ClassType.Person) as Array<Person>;
    }

    public setExtents():void {
   
        var list : Array<Date> = [];
        
        this.composers
        .filter(obj => obj.visible)
        .map(obj => {
                list.push(obj.birth);
                list.push(obj.death == undefined ? new Date() : obj.death);
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

        this.shapeGenerator.config.minDate = this.minDate;
        this.shapeGenerator.config.maxDate = this.maxDate;
    }

    public refresh(){

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

    public regenerate(){
        if (this.shapeGenerator!=null)
            this.shapeGenerator.generateShapes();
    }

}