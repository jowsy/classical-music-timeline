import {IDataGateway} from '../../core/IDataGateway'
import { ParamType } from '@/core/Parameter';
import { RootObject } from './OpenOpus';
import { SessionVm } from '@/viewmodel/SessionVm';
import { TimeLineBase } from '@/core';
import { ComposerImpl } from './ComposerImpl';
import { Composer } from '@/core/Composer';

/* -------------------------------------------------------
* Resonsible to map OpenOpus composers into TimeSpan objects
-------------------------------------------------------*/ 
export class OpenOpusJsonMapper implements IDataGateway {

    private session : SessionVm;
    private json : string;

    private epochParameterName : string = "epoch";
    private popParameterName : string = "popularity";

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
        
        if (epochParameterDef == undefined){
            var definition = this.session.configuration.addParameter(this.epochParameterName, ParamType.String, true);
            //this.session.colorManager.mapColorsByStringParameter(definition);
        }

        if (popParameterDef == undefined){
            var definition = this.session.configuration.addParameter(this.popParameterName, ParamType.String, true);
        }
    }
    
    getElements(): TimeLineBase[] {
        let id:number=0;
        let rootObject : RootObject = JSON.parse(this.json);
        let data: Array<TimeLineBase> = new Array<TimeLineBase>();
        rootObject.composers.forEach(c =>{ 
            let openOpusComposer : ComposerImpl = Object.assign(new ComposerImpl(), c);
            let composer = new Composer();
            composer.id = openOpusComposer.id;
            
            if (composer.id==""){
                composer.id=id.toString();
                id++;
            } 

            composer.displayCaption = openOpusComposer.complete_name; //REMOVE LATER

            composer.birth = new Date(openOpusComposer.birth);
            if (openOpusComposer.death!=null)
                composer.death = new Date(openOpusComposer.death);
            composer.visible = true; //Show by default

            composer.session = this.session;
            composer.getParameterByName(this.epochParameterName).set(openOpusComposer.epoch); 
            composer.getParameterByName(this.popParameterName).set(openOpusComposer.popular == 1 ? "High": "Low"); 
            //newTimeSpan.getParameterByName("portrait").set(comp.portrait); 

            data.push(composer);
            });

            return data;
    }
}