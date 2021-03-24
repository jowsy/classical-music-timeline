import {TimeLineBase} from './TimeLineBase'
import { ISessionContext } from './ISessionContext';

export interface IDataGateway {
    SetSession(session: ISessionContext):void;
    Prepare() : void;
    getElements() : Array<TimeLineBase>;
}