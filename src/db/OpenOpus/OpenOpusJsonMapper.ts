import {IDataGateway} from '../../core/IDataGateway'
import { Composer } from './Composer';
import { TimeSpan } from '@/core/TimeSpan';
import { Event } from '@/core/Event';
import { ParamType } from '@/core/Parameter';
import { RootObject } from './OpenOpus';
import { SessionVm } from '@/viewmodel/SessionVm';

/* -------------------------------------------------------
* Resonsible to map OpenOpus composers into TimeSpan objects
-------------------------------------------------------*/ 
export class OpenOpusJsonMapper implements IDataGateway {

    private session : SessionVm;
    private json : string;


    constructor(json : string){
        this.json = json;
    }

    SetSession(session:SessionVm) {
        this.session=session;
    }
    void: any;

    Prepare(): void {

        //Create parameter if not exist
        if (this.session.configuration.parameterDefinitions.findIndex(p => p.name=="epoch") == -1){
            var definition = this.session.configuration.addParameter("epoch", ParamType.String, true);
            this.session.colorManager.mapColorsByStringParameter(definition);
        }

        if (this.session.configuration.parameterDefinitions.findIndex(p => p.name=="popularity") == -1){
            var definition = this.session.configuration.addParameter("popularity", ParamType.String, true);
        }
    }
    
    getTimeSpans(): TimeSpan[] {
        let id:number=0;
        let rootObject : RootObject = JSON.parse(this.json);
        let data: Array<TimeSpan> = new Array<TimeSpan>();
        rootObject.composers.forEach(composer =>{ 
            let comp : Composer = Object.assign(new Composer(), composer);
            let newTimeSpan = new TimeSpan();
            newTimeSpan.id = comp.id;
            
            if (newTimeSpan.id==""){
                newTimeSpan.id=id.toString();
                id++;
            } 

            newTimeSpan.displayCaption = comp.complete_name;
            newTimeSpan.startDate = comp.getBirthDate();
            newTimeSpan.endDate = comp.getDeathDate();
            newTimeSpan.visible = true; //Show by default

            newTimeSpan.session = this.session;
            newTimeSpan.getParameterByName("epoch").set(comp.epoch); 
            newTimeSpan.getParameterByName("popularity").set(comp.popular == 1 ? "High": "Low"); 
            //newTimeSpan.getParameterByName("portrait").set(comp.portrait); 

            data.push(newTimeSpan);
            });
            return data;
    }
    getEvents(): Event[] {
        throw new Error('Method not implemented.');
    }
}