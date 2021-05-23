import { IFilter } from "../core/IFilter";
import { Configuration } from "../core/Configuration";
import { ColorManager } from "../core/ColorManager";
import { WorkspaceBase } from "@/core/WorkspaceBase";
import { ShapeGeneratorImpl } from "./ShapeGeneratorImpl";
import { Person } from "@/core/Person";
import { TimeLineGeometry } from "@/core/TimeLineGeometry";
import { DataSet } from "@/core";
import { ShapeGeneratorConfig } from "./ShapeGeneratorConfig";

export class Workspace extends WorkspaceBase {

    //#region PROPERTIES
    
    public viewConfig:ShapeGeneratorConfig;
    public rootFilter: IFilter;
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
    //#endregion

    //#region METHODS
    constructor(){
        super();
        this.configuration = new Configuration();
        this.colorManager = new ColorManager();      
        this.colorManager.session = this;   
        this.dataSets = new Array<DataSet>();
    }

    public refresh(){
        if (this.rootFilter!=null){
            this.getAllElements().forEach(geometry => {
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
            this.shapeGenerator.generatePersonShapes(this.composers);
    }
    //#endregion

}