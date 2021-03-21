<template>
    <div>
        <div id="canvas"></div>
    </div> 
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { SessionVm } from '../viewmodel/SessionVm';
import * as d3 from 'd3';
// eslint-disable-next-line no-unused-vars
import { WebColor } from '@/WebColor';
// eslint-disable-next-line no-unused-vars
import { IColor } from '@/core/IColor';

//------------- PUT THIS INTO A CONFIGURATION -------------------------
let tickTimeInterval : number = 10; //in year
var pixelPerYear = 5;
var verticalGridPaddingTop = 20;
//----------------------------------------------------------------

@Options({
      props: {
    session: SessionVm
      }
})
export default class TimeLine extends Vue {

    session : SessionVm;

    created(){

        this.$watch('session', () => {
            //this.session.setExtents();
            this.redraw();
        }, {
        deep: true
        });

    }
    redraw(){


 //Define svg dimensions
 class SvgDimensions {
        marginLeft: number;
        marginRight: number;
        marginBottom: number;
        marginTop: number;       
        width: number;
        height: number;
    }
    const svgDimensions = new SvgDimensions();
    const minDate = this.session.timeExtents.getSelectedMinDate();
    const maxDate =  this.session.timeExtents.getSelectedMaxDate();
        

    //We don't want the array to mutate because it will retrigger redraw and up in maximum recursive update
    //So first clone TimeSpans
    const sorted = [...this.session
                .timeSpans].sort((a, b) => {
                    return a.startDate > b.startDate ? 1 : -1;})
                       .filter(tSpan => tSpan.startDate.getFullYear()>=minDate.getFullYear() && tSpan.endDate.getFullYear()<=maxDate.getFullYear());



    svgDimensions.marginLeft = 20;
    svgDimensions.marginTop = 40;

    //Calculate svg width & height based on screen size
    const sideMenuHeight = document.getElementById("sidebarMenu")?.clientHeight;
    const sideMenuWidth = document.getElementById("sidebarMenu")?.clientWidth;
    const topMenuWidth = document.getElementById("topMenu")?.offsetWidth;
    const componentHeight =(sideMenuHeight || 0.0)-50;//-(topMenuHeight || 0.0); 
    const timeLineObjectPaddingTop=50;
    const maxBarHeight = 70;
    const barHeight = Math.min((componentHeight-timeLineObjectPaddingTop)/(sorted.length),maxBarHeight);


    const componentWidth = (topMenuWidth || 0.0) - (sideMenuWidth || 0.0) - svgDimensions.marginLeft - 60;// - (sideBarWidth || 0.0) - svgRect.left - svgRect.right;


    svgDimensions.width = componentWidth;
    svgDimensions.height = componentHeight;

    //if redraw, remove old canvas
    d3.select("#canvas").select("svg").remove();

    //DEFINE MAIN SVG
    //Explicit cast necessary
    //Reference: https://stackoverflow.com/questions/66059904/type-errors-for-d3js-in-angular-latest
    const gMain = d3.select<SVGSVGElement, unknown>("#canvas")
        .append("svg")
        .attr("width", svgDimensions.width)
        .attr("height", svgDimensions.height)
        .append("g");

    //Only show graphics inside a specified rectangle
    var clip = gMain.append("defs").append("SVG:clipPath")
    .attr("id", "clip")
    .append("SVG:rect")
    .attr("width", svgDimensions.width)
    .attr("height", svgDimensions.height - timeLineObjectPaddingTop)
    .attr("x", 0)
    .attr("y", timeLineObjectPaddingTop);

    var clipPath = gMain.append('g')
    .attr("clip-path", "url(#clip)")

    var canvas = clipPath.append('g');
    //Define time scale
    const scale = d3.scaleTime()
    .domain(
        [minDate, 
        maxDate])
        .range([0, svgDimensions.width]);

    let dateInterval = d3.timeYear.every(tickTimeInterval);
    let xAxis = d3.axisTop(scale).ticks(dateInterval); //Date ticks
  
    //This rectangle exists as a zooming area
    const rectangle = gMain
        .append("rect")
        .attr("id","zoomRect")
        .attr("x", 0)
        .attr("y",  0)
        .attr("width", svgDimensions.width)
        .attr("height", svgDimensions.height)
        .style("fill", "transparent")

    //Create svg groups where we can put rectangle and texts
    var g = canvas.selectAll("rect")
        .data(sorted.filter(ts => ts.visible==true))
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate("+scale(new Date(d.startDate))+"," + ((i * barHeight) + timeLineObjectPaddingTop) +")";
        });

    const barHeightWithMargin = barHeight*0.9;

    //Create rectangles inside groups
    const rectangles = g
        .append("rect")
        .attr("width", function (d)  {
            return scale(d.endDate)-scale(d.startDate);
        })
        .attr("height",barHeightWithMargin)
        .attr("fill", function (c) { 
        var color = c.session.colorManager.getColor(c) as WebColor;
        if (color == null) return "gray";
         return color.toHexString(); } )
        .attr("visibility", function(d) { if (d.visible) return "visible"; else return "collapse"});
   
    const texts = g.append("text")
        .attr("dy", ".7em")
        .text(function (d) { return d.displayCaption; })
        .attr("visibility", function(d) { if (d.visible) return "visible"; else return "collapse"})
        .style("fill", function (d) { 
            return TimeLine.textBackgroundColor(
                d.session.colorManager.getColor(d))
            } )
        .style("font", function (d)  {

            return Math.max((scale(new Date(d.startDate)) - scale(new Date(d.endDate)))/d.displayCaption.length,barHeightWithMargin)+"px times";
        });

    const axis = gMain.append("g")
        .attr("class", "grid")
        .attr("transform", "translate("+ 0+","+ timeLineObjectPaddingTop + ")")
        .call(xAxis);
    
    const verticalAxis = gMain.append("g")
        .attr("class", "verticalgrid")
        .attr("transform", "translate(" + 0+ "," + (componentHeight + timeLineObjectPaddingTop) + ")")
        .call(xAxis.tickSize(componentHeight).tickFormat(() => ""))
        .lower();

    const zoom = d3.zoom<SVGSVGElement, unknown>();
    const zoomRect = d3.select<SVGSVGElement, unknown>("#zoomRect").call(zoom);

    zoom.extent([[0, 0], [svgDimensions.width, svgDimensions.height]])
    .scaleExtent([1, 10])
    .translateExtent([[0, 0], [svgDimensions.width, svgDimensions.height]])
    .on('zoom', updateChart);

    
        /*eslint no-unused-vars: 0 */    
        function updateChart(event:any, d:any) {

            var xNewScale = event.transform.rescaleX(scale);

            canvas.attr("transform", event.transform);      

            axis.call(d3.axisTop(xNewScale).ticks(dateInterval));
            verticalAxis.call(d3.axisTop(xNewScale).tickSize(componentHeight).ticks(dateInterval).tickFormat(() => ""));
        }

         window.addEventListener('resize', () => {
               //   this.redraw();                 
         });

    }  




    private static textBackgroundColor(color:IColor) : string{
       
        var newColor = Math.round(((color.r * 299) + 
                    (color.b * 587) + 
                    (color.g * 114)) / 1000); 
        var textColor = (newColor > 125) ? 'black' : 'white'; 
    
        return textColor;
        }

}

/*
function GetHexColorByEpoch(epochName:string) {
    let index : number = Object.keys(epochs).findIndex(x => x == epochName);
    if (index==-1 && colorScheme.values.length-1 < index) return "gray"
    else return colorScheme[index];
}*/


</script>