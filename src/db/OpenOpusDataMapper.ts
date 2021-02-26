import {DataGateway} from '../core/DataGateway'
import * as jsonData from '../assets/data.json'
import { Composer } from './Composer';
import { TimeSpan } from '@/core/TimeSpan';
import { Event } from '@/core/Event';


/* -------------------------------------------------------
* Resonsible to map OpenOpus composers into TimeSpan objects
-------------------------------------------------------*/ 
export class OpenOpusDataMapper implements DataGateway {
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