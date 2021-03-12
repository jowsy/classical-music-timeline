import {TimeLineBase} from './TimeLineBase'
import { TimeSpan } from './TimeSpan';
import { Event } from './Event';
import { ISessionContext } from './ISessionContext';

export interface IDataGateway {
    SetSession(session: ISessionContext):void;
    Prepare() : void;
    getTimeSpans() : Array<TimeSpan> ;
    getEvents() : Array<Event>;
}