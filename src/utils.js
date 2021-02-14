"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    //CREDIT: https://www.geeksforgeeks.org/how-to-change-text-color-depending-on-background-color-using-javascript/
    Utils.getTextColorByBackgroundColor = function (hex) {
        var rgb = 'rgb(' + (hex = hex.replace('#', ''))
            .match(new RegExp('(.{' + hex.length / 3 + '})', 'g'))
            .map(function (l) {
            return parseInt(hex.length % 2 ? l + l : l, 16);
        }).join(',') + ')';
        // Get array of RGB values
        var rgbList = rgb.replace(/[^\d,]/g, '').split(',');
        var r = parseInt(rgbList[0]), g = parseInt(rgbList[1]), b = parseInt(rgbList[2]);
        var color = Math.round(((r * 299) +
            (b * 587) +
            (g * 114)) / 1000);
        var textColor = (color > 125) ? 'black' : 'white';
        return textColor;
    };
    // Sort function
    //Credit: https://www.cloudhadoop.com/2018/09/typescript-array-sort-method-with.html
    Utils.compareDate = function (emp1, emp2) {
        var emp1Date = new Date(emp1.birth).getTime();
        var emp2Date = new Date(emp2.birth).getTime();
        return emp1Date > emp2Date ? 1 : -1;
    };
    ;
    return Utils;
}());
exports.default = Utils;
Array.prototype.groupBy = function (getKey) {
    return this.reduce(function (prev, current) {
        var group = getKey(current);
        if (!prev[group])
            prev[group] = [];
        prev[group].push(current);
        return prev;
    }, {});
};
//# sourceMappingURL=utils.js.map