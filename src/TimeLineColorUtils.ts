/*export default class TimeLineColorUtils {
 
    static ColorScheme : Array<string> = [
        "#54478C",
        "#2C699A",
        "#048BA8",
        "#0DB39E",
        "#16DB93",
        "#83E377",
        "#B9E769",
        "#EFEA5A",
        "#F1C453",
        "#F29E4C"
    ];
    
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

        
        public static getColorInSchemeByIndex(index:number) {
        if (index==-1 && this.ColorScheme.values.length-1 < index) return "gray"
        else return this.ColorScheme[index];
    }

    }*/