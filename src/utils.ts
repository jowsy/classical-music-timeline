import { Composer } from "./openopusapi";

export default class Utils {
 
//CREDIT: https://www.geeksforgeeks.org/how-to-change-text-color-depending-on-background-color-using-javascript/
public static getTextColorByBackgroundColor(hex : string){

    let rgb : string = 'rgb(' + (hex = hex.replace('#', ''))
                        .match(new RegExp('(.{' + hex.length/3 + '})', 'g'))
                        .map(function(l) { 
                            return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

    // Get array of RGB values
    let rgbList = rgb.replace(/[^\d,]/g, '').split(',');

    var r = parseInt(rgbList[0]), g = parseInt(rgbList[1]), b = parseInt(rgbList[2]);
    
    var color = Math.round(((r * 299) + 
                (b * 587) + 
                (g * 114)) / 1000); 
    var textColor = (color > 125) ? 'black' : 'white'; 

    return textColor;
    }  

    // Sort function
    //Credit: https://www.cloudhadoop.com/2018/09/typescript-array-sort-method-with.html
    public static compareDate(emp1:Composer, emp2:Composer) {
        var emp1Date = new Date(emp1.birth).getTime();
        var emp2Date = new Date(emp2.birth).getTime();
        return emp1Date > emp2Date ? 1 : -1;
    };
}

declare global {
    interface Array<T> {
        groupBy<T, K extends keyof any>(this:T[], getKey: (item: T) => K): Record<K, T[]>;
    }
}

Array.prototype.groupBy = function<T, K extends keyof any>(this:T[], getKey: (item:T) => K){

    return this.reduce( (prev, current) => {
        const group = getKey(current);
        if (!prev[group]) prev[group] = [];
        prev[group].push(current);
        return prev;
    }, {} as Record<K,T[]>);
};