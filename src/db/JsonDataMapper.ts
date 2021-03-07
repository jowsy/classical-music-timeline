import {IDataGateway} from '../core/IDataGateway'
import { Composer } from './Composer';
import { TimeSpan } from '@/core/TimeSpan';
import { Event } from '@/core/Event';
import { Session } from '@/core/Session';
import { ParamType } from '@/core/Parameter';
import { RootObject } from './OpenOpus';

/* -------------------------------------------------------
* Resonsible to map OpenOpus composers into TimeSpan objects
-------------------------------------------------------*/ 
export class JsonDataMapper implements IDataGateway {

    private session : Session;
    private json : string;


    constructor(json : string){
        this.json = json;
    }

    SetSession(session:Session) {
        this.session=session;
    }
    void: any;

    Prepare(): void {

        //Create parameter if not exist
        if (this.session.parameterDefs.findIndex(p => p.name=="epoch") == -1)
            this.session.addCustomParameter("epoch", ParamType.String, true);

        //if (this.session.parameterDefs.findIndex(p => p.name=="portrait") == -1)
          //  this.session.addCustomParameter("portrait", ParamType.String, false);
    }
    
    getTimeSpans(): TimeSpan[] {
        let rootObject : RootObject = JSON.parse(this.json);
        let data: Array<TimeSpan> = new Array<TimeSpan>();
        rootObject.composers.forEach(composer =>{ 
            let comp : Composer = Object.assign(new Composer(), composer);
            let newTimeSpan = new TimeSpan();
            newTimeSpan.id = comp.id;
            newTimeSpan.displayCaption = comp.complete_name;
            newTimeSpan.startDate = comp.getBirthDate();
            newTimeSpan.endDate = comp.getDeathDate();
            newTimeSpan.visible = true; //Show by default

            newTimeSpan.session = this.session;
            newTimeSpan.getParameterByName("epoch").set(comp.epoch); 
            //newTimeSpan.getParameterByName("portrait").set(comp.portrait); 

            data.push(newTimeSpan);
            });
            return data;
    }
    getEvents(): Event[] {
        throw new Error('Method not implemented.');
    }
}