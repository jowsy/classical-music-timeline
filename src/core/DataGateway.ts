import {TimeLineBase} from './TimeLineBase'
import { TimeSpan } from './TimeSpan';
import { Event } from './Event';

export interface DataGateway {
    getTimeSpans() : Array<TimeSpan> 
    getEvents() : Array<Event> 
}