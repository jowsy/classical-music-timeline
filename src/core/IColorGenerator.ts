import { IColor } from "./IColor";

export interface IColorGenerator {
    GetGradientColor(startColor:IColor, endColor:IColor, percent:number):IColor;
}