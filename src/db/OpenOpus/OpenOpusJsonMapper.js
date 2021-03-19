import { Composer } from './Composer';
import { TimeSpan } from '@/core/TimeSpan';
import { ParamType } from '@/core/Parameter';
/* -------------------------------------------------------
* Resonsible to map OpenOpus composers into TimeSpan objects
-------------------------------------------------------*/
export class OpenOpusJsonMapper {
    constructor(json) {
        this.json = json;
    }
    SetSession(session) {
        this.session = session;
    }
    Prepare() {
        //Create parameter if not exist
        if (this.session.configuration.parameterDefinitions.findIndex(p => p.name == "epoch") == -1) {
            var definition = this.session.configuration.addParameter("epoch", ParamType.String, true);
            this.session.colorManager.mapColorsByParameter(definition, "default");
        }
        if (this.session.configuration.parameterDefinitions.findIndex(p => p.name == "popularity") == -1) {
            var definition = this.session.configuration.addParameter("popularity", ParamType.String, true);
            //this.session.colorManager.mapColorsByParameter(definition,"default");
        }
        //if (this.session.parameterDefs.findIndex(p => p.name=="portrait") == -1)
        //  this.session.addCustomParameter("portrait", ParamType.String, false);
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
            newTimeSpan.getParameterByName("epoch").set(comp.epoch);
            newTimeSpan.getParameterByName("popularity").set(comp.popular == 1 ? "High" : "Low");
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