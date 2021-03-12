export class timeLineExtents {
    value: Array<number> = new Array<number>();
    min: number;
    max:number;

    getSelectedMinDate() : Date {
       if (this.value.length == 0) return new Date(this.min,1,1); 
       return new Date(this.value[0],1,1);
    }

    getSelectedMaxDate() : Date {
        if (this.value.length == 0) return new Date(this.max,1,1); 
        return new Date(this.value[1],1,1);
     }
}
