import { WebColor } from "@/WebColor";
export class ColorGeneratorImpl {
    //CREDIT:https://stackoverflow.com/questions/3080421/javascript-color-gradient
    GetGradientColor(startColor, endColor, percent) {
        // get colors
        const startRed = startColor.r, startGreen = startColor.b, startBlue = startColor.g;
        const endRed = endColor.r, endGreen = endColor.b, endBlue = endColor.g;
        // calculate new color
        let diffRed = endRed - startRed;
        let diffGreen = endGreen - startGreen;
        let diffBlue = endBlue - startBlue;
        diffRed = ((diffRed * percent) + startRed);
        diffGreen = ((diffGreen * percent) + startGreen);
        diffBlue = ((diffBlue * percent) + startBlue);
        let diffRedStr = diffRed.toString(16).split('.')[0];
        let diffGreenStr = diffGreen.toString(16).split('.')[0];
        let diffBlueStr = diffBlue.toString(16).split('.')[0];
        // ensure 2 digits by color
        if (diffRedStr.length === 1)
            diffRedStr = '0' + diffRedStr;
        if (diffGreenStr.length === 1)
            diffGreenStr = '0' + diffGreen;
        if (diffBlueStr.length === 1)
            diffBlueStr = '0' + diffBlue;
        return new WebColor("#" + diffRedStr + diffGreenStr + diffBlueStr);
    }
}
//# sourceMappingURL=ColorGeneratorImpl.js.map