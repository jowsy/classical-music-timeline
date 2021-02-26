import * as jsonData from '../assets/data.json';
import { Composer } from './Composer';
import { TimeSpan } from '@/core/TimeSpan';
/* -------------------------------------------------------
* Resonsible to map OpenOpus composers into TimeSpan objects
-------------------------------------------------------*/
export class OpenOpusDataMapper {
    getObjects() {
        let data = new Array();
        jsonData.composers.forEach(composer => {
            let comp = Object.assign(new Composer(), composer);
            let newTimeSpan = new TimeSpan();
            newTimeSpan.id = comp.id;
            newTimeSpan.displayCaption = comp.complete_name;
            newTimeSpan.startDate = comp.getBirthDate();
            newTimeSpan.endDate = comp.getDeathDate();
            newTimeSpan.show = true; //Show by default
            data.push(newTimeSpan);
        });
        return data;
    }
}
//# sourceMappingURL=OpenOpusDataMapper.js.map