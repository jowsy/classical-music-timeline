import {TimeLineBase} from './TimeLineBase'
import { WorkspaceBase } from './WorkspaceBase';

export interface IDataGateway {

    // Import data from external source
    Load(session:WorkspaceBase): Promise<Boolean>;
    
    //For lazy loading, UI calls this when an element is selected, eg. composer
    Select(element:TimeLineBase):void;

   /* SetSession(session: WorkspaceBase):void;
    Prepare() : void;
    getElements() : Array<TimeLineBase>;*/
}