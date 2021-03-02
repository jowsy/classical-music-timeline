import {DataGateway} from '../core/DataGateway'
import * as jsonData from '../assets/data.json'
import { Composer } from './Composer';
import { TimeSpan } from '@/core/TimeSpan';
import { Event } from '@/core/Event';
import { Session } from '@/core/Session';
import { ParamType } from '@/core/Parameter';


/* -------------------------------------------------------
* Resonsible to map OpenOpus composers into TimeSpan objects
-------------------------------------------------------*/ 
export class OpenOpusDataMapper implements DataGateway {

    private _session : Session;
    Init(session : Session): void {
        this._session = session;
    }

    Prepare(): void {
        this._session.addCustomParameter("epoch", ParamType.String, true);
    }
    
    getTimeSpans(): TimeSpan[] {
        let data: Array<TimeSpan> = new Array<TimeSpan>();
        jsonData.composers.forEach(composer =>{ 
            let comp : Composer = Object.assign(new Composer(), composer);
            let newTimeSpan = new TimeSpan();
            newTimeSpan.id = comp.id;
            newTimeSpan.displayCaption = comp.complete_name;
            newTimeSpan.startDate = comp.getBirthDate();
            newTimeSpan.endDate = comp.getDeathDate();
            newTimeSpan.show = true; //Show by default

            newTimeSpan.session = this._session;
            newTimeSpan.getParameter("epoch").setString(comp.epoch); 

            data.push(newTimeSpan);
            });
            return data.sort((a, b) => {
                return a.startDate > b.startDate ? 1 : -1;
            });
    }
    getEvents(): Event[] {
        throw new Error('Method not implemented.');
    }
}