import {IDataGateway} from '../../core/IDataGateway'
import { ParameterType } from '@/core/Parameter';
import { Root } from './OpenOpus';
import { SessionVm } from '@/viewmodel/SessionVm';
import { TimeLineBase } from '@/core';
import * as OpenOpus from './OpenOpus';
import { Composer } from '@/core/Composer';

/* -------------------------------------------------------
* Resonsible to map OpenOpus composers into TimeSpan objects
-------------------------------------------------------*/ 
export class OpenOpusJsonMapper implements IDataGateway {

    private session : SessionVm;
    private json : string;

    private epochParameterName : string = "epoch";
    private popParameterName : string = "popularity";
    private worksParameterName : string = "quantityOfWorks";

    constructor(json : string){
        this.json = json;
    }

    SetSession(session:SessionVm) {
        this.session=session;
    }
    void: any;

    Prepare(): void {
        const epochParameterDef = this.session.configuration.getParameterByName(this.epochParameterName);
        const popParameterDef = this.session.configuration.getParameterByName(this.popParameterName);
        const worksParameterDef = this.session.configuration.getParameterByName(this.worksParameterName);
        
        if (epochParameterDef == undefined){
            var definition = this.session.configuration.addParameter(this.epochParameterName, "Epoch", ParameterType.String, true);
            this.session.colorManager.mapColorsByStringParameter(definition);
        }

        if (popParameterDef == undefined){
            var definition = this.session.configuration.addParameter(this.popParameterName, "Popularity", ParameterType.String, true);
        }

        if (worksParameterDef == undefined){
            var definition = this.session.configuration.addParameter(this.worksParameterName, "Quantity of Works", ParameterType.Number, true);
        }
    }
    
    getElements(): TimeLineBase[] {
        let id:number=0;
        let rootObject : Root = JSON.parse(this.json);
        let data: Array<TimeLineBase> = new Array<TimeLineBase>();
        (rootObject.composers as OpenOpus.Composer[]).forEach(c =>{ 
            
            let composer = new Composer();

            composer.internalId=id;
            id++;
            
            composer.fullName = c.complete_name; 

            composer.birth = new Date(c.birth);
            if (c.death!=null)
                composer.death = new Date(c.death);
            composer.visible = true; //Show by default

            composer.session = this.session;
            composer.getParameterByName(this.epochParameterName).set(c.epoch); 
            composer.getParameterByName(this.popParameterName).set(c.popular == "1" ? "High": "Low"); 

            if (c.works.length>0)
                composer.getParameterByName(this.worksParameterName).set(c.works.length); 


            data.push(composer);
            });

            return data;
    }
}