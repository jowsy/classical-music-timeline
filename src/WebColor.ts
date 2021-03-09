import { IColor } from "./core/IColor";

export class WebColor implements IColor {
    r: number;
    g: number;
    b: number;
    a: number;
    hexColor:string;
    toHexString() : string{
        return this.hexColor; 
    }
    constructor(hexString:string){
        this.hexColor = hexString;
        this.hexToRgb(hexString);
    }

    hexToRgb(hex:string) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (result == null) return;

        this.r =  parseInt(result[1], 16),
        this.g = parseInt(result[2], 16),
        this.b = parseInt(result[3], 16)

      }

}