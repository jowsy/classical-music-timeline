import * as jsonData from '../assets/data.json';
import { Composer } from './Composer';
import { TimeSpan } from '@/core/TimeSpan';
import { ParamType } from '@/core/Parameter';
/* -------------------------------------------------------
* Resonsible to map OpenOpus composers into TimeSpan objects
-------------------------------------------------------*/
export class OpenOpusDataMapper {
    Init(session) {
        this._session = session;
    }
    Prepare() {
        this._session.addCustomParameter("epoch", ParamType.String, true);
    }
    getTimeSpans() {
        let data = new Array();
        jsonData.composers.forEach(composer => {
            let comp = Object.assign(new Composer(), composer);
            let newTimeSpan = new TimeSpan();
            newTimeSpan.id = comp.id;
            newTimeSpan.displayCaption = comp.complete_name;
            newTimeSpan.startDate = comp.getBirthDate();
            newTimeSpan.endDate = comp.getDeathDate();
            newTimeSpan.show = true; //Show by default
            newTimeSpan.getParameter("epoch").setString(comp.epoch);
            data.push(newTimeSpan);
        });
        return data.sort((a, b) => {
            return a.startDate > b.startDate ? 1 : -1;
        });
    }
    getEvents() {
        throw new Error('Method not implemented.');
    }
}
//# sourceMappingURL=OpenOpusDataMapper.js.map