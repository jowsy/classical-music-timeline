import { Composer } from './Composer';
import { TimeSpan } from '@/core/TimeSpan';
import { ParamType } from '@/core/Parameter';
/* -------------------------------------------------------
* Resonsible to map OpenOpus composers into TimeSpan objects
-------------------------------------------------------*/
export class OpenOpusJsonMapper {
    constructor(json) {
        this.epochParameterName = "epoch";
        this.popParameterName = "popularity";
        this.json = json;
    }
    SetSession(session) {
        this.session = session;
    }
    Prepare() {
        const epochParameterDef = this.session.configuration.getParameterByName(this.epochParameterName);
        const popParameterDef = this.session.configuration.getParameterByName(this.popParameterName);
        if (epochParameterDef == undefined) {
            var definition = this.session.configuration.addParameter(this.epochParameterName, ParamType.String, true);
            //this.session.colorManager.mapColorsByStringParameter(definition);
        }
        if (popParameterDef == undefined) {
            var definition = this.session.configuration.addParameter(this.popParameterName, ParamType.String, true);
        }
    }
    getTimeSpans() {
        let id = 0;
        let rootObject = JSON.parse(this.json);
        let data = new Array();
        rootObject.composers.forEach(composer => {
            let comp = Object.assign(new Composer(), composer);
            let newTimeSpan = new TimeSpan();
            newTimeSpan.id = comp.id;
            if (newTimeSpan.id == "") {
                newTimeSpan.id = id.toString();
                id++;
            }
            newTimeSpan.displayCaption = comp.complete_name;
            newTimeSpan.startDate = comp.getBirthDate();
            newTimeSpan.endDate = comp.getDeathDate();
            newTimeSpan.visible = true; //Show by default
            newTimeSpan.session = this.session;
            newTimeSpan.getParameterByName(this.epochParameterName).set(comp.epoch);
            newTimeSpan.getParameterByName(this.popParameterName).set(comp.popular == 1 ? "High" : "Low");
            //newTimeSpan.getParameterByName("portrait").set(comp.portrait); 
            data.push(newTimeSpan);
        });
        return data;
    }
    getEvents() {
        throw new Error('Method not implemented.');
    }
}
//# sourceMappingURL=OpenOpusJsonMapper.js.map