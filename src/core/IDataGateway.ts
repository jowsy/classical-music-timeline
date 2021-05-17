import {TimeLineBase} from './TimeLineBase'
import { ISessionContext } from './ISessionContext';

export interface IDataGateway {

    // Import data from external source
    Load(session:ISessionContext): Promise<Boolean>;
    
    //For lazy loading, UI calls this when an element is selected, eg. composer
    Select(element:TimeLineBase):void;

   /* SetSession(session: ISessionContext):void;
    Prepare() : void;
    getElements() : Array<TimeLineBase>;*/
}