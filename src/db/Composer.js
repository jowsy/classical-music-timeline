export class Composer {
    constructor() {
        this.id = "";
        this.name = "";
        this.birth = "";
        this.death = "";
        this.epoch = "";
        this.portrait = "";
        this.complete_name = "";
        this.isChecked = true;
    }
    getBirthDate() {
        return new Date(this.birth);
    }
    getDeathDate() {
        if (this.death == null)
            return new Date(); //if alive use today date
        else
            return new Date(this.death);
    }
}
//# sourceMappingURL=Composer.js.map