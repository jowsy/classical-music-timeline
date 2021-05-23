import { SvgDimensions } from "./SvgDimensions";

export class ViewportUtils {
    public static GetViewportHeight(svgDimensions:SvgDimensions){
        var sideMenuDomObject = document.getElementById("sidebarMenu");
        var propertyMenuDomObject = document.getElementById("property-menu");
        var footerDomObject = document.getElementById("main-footer");
        if (sideMenuDomObject==null) throw Error("Can't computer canvas height. Sidebar menu dom-object not found.");
        if (propertyMenuDomObject==null) throw Error("Can't computer canvas height. Property menu dom-object not found.");
        if (footerDomObject==null) throw Error("Can't computer canvas height. Footer dom-object not found.");
        return sideMenuDomObject.clientHeight-svgDimensions.marginTop-svgDimensions.marginBottom-propertyMenuDomObject.clientHeight-footerDomObject.clientHeight;
    }

    public static GetViewportWidth(svgDimensions:SvgDimensions){
        var sideMenuDomObject = document.getElementById("sidebarMenu");
        if (sideMenuDomObject==null) throw Error("Can't computer canvas height. Sidebar menu dom-object not found.");
        var topMenuDomObject = document.getElementById("topMenu");
        if (topMenuDomObject==null) throw Error("Can't computer canvas height. top menu dom-object not found.");
        return topMenuDomObject.clientWidth 
                - sideMenuDomObject.clientWidth 
                - svgDimensions.marginLeft 
                - svgDimensions.marginRight;
    }
}