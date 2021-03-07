import {TimeLineBase} from './TimeLineBase'
import { TimeSpan } from './TimeSpan';
import { Event } from './Event';
import { Session } from './Session';

export interface IDataGateway {
    SetSession(session: Session):void;
    Prepare() : void;
    getTimeSpans() : Array<TimeSpan> ;
    getEvents() : Array<Event>;
}