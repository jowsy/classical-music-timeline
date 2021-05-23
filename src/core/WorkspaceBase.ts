import { Color } from "d3-color";
import { IDataGateway } from ".";
import { ColorManager } from "./ColorManager";
import { Person } from "./Person";
import { Configuration } from "./Configuration";
import { DataSet } from "./DataSet";
import { IShapeGenerator } from "./IShapeGenerator";
import { TimeLineBase } from "./TimeLineBase";
import { TimeLineExtents } from "./TimeLineExtents";
import { ClassType } from "./ClassType";

export abstract class WorkspaceBase {
    
    //#region PROPERTIES
    configuration: Configuration;
    colorManager: ColorManager;
    shapeGenerator: IShapeGenerator;

    minDate : Date;
    maxDate : Date;

    timeExtents : TimeLineExtents = new TimeLineExtents();

    protected dataSets: DataSet[];

    private _elements: Array<TimeLineBase> = new Array<TimeLineBase>();
   
    get elements(): Array<TimeLineBase> {
        return this._elements;
    }

    get composers() : Array<Person> {
        return this._elements.filter(el => el.classType == ClassType.Person) as Array<Person>;
    }
    //#endregion

    //#region METHODS
    getAllElements(){
        return this._elements;
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

        this.timeExtents = new TimeLineExtents();
        const minYear=this.minDate.getFullYear();
        const maxYear=this.maxDate.getFullYear();

        this.timeExtents.value =  [minYear,maxYear];
        this.timeExtents.min = minYear;
        this.timeExtents.max = maxYear;
    }
    //#endregion

}