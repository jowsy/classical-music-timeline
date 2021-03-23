export class TimeLineShape {
    x:number;
    y:number;
}

export class TimeLinePoint extends TimeLineShape{
    kind:string="point";
}

export class TimeLineRectangle extends TimeLineShape {
    kind:string="rectangle";
    width:number;
}