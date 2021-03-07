import { Composer } from './Composer';
import { TimeSpan } from '@/core/TimeSpan';
import { ParamType } from '@/core/Parameter';
/* -------------------------------------------------------
* Resonsible to map OpenOpus composers into TimeSpan objects
-------------------------------------------------------*/
export class JsonDataMapper {
    constructor(json) {
        this.json = json;
    }
    SetSession(session) {
        this.session = session;
    }
    Prepare() {
        this.session.addCustomParameter("epoch", ParamType.String, true);
        this.session.addCustomParameter("portrait", ParamType.String, false);
    }
    getTimeSpans() {
        let rootObject = JSON.parse(this.json);
        let data = new Array();
        rootObject.composers.forEach(composer => {
            let comp = Object.assign(new Composer(), composer);
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
        return data.sort((a, b) => {
            return a.startDate > b.startDate ? 1 : -1;
        });
    }
    getEvents() {
        throw new Error('Method not implemented.');
    }
}
//# sourceMappingURL=JsonDataMapper.js.map