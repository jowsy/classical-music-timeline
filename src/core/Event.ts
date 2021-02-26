import { TimeLineBase } from "./TimeLineBase";

export class Event implements TimeLineBase {
    id: string;
    show: boolean;
    displayCaption: string;
    order: number;
    date : Date;
}