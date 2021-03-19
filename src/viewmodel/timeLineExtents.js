export class timeLineExtents {
    constructor() {
        this.value = new Array();
    }
    getSelectedMinDate() {
        if (this.value.length == 0)
            return new Date(this.min, 1, 1);
        return new Date(this.value[0], 1, 1);
    }
    getSelectedMaxDate() {
        if (this.value.length == 0)
            return new Date(this.max, 1, 1);
        return new Date(this.value[1], 1, 1);
    }
}
//# sourceMappingURL=timeLineExtents.js.map